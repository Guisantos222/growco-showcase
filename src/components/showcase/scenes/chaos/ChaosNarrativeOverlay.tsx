"use client";

import {
  useEffect,
  useRef,
} from "react";

import type {
  MutableRefObject,
} from "react";

import {
  Archivo_Black,
} from "next/font/google";

import {
  useTranslations,
} from "next-intl";

import {
  gsap,
} from "gsap";

import {
  CHAOS_NARRATIVE_BEATS,
} from "@/components/showcase/scenes/chaos/chaosNarrativeBeats";

type ChaosNarrativeOverlayProps = {
  progressRef: MutableRefObject<number>;
  reducedMotion?: boolean;
};

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
});

export function ChaosNarrativeOverlay({
  progressRef,
  reducedMotion = false,
}: ChaosNarrativeOverlayProps) {
  const t = useTranslations(
    "Showcase.chaos.narrative",
  );

  const rootRef = useRef<HTMLDivElement>(null);

  const beatRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    let width = root.clientWidth;
    let height = root.clientHeight;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];

      if (!entry) {
        return;
      }

      width = entry.contentRect.width;
      height = entry.contentRect.height;
    });

    resizeObserver.observe(root);

    const update = (time: number) => {
      const progress = progressRef.current;

      const isCompact = width < 900;
      const isNarrow = width < 640;
      const isShort = height < 700;

      const perspectiveStrength = reducedMotion
        ? 0
        : isNarrow
          ? 0.34
          : isCompact
            ? 0.58
            : 1;

      const depthStrength = reducedMotion
        ? 0
        : isNarrow
          ? 0.42
          : isCompact
            ? 0.68
            : 1;

      CHAOS_NARRATIVE_BEATS.forEach((beat, index) => {
        const node = beatRefs.current[index];

        if (!node) {
          return;
        }

        const enter = smootherstep(
          smoothRange(
            progress,
            beat.start,
            beat.enterEnd,
          ),
        );

        const exit = smootherstep(
          smoothRange(
            progress,
            beat.holdEnd,
            beat.end,
          ),
        );

        const opacity = enter * (1 - exit);

        if (opacity <= 0.002) {
          node.style.opacity = "0";
          node.style.visibility = "hidden";
          return;
        }

        node.style.visibility = "visible";

        const responsiveX = isCompact
          ? mix(
              beat.x,
              0.5,
              0.76,
            )
          : beat.x;

        const responsiveY = isShort
          ? mix(
              beat.y,
              0.5,
              0.12,
            )
          : beat.y;

        const anchorX = width * responsiveX;
        const anchorY = height * responsiveY;

        const enterX =
          mix(
            beat.enterX,
            0,
            enter,
          ) *
          (isCompact ? 0.6 : 1);

        const enterY =
          mix(
            beat.enterY,
            0,
            enter,
          ) *
          (isShort ? 0.7 : 1);

        const enterZ =
          mix(
            beat.enterZ,
            0,
            enter,
          ) * depthStrength;

        const exitX =
          mix(
            0,
            beat.exitX,
            exit,
          ) *
          (isCompact ? 0.58 : 1);

        const exitY = mix(
          0,
          beat.exitY,
          exit,
        );

        const exitZ =
          mix(
            0,
            beat.exitZ,
            exit,
          ) * depthStrength;

       const beatProgress =
  smoothRange(
    progress,
    beat.start,
    beat.end,
  );

/*
 * curva central do beat
 * 0 → 1 → 0
 */
const stageCurve =
  Math.sin(
    Math.PI *
      beatProgress,
  );

const settledRotateX =
  beat.rotateX *
  0.58;

const settledRotateY =
  beat.rotateY *
  0.52;

const settledRotateZ =
  beat.rotateZ *
  0.72;

/*
 * viés cinematográfico:
 * o texto continua inclinado
 * mesmo durante a leitura.
 */
const yawBias =
  beat.align === "left"
    ? 8
    : beat.align === "right"
      ? -8
      : 0;

const pitchBias =
  beat.hero
    ? -2.5
    : 1.6;

const rollBias =
  beat.align === "center"
    ? -1.2
    : beat.align === "left"
      ? -0.8
      : 0.8;

const rotateX =
  reducedMotion
    ? 0
    : (
        mix(
          beat.rotateX,
          settledRotateX,
          enter,
        ) +
        pitchBias *
          stageCurve +
        exit *
          -2.4
      ) *
      perspectiveStrength;

const rotateY =
  reducedMotion
    ? 0
    : (
        mix(
          beat.rotateY,
          settledRotateY,
          enter,
        ) +
        yawBias *
          stageCurve
      ) *
      perspectiveStrength;

const rotateZ =
  reducedMotion
    ? 0
    : (
        mix(
          beat.rotateZ,
          settledRotateZ,
          enter,
        ) +
        rollBias *
          stageCurve
      ) *
      (
        isCompact
          ? 0.78
          : 1
      );

        const centeredProgress =
  beatProgress -
  0.5;

/*
 * microdeslizamento ligado ao progresso.
 * Parece que a câmera cruza o plano do texto.
 */
const parallaxX =
  reducedMotion
    ? 0
    : centeredProgress *
      beat.rotateY *
      -2.3 *
      perspectiveStrength;

const parallaxY =
  reducedMotion
    ? 0
    : centeredProgress *
      beat.rotateX *
      1.55 *
      perspectiveStrength;

/*
 * leve deriva lateral para o texto
 * parecer “atravessar” o espaço.
 */
const cinematicDriftX =
  reducedMotion
    ? 0
    : stageCurve *
      (
        beat.align === "left"
          ? -18
          : beat.align === "right"
            ? 18
            : 0
      ) *
      (
        isCompact
          ? 0.48
          : 1
      );

const cinematicLiftY =
  reducedMotion
    ? 0
    : stageCurve *
      (
        beat.hero
          ? -12
          : -6
      );

        const breatheX = reducedMotion
          ? 0
          : Math.sin(
              time * 0.38 + index * 0.74,
            ) * 2;

        const breatheY = reducedMotion
          ? 0
          : Math.cos(
              time * 0.31 + index * 0.62,
            ) * 1.4;

        const baseScale = isNarrow
          ? beat.scale * 0.92
          : isCompact
            ? beat.scale * 0.96
            : beat.scale;

        const scale =
          mix(
            baseScale * 0.9,
            baseScale,
            enter,
          ) *
          mix(
            1,
            0.97,
            exit,
          );

        node.style.textAlign = isCompact
          ? "center"
          : beat.align;

       node.style.transformOrigin =
  isCompact
    ? "50% 50%"
    : beat.align === "left"
      ? "12% 52%"
      : beat.align === "right"
        ? "88% 52%"
        : "50% 50%";

        node.style.opacity = `${opacity}`;

        const depthBoost =
  reducedMotion
    ? 0
    : stageCurve *
      (
        beat.hero
          ? (
              isCompact
                ? 44
                : 96
            )
          : (
              isCompact
                ? 28
                : 72
            )
      );

const worldZ =
  enterZ +
  exitZ +
  depthBoost;

        node.style.transform = `
          translate3d(
           ${
  anchorX +
  enterX +
  exitX +
  parallaxX +
  cinematicDriftX +
  breatheX
}px,
            ${
  anchorY +
  enterY +
  exitY +
  parallaxY +
  cinematicLiftY +
  breatheY
}px,
            ${worldZ}px
          )
          translate(-50%, -50%)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
          rotateZ(${rotateZ}deg)
          scale(${scale})
        `;
      });
    };

    gsap.ticker.add(update);
    update(0);

    return () => {
      gsap.ticker.remove(update);
      resizeObserver.disconnect();
    };
  }, [
    progressRef,
    reducedMotion,
  ]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="
        pointer-events-none
        absolute
        inset-0
        z-[120]
        overflow-hidden
        [perspective:880px]
        [perspective-origin:50%_48%]
        [transform-style:preserve-3d]
      "
    >
      {CHAOS_NARRATIVE_BEATS.map((beat, index) => (
        <div
          key={beat.id}
          ref={(element) => {
            beatRefs.current[index] = element;
          }}
          className={`
            absolute
            left-0
            top-0
            opacity-0
            [backface-visibility:hidden]
            [transform-style:preserve-3d]
            will-change-[transform,opacity]

            ${
              beat.width === "massive"
  ? "w-[calc(100vw-32px)] max-w-[980px]"
  : "w-[calc(100vw-32px)] max-w-[690px]"
            }
          `}
        >
          <div
            className={`
              pointer-events-none
              absolute
              -z-10

              ${
                beat.align === "right"
                  ? "-inset-y-12 -left-24 -right-10 bg-[radial-gradient(ellipse_at_78%_50%,rgba(255,255,255,0.97)_0%,rgba(255,255,255,0.84)_40%,rgba(255,255,255,0)_76%)]"
                  : beat.align === "left"
                    ? "-inset-y-12 -left-10 -right-24 bg-[radial-gradient(ellipse_at_22%_50%,rgba(255,255,255,0.97)_0%,rgba(255,255,255,0.84)_40%,rgba(255,255,255,0)_76%)]"
                    : "-inset-x-24 -inset-y-16 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.84)_44%,rgba(255,255,255,0)_78%)]"
              }
            `}
          />

          <p
            className="
              mb-4
              font-mono
              text-[clamp(0.68rem,1vw,0.9rem)]
              font-black
              uppercase
              tracking-[0.22em]
              text-[#0BA5FF]
            "
          >
            {t(`${beat.id}.eyebrow`)}
          </p>

          <h2
            className={`
              ${archivoBlack.className}
              uppercase
              leading-[0.82]
              tracking-[-0.065em]
              text-[#070B10]
              [overflow-wrap:normal]
              [word-break:normal]

              ${
                beat.hero
                  ? "text-[clamp(3rem,8.4vw,7.6rem)]"
                  : "text-[clamp(2.65rem,6.7vw,5.8rem)]"
              }
            `}
          >
            <span
              className="
                block
                text-[#070B10]
                [text-wrap:balance]
              "
            >
              {t(`${beat.id}.before`)}
            </span>

            <span
              className="
                mt-[0.035em]
                block
                text-[#0BA5FF]
                [text-wrap:balance]
              "
            >
              {t(`${beat.id}.accent`)}
            </span>
          </h2>

          <p
            className={`
              mt-5
              max-w-[44ch]
              text-[clamp(0.95rem,1.35vw,1.22rem)]
              font-bold
              leading-[1.38]
              tracking-[-0.02em]
              text-[#070B10]/72

              ${
                beat.align === "center"
                  ? "mx-auto"
                  : beat.align === "right"
                    ? "mx-auto min-[900px]:mr-0 min-[900px]:ml-auto"
                    : "mx-auto min-[900px]:ml-0"
              }
            `}
          >
            {t(`${beat.id}.detail`)}
          </p>
        </div>
      ))}
    </div>
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
      end - start
    ) * progress
  );
}

function smoothRange(
  value: number,
  start: number,
  end: number,
) {
  if (value <= start) {
    return 0;
  }

  if (value >= end) {
    return 1;
  }

  return (
    value - start
  ) / (
    end - start
  );
}

function smootherstep(
  value: number,
) {
  const t = Math.min(
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
        t * 6 - 15
      ) +
      10
    )
  );
}
