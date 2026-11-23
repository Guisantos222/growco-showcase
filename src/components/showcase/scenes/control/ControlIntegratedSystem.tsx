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
  Line,
} from "@react-three/drei";

import {
  useThree,
} from "@react-three/fiber";

import {
  gsap,
} from "gsap";

import {
  CatmullRomCurve3,
  Group,
  Mesh,
  TubeGeometry,
  Vector3,
} from "three";

import {
  CONTROL_CATEGORIES,
  CONTROL_LINE_END_T,
  CONTROL_TERMINAL,
  getCategoryTiming,
} from "@/components/showcase/scenes/control/controlWorldConfig";

import type {
  ControlCategoryDefinition,
  ControlCategoryId,
} from "@/components/showcase/scenes/control/controlWorldConfig";

type ControlIntegratedSystemProps = {
  curve:
    CatmullRomCurve3;

  travelRef:
    MutableRefObject<number>;
};

type CategoryRuntime = {
  timing:
    ReturnType<
      typeof getCategoryTiming
    >;

  stationPosition:
    Vector3;

  stationYaw:
    number;

  connectorCurve:
    CatmullRomCurve3;

  connectorGeometry:
    TubeGeometry;

  connectorIndexCount:
    number;

  ceilingCurve:
    CatmullRomCurve3;

  ceilingGeometry:
    TubeGeometry;

  ceilingIndexCount:
    number;
};

/*
 * ============================================================================
 * CONTROL INTEGRATED SYSTEM
 * ============================================================================
 *
 * This component replaces the old split between:
 *
 * - isolated station animation;
 * - independent ceiling line animation;
 * - unrelated timing values.
 *
 * Everything is driven by ONE category config and ONE camera-space timeline.
 *
 * Each category now has:
 *
 * 1. a physical station on the wall;
 * 2. multiple animated objects that BUILD sequentially;
 * 3. one connector that grows FROM the station TO the ceiling;
 * 4. one persistent ceiling line that continues forward;
 * 5. one travelling signal that moves through connector + ceiling line.
 *
 * The line is therefore causally linked to the object that generated it.
 */

export function ControlIntegratedSystem({
  curve,
  travelRef,
}: ControlIntegratedSystemProps) {
  const {
    invalidate,
  } =
    useThree();

  const runtime =
    useMemo<
      CategoryRuntime[]
    >(
      () =>
        CONTROL_CATEGORIES.map(
          (
            category,
          ) =>
            createCategoryRuntime(
              curve,
              category,
            ),
        ),
      [
        curve,
      ],
    );

  const stationRefs =
    useRef<
      Array<
        Group | null
      >
    >([]);

  const buildPartRefs =
    useRef<
      Array<
        Array<
          Group | null
        >
      >
    >([]);

  const connectorRefs =
    useRef<
      Array<
        Mesh | null
      >
    >([]);

  const ceilingRefs =
    useRef<
      Array<
        Mesh | null
      >
    >([]);

  const signalRefs =
    useRef<
      Array<
        Mesh | null
      >
    >([]);

  useEffect(() => {
    let previousTravel =
      -1;

    const signalPoint =
      new Vector3();

    const update = () => {
      const travel =
        Math.max(
          0,
          travelRef.current,
        );

      if (
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

      CONTROL_CATEGORIES.forEach(
        (
          category,
          index,
        ) => {
          const data =
            runtime[
              index
            ];

          const station =
            stationRefs.current[
              index
            ];

          const connector =
            connectorRefs.current[
              index
            ];

          const ceiling =
            ceilingRefs.current[
              index
            ];

          const signal =
            signalRefs.current[
              index
            ];

          if (
            !data ||
            !station ||
            !connector ||
            !ceiling ||
            !signal
          ) {
            return;
          }

          /*
           * ==========================================================
           * STATION VISIBILITY
           * ==========================================================
           */

          const enter =
            smootherstep(
              range(
                travel,
                data.timing.enterStart,
                data.timing.buildStart +
                  0.32,
              ),
            );

          const exit =
            smootherstep(
              range(
                travel,
                data.timing.holdEnd,
                data.timing.exitEnd,
              ),
            );

          const stationVisibility =
            enter *
            (
              1 -
              exit
            );

          station.visible =
            stationVisibility >
            0.001;

          station.scale.setScalar(
            mix(
              0.92,
              1,
              enter,
            ) *
            mix(
              1,
              0.96,
              exit,
            ),
          );

          /*
           * ==========================================================
           * BUILD ANIMATION
           * ==========================================================
           *
           * The station is not one object popping on.
           *
           * Each visual layer builds in sequence.
           */

          const build =
            smootherstep(
              range(
                travel,
                data.timing.buildStart,
                data.timing.buildEnd,
              ),
            );

          const parts =
            buildPartRefs.current[
              index
            ] ??
            [];

          parts.forEach(
            (
              part,
              partIndex,
            ) => {
              if (!part) {
                return;
              }

              const localStart =
                partIndex *
                0.09;

              const localEnd =
                Math.min(
                  1,
                  localStart +
                    0.42,
                );

              const localBuild =
                smootherstep(
                  range(
                    build,
                    localStart,
                    localEnd,
                  ),
                );

              part.visible =
                localBuild >
                0.001;

              const scale =
                Math.max(
                  0.001,
                  localBuild,
                );

              part.scale.set(
                scale,
                scale,
                scale,
              );

              part.position.z =
                mix(
                  -0.12,
                  0,
                  localBuild,
                );
            },
          );

          /*
           * ==========================================================
           * CONNECTOR: WALL -> CEILING
           * ==========================================================
           */

          const connectorReveal =
            smootherstep(
              range(
                travel,
                data.timing.connectorStart,
                data.timing.connectorEnd,
              ),
            );

          const connectorCount =
            Math.floor(
              data.connectorIndexCount *
              connectorReveal,
            );

          data.connectorGeometry.setDrawRange(
            0,
            connectorCount,
          );

          connector.visible =
            connectorReveal >
            0.001;

          /*
           * ==========================================================
           * PERSISTENT CEILING LINE
           * ==========================================================
           */

          const ceilingReveal =
            smootherstep(
              range(
                travel,
                data.timing.lineStart,
                data.timing.lineEnd,
              ),
            );

          const ceilingCount =
            Math.floor(
              data.ceilingIndexCount *
              ceilingReveal,
            );

          data.ceilingGeometry.setDrawRange(
            0,
            ceilingCount,
          );

          /*
           * Once the line exists, it stays through CONTROL's main tunnel,
           * BUT it must leave before the final 3D -> SVG handoff.
           *
           * Previously these original ceiling lines stayed visible forever.
           * They were one of the reasons blue geometry kept flashing inside
           * the shaft even after ControlTerminalFlow had already faded.
           */
          ceiling.visible =
            travel >=
              data.timing.lineStart &&
            travel <
              CONTROL_TERMINAL.handoffOverlayStart;

          /*
           * ==========================================================
           * SIGNAL
           * ==========================================================
           *
           * One signal visibly moves out of the station,
           * climbs to the ceiling and then continues along the line.
           */

          const signalPhase =
            smootherstep(
              range(
                travel,
                data.timing.connectorStart +
                  0.08,
                data.timing.lineEnd +
                  0.35,
              ),
            );

          signal.visible =
            signalPhase >
            0.001 &&
            signalPhase <
            0.999;

          if (
            signalPhase <
            0.42
          ) {
            const amount =
              clamp01(
                signalPhase /
                0.42,
              );

            data.connectorCurve.getPointAt(
              amount,
              signalPoint,
            );
          } else {
            const amount =
              clamp01(
                (
                  signalPhase -
                  0.42
                ) /
                0.58,
              );

            data.ceilingCurve.getPointAt(
              amount,
              signalPoint,
            );
          }

          signal.position.copy(
            signalPoint,
          );

          const pulse =
            0.72 +
            Math.sin(
              signalPhase *
                Math.PI *
                5,
            ) *
            0.12;

          signal.scale.setScalar(
            pulse,
          );
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

  const registerBuildPart = (
    categoryIndex:
      number,

    partIndex:
      number,

    group:
      Group | null,
  ) => {
    if (
      !buildPartRefs.current[
        categoryIndex
      ]
    ) {
      buildPartRefs.current[
        categoryIndex
      ] =
        [];
    }

    buildPartRefs.current[
      categoryIndex
    ][
      partIndex
    ] =
      group;
  };

  return (
    <group
      name="control-integrated-system"
    >
      {
        CONTROL_CATEGORIES.map(
          (
            category,
            index,
          ) => {
            const data =
              runtime[
                index
              ];

            return (
              <group
                key={
                  category.id
                }
              >
                {/*
                 * ====================================================
                 * PHYSICAL CATEGORY INSTALLATION
                 * ====================================================
                 */}

                <group
                  ref={(
                    element,
                  ) => {
                    stationRefs.current[
                      index
                    ] =
                      element;
                  }}
                  position={[
                    data.stationPosition.x,
                    data.stationPosition.y,
                    data.stationPosition.z,
                  ]}
                  rotation={[
                    0,
                    data.stationYaw,
                    0,
                  ]}
                  visible={
                    false
                  }
                >
                  <StationShell />

                  <StationVisual
                    id={
                      category.id
                    }
                    register={(
                      partIndex,
                      group,
                    ) =>
                      registerBuildPart(
                        index,
                        partIndex,
                        group,
                      )
                    }
                  />

                  <pointLight
                    position={[
                      0,
                      0.35,
                      1.15,
                    ]}
                    color="#69CBF3"
                    intensity={
                      3.1
                    }
                    distance={
                      7.5
                    }
                    decay={
                      2
                    }
                  />
                </group>

                {/*
                 * ====================================================
                 * WALL -> CEILING CONNECTOR
                 * ====================================================
                 */}

                <mesh
                  ref={(
                    element,
                  ) => {
                    connectorRefs.current[
                      index
                    ] =
                      element;
                  }}
                  geometry={
                    data.connectorGeometry
                  }
                  visible={
                    false
                  }
                >
                  <meshBasicMaterial
                    color="#4FC5F3"
                    transparent
                    opacity={
                      0.78
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
                 * ====================================================
                 * CEILING LINE
                 * ====================================================
                 */}

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
                    color="#0BA5FF"
                    transparent
                    opacity={
                      0.66
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
                 * ====================================================
                 * SIGNAL
                 * ====================================================
                 */}

                <mesh
                  ref={(
                    element,
                  ) => {
                    signalRefs.current[
                      index
                    ] =
                      element;
                  }}
                  visible={
                    false
                  }
                >
                  <sphereGeometry
                    args={[
                      0.078,
                      14,
                      14,
                    ]}
                  />

                  <meshBasicMaterial
                    color="#D4F3FF"
                    toneMapped={
                      false
                    }
                    depthWrite={
                      false
                    }
                  />
                </mesh>
              </group>
            );
          },
        )
      }
    </group>
  );
}

/*
 * ============================================================================
 * STATION SHELL
 * ============================================================================
 */

function StationShell() {
  return (
    <group>
      <mesh
        position={[
          0,
          0,
          -0.12,
        ]}
      >
        <boxGeometry
          args={[
            4.35,
            2.75,
            0.18,
          ]}
        />

        <meshStandardMaterial
          color="#07131B"
          roughness={
            0.94
          }
          metalness={
            0.035
          }
          emissive="#061219"
          emissiveIntensity={
            0.2
          }
        />
      </mesh>

      <mesh>
        <planeGeometry
          args={[
            4.05,
            2.45,
          ]}
        />

        <meshStandardMaterial
          color="#0B1B24"
          roughness={
            0.84
          }
          metalness={
            0.05
          }
          emissive="#071821"
          emissiveIntensity={
            0.23
          }
        />
      </mesh>

      <mesh
        position={[
          -1.78,
          1.03,
          0.045,
        ]}
      >
        <boxGeometry
          args={[
            0.2,
            0.055,
            0.03,
          ]}
        />

        <meshBasicMaterial
          color="#0BA5FF"
          transparent
          opacity={
            0.8
          }
        />
      </mesh>
    </group>
  );
}

type RegisterPart = (
  index:
    number,

  group:
    Group | null,
) => void;

type StationVisualProps = {
  id:
    ControlCategoryId;

  register:
    RegisterPart;
};

function StationVisual({
  id,
  register,
}: StationVisualProps) {
  switch (
    id
  ) {
    case "sales":
      return (
        <SalesStation
          register={
            register
          }
        />
      );

    case "stock":
      return (
        <StockStation
          register={
            register
          }
        />
      );

    case "finance":
      return (
        <FinanceStation
          register={
            register
          }
        />
      );

    case "people":
      return (
        <PeopleStation
          register={
            register
          }
        />
      );

    case "goals":
      return (
        <GoalsStation
          register={
            register
          }
        />
      );

    case "reports":
      return (
        <ReportsStation
          register={
            register
          }
        />
      );

    default:
      return null;
  }
}

/*
 * ============================================================================
 * SALES
 * ============================================================================
 */

function SalesStation({
  register,
}: {
  register:
    RegisterPart;
}) {
  const bars = [
    0.35,
    0.48,
    0.41,
    0.61,
    0.57,
    0.75,
    0.84,
  ];

  const linePoints:
    [
      number,
      number,
      number,
    ][] =
      bars.map(
        (
          value,
          index,
        ) => [
          -1.05 +
          index *
            0.34,

          -0.28 +
          value *
            0.78,

          0.16,
        ],
      );

  return (
    <group
      position={[
        0.25,
        -0.05,
        0.1,
      ]}
    >
      <group
        ref={(
          element,
        ) =>
          register(
            0,
            element,
          )
        }
      >
        <MetricSlab
          position={[
            -1.28,
            0.78,
            0.05,
          ]}
          width={
            0.82
          }
          active
        />

        <MetricSlab
          position={[
            -0.3,
            0.78,
            0.05,
          ]}
          width={
            0.68
          }
        />

        <MetricSlab
          position={[
            0.56,
            0.78,
            0.05,
          ]}
          width={
            0.72
          }
        />
      </group>

      <group
        ref={(
          element,
        ) =>
          register(
            1,
            element,
          )
        }
      >
        {
          bars.map(
            (
              value,
              index,
            ) => (
              <mesh
                key={
                  `sales-bar-${index}`
                }
                position={[
                  -1.05 +
                  index *
                    0.34,

                  -0.62 +
                  value *
                    0.4,

                  0.1,
                ]}
              >
                <boxGeometry
                  args={[
                    0.16,
                    value *
                      0.82,
                    0.08,
                  ]}
                />

                <meshStandardMaterial
                  color={
                    index >=
                    4
                      ? "#21B2FC"
                      : "#173947"
                  }
                  emissive={
                    index >=
                    4
                      ? "#0B3A53"
                      : "#06141C"
                  }
                  emissiveIntensity={
                    0.46
                  }
                  roughness={
                    0.66
                  }
                />
              </mesh>
            ),
          )
        }
      </group>

      <group
        ref={(
          element,
        ) =>
          register(
            2,
            element,
          )
        }
      >
        <Line
          points={
            linePoints
          }
          color="#B1E8FF"
          lineWidth={
            1.4
          }
          transparent
          opacity={
            0.76
          }
        />
      </group>

      <group
        ref={(
          element,
        ) =>
          register(
            3,
            element,
          )
        }
      >
        <MiniChip
          position={[
            1.18,
            0.6,
            0.08,
          ]}
          scaleX={
            0.72
          }
          active
        />

        <MiniChip
          position={[
            1.18,
            0.26,
            0.08,
          ]}
          scaleX={
            0.56
          }
        />

        <MiniChip
          position={[
            1.18,
            -0.08,
            0.08,
          ]}
          scaleX={
            0.63
          }
        />
      </group>
    </group>
  );
}

/*
 * ============================================================================
 * STOCK
 * ============================================================================
 */

function StockStation({
  register,
}: {
  register:
    RegisterPart;
}) {
  const levels = [
    0.88,
    0.68,
    0.82,
    0.46,
    0.62,
    0.34,
    0.74,
    0.53,
    0.41,
    0.69,
    0.58,
    0.29,
  ];

  return (
    <group
      position={[
        0.12,
        0,
        0.08,
      ]}
    >
      <group
        ref={(
          element,
        ) =>
          register(
            0,
            element,
          )
        }
      >
        <MetricSlab
          position={[
            -1.18,
            0.82,
            0.05,
          ]}
          width={
            0.88
          }
          active
        />

        <MetricSlab
          position={[
            -0.18,
            0.82,
            0.05,
          ]}
          width={
            0.72
          }
        />
      </group>

      <group
        ref={(
          element,
        ) =>
          register(
            1,
            element,
          )
        }
      >
        {
          levels.map(
            (
              level,
              index,
            ) => {
              const column =
                index %
                4;

              const row =
                Math.floor(
                  index /
                  4,
                );

              return (
                <InventoryCell
                  key={
                    `inventory-cell-${index}`
                  }
                  position={[
                    -1.15 +
                    column *
                      0.72,

                    0.42 -
                    row *
                      0.48,

                    0.08,
                  ]}
                  level={
                    level
                  }
                  critical={
                    level <
                    0.36
                  }
                />
              );
            },
          )
        }
      </group>

      <group
        ref={(
          element,
        ) =>
          register(
            2,
            element,
          )
        }
      >
        <MiniChip
          position={[
            1.15,
            0.58,
            0.08,
          ]}
          scaleX={
            0.64
          }
          active
        />

        <MiniChip
          position={[
            1.15,
            0.2,
            0.08,
          ]}
          scaleX={
            0.5
          }
        />

        <MiniChip
          position={[
            1.15,
            -0.18,
            0.08,
          ]}
          scaleX={
            0.58
          }
        />
      </group>
    </group>
  );
}

/*
 * ============================================================================
 * FINANCE
 * ============================================================================
 */

function FinanceStation({
  register,
}: {
  register:
    RegisterPart;
}) {
  const values = [
    0.31,
    0.42,
    0.39,
    0.54,
    0.61,
    0.58,
    0.79,
  ];

  const points:
    [
      number,
      number,
      number,
    ][] =
      values.map(
        (
          value,
          index,
        ) => [
          -1.22 +
          index *
            0.42,

          -0.38 +
          value *
            1.0,

          0.14,
        ],
      );

  return (
    <group
      position={[
        0.2,
        -0.02,
        0.08,
      ]}
    >
      <group
        ref={(
          element,
        ) =>
          register(
            0,
            element,
          )
        }
      >
        <MetricSlab
          position={[
            -1.2,
            0.82,
            0.05,
          ]}
          width={
            0.82
          }
          active
        />

        <MetricSlab
          position={[
            -0.28,
            0.82,
            0.05,
          ]}
          width={
            0.68
          }
        />

        <MetricSlab
          position={[
            0.55,
            0.82,
            0.05,
          ]}
          width={
            0.64
          }
        />
      </group>

      <group
        ref={(
          element,
        ) =>
          register(
            1,
            element,
          )
        }
      >
        <Line
          points={
            points
          }
          color="#82D5FA"
          lineWidth={
            1.7
          }
          transparent
          opacity={
            0.82
          }
        />

        {
          points.map(
            (
              point,
              index,
            ) => (
              <mesh
                key={
                  `finance-point-${index}`
                }
                position={
                  point
                }
              >
                <sphereGeometry
                  args={[
                    index ===
                    points.length -
                      1
                      ? 0.055
                      : 0.04,
                    12,
                    12,
                  ]}
                />

                <meshBasicMaterial
                  color={
                    index ===
                    points.length -
                      1
                      ? "#D5F4FF"
                      : "#0BA5FF"
                  }
                />
              </mesh>
            ),
          )
        }
      </group>

      <group
        ref={(
          element,
        ) =>
          register(
            2,
            element,
          )
        }
      >
        <MiniChip
          position={[
            -0.86,
            -0.78,
            0.08,
          ]}
          scaleX={
            0.74
          }
        />

        <MiniChip
          position={[
            0,
            -0.78,
            0.08,
          ]}
          scaleX={
            0.61
          }
          active
        />

        <MiniChip
          position={[
            0.86,
            -0.78,
            0.08,
          ]}
          scaleX={
            0.68
          }
        />
      </group>
    </group>
  );
}

/*
 * ============================================================================
 * PEOPLE
 * ============================================================================
 */

function PeopleStation({
  register,
}: {
  register:
    RegisterPart;
}) {
  const nodes:
    [
      number,
      number,
      number,
    ][] = [
    [
      -1.05,
      0.42,
      0.12,
    ],
    [
      -0.38,
      0.76,
      0.12,
    ],
    [
      0.38,
      0.54,
      0.12,
    ],
    [
      1.05,
      0.2,
      0.12,
    ],
    [
      0.46,
      -0.32,
      0.12,
    ],
    [
      -0.42,
      -0.42,
      0.12,
    ],
  ];

  const links = [
    [
      0,
      1,
    ],
    [
      1,
      2,
    ],
    [
      2,
      3,
    ],
    [
      2,
      4,
    ],
    [
      4,
      5,
    ],
    [
      5,
      0,
    ],
    [
      1,
      4,
    ],
  ];

  return (
    <group
      position={[
        0.18,
        0,
        0.08,
      ]}
    >
      <group
        ref={(
          element,
        ) =>
          register(
            0,
            element,
          )
        }
      >
        <MetricSlab
          position={[
            -1.18,
            0.82,
            0.05,
          ]}
          width={
            0.8
          }
          active
        />

        <MetricSlab
          position={[
            -0.25,
            0.82,
            0.05,
          ]}
          width={
            0.72
          }
        />
      </group>

      <group
        ref={(
          element,
        ) =>
          register(
            1,
            element,
          )
        }
      >
        {
          links.map(
            (
              [
                start,
                end,
              ],
              index,
            ) => (
              <Line
                key={
                  `people-link-${index}`
                }
                points={[
                  nodes[
                    start
                  ],
                  nodes[
                    end
                  ],
                ]}
                color="#52BFEA"
                lineWidth={
                  0.9
                }
                transparent
                opacity={
                  0.34
                }
              />
            ),
          )
        }
      </group>

      <group
        ref={(
          element,
        ) =>
          register(
            2,
            element,
          )
        }
      >
        {
          nodes.map(
            (
              position,
              index,
            ) => (
              <mesh
                key={
                  `people-node-${index}`
                }
                position={
                  position
                }
              >
                <sphereGeometry
                  args={[
                    index ===
                    2
                      ? 0.11
                      : 0.075,
                    14,
                    14,
                  ]}
                />

                <meshStandardMaterial
                  color={
                    index ===
                    2
                      ? "#BEEBFF"
                      : "#216E90"
                  }
                  emissive={
                    index ===
                    2
                      ? "#2D7EA2"
                      : "#0A2E41"
                  }
                  emissiveIntensity={
                    0.6
                  }
                  roughness={
                    0.62
                  }
                />
              </mesh>
            ),
          )
        }
      </group>

      <group
        ref={(
          element,
        ) =>
          register(
            3,
            element,
          )
        }
      >
        <MiniChip
          position={[
            1.2,
            0.62,
            0.08,
          ]}
          scaleX={
            0.6
          }
          active
        />

        <MiniChip
          position={[
            1.2,
            0.26,
            0.08,
          ]}
          scaleX={
            0.5
          }
        />

        <MiniChip
          position={[
            1.2,
            -0.1,
            0.08,
          ]}
          scaleX={
            0.56
          }
        />
      </group>
    </group>
  );
}

/*
 * ============================================================================
 * GOALS
 * ============================================================================
 */

function GoalsStation({
  register,
}: {
  register:
    RegisterPart;
}) {
  const progressCurve =
    useMemo(
      () =>
        new TubeGeometry(
          new CatmullRomCurve3(
            createArcPoints(
              0.72,
              Math.PI *
                2 *
                0.74,
              64,
            ),
          ),
          64,
          0.045,
          8,
          false,
        ),
      [],
    );

  return (
    <group
      position={[
        0.22,
        0.02,
        0.08,
      ]}
    >
      <group
        ref={(
          element,
        ) =>
          register(
            0,
            element,
          )
        }
      >
        <MetricSlab
          position={[
            -1.2,
            0.82,
            0.05,
          ]}
          width={
            0.82
          }
          active
        />

        <MetricSlab
          position={[
            -0.25,
            0.82,
            0.05,
          ]}
          width={
            0.66
          }
        />
      </group>

      <group
        ref={(
          element,
        ) =>
          register(
            1,
            element,
          )
        }
      >
        <mesh>
          <torusGeometry
            args={[
              0.72,
              0.045,
              12,
              64,
            ]}
          />

          <meshStandardMaterial
            color="#153846"
            emissive="#071A22"
            emissiveIntensity={
              0.28
            }
            roughness={
              0.72
            }
          />
        </mesh>

        <mesh
          geometry={
            progressCurve
          }
          rotation={[
            0,
            0,
            -Math.PI /
              2,
          ]}
        >
          <meshBasicMaterial
            color="#0BA5FF"
            transparent
            opacity={
              0.82
            }
          />
        </mesh>

        <mesh>
          <circleGeometry
            args={[
              0.44,
              32,
            ]}
          />

          <meshStandardMaterial
            color="#091A22"
            emissive="#06141B"
            emissiveIntensity={
              0.22
            }
            roughness={
              0.9
            }
          />
        </mesh>
      </group>

      <group
        ref={(
          element,
        ) =>
          register(
            2,
            element,
          )
        }
      >
        <GoalBars
          x={
            -1.18
          }
        />

        <GoalBars
          x={
            1.18
          }
        />
      </group>
    </group>
  );
}

/*
 * ============================================================================
 * REPORTS
 * ============================================================================
 */

function ReportsStation({
  register,
}: {
  register:
    RegisterPart;
}) {
  return (
    <group
      position={[
        0.22,
        0,
        0.08,
      ]}
    >
      <group
        ref={(
          element,
        ) =>
          register(
            0,
            element,
          )
        }
      >
        <MetricSlab
          position={[
            -1.18,
            0.82,
            0.05,
          ]}
          width={
            0.84
          }
          active
        />

        <MetricSlab
          position={[
            -0.2,
            0.82,
            0.05,
          ]}
          width={
            0.74
          }
        />
      </group>

      <group
        ref={(
          element,
        ) =>
          register(
            1,
            element,
          )
        }
      >
        <ReportSheet
          position={[
            -0.78,
            0.28,
            0.03,
          ]}
          scale={
            0.84
          }
        />

        <ReportSheet
          position={[
            0.02,
            0,
            0.08,
          ]}
          scale={
            1
          }
          active
        />

        <ReportSheet
          position={[
            0.78,
            -0.28,
            0.13,
          ]}
          scale={
            0.82
          }
        />
      </group>

      <group
        ref={(
          element,
        ) =>
          register(
            2,
            element,
          )
        }
      >
        <MiniChip
          position={[
            1.18,
            0.66,
            0.08,
          ]}
          scaleX={
            0.64
          }
          active
        />

        <MiniChip
          position={[
            1.18,
            0.3,
            0.08,
          ]}
          scaleX={
            0.54
          }
        />

        <MiniChip
          position={[
            1.18,
            -0.06,
            0.08,
          ]}
          scaleX={
            0.6
          }
        />
      </group>
    </group>
  );
}

/*
 * ============================================================================
 * REUSABLE VISUAL PARTS
 * ============================================================================
 */

function MetricSlab({
  position,
  width,
  active = false,
}: {
  position:
    [
      number,
      number,
      number,
    ];

  width:
    number;

  active?:
    boolean;
}) {
  return (
    <group
      position={
        position
      }
    >
      <mesh>
        <boxGeometry
          args={[
            width,
            0.24,
            0.05,
          ]}
        />

        <meshStandardMaterial
          color={
            active
              ? "#0F3141"
              : "#0B2632"
          }
          emissive={
            active
              ? "#0A2634"
              : "#06151D"
          }
          emissiveIntensity={
            active
              ? 0.42
              : 0.24
          }
          roughness={
            0.82
          }
        />
      </mesh>

      <mesh
        position={[
          -width *
            0.28,
          0,
          0.04,
        ]}
      >
        <boxGeometry
          args={[
            width *
              0.26,
            0.035,
            0.018,
          ]}
        />

        <meshBasicMaterial
          color={
            active
              ? "#7ED4FA"
              : "#466473"
          }
          transparent
          opacity={
            active
              ? 0.68
              : 0.45
          }
        />
      </mesh>
    </group>
  );
}

function MiniChip({
  position,
  scaleX,
  active = false,
}: {
  position:
    [
      number,
      number,
      number,
    ];

  scaleX:
    number;

  active?:
    boolean;
}) {
  return (
    <mesh
      position={
        position
      }
      scale={[
        scaleX,
        1,
        1,
      ]}
    >
      <boxGeometry
        args={[
          0.72,
          0.16,
          0.04,
        ]}
      />

      <meshStandardMaterial
        color={
          active
            ? "#0E3445"
            : "#0B252F"
        }
        emissive={
          active
            ? "#0A2532"
            : "#06141A"
        }
        emissiveIntensity={
          active
            ? 0.4
            : 0.22
        }
        roughness={
          0.84
        }
      />
    </mesh>
  );
}

function InventoryCell({
  position,
  level,
  critical,
}: {
  position:
    [
      number,
      number,
      number,
    ];

  level:
    number;

  critical:
    boolean;
}) {
  return (
    <group
      position={
        position
      }
    >
      <mesh>
        <boxGeometry
          args={[
            0.52,
            0.34,
            0.05,
          ]}
        />

        <meshStandardMaterial
          color="#0C2430"
          emissive="#06151D"
          emissiveIntensity={
            0.26
          }
          roughness={
            0.84
          }
        />
      </mesh>

      <mesh
        position={[
          -0.16 +
          level *
            0.16,
          -0.1,
          0.04,
        ]}
        scale={[
          level,
          1,
          1,
        ]}
      >
        <boxGeometry
          args={[
            0.32,
            0.04,
            0.018,
          ]}
        />

        <meshBasicMaterial
          color={
            critical
              ? "#607987"
              : "#0BA5FF"
          }
          transparent
          opacity={
            critical
              ? 0.5
              : 0.74
          }
        />
      </mesh>
    </group>
  );
}

function GoalBars({
  x,
}: {
  x:
    number;
}) {
  return (
    <group
      position={[
        x,
        0,
        0,
      ]}
    >
      {
        [
          {
            y:
              0.42,
            width:
              0.5,
            active:
              true,
          },
          {
            y:
              0,
            width:
              0.42,
            active:
              false,
          },
          {
            y:
              -0.42,
            width:
              0.46,
            active:
              false,
          },
        ].map(
          (
            bar,
            index,
          ) => (
            <mesh
              key={
                `goal-bar-${x}-${index}`
              }
              position={[
                0,
                bar.y,
                0,
              ]}
            >
              <boxGeometry
                args={[
                  bar.width,
                  0.055,
                  0.025,
                ]}
              />

              <meshBasicMaterial
                color={
                  bar.active
                    ? "#76D0F7"
                    : "#365361"
                }
                transparent
                opacity={
                  bar.active
                    ? 0.66
                    : 0.42
                }
              />
            </mesh>
          ),
        )
      }
    </group>
  );
}

function ReportSheet({
  position,
  scale,
  active = false,
}: {
  position:
    [
      number,
      number,
      number,
    ];

  scale:
    number;

  active?:
    boolean;
}) {
  return (
    <group
      position={
        position
      }
      scale={
        scale
      }
    >
      <mesh>
        <boxGeometry
          args={[
            1.08,
            0.74,
            0.05,
          ]}
        />

        <meshStandardMaterial
          color={
            active
              ? "#0E2E3B"
              : "#0A222C"
          }
          emissive="#07161F"
          emissiveIntensity={
            active
              ? 0.34
              : 0.25
          }
          roughness={
            0.82
          }
        />
      </mesh>

      {
        [
          0.2,
          0,
          -0.2,
        ].map(
          (
            y,
            index,
          ) => (
            <mesh
              key={
                `report-row-${index}`
              }
              position={[
                0,
                y,
                0.04,
              ]}
            >
              <boxGeometry
                args={[
                  index ===
                  1
                    ? 0.74
                    : 0.62,
                  0.035,
                  0.018,
                ]}
              />

              <meshBasicMaterial
                color={
                  index ===
                  0
                    ? "#72C9F1"
                    : "#3A5866"
                }
                transparent
                opacity={
                  index ===
                  0
                    ? 0.62
                    : 0.42
                }
              />
            </mesh>
          ),
        )
      }
    </group>
  );
}

function createArcPoints(
  radius:
    number,

  angle:
    number,

  segments:
    number,
) {
  const points:
    Vector3[] =
      [];

  for (
    let index = 0;
    index <=
    segments;
    index += 1
  ) {
    const t =
      index /
      segments;

    const theta =
      -Math.PI /
        2 +
      angle *
        t;

    points.push(
      new Vector3(
        Math.cos(
          theta,
        ) *
          radius,

        Math.sin(
          theta,
        ) *
          radius,

        0.04,
      ),
    );
  }

  return points;
}

/*
 * ============================================================================
 * RUNTIME GEOMETRY
 * ============================================================================
 */

function createCategoryRuntime(
  curve:
    CatmullRomCurve3,

  category:
    ControlCategoryDefinition,
):
  CategoryRuntime {
  const timing =
    getCategoryTiming(
      category,
    );

  const station =
    getStationTransform(
      curve,
      category.t,
      category.side,
    );

  const connectorCurve =
    createConnectorCurve(
      curve,
      category,
    );

  const connectorGeometry =
    new TubeGeometry(
      connectorCurve,
      72,
      0.026,
      6,
      false,
    );

  connectorGeometry.setDrawRange(
    0,
    0,
  );

  const ceilingCurve =
    createCeilingCurve(
      curve,
      category.t +
        0.012,
      CONTROL_LINE_END_T,
      category.lineLane,
    );

  const ceilingGeometry =
    new TubeGeometry(
      ceilingCurve,
      180,
      0.021,
      6,
      false,
    );

  ceilingGeometry.setDrawRange(
    0,
    0,
  );

  return {
    timing,

    stationPosition:
      station.position,

    stationYaw:
      station.yaw,

    connectorCurve,

    connectorGeometry,

    connectorIndexCount:
      connectorGeometry
        .index
        ?.count ??
      0,

    ceilingCurve,

    ceilingGeometry,

    ceilingIndexCount:
      ceilingGeometry
        .index
        ?.count ??
      0,
  };
}

function getStationTransform(
  curve:
    CatmullRomCurve3,

  t:
    number,

  sideName:
    "left" |
    "right",
) {
  const center =
    curve.getPointAt(
      t,
    );

  const tangent =
    curve
      .getTangentAt(
        t,
      )
      .normalize();

  const worldUp =
    new Vector3(
      0,
      1,
      0,
    );

  const side =
    new Vector3()
      .crossVectors(
        tangent,
        worldUp,
      )
      .normalize();

  const direction =
    sideName ===
    "right"
      ? 1
      : -1;

  const position =
    center
      .clone()
      .addScaledVector(
        side,
        direction *
          3.08,
      );

  position.y +=
    0.08;

  const pathYaw =
    Math.atan2(
      tangent.x,
      -tangent.z,
    );

  const wallTurn =
    sideName ===
    "right"
      ? -Math.PI /
        2
      : Math.PI /
        2;

  return {
    position,

    yaw:
      pathYaw +
      wallTurn,

    side,
    tangent,
  };
}

function createConnectorCurve(
  curve:
    CatmullRomCurve3,

  category:
    ControlCategoryDefinition,
) {
  const station =
    getStationTransform(
      curve,
      category.t,
      category.side,
    );

  const worldUp =
    new Vector3(
      0,
      1,
      0,
    );

  const source =
    station.position
      .clone();

  source.y +=
    0.72;

  /*
   * Pull slightly into the tunnel first.
   */
  const inward =
    station.side
      .clone()
      .multiplyScalar(
        category.side ===
        "right"
          ? -1.05
          : 1.05,
      );

  const point2 =
    source
      .clone()
      .add(
        inward,
      )
      .addScaledVector(
        worldUp,
        0.85,
      );

  const upperT =
    Math.min(
      0.99,
      category.t +
        0.008,
    );

  const ceiling =
    getCeilingPoint(
      curve,
      upperT,
      category.lineLane,
    );

  const point3 =
    ceiling
      .clone()
      .addScaledVector(
        worldUp,
        -0.55,
      );

  return new CatmullRomCurve3(
    [
      source,
      point2,
      point3,
      ceiling,
    ],
    false,
    "catmullrom",
    0.44,
  );
}

function createCeilingCurve(
  curve:
    CatmullRomCurve3,

  startT:
    number,

  endT:
    number,

  lane:
    number,
) {
  const points:
    Vector3[] =
      [];

  const samples =
    170;

  for (
    let index = 0;
    index <=
    samples;
    index += 1
  ) {
    const amount =
      index /
      samples;

    const t =
      mix(
        startT,
        endT,
        amount,
      );

    points.push(
      getCeilingPoint(
        curve,
        t,
        lane,
      ),
    );
  }

  return new CatmullRomCurve3(
    points,
    false,
    "catmullrom",
    0.42,
  );
}

function getCeilingPoint(
  curve:
    CatmullRomCurve3,

  t:
    number,

  lane:
    number,
) {
  const center =
    curve.getPointAt(
      t,
    );

  const tangent =
    curve
      .getTangentAt(
        t,
      )
      .normalize();

  const worldUp =
    new Vector3(
      0,
      1,
      0,
    );

  const side =
    new Vector3()
      .crossVectors(
        tangent,
        worldUp,
      )
      .normalize();

  const localUp =
    new Vector3()
      .crossVectors(
        side,
        tangent,
      )
      .normalize();

  return center
    .clone()
    .addScaledVector(
      localUp,
      4.52,
    )
    .addScaledVector(
      side,
      lane,
    );
}

/*
 * ============================================================================
 * MATH
 * ============================================================================
 */

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
    clamp01(
      value,
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

function clamp01(
  value:
    number,
) {
  return Math.min(
    1,
    Math.max(
      0,
      value,
    ),
  );
}
