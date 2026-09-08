"use client";

import {
  useEffect,
  useRef,
} from "react";

import type {
  MutableRefObject,
  RefObject,
} from "react";

import {
  gsap,
} from "gsap";

import {
  CHAOS_TIMELINE as T,
} from "@/components/showcase/scenes/chaos/chaosTimeline";

type ChaosEventHorizonTakeoverProps = {
  progressRef:
    MutableRefObject<number>;

  sourceRootRef:
    RefObject<HTMLElement | null>;

  reducedMotion?: boolean;
};

type CollapseItem = {
  source:
    HTMLElement;

  clone:
    HTMLElement;

  sourceOpacity:
    string;

  startX:
    number;

  startY:
    number;

  width:
    number;

  height:
    number;

  radius:
    number;

  angle:
    number;

  phase:
    number;

  direction:
    1 | -1;

  turns:
    number;
};

export function ChaosEventHorizonTakeover({
  progressRef,
  sourceRootRef,
  reducedMotion = false,
}: ChaosEventHorizonTakeoverProps) {
  const root =
    useRef<HTMLDivElement>(
      null,
    );

  const cloneLayer =
    useRef<HTMLDivElement>(
      null,
    );

  const core =
    useRef<HTMLDivElement>(
      null,
    );

  const innerCore =
    useRef<HTMLDivElement>(
      null,
    );

  const ring =
    useRef<HTMLDivElement>(
      null,
    );

  useEffect(() => {
    const rootNode =
      root.current;

    const layerNode =
      cloneLayer.current;

    const coreNode =
      core.current;

    const innerCoreNode =
      innerCore.current;

    const ringNode =
      ring.current;

    const sourceRoot =
      sourceRootRef.current;

    if (
      !rootNode ||
      !layerNode ||
      !coreNode ||
      !innerCoreNode ||
      !ringNode ||
      !sourceRoot
    ) {
      return;
    }

    /*
     * Aliases não-nulos.
     */

    const rootElement:
      HTMLDivElement =
      rootNode;

    const layerElement:
      HTMLDivElement =
      layerNode;

    const coreElement:
      HTMLDivElement =
      coreNode;

    const innerCoreElement:
      HTMLDivElement =
      innerCoreNode;

    const ringElement:
      HTMLDivElement =
      ringNode;

    const sourceElement:
      HTMLElement =
      sourceRoot;

    let items:
      CollapseItem[] = [];

    let captured =
      false;

    /*
     * ==========================================================
     * CAPTURE
     * ==========================================================
     *
     * Pegamos exatamente o que o
     * usuário está vendo no momento
     * do início da espaguetificação.
     *
     * Depois clonamos as superfícies
     * para uma camada screen-space.
     */

    function capture() {
      if (
        captured
      ) {
        return;
      }

      release();

      const overlayRect =
        rootElement
          .getBoundingClientRect();

      const centerX =
        overlayRect.width /
        2;

      const centerY =
        overlayRect.height /
        2;

      const sources =
        Array.from(
          sourceElement.querySelectorAll<HTMLElement>(
            `
              [data-chaos-signal-surface],
              [data-chaos-micro-surface]
            `,
          ),
        ).filter(
          (element) => {
            /*
             * Não podemos recapturar
             * nossos próprios clones.
             */

            if (
              element.closest(
                "[data-chaos-event-horizon]",
              )
            ) {
              return false;
            }

            const style =
              window.getComputedStyle(
                element,
              );

            if (
              style.display ===
                "none" ||
              style.visibility ===
                "hidden"
            ) {
              return false;
            }

            const rect =
              element
                .getBoundingClientRect();

            return (
              rect.width >
                2 &&
              rect.height >
                2
            );
          },
        );

      items =
        sources.map(
          (
            source,
            index,
          ) => {
            const rect =
              source
                .getBoundingClientRect();

            /*
             * Centro do elemento
             * relativo à viewport
             * do CHAOS.
             */

            const startX =
              rect.left -
              overlayRect.left +
              rect.width /
                2;

            const startY =
              rect.top -
              overlayRect.top +
              rect.height /
                2;

            const deltaX =
              startX -
              centerX;

            const deltaY =
              startY -
              centerY;

            const radius =
              Math.sqrt(
                deltaX *
                  deltaX +
                deltaY *
                  deltaY,
              );

            const angle =
              Math.atan2(
                deltaY,
                deltaX,
              );

            /*
             * Determinismo.
             */

            const id =
              source.closest<HTMLElement>(
                "[data-chaos-id], [data-chaos-micro-id]",
              )
                ?.dataset
                .chaosId ??
              source.closest<HTMLElement>(
                "[data-chaos-micro-id]",
              )
                ?.dataset
                .chaosMicroId ??
              `collapse-${index}`;

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

            /*
             * Entre ~1.2 e ~2.7
             * voltas durante a queda.
             */

            const turns =
              1.2 +
              phase *
                1.5;

            /*
             * Clone visual.
             */

            const clone =
              source.cloneNode(
                true,
              ) as HTMLElement;

            clone.setAttribute(
              "data-chaos-collapse-clone",
              "true",
            );

            /*
             * Retiramos atributos usados
             * para identificar sources.
             */

            clone.removeAttribute(
              "data-chaos-signal-surface",
            );

            clone.removeAttribute(
              "data-chaos-micro-surface",
            );

            clone.style.position =
              "absolute";

            clone.style.left =
              "0";

            clone.style.top =
              "0";

            clone.style.margin =
              "0";

            clone.style.width =
              `${rect.width}px`;

            clone.style.height =
              `${rect.height}px`;

            clone.style.maxWidth =
              "none";

            clone.style.minWidth =
              "0";

            clone.style.boxSizing =
              "border-box";

            clone.style.pointerEvents =
              "none";

            clone.style.transformOrigin =
              "50% 50%";

            clone.style.willChange =
              "transform, opacity";

            clone.style.filter =
              "none";

            clone.style.opacity =
              "0";

            /*
             * Alguns micros possuem
             * transform inline.
             *
             * O takeover assume
             * totalmente o transform.
             */

            clone.style.transform =
              "none";

            layerElement.appendChild(
              clone,
            );

            return {
              source,
              clone,

              sourceOpacity:
                source.style
                  .opacity,

              startX,
              startY,

              width:
                rect.width,

              height:
                rect.height,

              radius,
              angle,

              phase,
              direction,
              turns,
            };
          },
        );

      captured =
        true;
    }

    /*
     * ==========================================================
     * RELEASE
     * ==========================================================
     *
     * Necessário para reverse.
     */

    function release() {
      items.forEach(
        (item) => {
          item.source.style.opacity =
            item.sourceOpacity;

          item.clone.remove();
        },
      );

      items =
        [];

      captured =
        false;
    }

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
       * ========================================================
       * CORE
       * ========================================================
       *
       * O ponto começa a aparecer
       * antes do takeover.
       */

      const coreAppear =
        smoothRange(
          progress,
          T.gravityLock,
          T.spaghettify,
        );

      const collapseProgress =
        smoothRange(
          progress,
          T.spaghettify,
          T.eventHorizon,
        );

      const horizonReached =
        smoothRange(
          progress,
          T.eventHorizon,
          T.silence,
        );

      rootElement.style.opacity =
        `${
          Math.max(
            coreAppear,
            collapseProgress,
          )
        }`;

      /*
       * Core fica exatamente no
       * centro da viewport.
       */

      const corePulse =
        reducedMotion
          ? 0
          : Math.sin(
              time *
                1.8,
            ) *
            0.035 *
            (
              1 -
              horizonReached
            );

      const coreScale =
        mix(
          0.45,
          1,
          coreAppear,
        ) *
        (
          1 +
          corePulse +
          collapseProgress *
            0.16
        );

      coreElement.style.transform = `
        translate3d(
          -50%,
          -50%,
          0
        )

        scale(
          ${coreScale}
        )
      `;

      /*
       * O ring existe apenas para
       * comunicar a atração.
       *
       * No final sobra só o ponto.
       */

      const ringRotation =
        reducedMotion
          ? 0
          : time *
            (
              18 +
              collapseProgress *
                90
            );

      ringElement.style.opacity =
        `${
          coreAppear *
          (
            1 -
            collapseProgress *
              0.95
          )
        }`;

      ringElement.style.transform = `
        rotate(
          ${ringRotation}deg
        )

        scale(
          ${
            mix(
              1.35,
              0.82,
              collapseProgress,
            )
          }
        )
      `;

      innerCoreElement.style.transform = `
        scale(
          ${
            1 +
            collapseProgress *
              0.22
          }
        )
      `;

      /*
       * ========================================================
       * TAKEOVER ACTIVATION
       * ========================================================
       */

      if (
        progress >=
        T.spaghettify
      ) {
        if (
          !captured
        ) {
          capture();
        }
      } else if (
        captured
      ) {
        release();
      }

      if (
        !captured
      ) {
        return;
      }

      const overlayRect =
        rootElement
          .getBoundingClientRect();

      const centerX =
        overlayRect.width /
        2;

      const centerY =
        overlayRect.height /
        2;

      /*
       * Pequena região de crossfade:
       *
       * original → clone.
       */

      const handoff =
        smoothRange(
          progress,
          T.spaghettify,
          T.spaghettify +
            0.008,
        );

      items.forEach(
        (item) => {
          const {
            source,
            clone,

            startX,
            startY,

            width,
            height,

            radius,
            angle,

            phase,
            direction,
            turns,
          } = item;

          /*
           * ====================================================
           * PER-OBJECT STAGGER
           * ====================================================
           */

          const localStart =
            T.spaghettify +
            phase *
              0.018;

          const local =
            smoothRange(
              progress,
              localStart,
              T.eventHorizon,
            );

          /*
           * ====================================================
           * ACCELERATION
           * ====================================================
           *
           * Devagar no começo.
           *
           * Muito mais rápido perto
           * do horizonte.
           */

          const pull =
            Math.pow(
              local,
              2.25,
            );

          /*
           * ====================================================
           * SPIRAL
           * ====================================================
           */

          const spiralAngle =
            angle +
            direction *
              Math.PI *
              2 *
              turns *
              pull;

          /*
           * O raio cai lentamente
           * primeiro e violentamente
           * depois.
           */

          const radiusFactor =
            Math.pow(
              1 -
              pull,
              1.08,
            );

          const currentRadius =
            radius *
            radiusFactor;

          const currentX =
            centerX +
            Math.cos(
              spiralAngle,
            ) *
              currentRadius;

          const currentY =
            centerY +
            Math.sin(
              spiralAngle,
            ) *
              currentRadius;

          /*
           * ====================================================
           * DIRECTION TO CENTER
           * ====================================================
           */

          const toCenterX =
            centerX -
            currentX;

          const toCenterY =
            centerY -
            currentY;

          const radialAngle =
            Math.atan2(
              toCenterY,
              toCenterX,
            );

          /*
           * O eixo Y será o eixo
           * de alongamento.
           */

          const radialRotation =
            radiansToDegrees(
              radialAngle,
            ) -
            90;

          /*
           * ====================================================
           * SPAGHETTIFICATION
           * ====================================================
           */

          const spaghetti =
            smoothRange(
              local,
              0.08,
              0.92,
            );

          /*
           * Horizontalmente afina.
           */

          const squashX =
            mix(
              1,
              0.12,
              spaghetti,
            );

          /*
           * Radialmente alonga.
           */

          const stretchY =
            mix(
              1,
              4.1 +
                phase *
                  0.8,
              spaghetti,
            );

          /*
           * ====================================================
           * SHRINK
           * ====================================================
           *
           * Precisa diminuir apesar
           * do stretch.
           */

          const shrink =
            mix(
              1,
              0.018,
              Math.pow(
                local,
                1.55,
              ),
            );

          /*
           * Pequena rotação própria
           * antes de o stretch dominar.
           */

          const selfSpin =
            direction *
            (
              local *
              (
                180 +
                phase *
                  480
              )
            ) *
            (
              1 -
              spaghetti *
                0.88
            );

          /*
           * ====================================================
           * EVENT HORIZON
           * ====================================================
           */

          const vanish =
            smoothRange(
              local,
              0.965,
              1,
            );

          /*
           * Original desaparece
           * durante a troca.
           */

          source.style.opacity =
            `${
              1 -
              handoff
            }`;

          /*
           * Clone nasce durante o
           * crossfade e morre só
           * quando entra no ponto.
           */

          clone.style.opacity =
            `${
              handoff *
              (
                1 -
                vanish
              )
            }`;

          /*
           * ====================================================
           * APPLY
           * ====================================================
           */

          if (
            reducedMotion
          ) {
            clone.style.transform = `
              translate3d(
                ${
                  currentX -
                  width / 2
                }px,
                ${
                  currentY -
                  height / 2
                }px,
                0
              )

              scale(
                ${shrink}
              )
            `;
          } else {
            clone.style.transform = `
              translate3d(
                ${
                  currentX -
                  width / 2
                }px,
                ${
                  currentY -
                  height / 2
                }px,
                0
              )

              rotate(
                ${
                  radialRotation +
                  selfSpin
                }deg
              )

              scaleX(
                ${
                  squashX *
                  shrink
                }
              )

              scaleY(
                ${
                  stretchY *
                  shrink
                }
              )
            `;
          }

          /*
           * No último instante,
           * desligamos totalmente.
           */

          if (
            local >=
            0.999
          ) {
            clone.style.opacity =
              "0";

            source.style.opacity =
              "0";
          }
        },
      );
    }

    /*
     * ==========================================================
     * RESIZE
     * ==========================================================
     *
     * Se a viewport mudar durante
     * o takeover, recapturamos.
     */

    function handleResize() {
      if (
        captured
      ) {
        release();

        if (
          progressRef.current >=
          T.spaghettify
        ) {
          capture();
        }
      }
    }

    window.addEventListener(
      "resize",
      handleResize,
    );

    gsap.ticker.add(
      update,
    );

    update(
      0,
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize,
      );

      gsap.ticker.remove(
        update,
      );

      release();
    };
  }, [
    progressRef,
    sourceRootRef,
    reducedMotion,
  ]);

  return (
    <div
      ref={root}
      data-chaos-event-horizon
      aria-hidden="true"
      className="
        pointer-events-none
        absolute
        inset-0
        z-[70]
        overflow-hidden
        opacity-0
      "
    >
      {/* ================================================ */}
      {/* CLONED COLLAPSE OBJECTS                          */}
      {/* ================================================ */}

      <div
        ref={cloneLayer}
        data-chaos-collapse-layer
        className="
          absolute
          inset-0
          [transform-style:preserve-3d]
        "
      />

      {/* ================================================ */}
      {/* EVENT HORIZON CORE                               */}
      {/* ================================================ */}

      <div
        ref={core}
        data-chaos-event-core
        className="
          absolute
          left-1/2
          top-1/2
          z-[90]
          h-[110px]
          w-[110px]
          opacity-100
          [transform-style:preserve-3d]
          will-change-transform
        "
      >
        {/* ORBIT RING */}

        <div
          ref={ring}
          className="
            absolute
            inset-[4px]
            rounded-full
            border
            border-dashed
            border-[#0BA5FF]/35
            opacity-0
            will-change-transform
          "
        />

        {/* BLACK CORE */}

        <div
          ref={innerCore}
          className="
            absolute
            left-1/2
            top-1/2
            h-[34px]
            w-[34px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[#080A10]
            shadow-[
              0_0_0_5px_rgba(255,255,255,0.8),
              0_0_0_7px_rgba(11,165,255,0.16),
              0_0_50px_rgba(11,165,255,0.18)
            ]
            will-change-transform
          "
        />

        {/* ABSOLUTE CENTER */}

        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-[5px]
            w-[5px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-black
          "
        />
      </div>
    </div>
  );
}

/*
 * ============================================================
 * HELPERS
 * ============================================================
 */

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