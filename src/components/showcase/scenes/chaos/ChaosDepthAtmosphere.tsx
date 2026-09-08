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

type ChaosDepthAtmosphereProps = {
    progressRef:
    MutableRefObject<number>;
};

import {
    CHAOS_TIMELINE as T,
} from "@/components/showcase/scenes/chaos/chaosTimeline";

const streaks = [
    {
        left: 7,
        top: 16,
        height: 90,
        delay: 0.12,
    },

    {
        left: 16,
        top: 68,
        height: 150,
        delay: 0.34,
    },

    {
        left: 26,
        top: 31,
        height: 110,
        delay: 0.2,
    },

    {
        left: 37,
        top: 77,
        height: 180,
        delay: 0.52,
    },

    {
        left: 48,
        top: 12,
        height: 130,
        delay: 0.07,
    },

    {
        left: 57,
        top: 58,
        height: 210,
        delay: 0.41,
    },

    {
        left: 68,
        top: 26,
        height: 95,
        delay: 0.25,
    },

    {
        left: 76,
        top: 73,
        height: 165,
        delay: 0.57,
    },

    {
        left: 84,
        top: 19,
        height: 125,
        delay: 0.16,
    },

    {
        left: 92,
        top: 52,
        height: 190,
        delay: 0.46,
    },

    {
        left: 12,
        top: 43,
        height: 75,
        delay: 0.63,
    },

    {
        left: 63,
        top: 84,
        height: 140,
        delay: 0.31,
    },
] as const;

export function ChaosDepthAtmosphere({
    progressRef,
}: ChaosDepthAtmosphereProps) {
    const root =
        useRef<HTMLDivElement>(
            null,
        );

    const vignette =
        useRef<HTMLDivElement>(
            null,
        );

    const blueGlow =
        useRef<HTMLDivElement>(
            null,
        );

    useEffect(() => {
        const rootElement =
            root.current;

        const vignetteElement =
            vignette.current;

        const glowElement =
            blueGlow.current;

        if (
            !rootElement ||
            !vignetteElement ||
            !glowElement
        ) {
            return;
        }

        const rootNode =
            rootElement;

        const vignetteNode =
            vignetteElement;

        const glowNode =
            glowElement;

        const streakElements =
            Array.from(
                rootNode.querySelectorAll<HTMLElement>(
                    "[data-chaos-depth-streak]",
                ),
            );

        function update() {
            const progress =
                progressRef.current;
            if (
                progress >=
                T.chaosMaximum
            ) {
                rootNode.style.opacity =
                    "0";

                vignetteNode.style.opacity =
                    "0";

                glowNode.style.opacity =
                    "0";

                return;
            }

            /*
             * Suspensão antes da queda.
             */

            const anticipation =
                smoothRange(
                    progress,
                    T.overviewBreathe,
                    T.dropStart,
                );

            const drop =
                createEnvelope(
                    progress,
                    T.lookDown,
                    T.dropMid,
                    T.recovery,
                );

            const impact =
                createEnvelope(
                    progress,
                    T.dropMid,
                    T.impact,
                    T.recovery,
                );

            rootNode.style.opacity =
                `${Math.min(
                    1,
                    drop * 1.15,
                )}`;

            vignetteNode.style.opacity =
                `${anticipation *
                0.3 +
                drop *
                0.45
                }`;

            glowNode.style.opacity =
                `${drop *
                0.18 +
                impact *
                0.34
                }`;

            glowNode.style.transform = `
        translate3d(
          -50%,
          ${20 -
                drop * 55
                }%,
          0
        )
        scale(
          ${0.8 +
                drop * 0.7
                }
        )
      `;

            streakElements.forEach(
                (
                    element,
                    index,
                ) => {
                    const config =
                        streaks[
                        index %
                        streaks.length
                        ];

                    const speed =
                        170 +
                        index * 13;

                    const offset =
                        (
                            drop *
                            speed
                        ) +
                        config.delay *
                        140;

                    const stretch =
                        1 +
                        drop *
                        (
                            1.8 +
                            (
                                index %
                                3
                            ) *
                            0.35
                        );

                    element.style.opacity =
                        `${drop *
                        (
                            0.18 +
                            (
                                index %
                                4
                            ) *
                            0.07
                        )
                        }`;

                    element.style.transform = `
            translate3d(
              0,
              ${offset}px,
              0
            )
            scaleY(
              ${stretch}
            )
          `;
                },
            );
        }

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
        <div
            ref={root}
            aria-hidden="true"
            className="
        pointer-events-none
        absolute
        inset-0
        z-[35]
        overflow-hidden
        opacity-0
      "
        >
            {/* STREAKS */}

            {streaks.map(
                (
                    streak,

                ) => (
                    <span
                        key={
                            `${streak.left}-${streak.top}`
                        }
                        data-chaos-depth-streak
                        className="
              absolute
              w-px
              origin-center
              bg-gradient-to-b
              from-transparent
              via-white/45
              to-transparent
              opacity-0
              will-change-transform
            "
                        style={{
                            left:
                                `${streak.left}%`,

                            top:
                                `${streak.top}%`,

                            height:
                                streak.height,
                        }}
                    />
                ),
            )}

            {/* BLUE DEPTH GLOW */}

            <div
                ref={blueGlow}
                className="
          absolute
          bottom-[-25%]
          left-1/2
          h-[55vh]
          w-[70vw]
          -translate-x-1/2
          rounded-[50%]
          bg-[#0BA5FF]
          opacity-0
          blur-[140px]
          will-change-transform
        "
            />

            {/* VIGNETTE */}

            <div
                ref={vignette}
                className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.75)_100%)]
          opacity-0
        "
            />
        </div>
    );
}

function smoothRange(
    progress: number,
    start: number,
    end: number,
) {
    if (
        progress <= start
    ) {
        return 0;
    }

    if (
        progress >= end
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
        progress <= start ||
        progress >= end
    ) {
        return 0;
    }

    if (
        progress <= peak
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