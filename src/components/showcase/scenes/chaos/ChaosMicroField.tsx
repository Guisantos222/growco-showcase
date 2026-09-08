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
    useTranslations,
} from "next-intl";

import {
    ChaosMicroSignal,
} from "@/components/showcase/scenes/chaos/ChaosMicroSignal";

import {
    chaosMicroSignals,
    type ChaosMicroDepth,
} from "@/components/showcase/scenes/chaos/chaosMicroData";

import {
    CHAOS_WORLD,
} from "@/components/showcase/scenes/chaos/chaosWorldData";

import {
    CHAOS_TIMELINE as T,
} from "@/components/showcase/scenes/chaos/chaosTimeline";

type ChaosMicroFieldProps = {
    progressRef:
    MutableRefObject<number>;

    reducedMotion?: boolean;

    authoringPreview?: boolean;
};

/*
 * ============================================================
 * DEPTH MOTION CONFIG
 * ============================================================
 *
 * Elementos próximos reagem mais.
 *
 * Elementos distantes se movem menos.
 */

const depthMotion:
    Record<
        ChaosMicroDepth,
        {
            amplitude: number;
            opacity: number;
            scale: number;
            speed: number;
            pass: number;
        }
    > = {
    far: {
        amplitude: 0.32,
        opacity: 0.42,
        scale: 0.88,
        speed: 0.72,
        pass: 0.12,
    },

    middle: {
        amplitude: 0.58,
        opacity: 0.66,
        scale: 0.96,
        speed: 0.9,
        pass: 0.34,
    },

    near: {
        amplitude: 0.88,
        opacity: 0.88,
        scale: 1.03,
        speed: 1.08,
        pass: 0.7,
    },

    foreground: {
        amplitude: 1.22,
        opacity: 1,
        scale: 1.1,
        speed: 1.28,
        pass: 1,
    },
};

export function ChaosMicroField({
    progressRef,
    reducedMotion = false,
    authoringPreview = false,
}: ChaosMicroFieldProps) {
    const t =
        useTranslations(
            "Showcase.chaos.micro",
        );

    const root =
        useRef<HTMLDivElement>(
            null,
        );

    /*
     * ============================================================
     * CINEMATIC MICRO FIELD
     * ============================================================
     */

    useEffect(() => {
        const rootElement =
            root.current;

        if (
            !rootElement ||
            authoringPreview
        ) {
            return;
        }

        const rootNode =
            rootElement;

        const elements =
            Array.from(
                rootNode.querySelectorAll<HTMLElement>(
                    "[data-chaos-micro]",
                ),
            );

        /*
   * ============================================================
   * CACHE
   * ============================================================
   *
   * Tudo que precisamos de cada signal
   * é resolvido uma única vez.
   */

        const items =
            elements.map(
                (
                    element,
                    index,
                ) => {
                    const depth =
                        (
                            element.dataset
                                .chaosMicroDepth ??
                            "middle"
                        ) as ChaosMicroDepth;

                    const surface =
                        element.querySelector<HTMLElement>(
                            "[data-chaos-micro-surface]",
                        );

                    const motion =
                        element.querySelector<HTMLElement>(
                            "[data-chaos-micro-motion]",
                        );

                    const bar =
                        element.querySelector<HTMLElement>(
                            "[data-chaos-micro-bar]",
                        );

                    if (surface) {
                        surface.style.transformOrigin =
                            "center";

                        surface.style.willChange =
                            "transform, filter";
                    }

                    if (motion) {
                        motion.style.transformOrigin =
                            "center";

                        motion.style.willChange =
                            "transform";
                    }

                    return {
                        element,
                        surface,
                        motion,
                        bar,

                        index,

                        depth,

                        revealAt:
                            remapMicroRevealAt(
                                numberDataset(
                                    element,
                                    "chaosMicroReveal",
                                    0,
                                ),
                            ),

                        driftX:
                            numberDataset(
                                element,
                                "chaosMicroDriftX",
                                0,
                            ),

                        driftY:
                            numberDataset(
                                element,
                                "chaosMicroDriftY",
                                0,
                            ),

                        phase:
                            numberDataset(
                                element,
                                "chaosMicroPhase",
                                0,
                            ),

                        x:
                            numberDataset(
                                element,
                                "chaosMicroX",
                                CHAOS_WORLD.width /
                                2,
                            ),

                        y:
                            numberDataset(
                                element,
                                "chaosMicroY",
                                CHAOS_WORLD.height /
                                2,
                            ),

                        z:
                            numberDataset(
                                element,
                                "chaosMicroZ",
                                0,
                            ),
                    };
                },
            );

        /*
         * Evita flash no primeiro frame.
         */

        items.forEach(
            ({ element }) => {
                element.style.opacity =
                    "0";
            },
        );

        rootNode.style.opacity =
            "1";

        /*
         * ==========================================================
         * FRAME UPDATE
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
 * ============================================================
 * PHASE OWNERSHIP
 * ============================================================
 *
 * Depois que o Event Horizon
 * assume a cena, este sistema
 * não precisa mais animar
 * dezenas de elementos.
 */

/*
 * ============================================================
 * FINAL ACT PERFORMANCE HANDOFF
 * ============================================================
 *
 * Depois do Chaos Maximum,
 * todos os micros ficam congelados.
 *
 * A câmera passa a mover o mundo
 * inteiro como uma única composição.
 */

if (
  progress >=
  T.chaosMaximum
) {
  return;
}
            /*
             * --------------------------------------------------------
             * GLOBAL CHAOS ENERGY
             * --------------------------------------------------------
             *
             * Energia cresce durante
             * praticamente todo o ato.
             */

            const globalEnergy =
                smoothRange(
                    progress,
                    T.signals,
                    T.chaosMaximum,
                );

            /*
             * Primeira jornada.
             */

            const firstJourneyEnergy =
                createEnvelope(
                    progress,
                    T.signals,
                    T.swing,
                    T.ledge,
                );

            /*
             * Queda.
             *
             * Nesse momento o micro-field
             * reage, mas não domina.
             */

            const dropEnergy =
                createEnvelope(
                    progress,
                    T.lookDown,
                    T.dropMid,
                    T.recovery,
                );

            /*
             * Segunda jornada.
             */

            const reboundEnergy =
                smoothRange(
                    progress,
                    T.recovery,
                    T.chaosMaximum,
                );

            /*
 * ============================================================
 * DEEP RUN
 * ============================================================
 *
 * A segunda viagem fica muito
 * mais próxima da câmera.
 */

            const deepRunEnergy =
                createEnvelope(
                    progress,
                    T.rebound,
                    T.deepPass,
                    T.crossWorldRise,
                );

            const crossWorldEnergy =
                createEnvelope(
                    progress,
                    T.deepRun,
                    T.crossWorld,
                    T.chaosMaximum,
                );

            const chaosMaximumEnergy =
                smoothRange(
                    progress,
                    T.deepRun,
                    T.chaosMaximum,
                );

            const preOrbitEnergy =
                smoothRange(
                    progress,
                    T.chaosMaximum,
                    T.orbitStart,
                );

            /*
             * --------------------------------------------------------
             * EACH SIGNAL
             * --------------------------------------------------------
             */

            items.forEach(
                (item) => {
                    const {
                        element,
                        surface,
                        motion,
                        bar,

                        index,

                        depth,

                        revealAt,
                        driftX,
                        driftY,
                        phase,

                        x,
                        y,
                    } = item;

                    const config =
                        depthMotion[
                        depth
                        ];

                    /*
                     * ========================================================
                     * REVEAL
                     * ========================================================
                     */

                    const revealDuration =
                        depth ===
                            "foreground"
                            ? 0.018
                            : 0.024;

                    const reveal =
                        reducedMotion
                            ? progress >=
                                revealAt
                                ? 1
                                : 0
                            : smoothRange(
                                progress,
                                revealAt,
                                revealAt +
                                revealDuration,
                            );

                    if (
                        reveal <=
                        0.0001
                    ) {
                        element.style.opacity =
                            "0";

                        return;
                    }

                    /*
                     * ========================================================
                     * BASE ENERGY
                     * ========================================================
                     */

                    const localEnergy =
                        clamp01(
                            0.25 +
                            globalEnergy *
                            0.42 +
                            firstJourneyEnergy *
                            0.15 +
                            reboundEnergy *
                            0.4 +
                            dropEnergy *
                            0.12,
                        );

                    const lateSignalBoost =
                        smoothRange(
                            revealAt,
                            0.7,
                            0.9,
                        );

                    const energy =
                        clamp01(
                            localEnergy +
                            lateSignalBoost *
                            reboundEnergy *
                            0.28 +
                            chaosMaximumEnergy *
                            0.18,
                        );

                    /*
                     * ========================================================
                     * NORMAL DRIFT
                     * ========================================================
                     */

                    let driftOffsetX =
                        0;

                    let driftOffsetY =
                        0;

                    let driftRotation =
                        0;

                    if (
                        !reducedMotion
                    ) {
                        const phaseRadians =
                            phase *
                            Math.PI *
                            2;

                        const speed =
                            (
                                0.55 +
                                energy *
                                1.2
                            ) *
                            config.speed;

                        const horizontalWave =
                            Math.sin(
                                time *
                                speed +
                                phaseRadians,
                            );

                        const verticalWave =
                            Math.cos(
                                time *
                                (
                                    speed *
                                    0.82
                                ) +
                                phaseRadians *
                                1.37,
                            );

                        const secondaryWave =
                            Math.sin(
                                time *
                                (
                                    speed *
                                    0.43
                                ) +
                                phaseRadians *
                                2.1,
                            );

                        const amplitude =
                            config.amplitude *
                            (
                                0.35 +
                                energy *
                                0.95
                            );

                        driftOffsetX =
                            horizontalWave *
                            driftX *
                            amplitude +
                            secondaryWave *
                            driftX *
                            0.18 *
                            energy;

                        driftOffsetY =
                            verticalWave *
                            driftY *
                            amplitude +
                            secondaryWave *
                            driftY *
                            0.12 *
                            energy;

                        driftRotation =
                            horizontalWave *
                            (
                                0.5 +
                                energy *
                                2.2
                            ) *
                            config.amplitude;
                    }

                    /*
                     * ========================================================
                     * DEEP RUN — CLOSE PASS
                     * ========================================================
                     *
                     * Determinamos de que lado
                     * o elemento "corta" a câmera.
                     */

                    const passDirection =
                        phase >=
                            0.5
                            ? 1
                            : -1;

                    /*
                     * Foreground recebe quase
                     * o efeito inteiro.
                     *
                     * Far recebe pouquíssimo.
                     */

                    const passStrength =
                        config.pass;

                    const deepTravelDistance =
                        (
                            70 +
                            phase *
                            150
                        ) *
                        passStrength;

                    const deepPassX =
                        reducedMotion
                            ? 0
                            : passDirection *
                            deepTravelDistance *
                            deepRunEnergy;

                    const deepPassY =
                        reducedMotion
                            ? 0
                            : (
                                phase -
                                0.5
                            ) *
                            150 *
                            passStrength *
                            deepRunEnergy;

                    /*
                     * Aproximação em profundidade.
                     */

                    const deepPassZ =
                        reducedMotion
                            ? 0
                            : (
                                45 +
                                phase *
                                100
                            ) *
                            passStrength *
                            deepRunEnergy;

                    /*
                     * ========================================================
                     * CROSS WORLD
                     * ========================================================
                     *
                     * Aqui usamos index para
                     * quebrar sincronia visual.
                     */

                    const crossDirection =
                        index %
                            2 ===
                            0
                            ? -1
                            : 1;

                    const crossPassX =
                        reducedMotion
                            ? 0
                            : crossDirection *
                            (
                                45 +
                                lateSignalBoost *
                                100
                            ) *
                            passStrength *
                            crossWorldEnergy;

                    const crossPassY =
                        reducedMotion
                            ? 0
                            : Math.sin(
                                time *
                                0.8 +
                                phase *
                                9,
                            ) *
                            30 *
                            passStrength *
                            crossWorldEnergy;

                    /*
                     * ========================================================
                     * CHAOS COMPRESSION
                     * ========================================================
                     *
                     * Ainda não é gravidade.
                     *
                     * Apenas comprimimos
                     * ligeiramente o campo
                     * para aumentar a sensação
                     * de densidade.
                     */

                    const centerX =
                        CHAOS_WORLD.width /
                        2;

                    const centerY =
                        CHAOS_WORLD.height /
                        2;

                    const compressionStrength =
                        chaosMaximumEnergy *
                        0.045 +
                        preOrbitEnergy *
                        0.015;

                    const compressionX =
                        (
                            centerX -
                            x
                        ) *
                        compressionStrength;

                    const compressionY =
                        (
                            centerY -
                            y
                        ) *
                        compressionStrength;

                    /*
                     * ========================================================
                     * CHAOS JITTER
                     * ========================================================
                     *
                     * Pequeno.
                     *
                     * Não queremos "vibrar a tela".
                     */

                    const jitterX =
                        reducedMotion
                            ? 0
                            : Math.sin(
                                time *
                                (
                                    2.1 +
                                    phase *
                                    1.7
                                ) +
                                phase *
                                13,
                            ) *
                            chaosMaximumEnergy *
                            7 *
                            config.amplitude;

                    const jitterY =
                        reducedMotion
                            ? 0
                            : Math.cos(
                                time *
                                (
                                    2.4 +
                                    phase *
                                    1.5
                                ) +
                                phase *
                                11,
                            ) *
                            chaosMaximumEnergy *
                            5 *
                            config.amplitude;

                    /*
                     * ========================================================
                     * MOTION LAYER
                     * ========================================================
                     */

                    const motionX =
                        deepPassX +
                        crossPassX +
                        compressionX +
                        jitterX;

                    const motionY =
                        deepPassY +
                        crossPassY +
                        compressionY +
                        jitterY;

                    const motionZ =
                        deepPassZ;

                    /*
                     * Close objects passam
                     * ligeiramente maiores.
                     */

                    const closeScale =
                        1 +
                        deepRunEnergy *
                        passStrength *
                        (
                            0.07 +
                            lateSignalBoost *
                            0.07
                        );

                    /*
                     * Stretch vende velocidade
                     * melhor que blur exagerado.
                     */

                    const velocityStretch =
                        1 +
                        (
                            deepRunEnergy *
                            0.075 +
                            crossWorldEnergy *
                            0.045
                        ) *
                        passStrength;

                    const velocitySkew =
                        reducedMotion
                            ? 0
                            : passDirection *
                            deepRunEnergy *
                            passStrength *
                            2.2;

                    if (
                        motion
                    ) {
                        motion.style.transform = `
        translate3d(
          ${motionX}px,
          ${motionY}px,
          ${motionZ}px
        )

        skewX(
          ${velocitySkew}deg
        )

        scale(
          ${closeScale}
        )

        scaleX(
          ${velocityStretch}
        )
      `;
                    }

                    /*
                     * ========================================================
                     * DEPTH BREATHING
                     * ========================================================
                     */

                    const depthPulse =
                        reducedMotion
                            ? 0
                            : Math.sin(
                                time *
                                (
                                    0.65 +
                                    phase *
                                    0.4
                                ) +
                                phase *
                                8,
                            ) *
                            0.018 *
                            energy *
                            config.amplitude;

                    const revealScale =
                        mix(
                            0.86,
                            1,
                            easeOutCubic(
                                reveal,
                            ),
                        );

                    /*
                     * Chaos Maximum ganha
                     * pequeno pulso adicional.
                     */

                    const chaosPulse =
                        reducedMotion
                            ? 0
                            : Math.sin(
                                time *
                                (
                                    1.4 +
                                    phase *
                                    0.55
                                ) +
                                phase *
                                8,
                            ) *
                            0.025 *
                            chaosMaximumEnergy *
                            config.amplitude;

                    const finalScale =
                        config.scale *
                        revealScale *
                        (
                            1 +
                            depthPulse +
                            chaosPulse
                        );

                    /*
                     * ========================================================
                     * OPACITY
                     * ========================================================
                     */

                    const finalOpacity =
                        reveal *
                        config.opacity *
                        (
                            0.78 +
                            globalEnergy *
                            0.22
                        );

                    element.style.opacity =
                        `${finalOpacity}`;

                    /*
                     * ========================================================
                     * SURFACE
                     * ========================================================
                     */

                    if (
                        surface
                    ) {
                        surface.style.transform = `
        translate3d(
          ${driftOffsetX}px,
          ${driftOffsetY}px,
          0
        )

        rotate(
          ${driftRotation}deg
        )

        scale(
          ${finalScale}
        )
      `;

                        /*
                         * Blur só aparece durante
                         * passagens próximas.
                         *
                         * Mantemos extremamente
                         * pequeno para não destruir
                         * a legibilidade geral.
                         */

                        const velocityBlur =
                            reducedMotion
                                ? 0
                                : clamp(
                                    (
                                        deepRunEnergy *
                                        0.7 +
                                        crossWorldEnergy *
                                        0.3
                                    ) *
                                    passStrength,
                                    0,
                                    0.9,
                                );

                        if (
                            velocityBlur >
                            0.02
                        ) {
                            surface.style.filter =
                                `blur(${velocityBlur}px)`;
                        } else {
                            surface.style.filter =
                                "none";
                        }
                    }

                    /*
                     * ========================================================
                     * MICRO BAR
                     * ========================================================
                     */

                    if (
                        bar
                    ) {
                        const barPulse =
                            reducedMotion
                                ? 0
                                : Math.sin(
                                    time *
                                    1.4 +
                                    phase *
                                    10,
                                ) *
                                0.06 *
                                energy;

                        bar.style.transform = `
        scaleX(
          ${clamp(
                            0.72 +
                            barPulse,
                            0.55,
                            0.9,
                        )
                            }
        )
      `;

                        bar.style.transformOrigin =
                            "left center";
                    }

                    element.dataset
                        .chaosMicroActive =
                        reveal >=
                            0.999
                            ? "true"
                            : "false";

                    element.dataset
                        .chaosMicroIndex =
                        `${index}`;
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
        authoringPreview,
    ]);

    /*
     * ============================================================
     * RENDER
     * ============================================================
     */

    return (
        <div
            ref={root}
            data-chaos-micro-field
            aria-hidden="true"
            className="
        absolute
        left-1/2
        top-1/2
        transform-gpu
        [transform-style:preserve-3d]
      "
            style={{
                width:
                    CHAOS_WORLD.width,

                height:
                    CHAOS_WORLD.height,

                marginLeft:
                    -CHAOS_WORLD.width /
                    2,

                marginTop:
                    -CHAOS_WORLD.height /
                    2,

                opacity:
                    authoringPreview
                        ? 1
                        : 0,
            }}
        >
            {chaosMicroSignals.map(
                (signal) => (
                    <ChaosMicroSignal
                        key={
                            signal.id
                        }
                        signal={
                            signal
                        }
                        label={t(
                            signal.labelKey,
                        )}
                    />
                ),
            )}
        </div>
    );
}

/*
 * ============================================================
 * HELPERS
 * ============================================================
 */

function numberDataset(
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

function createEnvelope(
    progress: number,
    start: number,
    peak: number,
    end: number,
) {
    if (
        progress <=
        start ||
        progress >=
        end
    ) {
        return 0;
    }

    if (
        progress <=
        peak
    ) {
        return smoothRange(
            progress,
            start,
            peak,
        );
    }

    return (
        1 -
        smoothRange(
            progress,
            peak,
            end,
        )
    );
}

function easeOutCubic(
    value: number,
) {
    const t =
        clamp01(
            value,
        );

    return (
        1 -
        Math.pow(
            1 - t,
            3,
        )
    );
}

/*
 * ============================================================
 * MICRO TIMELINE REMAP
 * ============================================================
 *
 * Os dados originais foram
 * distribuídos para a timeline
 * antiga.
 *
 * Preservamos o começo e
 * comprimimos os sinais tardios
 * para o novo Chaos Maximum.
 */

function remapMicroRevealAt(
  original: number,
) {
  /*
   * Até 55%, mantém exatamente
   * o timing original.
   */

  if (
    original <= 0.55
  ) {
    return original;
  }

  /*
   * Antigo:
   *
   * 0.55 → 0.895
   *
   * Novo:
   *
   * 0.50 → 0.78
   */

  const normalized =
    clamp01(
      (
        original -
        0.55
      ) /
      (
        0.895 -
        0.55
      ),
    );

  return mix(
    0.5,
      T.chaosMaximum,
    normalized,
  );
}