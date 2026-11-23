"use client";

import {
  useEffect,
  useRef,
} from "react";

import type {
  MutableRefObject,
} from "react";

import {
  gsap,
} from "gsap";

import type {
  ProductFocus,
} from "@/components/showcase/scenes/product/productWorldConfig";

import {
  getProductTimelineState,
  mix,
} from "@/components/showcase/scenes/product/productTimeline";

import {
  PRODUCT_ENTRY_LANES,
  PRODUCT_FLOW_PATHS,
  PRODUCT_GATEWAY,
  PRODUCT_WORLD_SIZE,
} from "@/components/showcase/scenes/product/productWorldGeometry";

import styles from "@/components/showcase/scenes/product/ProductScene.module.css";

type ProductFlowNetworkProps = {
  progressRef:
    MutableRefObject<number>;
};

type FlowKey =
  | "sales"
  | "stock"
  | "finance"
  | "reports"
  | "operations"
  | "people";

const FLOW_FOCUS: Record<
  FlowKey,
  ProductFocus[]
> = {
  sales: [
    "sales",
    "intelligence",
    "unified",
  ],
  stock: [
    "sales",
    "intelligence",
    "unified",
  ],
  finance: [
    "finance",
    "intelligence",
    "unified",
  ],
  reports: [
    "finance",
    "intelligence",
    "unified",
  ],
  operations: [
    "operations",
    "intelligence",
    "unified",
  ],
  people: [
    "people",
    "intelligence",
    "unified",
  ],
};

export function ProductFlowNetwork({
  progressRef,
}: ProductFlowNetworkProps) {
  const entryRefs =
    useRef<
      Array<
        SVGPathElement | null
      >
    >([]);

  const branchRefs =
    useRef<
      Partial<
        Record<
          FlowKey,
          SVGPathElement | null
        >
      >
    >({});

  const branchHaloRefs =
    useRef<
      Partial<
        Record<
          FlowKey,
          SVGPathElement | null
        >
      >
    >({});

  const signalRefs =
    useRef<
      Partial<
        Record<
          FlowKey,
          SVGPathElement | null
        >
      >
    >({});

  const coreGlowRef =
    useRef<SVGCircleElement>(
      null,
    );

  useEffect(() => {
    let previousProgress =
      Number.NaN;

    const update = () => {
      const progress =
        progressRef.current;

      if (
        Number.isFinite(
          previousProgress,
        ) &&
        Math.abs(
          progress -
          previousProgress,
        ) <
          0.00001
      ) {
        return;
      }

      previousProgress =
        progress;

      const state =
        getProductTimelineState(
          progress,
        );

      entryRefs.current.forEach(
        (
          path,
        ) => {
          if (!path) {
            return;
          }

          const settle =
            1 -
            state.arrivalStrength;

          path.style.opacity =
            `${state.networkReveal}`;

          path.style.strokeWidth =
            `${mix(
              5.2,
              3.2,
              settle,
            )}`;

          path.style.strokeDashoffset =
            `${-progress * 180}`;
        },
      );

      (
        Object.keys(
          FLOW_FOCUS,
        ) as
          FlowKey[]
      ).forEach(
        (
          key,
        ) => {
          const path =
            branchRefs.current[
              key
            ];

          const halo =
            branchHaloRefs.current[
              key
            ];

          const signal =
            signalRefs.current[
              key
            ];

          if (
            !path ||
            !halo ||
            !signal
          ) {
            return;
          }

          const fromStrength =
            getFlowStrength(
              key,
              state.fromFocus,
            );

          const toStrength =
            getFlowStrength(
              key,
              state.toFocus,
            );

          const strength =
            mix(
              fromStrength,
              toStrength,
              state.segmentMix,
            ) *
            state.networkReveal;

          const activelyFocused =
            isFlowActive(
              key,
              state.activeFocus,
            );

          path.style.opacity =
            `${
              0.06 +
              strength *
                0.94
            }`;

          path.style.strokeWidth =
            `${
              1.65 +
              strength *
                1.85
            }`;

          path.style.strokeDashoffset =
            `${-progress * 230}`;

          halo.style.opacity =
            `${
              strength *
              0.24
            }`;

          halo.style.strokeWidth =
            `${
              6 +
              strength *
                6
            }`;

          signal.dataset.active =
            activelyFocused
              ? "true"
              : "false";

          signal.style.opacity =
            `${
              activelyFocused
                ? 0.82
                : 0
            }`;
        },
      );

      if (
        coreGlowRef.current
      ) {
        const intelligence =
          state.activeFocus ===
            "intelligence"
            ? 0.64
            : state.activeFocus ===
              "unified"
              ? 0.40
              : 0.18;

        coreGlowRef.current.style.opacity =
          `${
            state.networkReveal *
            intelligence
          }`;
      }
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
    progressRef,
  ]);

  return (
    <svg
      viewBox={`0 0 ${PRODUCT_WORLD_SIZE.width} ${PRODUCT_WORLD_SIZE.height}`}
      preserveAspectRatio="none"
      className={
        styles.flowSvg
      }
      aria-hidden="true"
    >
      {
        PRODUCT_ENTRY_LANES.map(
          (
            x,
            index,
          ) => (
            <path
              key={
                x
              }
              ref={(
                element,
              ) => {
                entryRefs.current[
                  index
                ] =
                  element;
              }}
              d={
                createEntryPath(
                  x,
                  index,
                )
              }
              fill="none"
              stroke="#0BA5FF"
              strokeWidth="5.2"
              strokeLinecap="round"
              strokeDasharray="10 14"
              vectorEffect="non-scaling-stroke"
              opacity="0"
            />
          ),
        )
      }

      {
        (
          Object.keys(
            PRODUCT_FLOW_PATHS,
          ) as
            FlowKey[]
        ).map(
          (
            key,
          ) => (
            <g
              key={
                key
              }
            >
              <path
                ref={(
                  element,
                ) => {
                  branchHaloRefs.current[
                    key
                  ] =
                    element;
                }}
                d={
                  PRODUCT_FLOW_PATHS[
                    key
                  ]
                }
                fill="none"
                stroke="rgba(11,165,255,.22)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                opacity="0"
              />

              <path
                ref={(
                  element,
                ) => {
                  branchRefs.current[
                    key
                  ] =
                    element;
                }}
                d={
                  PRODUCT_FLOW_PATHS[
                    key
                  ]
                }
                fill="none"
                stroke="#0BA5FF"
                strokeWidth="1.65"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="10 14"
                vectorEffect="non-scaling-stroke"
                opacity="0.06"
              />

              <path
                ref={(
                  element,
                ) => {
                  signalRefs.current[
                    key
                  ] =
                    element;
                }}
                d={
                  PRODUCT_FLOW_PATHS[
                    key
                  ]
                }
                fill="none"
                stroke="#C7EEFF"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="1 76"
                vectorEffect="non-scaling-stroke"
                opacity="0"
                data-active="false"
                className={
                  styles.flowSignal
                }
              />
            </g>
          ),
        )
      }

      <circle
        ref={
          coreGlowRef
        }
        cx={
          PRODUCT_GATEWAY.x
        }
        cy={
          PRODUCT_GATEWAY.y
        }
        r="88"
        fill="rgba(11,165,255,.09)"
        opacity="0"
      />
    </svg>
  );
}

function isFlowActive(
  key:
    FlowKey,
  focus:
    ProductFocus | null,
) {
  if (!focus) {
    return false;
  }

  if (
    focus ===
      "overview"
  ) {
    return false;
  }

  return FLOW_FOCUS[
    key
  ].includes(
    focus,
  );
}

function getFlowStrength(
  key:
    FlowKey,
  focus:
    ProductFocus | null,
) {
  if (!focus) {
    return 0.07;
  }

  if (
    focus ===
      "overview"
  ) {
    return 0.34;
  }

  if (
    FLOW_FOCUS[
      key
    ].includes(
      focus,
    )
  ) {
    return focus ===
      "unified"
      ? 0.9
      : 1;
  }

  return 0.07;
}

function createEntryPath(
  x: number,
  index: number,
) {
  const portX =
    PRODUCT_GATEWAY.x +
    (
      index -
      2.5
    ) *
      8;

  return `M ${x} -80 L ${x} 620 C ${x} 690 ${portX} 710 ${portX} 742`;
}
