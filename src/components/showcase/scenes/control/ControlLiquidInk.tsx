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

import {
  CHAOS_LIQUID_ACT,
} from "@/components/showcase/scenes/chaos/chaosTimeline";

type ControlLiquidInkProps = {
  progressRef: MutableRefObject<number>;
  reducedMotion?: boolean;
  className?: string;
};

type BlobDefinition = {
  x: number;
  rx: number;
  ry: number;
  phase: number;
  lift: number;
  drift: number;
};

type TongueDefinition = {
  x: number;
  rx: number;
  ry: number;
  phase: number;
  advance: number;
};

const VIEWBOX_WIDTH = 1600;
const VIEWBOX_HEIGHT = 1000;

export const CONTROL_INK_COLOR =
  "#0A0F14";

/*
 * ============================================================================
 * METABALL SURFACE
 * ============================================================================
 *
 * A versão anterior ainda era uma função y = f(x).
 * Mesmo com várias ondas, o cérebro continuava lendo uma linha horizontal.
 *
 * Aqui a frente deixa de ser uma linha.
 *
 * Ela é formada por:
 *
 * - uma massa inferior;
 * - 15 grandes blobs sobrepostos;
 * - 4 "línguas" verticais;
 * - 8 blobs menores de conexão;
 * - blur + alpha threshold para fundir tudo como metaballs;
 * - displacement muito leve para quebrar a perfeição geométrica.
 *
 * Essa é a diferença que cria o aspecto de gosma.
 */

const BLOBS: readonly BlobDefinition[] = [
  {
    x: 35,
    rx: 150,
    ry: 178,
    phase: 0.2,
    lift: 6,
    drift: 18,
  },
  {
    x: 150,
    rx: 156,
    ry: 205,
    phase: 1.1,
    lift: 20,
    drift: 25,
  },
  {
    x: 275,
    rx: 138,
    ry: 168,
    phase: 2.4,
    lift: -2,
    drift: 21,
  },
  {
    x: 385,
    rx: 168,
    ry: 228,
    phase: 0.7,
    lift: 38,
    drift: 28,
  },
  {
    x: 510,
    rx: 145,
    ry: 188,
    phase: 3.1,
    lift: 12,
    drift: 20,
  },
  {
    x: 625,
    rx: 172,
    ry: 245,
    phase: 1.8,
    lift: 46,
    drift: 27,
  },
  {
    x: 745,
    rx: 148,
    ry: 195,
    phase: 4.2,
    lift: 14,
    drift: 23,
  },
  {
    x: 860,
    rx: 180,
    ry: 222,
    phase: 2.7,
    lift: 34,
    drift: 30,
  },
  {
    x: 985,
    rx: 144,
    ry: 180,
    phase: 5.1,
    lift: 5,
    drift: 18,
  },
  {
    x: 1090,
    rx: 170,
    ry: 235,
    phase: 0.9,
    lift: 42,
    drift: 31,
  },
  {
    x: 1210,
    rx: 148,
    ry: 198,
    phase: 3.6,
    lift: 17,
    drift: 22,
  },
  {
    x: 1325,
    rx: 176,
    ry: 216,
    phase: 1.5,
    lift: 31,
    drift: 28,
  },
  {
    x: 1440,
    rx: 150,
    ry: 186,
    phase: 4.7,
    lift: 8,
    drift: 21,
  },
  {
    x: 1545,
    rx: 166,
    ry: 226,
    phase: 2.1,
    lift: 36,
    drift: 25,
  },
  {
    x: 1640,
    rx: 145,
    ry: 190,
    phase: 5.6,
    lift: 13,
    drift: 17,
  },
];

const TONGUES: readonly TongueDefinition[] = [
  {
    x: 292,
    rx: 92,
    ry: 292,
    phase: 0.5,
    advance: 74,
  },
  {
    x: 662,
    rx: 106,
    ry: 338,
    phase: 2.2,
    advance: 112,
  },
  {
    x: 1038,
    rx: 88,
    ry: 280,
    phase: 4.1,
    advance: 66,
  },
  {
    x: 1378,
    rx: 98,
    ry: 318,
    phase: 1.3,
    advance: 94,
  },
];

const CONNECTORS = [
  110,
  335,
  565,
  790,
  1015,
  1245,
  1465,
  1580,
] as const;

export function ControlLiquidInk({
  progressRef,
  reducedMotion = false,
  className = "",
}: ControlLiquidInkProps) {
  const rootRef =
    useRef<HTMLDivElement>(
      null,
    );

  const svgRef =
    useRef<SVGSVGElement>(
      null,
    );

  const massRef =
    useRef<SVGRectElement>(
      null,
    );

  const blobRefs =
    useRef<
      Array<
        SVGEllipseElement | null
      >
    >([]);

  const tongueRefs =
    useRef<
      Array<
        SVGEllipseElement | null
      >
    >([]);

  const connectorRefs =
    useRef<
      Array<
        SVGCircleElement | null
      >
    >([]);

  const rimRefs =
    useRef<
      Array<
        SVGEllipseElement | null
      >
    >([]);

    const turbulenceRef =
  useRef<SVGFETurbulenceElement | null>(null);

const displacementRef =
  useRef<SVGFEDisplacementMapElement | null>(null);

  useEffect(() => {
    const root =
      rootRef.current;

    const svg =
      svgRef.current;

    const mass =
      massRef.current;

      const turbulence =
  turbulenceRef.current;

const displacement =
  displacementRef.current;

    if (
  !root ||
  !svg ||
  !mass ||
  !turbulence ||
  !displacement
) {
  return;
}

    let locked =
      false;

    const applyLockedFrame =
      () => {
        root.style.visibility =
          "visible";

        root.style.opacity =
          "1";

        root.style.background =
          CONTROL_INK_COLOR;

        svg.style.visibility =
          "hidden";
      };

    const update = (
      time: number,
    ) => {
      const progress =
        clamp01(
          progressRef.current,
        );

      /*
       * ============================================================
       * BEFORE THE LIQUID
       * ============================================================
       */

      if (
        progress <
        CHAOS_LIQUID_ACT.visibleStart
      ) {
        locked =
          false;

        root.style.visibility =
          "hidden";

        root.style.opacity =
          "0";

        root.style.background =
          "transparent";

        svg.style.visibility =
          "hidden";

        return;
      }

      /*
       * ============================================================
       * RISE
       * ============================================================
       */

      const rawRise =
        smoothRange(
          progress,
          CHAOS_LIQUID_ACT.riseStart,
          CHAOS_LIQUID_ACT.riseEnd,
        );

      /*
       * ============================================================
       * LOCK
       * ============================================================
       */

      if (
        rawRise >=
        0.999
      ) {
        if (!locked) {
          locked =
            true;

          applyLockedFrame();
        }

        return;
      }

      locked =
        false;

      root.style.visibility =
        "visible";

      root.style.opacity =
        "1";

      root.style.background =
        "transparent";

      svg.style.visibility =
        "visible";

      const rise =
        viscousRiseEase(
          rawRise,
        );

        /*
 * ============================================================
 * LIVING MOTION LAYER
 * ============================================================
 *
 * Isso dá sensação de tinta fresca:
 * - respiração da superfície
 * - fluxo lateral
 * - pele líquida viva
 */

/*
 * ============================================================
 * GOO ACTIVITY
 * ============================================================
 */

const middle =
  Math.sin(
    Math.PI *
    clamp01(
      rawRise,
    ),
  );

const settle =
  1 -
  smootherstep(
    smoothRange(
      rawRise,
      0.76,
      1,
    ),
  );

const activity =
  reducedMotion
    ? 0
    : (
        0.54 +
        middle *
          0.74
      ) *
      (
        0.34 +
        settle *
          0.66
      );

/*
 * ============================================================
 * LIVING MOTION
 * ============================================================
 */

const livingBreath =
  reducedMotion
    ? 0
    : Math.sin(
        time *
          0.42,
      ) *
        18 +
      Math.cos(
        time *
          0.19 +
          1.3,
      ) *
        10;

const livingSway =
  reducedMotion
    ? 0
    : Math.sin(
        time *
          0.23 +
          0.8,
      ) *
        36 +
      Math.cos(
        time *
          0.11 +
          2.1,
      ) *
        22;

const lipDrift =
  reducedMotion
    ? 0
    : Math.sin(
        time *
          0.31,
      ) *
        20;

const freshEnergy =
  reducedMotion
    ? 0
    : 0.45 +
      Math.sin(
        time *
          0.27 +
          0.4,
      ) *
        0.08;

/*
 * ============================================================
 * FRONT POSITION
 * ============================================================
 */

const frontY =
  mix(
    1240,
    -260,
    rise,
  ) -
  livingBreath *
    (
      0.18 +
      middle *
        0.22
    );

const massY =
  frontY +
  210 +
  livingBreath *
    0.08;

      mass.setAttribute(
        "y",
        `${massY}`,
      );

      mass.setAttribute(
        "height",
        `${
          VIEWBOX_HEIGHT +
          500 -
          massY
        }`,
      );

     

      /*
       * Quanto mais cedo na subida,
       * mais as línguas podem se esticar.
       *
       * Ao assentar, elas voltam a uma forma mais larga.
       */

      const stretchEnergy =
        reducedMotion
          ? 0
          : activity *
            (
              0.62 +
              middle *
                0.52
            );

      /*
       * ============================================================
       * MAIN BLOBS
       * ============================================================
       */

      blobRefs.current.forEach(
        (
          blob,
          index,
        ) => {
          if (!blob) {
            return;
          }

          const definition =
            BLOBS[index];

          if (!definition) {
            return;
          }

         const driftX =
  (
    Math.sin(
      time * 0.21 +
      definition.phase,
    ) *
      definition.drift +
    Math.cos(
      time * 0.13 +
      definition.phase * 1.9,
    ) *
      definition.drift *
      0.55 +
    livingSway * 0.18
  ) * activity;

const bobY =
  (
    Math.cos(
      time * 0.18 +
      definition.phase * 1.7,
    ) *
      22 +
    Math.sin(
      time * 0.34 +
      definition.phase * 0.9,
    ) *
      12
  ) * activity;

const pulse =
  Math.sin(
    time * 0.27 +
    definition.phase * 2.1,
  );

const wobble =
  Math.cos(
    time * 0.16 +
    definition.phase * 2.7,
  );

const rx =
  definition.rx *
  (
    1 +
    pulse * 0.055 * activity +
    wobble * 0.028 * activity
  );

const ry =
  definition.ry *
  (
    1 -
    pulse * 0.075 * activity +
    wobble * 0.042 * activity
  );

const cx =
  definition.x +
  driftX;

const cy =
  frontY +
  136 -
  definition.lift -
  bobY +
  Math.sin(
    time * 0.12 +
    definition.phase,
  ) *
    8 *
    freshEnergy;

          blob.setAttribute(
            "cx",
            `${cx}`,
          );

          blob.setAttribute(
            "cy",
            `${cy}`,
          );

          blob.setAttribute(
            "rx",
            `${rx}`,
          );

          blob.setAttribute(
            "ry",
            `${ry}`,
          );

          /*
           * Rim separado.
           *
           * Não participa do metaball filter.
           */

          const rim =
            rimRefs.current[
              index
            ];

          if (rim) {
            rim.setAttribute(
              "cx",
              `${cx}`,
            );

            rim.setAttribute(
              "cy",
              `${cy - 3}`,
            );

            rim.setAttribute(
              "rx",
              `${rx * 0.94}`,
            );

            rim.setAttribute(
              "ry",
              `${ry * 0.9}`,
            );

            rim.style.opacity =
              `${
                0.035 +
                activity *
                  0.045
              }`;
          }
        },
      );

      /*
       * ============================================================
       * TONGUES
       * ============================================================
       *
       * Estas são as formas que realmente quebram
       * a sensação de "onda horizontal".
       *
       * Algumas regiões sobem bem mais que o restante,
       * formando pescoços largos de gosma.
       */

      tongueRefs.current.forEach(
        (
          tongue,
          index,
        ) => {
          if (!tongue) {
            return;
          }

          const definition =
            TONGUES[index];

          if (!definition) {
            return;
          }

         const sway =
  (
    Math.sin(
      time * 0.16 +
      definition.phase,
    ) *
      32 +
    Math.cos(
      time * 0.09 +
      definition.phase * 1.4,
    ) *
      16 +
    lipDrift * 0.25
  ) * activity;

const breathing =
  Math.sin(
    time * 0.24 +
    definition.phase * 1.8,
  );

const tension =
  Math.cos(
    time * 0.15 +
    definition.phase * 2.4,
  );

const localAdvance =
  definition.advance *
  (
    0.62 +
    middle * 0.72
  ) *
  (
    0.7 +
    0.3 *
      Math.sin(
        time * 0.11 +
        definition.phase,
      )
  ) +
  Math.sin(
    time * 0.33 +
    definition.phase * 1.2,
  ) *
    18 *
    activity;

const rx =
  definition.rx *
  (
    1 -
    0.12 * stretchEnergy +
    breathing * 0.05 * activity -
    tension * 0.03 * activity
  );

const ry =
  definition.ry *
  (
    1 +
    0.22 * stretchEnergy -
    breathing * 0.04 * activity +
    tension * 0.06 * activity
  );

          tongue.setAttribute(
            "cx",
            `${
              definition.x +
              sway
            }`,
          );

          tongue.setAttribute(
  "cy",
  `${
    frontY +
    88 -
    localAdvance -
    livingBreath * 0.12
  }`,
);

          tongue.setAttribute(
            "rx",
            `${rx}`,
          );

          tongue.setAttribute(
            "ry",
            `${ry}`,
          );
        },
      );

      /*
       * ============================================================
       * CONNECTORS
       * ============================================================
       *
       * Pequenas massas entre os blobs grandes.
       * Elas criam pescoços/filamentos ao passar pelo filtro.
       */

      connectorRefs.current.forEach(
        (
          connector,
          index,
        ) => {
          if (!connector) {
            return;
          }

          const baseX =
            CONNECTORS[index];

          if (
            baseX ===
            undefined
          ) {
            return;
          }

         const phase =
  index * 0.83 + 0.7;

const radius =
  62 +
  Math.sin(
    time * 0.29 + phase,
  ) *
    13 *
    activity +
  Math.cos(
    time * 0.17 + phase * 1.8,
  ) *
    7 *
    activity;

connector.setAttribute(
  "cx",
  `${
    baseX +
    Math.sin(
      time * 0.19 + phase,
    ) *
      18 *
      activity +
    Math.cos(
      time * 0.08 + phase * 2.1,
    ) *
      8 *
      activity
  }`,
);

connector.setAttribute(
  "cy",
  `${
    frontY +
    52 +
    Math.cos(
      time * 0.22 + phase,
    ) *
      28 *
      activity +
    Math.sin(
      time * 0.14 + phase * 1.7,
    ) *
      10 *
      activity
  }`,
);

/*
 * ============================================================
 * LIVING SURFACE NOISE
 * ============================================================
 *
 * Sem isso a massa até se mexe,
 * mas a pele continua "congelada".
 */

const noiseX =
  0.0055 +
  Math.sin(time * 0.08) * 0.0012 +
  activity * 0.0014;

const noiseY =
  0.014 +
  Math.cos(time * 0.11 + 0.7) * 0.0026 +
  activity * 0.0018;

turbulence.setAttribute(
  "baseFrequency",
  `${noiseX} ${noiseY}`,
);

const displacementScale =
  11 +
  Math.sin(time * 0.21 + 0.5) * 2.2 +
  activity * 4.5;

displacement.setAttribute(
  "scale",
  `${displacementScale}`,
);

connector.setAttribute(
  "r",
  `${radius}`,
);
        },
      );
    };

    gsap.ticker.add(
      update,
    );

    update(
      0,
    );

    return () => {
      gsap.ticker.remove(
        update,
      );
    };
  }, [
    progressRef,
    reducedMotion,
  ]);

  return (
    <div
      ref={
        rootRef
      }
      aria-hidden="true"
      className={`
        pointer-events-none
        absolute
        inset-0
        z-[150]
        overflow-hidden
        invisible
        opacity-0
        ${className}
      `}
    >
      <svg
        ref={
          svgRef
        }
        viewBox={`
          0
          0
          ${VIEWBOX_WIDTH}
          ${VIEWBOX_HEIGHT}
        `}
        preserveAspectRatio="none"
        className="
          absolute
          inset-0
          h-full
          w-full
        "
      >
        <defs>
          {/*
           * ================================================================
           * GOO FILTER
           * ================================================================
           *
           * Blur:
           * aproxima as massas.
           *
           * Color matrix:
           * endurece novamente o alpha, unindo as formas.
           *
           * Turbulence/displacement:
           * impede que a borda fique geometricamente perfeita.
           */}

          <filter
            id="control-goo-filter"
            x="-20%"
            y="-35%"
            width="140%"
            height="170%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="19"
              result="goo-blur"
            />

            <feColorMatrix
              in="goo-blur"
              mode="matrix"
              values="
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 27 -11
              "
              result="goo-threshold"
            />

           <feTurbulence
  ref={turbulenceRef}
  type="fractalNoise"
  baseFrequency="0.006 0.015"
  numOctaves="2"
  seed="9"
  result="goo-noise"
/>

<feDisplacementMap
  ref={displacementRef}
  in="goo-threshold"
  in2="goo-noise"
  scale="13"
  xChannelSelector="R"
  yChannelSelector="G"
  result="goo-distorted"
/>

            <feComposite
              in="goo-distorted"
              in2="goo-threshold"
              operator="in"
            />
          </filter>

          <linearGradient
            id="control-goo-body"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="#111B25"
            />

            <stop
              offset="18%"
              stopColor="#0E1720"
            />

            <stop
              offset="48%"
              stopColor="#0B1219"
            />

            <stop
              offset="100%"
              stopColor={
                CONTROL_INK_COLOR
              }
            />
          </linearGradient>

          <linearGradient
            id="control-goo-rim"
            x1="0"
            y1="0"
            x2="1"
            y2="0"
          >
            <stop
              offset="0%"
              stopColor="#FFFFFF"
              stopOpacity="0"
            />

            <stop
              offset="28%"
              stopColor="#FFFFFF"
              stopOpacity="0.11"
            />

            <stop
              offset="52%"
              stopColor="#0BA5FF"
              stopOpacity="0.18"
            />

            <stop
              offset="76%"
              stopColor="#FFFFFF"
              stopOpacity="0.08"
            />

            <stop
              offset="100%"
              stopColor="#FFFFFF"
              stopOpacity="0"
            />
          </linearGradient>
        </defs>

        {/*
         * ================================================================
         * GOO MASS
         * ================================================================
         *
         * A group inteira passa pelo metaball filter.
         */}

        <g
          filter="url(#control-goo-filter)"
          fill="url(#control-goo-body)"
        >
          <rect
            ref={
              massRef
            }
            x="-100"
            y="1200"
            width={
              VIEWBOX_WIDTH +
              200
            }
            height="0"
          />

          {BLOBS.map(
            (
              definition,
              index,
            ) => (
              <ellipse
                key={`goo-blob-${index}`}
                ref={(
                  element,
                ) => {
                  blobRefs.current[
                    index
                  ] =
                    element;
                }}
                cx={
                  definition.x
                }
                cy="1200"
                rx={
                  definition.rx
                }
                ry={
                  definition.ry
                }
              />
            ),
          )}

          {TONGUES.map(
            (
              definition,
              index,
            ) => (
              <ellipse
                key={`goo-tongue-${index}`}
                ref={(
                  element,
                ) => {
                  tongueRefs.current[
                    index
                  ] =
                    element;
                }}
                cx={
                  definition.x
                }
                cy="1200"
                rx={
                  definition.rx
                }
                ry={
                  definition.ry
                }
              />
            ),
          )}

          {CONNECTORS.map(
            (
              x,
              index,
            ) => (
              <circle
                key={`goo-connector-${index}`}
                ref={(
                  element,
                ) => {
                  connectorRefs.current[
                    index
                  ] =
                    element;
                }}
                cx={x}
                cy="1200"
                r="60"
              />
            ),
          )}
        </g>

        {/*
         * ================================================================
         * SURFACE HIGHLIGHTS
         * ================================================================
         *
         * Não passam pelo goo filter.
         * São só microreflexos em alguns blobs.
         */}

        <g
          fill="none"
          stroke="url(#control-goo-rim)"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        >
          {BLOBS.map(
            (
              definition,
              index,
            ) => (
              <ellipse
                key={`goo-rim-${index}`}
                ref={(
                  element,
                ) => {
                  rimRefs.current[
                    index
                  ] =
                    element;
                }}
                cx={
                  definition.x
                }
                cy="1200"
                rx={
                  definition.rx
                }
                ry={
                  definition.ry
                }
                opacity="0"
              />
            ),
          )}
        </g>
      </svg>
    </div>
  );
}

/*
 * ============================================================================
 * EASING
 * ============================================================================
 */

function viscousRiseEase(
  value: number,
) {
  const t =
    clamp01(
      value,
    );

  const smooth =
    smootherstep(
      t,
    );

  const heavy =
    t < 0.5
      ? 4 *
        t *
        t *
        t
      : 1 -
        Math.pow(
          -2 *
            t +
            2,
          3,
        ) /
          2;

  return mix(
    smooth,
    heavy,
    0.42,
  );
}

function mix(
  start: number,
  end: number,
  amount: number,
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

function smoothRange(
  value: number,
  start: number,
  end: number,
) {
  if (
    value <= start
  ) {
    return 0;
  }

  if (
    value >= end
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
  value: number,
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
        t * 6 -
        15
      ) +
      10
    )
  );
}

function clamp01(
  value: number,
) {
  return Math.min(
    1,
    Math.max(
      0,
      value,
    ),
  );
}
