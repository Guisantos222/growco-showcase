"use client";

import {
  useEffect,
  useRef,
} from "react";

import type {
  MutableRefObject,
  ReactNode,
} from "react";

import {
  gsap,
} from "gsap";

import {
  CHAOS_WORLD,
} from "@/components/showcase/scenes/chaos/chaosWorldData";

import {
  CHAOS_TIMELINE as T,
} from "@/components/showcase/scenes/chaos/chaosTimeline";

import type {
  ChaosGravityDepth,
} from "@/components/showcase/scenes/chaos/ChaosGravityNode";

type ChaosGravitySystemProps = {
  progressRef:
    MutableRefObject<number>;

  reducedMotion?: boolean;

  children:
    ReactNode;
};

type GravityItem = {
  element:
    HTMLElement;

  body:
    HTMLElement | null;

  id:
    string;

  x:
    number;

  y:
    number;

  z:
    number;

  depth:
    ChaosGravityDepth;

  phase:
    number;

  direction:
    1 | -1;

  orbitFactor:
    number;

  pullFactor:
    number;

  radius:
    number;

  baseAngle:
    number;
};

const CENTER_X =
  CHAOS_WORLD.width /
  2;

const CENTER_Y =
  CHAOS_WORLD.height /
  2;

const depthConfig:
  Record<
    ChaosGravityDepth,
    {
      orbit: number;
      pull: number;
      depth: number;
    }
  > = {
  background: {
    orbit: 0.46,
    pull: 0.5,
    depth: 0.32,
  },

  far: {
    orbit: 0.62,
    pull: 0.65,
    depth: 0.48,
  },

  middle: {
    orbit: 0.8,
    pull: 0.8,
    depth: 0.72,
  },

  near: {
    orbit: 0.98,
    pull: 0.94,
    depth: 0.95,
  },

  foreground: {
    orbit: 1.12,
    pull: 1,
    depth: 1.15,
  },
};

export function ChaosGravitySystem({
  progressRef,
  reducedMotion = false,
  children,
}: ChaosGravitySystemProps) {
  const root =
    useRef<HTMLDivElement>(
      null,
    );

  useEffect(() => {
    const rootNode =
      root.current;

    if (!rootNode) {
      return;
    }

    /*
     * ==========================================================
     * CACHE ALL GRAVITY NODES
     * ==========================================================
     */

    const nodes =
      Array.from(
        rootNode.querySelectorAll<HTMLElement>(
          "[data-chaos-gravity-node]",
        ),
      );

    const items:
      GravityItem[] =
      nodes.map(
        (
          element,
          index,
        ) => {
          const id =
            element.dataset
              .chaosGravityId ??
            `gravity-${index}`;

          const x =
            datasetNumber(
              element,
              "chaosGravityX",
              CENTER_X,
            );

          const y =
            datasetNumber(
              element,
              "chaosGravityY",
              CENTER_Y,
            );

          const z =
            datasetNumber(
              element,
              "chaosGravityZ",
              0,
            );

          const depth =
            (
              element.dataset
                .chaosGravityDepth ??
              "middle"
            ) as ChaosGravityDepth;

          const deltaX =
            x -
            CENTER_X;

          const deltaY =
            y -
            CENTER_Y;

          const radius =
            Math.sqrt(
              deltaX *
                deltaX +
              deltaY *
                deltaY,
            );

          const baseAngle =
            Math.atan2(
              deltaY,
              deltaX,
            );

          const hash =
            hashString(
              id,
            );

          const phase =
            (
              hash %
              1000
            ) /
            1000;

          const direction:
            1 | -1 =
            hash %
                2 ===
              0
                ? 1
                : -1;

          const orbitFactor =
            0.78 +
            (
              (
                hash >>
                3
              ) %
              32
            ) /
              100;

          const pullFactor =
            0.84 +
            (
              (
                hash >>
                5
              ) %
              24
            ) /
              100;

          const body =
            element.querySelector<HTMLElement>(
              "[data-chaos-gravity-body]",
            );

          element.style.transformOrigin =
            "center";

          element.style.willChange =
            "transform, opacity";

          if (body) {
            body.style.transformOrigin =
              "center";

            body.style.willChange =
              "transform";
          }

          return {
            element,
            body,

            id,

            x,
            y,
            z,

            depth,

            phase,
            direction,

            orbitFactor,
            pullFactor,

            radius,
            baseAngle,
          };
        },
      );

    /*
     * ==========================================================
     * FRAME
     * ==========================================================
     */

    function update(
      time: number,
    ) {
      const progress =
        clamp01(
          progressRef.current,
        );

        /*
 * O GravitySystem prepara:
 *
 * Chaos Maximum
 * Orbit
 * Gravity Lock
 *
 * Quando o takeover começa,
 * não há motivo para continuar
 * recalculando dezenas de nodes.
 */

/*
 * ============================================================
 * FINAL ACT PERFORMANCE HANDOFF
 * ============================================================
 *
 * Não existe mais órbita coletiva
 * dos 60 elementos.
 *
 * Chaos Maximum é o último frame
 * dinâmico deste sistema.
 */

if (
  progress >=
  T.chaosMaximum
) {
  return;
}

      /*
       * ========================================================
       * GLOBAL PHASES
       * ========================================================
       */

      const orbitEnergy =
        smoothRange(
          progress,
          T.chaosMaximum,
          T.orbitMid,
        );

      const lockEnergy =
        smoothRange(
          progress,
          T.orbitMid,
          T.spaghettify,
        );

      items.forEach(
        (item) => {
          const {
            element,
            body,

            depth,
            phase,
            direction,

            orbitFactor,
            pullFactor,

            radius,
            baseAngle,

            z,
          } = item;

          const config =
            depthConfig[
              depth
            ];

          /*
           * ====================================================
           * PER-OBJECT COLLAPSE TIMING
           * ====================================================
           *
           * Nem tudo cai no mesmo frame.
           *
           * Cada signal possui um pequeno
           * stagger determinístico.
           */

          const stagger =
            phase *
            0.018;

          const localSpaghettiStart =
            T.spaghettify +
            stagger *
              0.35;

          const localHorizon =
            T.eventHorizon -
            0.018 +
            stagger;

          /*
           * 0 → 1 da fase de colapso
           * específica desse objeto.
           */

          const collapseRaw =
            smoothRange(
              progress,
              localSpaghettiStart,
              localHorizon,
            );

          /*
           * Aceleração:
           *
           * lento no começo
           * brutal perto do centro.
           */

          const collapseAcceleration =
            Math.pow(
              collapseRaw,
              2.45,
            );

          /*
           * ====================================================
           * PRE-COLLAPSE ORBIT
           * ====================================================
           */

          const preOrbitTurns =
            (
              0.55 +
              phase *
                0.38
            ) *
            orbitFactor *
            config.orbit;

          /*
           * Durante a queda para dentro,
           * fazemos mais voltas.
           */

          const collapseTurns =
            (
              1.35 +
              phase *
                1.35
            ) *
            orbitFactor *
            config.orbit;

          const preOrbitAngle =
            Math.PI *
            2 *
            preOrbitTurns *
            orbitEnergy *
            direction;

          const collapseOrbitAngle =
            Math.PI *
            2 *
            collapseTurns *
            collapseAcceleration *
            direction;

          /*
           * Pequeno movimento vivo antes
           * da espaguetificação.
           */

          const livingAngle =
            reducedMotion
              ? 0
              : Math.sin(
                  time *
                    (
                      0.16 +
                      phase *
                        0.1
                    ) +
                    phase *
                      9,
                ) *
                0.022 *
                orbitEnergy *
                (
                  1 -
                  collapseRaw
                );

          const orbitAngle =
            baseAngle +
            preOrbitAngle +
            collapseOrbitAngle +
            livingAngle;

          /*
           * ====================================================
           * PRE-COLLAPSE RADIUS
           * ====================================================
           *
           * Gravity Lock já aproxima
           * parcialmente os objetos.
           */

          const orbitCompression =
            orbitEnergy *
            0.05;

          const lockCompression =
            lockEnergy *
            (
              0.2 +
              phase *
                0.12
            ) *
            pullFactor *
            config.pull;

          const preCompression =
            clamp(
              orbitCompression +
                lockCompression,
              0,
              0.4,
            );

          const preCollapseRadius =
            radius *
            (
              1 -
              preCompression
            );

          /*
           * ====================================================
           * TRUE SPIRAL
           * ====================================================
           *
           * Quanto mais próximo do
           * horizonte:
           *
           * radius → 0
           */

          const radiusFactor =
            1 -
            collapseAcceleration;

          const currentRadius =
            preCollapseRadius *
            radiusFactor;

          /*
           * Posição atual ao redor
           * do centro.
           */

          const targetX =
            Math.cos(
              orbitAngle,
            ) *
            currentRadius;

          const targetY =
            Math.sin(
              orbitAngle,
            ) *
            currentRadius;

          /*
           * Posição original.
           */

          const originalX =
            Math.cos(
              baseAngle,
            ) *
            radius;

          const originalY =
            Math.sin(
              baseAngle,
            ) *
            radius;

          const offsetX =
            targetX -
            originalX;

          const offsetY =
            targetY -
            originalY;

          /*
           * ====================================================
           * DEPTH CONVERGENCE
           * ====================================================
           *
           * Não convergimos apenas X/Y.
           *
           * Z também tende a zero.
           */

          const orbitDepth =
            reducedMotion
              ? 0
              : Math.sin(
                  orbitAngle *
                    1.7 +
                    phase *
                      6,
                ) *
                (
                  35 +
                  phase *
                    70
                ) *
                orbitEnergy *
                config.depth *
                (
                  1 -
                  collapseRaw
                );

          const collapseDepth =
            -z *
            collapseAcceleration;

          const offsetZ =
            orbitDepth +
            collapseDepth;

          /*
           * ====================================================
           * RADIAL ORIENTATION
           * ====================================================
           *
           * Descobrimos a direção
           * atual até o centro.
           */

          const toCenterX =
            -targetX;

          const toCenterY =
            -targetY;

          const radialAngle =
            Math.atan2(
              toCenterY,
              toCenterX,
            );

          /*
           * Nosso stretch principal
           * ocorre no eixo Y.
           *
           * Portanto alinhamos Y com
           * o vetor que aponta para
           * o buraco negro.
           */

          const radialRotation =
            radiansToDegrees(
              radialAngle,
            ) -
            90;

          /*
           * Antes do stretch usamos
           * uma rotação orbital normal.
           */

          const orbitRotation =
            radiansToDegrees(
              preOrbitAngle +
              collapseOrbitAngle,
            ) *
            0.18;

          /*
           * ====================================================
           * SPAGHETTIFICATION
           * ====================================================
           */

          const spaghetti =
            smoothRange(
              collapseRaw,
              0.08,
              0.88,
            );

          /*
           * Orientação progressivamente
           * passa da rotação orbital
           * para direção radial.
           */

          const finalRotation =
            mixAngleDegrees(
              orbitRotation,
              radialRotation,
              spaghetti,
            );

          /*
           * Afinar horizontalmente.
           */

          const squashX =
            mix(
              1,
              0.16,
              spaghetti,
            );

          /*
           * Alongar na direção
           * do centro.
           */

          const stretchY =
            mix(
              1,
              3.5,
              spaghetti,
            );

          /*
           * ====================================================
           * OVERALL SHRINK
           * ====================================================
           *
           * Mesmo ficando esticado,
           * o objeto inteiro começa
           * a diminuir perto do centro.
           */

          const shrink =
            mix(
              1,
              0.025,
              Math.pow(
                collapseRaw,
                1.75,
              ),
            );

          /*
           * ====================================================
           * SELF ROTATION
           * ====================================================
           *
           * Gira em seu próprio eixo.
           *
           * Conforme a espaguetificação
           * fica extrema, reduzimos isso
           * para preservar a direção
           * radial do stretch.
           */

          const selfSpin =
            direction *
            (
              orbitEnergy *
                135 *
                orbitFactor +
              collapseRaw *
                (
                  420 +
                  phase *
                    620
                )
            ) *
            (
              1 -
              spaghetti *
                0.82
            );

          /*
           * ====================================================
           * EVENT HORIZON
           * ====================================================
           *
           * Só desaparece praticamente
           * quando já chegou ao centro.
           */

          const horizonFade =
            smoothRange(
              collapseRaw,
              0.982,
              1,
            );

          const opacity =
            1 -
            horizonFade;

          /*
           * ====================================================
           * APPLY GRAVITY NODE
           * ====================================================
           */

          if (
            reducedMotion
          ) {
            /*
             * Fallback simples:
             *
             * sem órbita contínua
             * e sem stretch agressivo.
             */

            element.style.transform = `
              translate3d(
                ${offsetX}px,
                ${offsetY}px,
                ${offsetZ}px
              )

              scale(
                ${shrink}
              )
            `;
          } else {
            element.style.transform = `
              translate3d(
                ${offsetX}px,
                ${offsetY}px,
                ${offsetZ}px
              )

              rotateZ(
                ${finalRotation}deg
              )

              scaleX(
                ${squashX}
              )

              scaleY(
                ${stretchY}
              )

              scale(
                ${shrink}
              )
            `;
          }

          element.style.opacity =
            `${opacity}`;

          /*
           * ====================================================
           * SELF SPIN BODY
           * ====================================================
           */

          if (body) {
            body.style.transform = `
              rotateZ(
                ${selfSpin}deg
              )
            `;
          }

          /*
           * Quando cruza completamente
           * o horizonte:
           */

          element.dataset
            .chaosConsumed =
            collapseRaw >=
            0.999
              ? "true"
              : "false";

          element.dataset
            .chaosCollapse =
            collapseRaw.toFixed(
              3,
            );
        },
      );
    }

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
      ref={root}
      data-chaos-gravity-system
      className="
        absolute
        inset-0
        [transform-style:preserve-3d]
      "
    >
      {children}
    </div>
  );
}

/*
 * ============================================================
 * HELPERS
 * ============================================================
 */

function datasetNumber(
  element: HTMLElement,
  key: keyof DOMStringMap,
  fallback: number,
) {
  const raw =
    element.dataset[
      key
    ];

  if (
    raw === undefined
  ) {
    return fallback;
  }

  const parsed =
    Number(
      raw,
    );

  return Number.isFinite(
    parsed,
  )
    ? parsed
    : fallback;
}

function hashString(
  value: string,
) {
  let hash =
    2166136261;

  for (
    let index = 0;
    index <
    value.length;
    index += 1
  ) {
    hash ^=
      value.charCodeAt(
        index,
      );

    hash =
      Math.imul(
        hash,
        16777619,
      );
  }

  return (
    hash >>>
    0
  );
}

function radiansToDegrees(
  radians: number,
) {
  return (
    radians *
    180 /
    Math.PI
  );
}

function mix(
  start: number,
  end: number,
  progress: number,
) {
  return (
    start +
    (
      end -
      start
    ) *
      progress
  );
}

/*
 * Interpolação angular curta.
 *
 * Evita dar uma volta de 350°
 * quando bastava mover 10°.
 */

function mixAngleDegrees(
  start: number,
  end: number,
  progress: number,
) {
  let difference =
    (
      end -
      start +
      180
    ) %
    360 -
    180;

  /*
   * JS pode gerar negativo no %.
   */

  if (
    difference <
    -180
  ) {
    difference +=
      360;
  }

  return (
    start +
    difference *
      progress
  );
}

function clamp(
  value: number,
  min: number,
  max: number,
) {
  return Math.min(
    max,
    Math.max(
      min,
      value,
    ),
  );
}

function clamp01(
  value: number,
) {
  return clamp(
    value,
    0,
    1,
  );
}

function smoothRange(
  progress: number,
  start: number,
  end: number,
) {
  if (
    progress <=
    start
  ) {
    return 0;
  }

  if (
    progress >=
    end
  ) {
    return 1;
  }

  const normalized =
    (
      progress -
      start
    ) /
    (
      end -
      start
    );

  return (
    normalized *
    normalized *
    (
      3 -
      2 *
        normalized
    )
  );
}