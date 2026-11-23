"use client";

import {
  useEffect,
  useMemo,
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

import type {
  PerspectiveCamera,
} from "three";

import {
  CONTROL_CAMERA_FORWARD_END_T,
  CONTROL_CAMERA_START_T,
  CONTROL_CAMERA_T_PER_TRAVEL,
  CONTROL_TERMINAL,
} from "@/components/showcase/scenes/control/controlWorldConfig";

import {
  getControlTerminalHoleFrame,
  getControlTerminalWallFrame,
} from "@/components/showcase/scenes/control/controlTerminalMath";

type ControlTunnelCameraProps = {
  curve:
    CatmullRomCurve3;

  travelRef:
    MutableRefObject<number>;

  reducedMotion:
    boolean;
};

/*
 * ============================================================================
 * CONTROL CAMERA — PERSPECTIVE HANDOFF
 * ============================================================================
 *
 * The lines stay physically simple.
 *
 * CAMERA does the work:
 *
 * 1. approach the hole from above;
 * 2. look down the shaft -> natural vanishing-point perspective;
 * 3. enter the aperture;
 * 4. orbit smoothly around the shaft;
 * 5. finish perfectly side/front-on to the vertical strands;
 * 6. only then crossfade to 2D.
 */
export function ControlTunnelCamera({
  curve,
  travelRef,
  reducedMotion,
}: ControlTunnelCameraProps) {
  const {
    camera,
    invalidate,
  } =
    useThree();

  const terminal =
    useMemo(
      () => {
        const wall =
          getControlTerminalWallFrame(
            curve,
          );

        const hole =
          getControlTerminalHoleFrame(
            curve,
          );

        const brandTarget =
          wall.center
            .clone()
            .addScaledVector(
              wall.up,
              0.72,
            )
            .addScaledVector(
              wall.cameraNormal,
              0.08,
            );

        const approachPosition =
          curve.getPointAt(
            0.852,
          );

        approachPosition.y +=
          0.05;

        const rimPosition =
          hole.position
            .clone()
            .addScaledVector(
              hole.tangent,
              -1.42,
            );

        rimPosition.y +=
          1.22;

        const holeLook =
          hole.position
            .clone();

        holeLook.y -=
          1.05;

        /*
         * First position inside the shaft.
         * We are still looking DOWN here.
         */
        const dropPosition =
          hole.position
            .clone()
            .addScaledVector(
              hole.tangent,
              -0.12,
            );

        dropPosition.y -=
          1.45;

        const deepLook =
          hole.position
            .clone();

        deepLook.y -=
          6.6;

        /*
         * Front/side-on handoff view.
         *
         * The physical shaft lines span:
         *   world Y + hole.side
         *
         * Their plane normal is approximately hole.tangent.
         *
         * Therefore placing the camera along -hole.tangent makes the same
         * physical strands appear straight, vertical and parallel.
         */
        const frontTarget =
          hole.position
            .clone();

        frontTarget.y -=
          3.35;

        const frontPosition =
          frontTarget
            .clone()
            .addScaledVector(
              hole.tangent,
              -6.9,
            );

        return {
          wall,
          hole,
          brandTarget,
          approachPosition,
          rimPosition,
          holeLook,
          dropPosition,
          deepLook,
          frontTarget,
          frontPosition,
        };
      },
      [
        curve,
      ],
    );

  useEffect(() => {
    const perspectiveCamera =
      camera as
        PerspectiveCamera;

    let previousTravel =
      Number.NaN;

    const normalPosition =
      new Vector3();

    const normalLook =
      new Vector3();

    const tangent =
      new Vector3();

    const position =
      new Vector3();

    const lookTarget =
      new Vector3();

    const up =
      new Vector3();

    const worldUp =
      new Vector3(
        0,
        1,
        0,
      );

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

      const normalT =
        clamp(
          CONTROL_CAMERA_START_T +
            travel *
              CONTROL_CAMERA_T_PER_TRAVEL,
          CONTROL_CAMERA_START_T,
          CONTROL_CAMERA_FORWARD_END_T,
        );

      const normalLookT =
        clamp(
          normalT +
            0.03,
          0,
          0.955,
        );

      curve.getPointAt(
        normalT,
        normalPosition,
      );

      curve.getPointAt(
        normalLookT,
        normalLook,
      );

      curve.getTangentAt(
        normalT,
        tangent,
      );

      if (
        !reducedMotion &&
        travel <
          CONTROL_TERMINAL.cameraTakeoverStart
      ) {
        normalPosition.x +=
          Math.sin(
            travel *
              0.31,
          ) *
          0.035;

        normalPosition.y +=
          Math.sin(
            travel *
              0.21 +
              1.2,
          ) *
          0.018;
      }

      /*
       * PHASE 1 — normal tunnel
       */
      if (
        travel <=
        CONTROL_TERMINAL.cameraTakeoverStart
      ) {
        perspectiveCamera.position.copy(
          normalPosition,
        );

        perspectiveCamera.up.copy(
          worldUp,
        );

        perspectiveCamera.lookAt(
          normalLook,
        );

        if (
          !reducedMotion
        ) {
          perspectiveCamera.rotation.z =
            clamp(
              -tangent.x *
                0.042,
              -0.028,
              0.028,
            );
        }

        setFov(
          perspectiveCamera,
          68,
        );

        invalidate();

        return;
      }

      /*
       * PHASE 2 — terminal wall composition
       */
      const takeover =
        smootherstep(
          range(
            travel,
            CONTROL_TERMINAL.cameraTakeoverStart,
            CONTROL_TERMINAL.lookDownStart,
          ),
        );

      position
        .copy(
          normalPosition,
        )
        .lerp(
          terminal.approachPosition,
          takeover,
        );

      lookTarget
        .copy(
          normalLook,
        )
        .lerp(
          terminal.brandTarget,
          takeover,
        );

      up.copy(
        worldUp,
      );

      /*
       * PHASE 3 — look from the top into the large aperture.
       *
       * This is where the six straight shaft strands naturally point toward
       * the vanishing point because the camera is looking along their depth.
       */
      if (
        travel >
        CONTROL_TERMINAL.lookDownStart
      ) {
        const lookDown =
          smootherstep(
            range(
              travel,
              CONTROL_TERMINAL.lookDownStart,
              CONTROL_TERMINAL.fallStart,
            ),
          );

        position
          .copy(
            terminal.approachPosition,
          )
          .lerp(
            terminal.rimPosition,
            lookDown,
          );

        lookTarget
          .copy(
            terminal.brandTarget,
          )
          .lerp(
            terminal.holeLook,
            lookDown,
          );

        up
          .copy(
            worldUp,
          )
          .lerp(
            terminal.hole.tangent,
            lookDown *
              0.88,
          )
          .normalize();
      }

      /*
       * PHASE 4 — enter the shaft while STILL looking down.
       *
       * This begins immediately with the shaft-line reveal, so there is no
       * dead scroll after crossing the hole.
       */
      if (
        travel >
        CONTROL_TERMINAL.fallStart
      ) {
        const drop =
          smootherstep(
            range(
              travel,
              CONTROL_TERMINAL.fallStart,
              CONTROL_TERMINAL.perspectiveTurnStart,
            ),
          );

        position
          .copy(
            terminal.rimPosition,
          )
          .lerp(
            terminal.dropPosition,
            drop,
          );

        lookTarget
          .copy(
            terminal.holeLook,
          )
          .lerp(
            terminal.deepLook,
            drop,
          );

        up
          .copy(
            worldUp,
          )
          .lerp(
            terminal.hole.tangent,
            0.96,
          )
          .normalize();
      }

      /*
       * PHASE 5 — CAMERA changes the perspective.
       *
       * Lines remain straight in world space.
       * We orbit from top-down to side/front-on around the shaft.
       */
      if (
        travel >
        CONTROL_TERMINAL.perspectiveTurnStart
      ) {
        const turn =
          smootherstep(
            range(
              travel,
              CONTROL_TERMINAL.perspectiveTurnStart,
              CONTROL_TERMINAL.perspectiveTurnEnd,
            ),
          );

        position
          .copy(
            terminal.dropPosition,
          )
          .lerp(
            terminal.frontPosition,
            turn,
          );

        lookTarget
          .copy(
            terminal.deepLook,
          )
          .lerp(
            terminal.frontTarget,
            turn,
          );

        /*
         * Downward view uses tunnel tangent as screen-up.
         * Front-facing view returns cleanly to world-up.
         */
        up
          .copy(
            terminal.hole.tangent,
          )
          .lerp(
            worldUp,
            turn,
          )
          .normalize();
      }

      /*
       * Final optical fit.
       * Narrowing FOV slightly as we become front-facing gives a controlled
       * flattening sensation without any line deformation.
       */
      const perspectiveFit =
        smootherstep(
          range(
            travel,
            CONTROL_TERMINAL.perspectiveTurnStart,
            CONTROL_TERMINAL.perspectiveTurnEnd,
          ),
        );

      setFov(
        perspectiveCamera,
        mix(
          68,
          58,
          perspectiveFit,
        ),
      );

      perspectiveCamera.position.copy(
        position,
      );

      perspectiveCamera.up.copy(
        up,
      );

      perspectiveCamera.lookAt(
        lookTarget,
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
    curve,
    invalidate,
    reducedMotion,
    terminal,
    travelRef,
  ]);

  return null;
}

function setFov(
  camera:
    PerspectiveCamera,

  value:
    number,
) {
  if (
    Math.abs(
      camera.fov -
      value,
    ) <
    0.01
  ) {
    return;
  }

  camera.fov =
    value;

  camera.updateProjectionMatrix();
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
    clamp(
      value,
      0,
      1,
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

function clamp(
  value:
    number,

  min:
    number,

  max:
    number,
) {
  return Math.min(
    max,
    Math.max(
      min,
      value,
    ),
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
