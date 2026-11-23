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
  Mesh,
  MeshBasicMaterial,
  TubeGeometry,
  Vector3,
} from "three";

import {
  CONTROL_CATEGORIES,
  CONTROL_LINE_END_T,
  CONTROL_TERMINAL,
} from "@/components/showcase/scenes/control/controlWorldConfig";

import {
  getControlCeilingPoint,
  getControlTerminalWallFrame,
} from "@/components/showcase/scenes/control/controlTerminalMath";

import {
  createTerminalFlowCurves,
} from "@/components/showcase/scenes/control/controlTerminalFlowGeometry";

type ControlTerminalFlowProps = {
  curve:
    CatmullRomCurve3;

  travelRef:
    MutableRefObject<number>;
};

type Runtime = {
  ceilingGeometry:
    TubeGeometry;

  ceilingIndexCount:
    number;

  descentGeometry:
    TubeGeometry;

  descentIndexCount:
    number;

  shaftGeometry:
    TubeGeometry;

  shaftIndexCount:
    number;

  shaftStart:
    Vector3;
};

export function ControlTerminalFlow({
  curve,
  travelRef,
}: ControlTerminalFlowProps) {
  const {
    invalidate,
  } =
    useThree();

  const runtime =
    useMemo(
      () =>
        CONTROL_CATEGORIES.map(
          (
            category,
            index,
          ) =>
            createRuntime(
              curve,
              category.lineLane,
              index,
            ),
        ),
      [
        curve,
      ],
    );

  const ceilingRefs =
    useRef<
      Array<
        Mesh | null
      >
    >([]);

  const descentRefs =
    useRef<
      Array<
        Mesh | null
      >
    >([]);

  const shaftRefs =
    useRef<
      Array<
        Mesh | null
      >
    >([]);

  const jointRefs =
    useRef<
      Array<
        Mesh | null
      >
    >([]);

  const ceilingMaterialRefs =
    useRef<
      Array<
        MeshBasicMaterial | null
      >
    >([]);

  const descentMaterialRefs =
    useRef<
      Array<
        MeshBasicMaterial | null
      >
    >([]);

  const shaftMaterialRefs =
    useRef<
      Array<
        MeshBasicMaterial | null
      >
    >([]);

  useEffect(() => {
    let previous =
      Number.NaN;

    const update = () => {
      const travel =
        Math.max(
          0,
          travelRef.current,
        );

      if (
        Number.isFinite(
          previous,
        ) &&
        Math.abs(
          travel -
          previous,
        ) <
          0.00001
      ) {
        return;
      }

      previous =
        travel;

      /*
       * 3D disappears only AFTER the camera has already become almost
       * front-facing. Until then the physical geometry stays intact.
       */
      const handoffFade =
        smootherstep(
          range(
            travel,
            CONTROL_TERMINAL.handoffOverlayStart,
            CONTROL_TERMINAL.handoffOverlayFull,
          ),
        );

      const physicalOpacity =
        1 -
        handoffFade;

      runtime.forEach(
        (
          data,
          index,
        ) => {
          const stagger =
            index *
            0.04;

          const ceilingReveal =
            smootherstep(
              range(
                travel,
                CONTROL_TERMINAL.flowStart +
                  stagger,
                CONTROL_TERMINAL.lineTurnStart +
                  0.14 +
                  stagger *
                    0.15,
              ),
            );

          const descentReveal =
            smootherstep(
              range(
                travel,
                CONTROL_TERMINAL.lineTurnStart +
                  0.03 +
                  stagger,
                CONTROL_TERMINAL.lineDescentEnd +
                  stagger *
                    0.12,
              ),
            );

          /*
           * Shaft starts immediately as the line reaches the hole.
           * No one-scroll dead zone and no tiny disconnected fragments.
           */
          const shaftReveal =
            smootherstep(
              range(
                travel,
                CONTROL_TERMINAL.shaftLineStart,
                CONTROL_TERMINAL.shaftLineFull,
              ),
            );

          data.ceilingGeometry.setDrawRange(
            0,
            Math.floor(
              data.ceilingIndexCount *
                ceilingReveal,
            ),
          );

          data.descentGeometry.setDrawRange(
            0,
            Math.floor(
              data.descentIndexCount *
                descentReveal,
            ),
          );

          data.shaftGeometry.setDrawRange(
            0,
            Math.floor(
              data.shaftIndexCount *
                shaftReveal,
            ),
          );

          const ceiling =
            ceilingRefs.current[
              index
            ];

          const descent =
            descentRefs.current[
              index
            ];

          const shaft =
            shaftRefs.current[
              index
            ];

          const joint =
            jointRefs.current[
              index
            ];

          if (ceiling) {
            ceiling.visible =
              ceilingReveal >
                0.001 &&
              physicalOpacity >
                0.001;
          }

          if (descent) {
            descent.visible =
              descentReveal >
                0.001 &&
              physicalOpacity >
                0.001;
          }

          if (shaft) {
            shaft.visible =
              shaftReveal >
                0.001 &&
              physicalOpacity >
                0.001;
          }

          if (joint) {
            joint.visible =
              shaftReveal >
                0.001 &&
              descentReveal >
                0.001 &&
              physicalOpacity >
                0.001;
          }

          const ceilingMaterial =
            ceilingMaterialRefs.current[
              index
            ];

          const descentMaterial =
            descentMaterialRefs.current[
              index
            ];

          const shaftMaterial =
            shaftMaterialRefs.current[
              index
            ];

          if (ceilingMaterial) {
            ceilingMaterial.opacity =
              0.56 *
              physicalOpacity;
          }

          if (descentMaterial) {
            descentMaterial.opacity =
              0.74 *
              physicalOpacity;
          }

          if (shaftMaterial) {
            shaftMaterial.opacity =
              0.88 *
              physicalOpacity;
          }
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
    invalidate,
    runtime,
    travelRef,
  ]);

  return (
    <group
      name="control-terminal-flow"
    >
      {
        runtime.map(
          (
            data,
            index,
          ) => (
            <group
              key={
                `terminal-flow-${index}`
              }
            >
              <mesh
                ref={(
                  element,
                ) => {
                  ceilingRefs.current[
                    index
                  ] =
                    element;
                }}
                geometry={
                  data.ceilingGeometry
                }
                visible={
                  false
                }
              >
                <meshBasicMaterial
                  ref={(
                    material,
                  ) => {
                    ceilingMaterialRefs.current[
                      index
                    ] =
                      material;
                  }}
                  color="#179DFF"
                  transparent
                  opacity={
                    0.56
                  }
                  toneMapped={
                    false
                  }
                  depthWrite={
                    false
                  }
                />
              </mesh>

              <mesh
                ref={(
                  element,
                ) => {
                  descentRefs.current[
                    index
                  ] =
                    element;
                }}
                geometry={
                  data.descentGeometry
                }
                visible={
                  false
                }
              >
                <meshBasicMaterial
                  ref={(
                    material,
                  ) => {
                    descentMaterialRefs.current[
                      index
                    ] =
                      material;
                  }}
                  color="#50B8F6"
                  transparent
                  opacity={
                    0.74
                  }
                  toneMapped={
                    false
                  }
                  depthWrite={
                    false
                  }
                />
              </mesh>

              <mesh
                ref={(
                  element,
                ) => {
                  shaftRefs.current[
                    index
                  ] =
                    element;
                }}
                geometry={
                  data.shaftGeometry
                }
                visible={
                  false
                }
              >
                <meshBasicMaterial
                  ref={(
                    material,
                  ) => {
                    shaftMaterialRefs.current[
                      index
                    ] =
                      material;
                  }}
                  color="#0BA5FF"
                  transparent
                  opacity={
                    0.88
                  }
                  toneMapped={
                    false
                  }
                  depthWrite={
                    false
                  }
                />
              </mesh>

              {/*
               * Fills the meeting point between the wall/floor route and the
               * vertical shaft tube, eliminating the hollow/cut-looking tip.
               */}
              <mesh
                ref={(
                  element,
                ) => {
                  jointRefs.current[
                    index
                  ] =
                    element;
                }}
                position={[
                  data.shaftStart.x,
                  data.shaftStart.y,
                  data.shaftStart.z,
                ]}
                visible={
                  false
                }
              >
                <sphereGeometry
                  args={[
                    0.024,
                    10,
                    10,
                  ]}
                />

                <meshBasicMaterial
                  color="#0BA5FF"
                  toneMapped={
                    false
                  }
                />
              </mesh>
            </group>
          ),
        )
      }
    </group>
  );
}

function createRuntime(
  curve:
    CatmullRomCurve3,

  ceilingLane:
    number,

  index:
    number,
):
  Runtime {
  const wall =
    getControlTerminalWallFrame(
      curve,
    );

  const {
    descentCurve,
    shaftCurve,
    shaftStart,
  } =
    createTerminalFlowCurves(
      curve,
      ceilingLane,
      index,
    );

  const wallLanes = [
    -2.62,
    -2.28,
    -1.94,
    1.94,
    2.28,
    2.62,
  ];

  const wallLane =
    wallLanes[
      index
    ] ??
    0;

  const ceilingStart =
    getControlCeilingPoint(
      curve,
      CONTROL_LINE_END_T,
      ceilingLane,
    );

  const ceilingMid =
    getControlCeilingPoint(
      curve,
      0.905,
      mix(
        ceilingLane,
        wallLane *
          0.22,
        0.58,
      ),
    );

  const wallTop =
    wall.center
      .clone()
      .addScaledVector(
        wall.up,
        4.08,
      )
      .addScaledVector(
        wall.side,
        wallLane,
      )
      .addScaledVector(
        wall.cameraNormal,
        0.12,
      );

  const ceilingCurve =
    new CatmullRomCurve3(
      [
        ceilingStart,
        ceilingMid,
        wallTop,
      ],
      false,
      "catmullrom",
      0.42,
    );

  const ceilingGeometry =
    new TubeGeometry(
      ceilingCurve,
      72,
      0.017,
      8,
      false,
    );

  const descentGeometry =
    new TubeGeometry(
      descentCurve,
      116,
      0.02,
      8,
      false,
    );

  const shaftGeometry =
    new TubeGeometry(
      shaftCurve,
      92,
      0.019,
      8,
      false,
    );

  ceilingGeometry.setDrawRange(
    0,
    0,
  );

  descentGeometry.setDrawRange(
    0,
    0,
  );

  shaftGeometry.setDrawRange(
    0,
    0,
  );

  return {
    ceilingGeometry,

    ceilingIndexCount:
      ceilingGeometry.index?.count ??
      0,

    descentGeometry,

    descentIndexCount:
      descentGeometry.index?.count ??
      0,

    shaftGeometry,

    shaftIndexCount:
      shaftGeometry.index?.count ??
      0,

    shaftStart,
  };
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
