"use client";

import {
  useEffect,
  useMemo,
  useRef,
} from "react";

import type {
  MutableRefObject,
} from "react";

import {
  useThree,
} from "@react-three/fiber";

import {
  gsap,
} from "gsap";

import {
  CatmullRomCurve3,
  Vector3,
} from "three";

import {
  CONTROL_CATEGORIES,
  CONTROL_TERMINAL,
} from "@/components/showcase/scenes/control/controlWorldConfig";

import {
  createTerminalFlowCurves,
} from "@/components/showcase/scenes/control/controlTerminalFlowGeometry";

import {
  HANDOFF_SAMPLE_COUNT,
  PRODUCT_HANDOFF_LANES,
  createProductHandoffPoints,
  interpolateHandoffPoints,
  pointsToSvgPath,
} from "@/components/showcase/scenes/shared/controlProductHandoff";

type ControlProductHandoffProjectorProps = {
  curve:
    CatmullRomCurve3;

  travelRef:
    MutableRefObject<number>;

  pathRefs:
    MutableRefObject<
      Array<
        SVGPathElement | null
      >
    >;
};

/*
 * ============================================================================
 * FINAL 3D -> 2D CROSSFADE
 * ============================================================================
 *
 * IMPORTANT:
 *
 * There is NO dramatic line morph here.
 *
 * The camera has already rotated until the physical shaft strands are
 * straight and parallel on screen.
 *
 * This component only:
 *
 * 1. projects those REAL straight 3D strands;
 * 2. overlays SVG exactly on top;
 * 3. performs a very small fit to PRODUCT's exact phase-0 coordinates.
 */
export function ControlProductHandoffProjector({
  curve,
  travelRef,
  pathRefs,
}: ControlProductHandoffProjectorProps) {
  const {
    camera,
    invalidate,
  } =
    useThree();

  const laneMapRef =
    useRef<
      number[] | null
    >(
      null,
    );

  const shaftCurves =
    useMemo(
      () =>
        CONTROL_CATEGORIES.map(
          (
            category,
            index,
          ) =>
            createTerminalFlowCurves(
              curve,
              category.lineLane,
              index,
            ).shaftCurve,
        ),
      [
        curve,
      ],
    );

  useEffect(() => {
    let previousTravel =
      Number.NaN;

    const scratch =
      new Vector3();

    const update = () => {
      const travel =
        Math.max(
          0,
          travelRef.current,
        );

      if (
        Number.isFinite(
          previousTravel,
        ) &&
        Math.abs(
          travel -
          previousTravel,
        ) <
          0.00001
      ) {
        return;
      }

      previousTravel =
        travel;

      const overlay =
        smootherstep(
          range(
            travel,
            CONTROL_TERMINAL.handoffOverlayStart,
            CONTROL_TERMINAL.handoffOverlayFull,
          ),
        );

      const fit =
        smootherstep(
          range(
            travel,
            CONTROL_TERMINAL.handoffMorphStart,
            CONTROL_TERMINAL.handoffMorphEnd,
          ),
        );

      const projected =
        shaftCurves.map(
          (
            shaftCurve,
          ) =>
            sampleProjectedCurve(
              shaftCurve,
              camera,
              scratch,
            ),
        );

      /*
       * Lock left-to-right ordering once.
       * Since camera is already almost front-facing here, this mapping stays
       * stable and cannot produce crossed lanes.
       */
      if (
        overlay >
          0.001 &&
        !laneMapRef.current
      ) {
        const ordering =
          projected
            .map(
              (
                points,
                index,
              ) => ({
                index,

                x:
                  averageX(
                    points,
                  ),
              }),
            )
            .sort(
              (
                a,
                b,
              ) =>
                a.x -
                b.x,
            );

        const map =
          new Array(
            ordering.length,
          ).fill(
            0,
          );

        ordering.forEach(
          (
            item,
            targetLane,
          ) => {
            map[
              item.index
            ] =
              targetLane;
          },
        );

        laneMapRef.current =
          map;
      }

      projected.forEach(
        (
          sourcePoints,
          sourceIndex,
        ) => {
          const path =
            pathRefs.current[
              sourceIndex
            ];

          if (!path) {
            return;
          }

          const targetLaneIndex =
            laneMapRef.current?.[
              sourceIndex
            ] ??
            sourceIndex;

          const target =
            createProductHandoffPoints(
              PRODUCT_HANDOFF_LANES[
                targetLaneIndex
              ] ??
                0,
              0,
              HANDOFF_SAMPLE_COUNT,
            );

          /*
           * At this stage both source and target are already vertical,
           * parallel bundles. "fit" only corrects exact screen spacing/length.
           */
          const finalPoints =
            interpolateHandoffPoints(
              sourcePoints,
              target,
              fit,
            );

          path.setAttribute(
            "d",
            pointsToSvgPath(
              finalPoints,
            ),
          );

          path.style.opacity =
            `${overlay}`;

          path.style.strokeWidth =
            `${mix(
              4.6,
              5.2,
              fit,
            )}`;
        },
      );

      invalidate();
    };

    gsap.ticker.add(
      update,
    );

    update();

    return () => {
      gsap.ticker.remove(
        update,
      );
    };
  }, [
    camera,
    invalidate,
    pathRefs,
    shaftCurves,
    travelRef,
  ]);

  return null;
}

function sampleProjectedCurve(
  curve:
    CatmullRomCurve3,

  camera:
    import("three").Camera,

  scratch:
    Vector3,
) {
  return Array.from({
    length:
      HANDOFF_SAMPLE_COUNT,
  }).map(
    (
      _,
      index,
    ) => {
      const t =
        HANDOFF_SAMPLE_COUNT <=
        1
          ? 0
          : index /
            (
              HANDOFF_SAMPLE_COUNT -
              1
            );

      curve.getPointAt(
        t,
        scratch,
      );

      scratch.project(
        camera,
      );

      return {
        x:
          (
            scratch.x *
              0.5 +
            0.5
          ) *
          1600,

        y:
          (
            -scratch.y *
              0.5 +
            0.5
          ) *
          900,
      };
    },
  );
}

function averageX(
  points:
    Array<{
      x:
        number;

      y:
        number;
    }>,
) {
  if (
    points.length ===
    0
  ) {
    return 0;
  }

  return points.reduce(
    (
      sum,
      point,
    ) =>
      sum +
      point.x,
    0,
  ) /
  points.length;
}

function range(
  value:
    number,

  start:
    number,

  end:
    number,
) {
  if (
    value <=
    start
  ) {
    return 0;
  }

  if (
    value >=
    end
  ) {
    return 1;
  }

  return (
    value -
    start
  ) /
  (
    end -
    start
  );
}

function smootherstep(
  value:
    number,
) {
  const t =
    Math.min(
      1,
      Math.max(
        0,
        value,
      ),
    );

  return (
    t *
    t *
    t *
    (
      t *
      (
        t *
        6 -
        15
      ) +
      10
    )
  );
}

function mix(
  start:
    number,

  end:
    number,

  amount:
    number,
) {
  return (
    start +
    (
      end -
      start
    ) *
    amount
  );
}
