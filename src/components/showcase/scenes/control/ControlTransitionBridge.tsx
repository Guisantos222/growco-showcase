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
  useLocale,
} from "next-intl";

import {
  CONTROL_SCENE,
  controlPoint,
} from "@/components/showcase/scenes/control/controlTimeline";

type ControlTransitionBridgeProps = {
  progressRef: MutableRefObject<number>;
  reducedMotion?: boolean;
};

const DUST_PARTICLE_COUNT = 18;

export function ControlTransitionBridge({
  progressRef,
  reducedMotion = false,
}: ControlTransitionBridgeProps) {
  const locale = useLocale();

  const rootRef =
    useRef<HTMLDivElement>(
      null,
    );

  const liquidFillRef =
    useRef<HTMLDivElement>(
      null,
    );

  const liquidSurfaceRef =
    useRef<HTMLDivElement>(
      null,
    );

  const liquidRimRef =
    useRef<HTMLDivElement>(
      null,
    );

  const sheenRef =
    useRef<HTMLDivElement>(
      null,
    );

  const questionWrapRef =
    useRef<HTMLDivElement>(
      null,
    );

  const questionLineRef =
    useRef<HTMLParagraphElement>(
      null,
    );

  const questionAccentRef =
    useRef<HTMLParagraphElement>(
      null,
    );

  const subLabelRef =
    useRef<HTMLDivElement>(
      null,
    );

  const dustRefs =
    useRef<
      Array<
        HTMLSpanElement | null
      >
    >([]);

  const copy =
    locale.startsWith(
      "pt",
    )
      ? {
          eyebrow:
            "growCo. / control",
          line:
            "E se tudo estivesse",
          accent:
            "conectado?",
        }
      : {
          eyebrow:
            "growCo. / control",
          line:
            "What if everything",
          accent:
            "was connected?",
        };

  useEffect(() => {
    const root =
      rootRef.current;

    const liquidFill =
      liquidFillRef.current;

    const liquidSurface =
      liquidSurfaceRef.current;

    const liquidRim =
      liquidRimRef.current;

    const sheen =
      sheenRef.current;

    const questionWrap =
      questionWrapRef.current;

    const questionLine =
      questionLineRef.current;

    const questionAccent =
      questionAccentRef.current;

    const subLabel =
      subLabelRef.current;

    if (
      !root ||
      !liquidFill ||
      !liquidSurface ||
      !liquidRim ||
      !sheen ||
      !questionWrap ||
      !questionLine ||
      !questionAccent ||
      !subLabel
    ) {
      return;
    }

    const update = (
      time: number,
    ) => {
      const progress =
        Math.min(
          1,
          Math.max(
            0,
            progressRef.current,
          ),
        );

      /*
       * ============================================================
       * TIMELINE
       * ============================================================
       *
       * 00 — dark hold
       * 01 — liquid rises
       * 02 — fill completes
       * 03 — question appears
       * 04 — question turns to dust
       * 05 — root fades and tunnel takes over
       */

      const liquidRise =
        smootherstep(
          smoothRange(
            progress,
            controlPoint(
              CONTROL_SCENE.brandHold,
              0.1,
            ),
            controlPoint(
              CONTROL_SCENE.activation,
              0.82,
            ),
          ),
        );

      const liquidSettle =
        smootherstep(
          smoothRange(
            progress,
            controlPoint(
              CONTROL_SCENE.activation,
              0.58,
            ),
            controlPoint(
              CONTROL_SCENE.portal,
              0.24,
            ),
          ),
        );

      const questionEnter =
        smootherstep(
          smoothRange(
            progress,
            controlPoint(
              CONTROL_SCENE.portal,
              0.08,
            ),
            controlPoint(
              CONTROL_SCENE.portal,
              0.58,
            ),
          ),
        );

      const questionHold =
        smoothRange(
          progress,
          controlPoint(
            CONTROL_SCENE.portal,
            0.34,
          ),
          controlPoint(
            CONTROL_SCENE.portal,
            0.86,
          ),
        );

      const dustDissolve =
        smootherstep(
          smoothRange(
            progress,
            controlPoint(
              CONTROL_SCENE.portal,
              0.72,
            ),
            controlPoint(
              CONTROL_SCENE.tunnelBirth,
              0.34,
            ),
          ),
        );

      const bridgeExit =
        smootherstep(
          smoothRange(
            progress,
            controlPoint(
              CONTROL_SCENE.tunnelBirth,
              0.14,
            ),
            controlPoint(
              CONTROL_SCENE.tunnelBirth,
              0.9,
            ),
          ),
        );

      /*
       * ============================================================
       * ROOT
       * ============================================================
       */

      root.style.opacity =
        `${1 - bridgeExit}`;

      root.style.visibility =
        bridgeExit >= 0.999
          ? "hidden"
          : "visible";

      /*
       * ============================================================
       * LIQUID FILL
       * ============================================================
       *
       * A tela começa escura.
       * Depois um "derramar invertido" sobe,
       * preenchendo a viewport.
       */

      const fillTranslateY =
        mix(
          108,
          -4,
          liquidRise,
        );

      const fillScaleX =
        mix(
          1.14,
          1,
          liquidSettle,
        );

      const fillRotate =
        reducedMotion
          ? 0
          : mix(
              -2.2,
              0,
              liquidSettle,
            );

      liquidFill.style.transform = `
        translate3d(
          0,
          ${fillTranslateY}%,
          0
        )
        scaleX(
          ${fillScaleX}
        )
        rotate(
          ${fillRotate}deg
        )
      `;

      const surfaceWave =
        reducedMotion
          ? 0
          : Math.sin(
              time * 0.9,
            ) *
            4 *
            (
              1 -
              liquidSettle
            );

      liquidSurface.style.transform = `
        translate3d(
          -50%,
          ${
            mix(
              110,
              0,
              liquidRise,
            ) + surfaceWave
          }%,
          0
        )
        scaleX(
          ${
            mix(
              1.12,
              1,
              liquidSettle,
            )
          }
        )
      `;

      liquidRim.style.opacity =
        `${mix(
          0.72,
          0.18,
          liquidSettle,
        )}`;

      liquidRim.style.transform = `
        translate3d(
          -50%,
          ${
            mix(
              100,
              -1,
              liquidRise,
            ) + surfaceWave * 0.6
          }%,
          0
        )
        scaleX(
          ${
            mix(
              1.08,
              1,
              liquidSettle,
            )
          }
        )
      `;

      sheen.style.opacity =
        `${mix(
          0,
          0.55,
          liquidRise,
        ) *
          (1 - bridgeExit)}`;

      sheen.style.transform = `
        translate3d(
          -50%,
          ${
            mix(
              108,
              8,
              liquidRise,
            )
          }%,
          0
        )
        scaleX(
          ${mix(
            1.28,
            1,
            liquidSettle,
          )}
        )
      `;

      /*
       * ============================================================
       * QUESTION
       * ============================================================
       */

      const questionOpacity =
        questionEnter *
        (
          1 -
          dustDissolve
        );

      const holdPulse =
        reducedMotion
          ? 0
          : Math.sin(
              time * 1.3,
            ) *
            2 *
            questionHold;

      const questionY =
        mix(
          24,
          0,
          questionEnter,
        ) -
        mix(
          0,
          16,
          dustDissolve,
        );

      const questionScale =
        mix(
          0.94,
          1,
          questionEnter,
        ) *
        mix(
          1,
          1.03,
          questionHold,
        ) *
        mix(
          1,
          0.98,
          dustDissolve,
        );

      const questionBlur =
        mix(
          6,
          0,
          questionEnter,
        ) +
        mix(
          0,
          12,
          dustDissolve,
        );

      const questionRotateX =
        reducedMotion
          ? 0
          : mix(
              12,
              4,
              questionEnter,
            );

      const questionRotateY =
        reducedMotion
          ? 0
          : mix(
              -10,
              0,
              questionEnter,
            );

      questionWrap.style.opacity =
        `${questionOpacity}`;

      questionWrap.style.transform = `
        translate3d(
          -50%,
          calc(-50% + ${questionY}px),
          0
        )
        rotateX(
          ${questionRotateX}deg
        )
        rotateY(
          ${questionRotateY}deg
        )
        scale(
          ${questionScale}
        )
      `;

      questionWrap.style.filter = `blur(${questionBlur}px)`;

      questionLine.style.transform = `
        translate3d(
          0,
          ${holdPulse * -0.35}px,
          0
        )
      `;

      questionAccent.style.transform = `
        translate3d(
          0,
          ${holdPulse * 0.18}px,
          0
        )
      `;

      subLabel.style.opacity =
        `${mix(
          0,
          1,
          questionEnter,
        ) *
          (1 - dustDissolve)}`;

      subLabel.style.transform = `
        translate3d(
          -50%,
          ${
            mix(
              10,
              0,
              questionEnter,
            ) + dustDissolve * 10
          }px,
          0
        )
      `;

      /*
       * ============================================================
       * DUST
       * ============================================================
       *
       * O texto não desaparece "hard cut".
       * Ele se desfaz em poeira leve e seca.
       */

      dustRefs.current.forEach(
        (
          particle,
          index,
        ) => {
          if (!particle) {
            return;
          }

          const angle =
            (
              index /
              DUST_PARTICLE_COUNT
            ) *
            Math.PI *
            2;

          const radius =
            mix(
              0,
              reducedMotion
                ? 28
                : 120,
              dustDissolve,
            );

          const spreadX =
            Math.cos(
              angle,
            ) *
            radius;

          const spreadY =
            Math.sin(
              angle,
            ) *
            radius *
            0.52;

          const liftY =
            mix(
              0,
              -24,
              dustDissolve,
            );

          const scale =
            mix(
              0.15,
              1,
              dustDissolve,
            ) *
            mix(
              1,
              0.2,
              bridgeExit,
            );

          const opacity =
            dustDissolve *
            (
              1 -
              bridgeExit
            ) *
            (
              0.92 -
              (
                index %
                4
              ) *
                0.08
            );

          particle.style.opacity =
            `${opacity}`;

          particle.style.transform = `
            translate3d(
              ${spreadX}px,
              ${spreadY + liftY}px,
              0
            )
            scale(
              ${scale}
            )
          `;
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
      ref={rootRef}
      aria-hidden="true"
      className="
        pointer-events-none
        absolute
        inset-0
        z-[75]
        overflow-hidden
        bg-[#0A0F14]
        [perspective:980px]
        [perspective-origin:50%_46%]
        [transform-style:preserve-3d]
      "
    >
      {/*
       * BACKGROUND
       *
       * Escuro para dialogar com o fim do CHAOS.
       */}

      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_50%_42%,rgba(16,22,30,0.92)_0%,rgba(10,15,20,1)_46%,rgba(5,9,14,1)_100%)]
        "
      />

      <div
        className="
          absolute
          inset-0
          opacity-[0.16]
          [background-image:linear-gradient(rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px)]
          [background-size:54px_54px]
        "
      />

      {/*
       * LIQUID FILL BODY
       */}

      <div
        ref={liquidFillRef}
        className="
          absolute
          inset-x-[-6%]
          bottom-[-16%]
          h-[122%]
          rounded-t-[18%]
          bg-[#F7F9FB]
          shadow-[0_-32px_90px_rgba(255,255,255,0.10)]
          will-change-transform
        "
      />

      {/*
       * LIQUID SURFACE
       *
       * A "barriga" do líquido.
       */}

      <div
        ref={liquidSurfaceRef}
        className="
          absolute
          left-1/2
          bottom-[-3vh]
          h-[24vh]
          w-[146%]
          rounded-[100%]
          bg-[#F7F9FB]
          blur-[2px]
          will-change-transform
        "
      />

      {/*
       * LIQUID RIM
       *
       * Borda superior com sensação de camada/tensão.
       */}

      <div
        ref={liquidRimRef}
        className="
          absolute
          left-1/2
          bottom-[12vh]
          h-[10vh]
          w-[138%]
          rounded-[100%]
          bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.95)_0%,rgba(247,249,251,0.92)_52%,rgba(247,249,251,0)_80%)]
          blur-[10px]
          will-change-[transform,opacity]
        "
      />

      {/*
       * SHEEN
       *
       * Reflexo suave para vender o caráter líquido.
       */}

      <div
        ref={sheenRef}
        className="
          absolute
          left-1/2
          bottom-[10vh]
          h-[7vh]
          w-[86%]
          rounded-[100%]
          bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.84)_0%,rgba(255,255,255,0.0)_72%)]
          blur-[18px]
          opacity-0
          will-change-[transform,opacity]
        "
      />

      {/*
       * QUESTION
       */}

      <div
        ref={questionWrapRef}
        className="
          absolute
          left-1/2
          top-1/2
          z-[8]
          flex
          w-[min(90vw,1100px)]
          flex-col
          items-center
          text-center
          opacity-0
          [backface-visibility:hidden]
          [transform-style:preserve-3d]
          will-change-[transform,opacity,filter]
        "
      >
        <div
          ref={subLabelRef}
          className="
            mb-4
            font-mono
            text-[clamp(0.68rem,1vw,0.86rem)]
            font-bold
            uppercase
            tracking-[0.26em]
            text-[#0BA5FF]/72
            opacity-0
            will-change-[transform,opacity]
          "
        >
          {copy.eyebrow}
        </div>

        <p
          ref={questionLineRef}
          className="
            text-[clamp(2.2rem,5.6vw,5.3rem)]
            font-black
            uppercase
            leading-[0.88]
            tracking-[-0.06em]
            text-[#081018]
            will-change-transform
          "
        >
          {copy.line}
        </p>

        <p
          ref={questionAccentRef}
          className="
            mt-[0.04em]
            text-[clamp(2.5rem,6.4vw,6.2rem)]
            font-black
            uppercase
            leading-[0.84]
            tracking-[-0.07em]
            text-[#0BA5FF]
            will-change-transform
          "
        >
          {copy.accent}
        </p>

        <div
          className="
            relative
            mt-6
            h-[1px]
            w-[min(26vw,280px)]
            bg-[#081018]/12
          "
        >
          <span
            className="
              absolute
              left-1/2
              top-1/2
              h-[3px]
              w-[min(14vw,120px)]
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-[#0BA5FF]
            "
          />
        </div>
      </div>

      {/*
       * DUST PARTICLES
       */}

      <div
        className="
          absolute
          left-1/2
          top-1/2
          z-[9]
          [transform-style:preserve-3d]
        "
      >
        {Array.from({
          length:
            DUST_PARTICLE_COUNT,
        }).map(
          (
            _,
            index,
          ) => (
            <span
              key={`dust-${index}`}
              ref={(
                element,
              ) => {
                dustRefs.current[
                  index
                ] = element;
              }}
              className={`
                absolute
                left-0
                top-0
                opacity-0
                rounded-full
                will-change-[transform,opacity]

                ${
                  index % 3 === 0
                    ? "h-2 w-2 bg-[#0BA5FF]"
                    : index % 3 === 1
                      ? "h-[5px] w-[5px] bg-[#081018]/66"
                      : "h-[3px] w-[3px] bg-[#0BA5FF]/62"
                }
              `}
            />
          ),
        )}
      </div>
    </div>
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
        t * 6 -
        15
      ) +
      10
    )
  );
}
