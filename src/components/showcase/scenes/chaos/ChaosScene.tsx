"use client";
import {
    CHAOS_RUNWAY_VH,
} from "@/components/showcase/scenes/chaos/chaosTimeline";

import {
    ChaosWorldHandoff,
} from "@/components/showcase/scenes/chaos/ChaosWorldHandoff";


import {
    ChaosNarrativeOverlay,
} from "@/components/showcase/scenes/chaos/ChaosNarrativeOverlay";

import {
    ChaosFinalStage,
} from "@/components/showcase/scenes/chaos/ChaosFinalStage";

import {
    ChaosWorld,
} from "@/components/showcase/scenes/chaos/ChaosWorld";

import {
    ChaosCameraRig,
} from "@/components/showcase/scenes/chaos/ChaosCameraRig";

import {
    ChaosCameraDebug,
} from "@/components/showcase/scenes/chaos/ChaosCameraDebug";

import {
    ChaosEventHorizonTakeover,
} from "@/components/showcase/scenes/chaos/ChaosEventHorizonTakeover";



import {
    useEffect,
    useRef,
} from "react";

import {
    gsap,
} from "gsap";

import {
    ScrollTrigger,
} from "gsap/ScrollTrigger";

import {
    useGSAP,
} from "@gsap/react";

import {
    useTranslations,
} from "next-intl";

import {
    ChaosDataCard,
} from "@/components/showcase/scenes/chaos/ChaosDataCard";

import {
    chaosItems,
    type ChaosLayer,
} from "@/components/showcase/scenes/chaos/chaosData";

import {
    ExperienceProgress,
} from "@/components/showcase/progress/ExperienceProgress";

import {
    CHAOS_CINEMATIC_MARKERS,
} from "@/experience/director/sceneMarkers";

import {
    useSceneDirector,
} from "@/experience/director/useSceneDirector";

import {
    useExperienceRuntime,
} from "@/experience/hooks/useExperienceRuntime";

import {
    ChaosDepthAtmosphere,
} from "@/components/showcase/scenes/chaos/ChaosDepthAtmosphere";

import {
    ChaosMicroField,
} from "@/components/showcase/scenes/chaos/ChaosMicroField";

import {
    ChaosGravitySystem,
} from "@/components/showcase/scenes/chaos/ChaosGravitySystem";

import {
    ChaosGravityCore,
} from "@/components/showcase/scenes/chaos/ChaosGravityCore";

gsap.registerPlugin(
    useGSAP,
    ScrollTrigger,
);

export function ChaosScene() {
    const t =
        useTranslations(
            "Showcase.chaos",
        );

    const runtime =
        useExperienceRuntime();

    /*
     * ============================================================
     * REFERENCES
     * ============================================================
     */

    const section =
        useRef<HTMLElement>(
            null,
        );

    const stage =
        useRef<HTMLDivElement>(
            null,
        );

    const farLayer =
        useRef<HTMLDivElement>(
            null,
        );

    const midLayer =
        useRef<HTMLDivElement>(
            null,
        );

    const nearLayer =
        useRef<HTMLDivElement>(
            null,
        );

    const movingCopy =
        useRef<HTMLHeadingElement>(
            null,
        );

    const everySecondCopy =
        useRef<HTMLParagraphElement>(
            null,
        );

    const tooMuchCopy =
        useRef<HTMLHeadingElement>(
            null,
        );

    const notEnoughCopy =
        useRef<HTMLHeadingElement>(
            null,
        );

    const questionCopy =
        useRef<HTMLHeadingElement>(
            null,
        );

    const heavyWorld =
        useRef<HTMLDivElement>(
            null,
        );

    /*
     * ============================================================
     * CINEMATIC SCENE DIRECTOR
     * ============================================================
     *
     * Por enquanto ele roda ao lado da antiga timeline CHAOS.
     *
     * Depois, no rebuild, o director.progress será a fonte principal
     * de movimento da câmera e do mundo.
     */

    const director =
        useSceneDirector({
            sectionRef:
                section,

            pinRef:
                stage,

            markers:
                CHAOS_CINEMATIC_MARKERS,

            enableSnap:
                false,
        });

    /*
     * ============================================================
     * CURSOR PARALLAX
     * ============================================================
     */

    useEffect(() => {
        if (
            !runtime.ready ||
            runtime.reducedMotion
        ) {
            return;
        }

        const far =
            farLayer.current;

        const mid =
            midLayer.current;

        const near =
            nearLayer.current;

        if (
            !far ||
            !mid ||
            !near
        ) {
            return;
        }

        const finePointer =
            window.matchMedia(
                "(pointer: fine)",
            );

        if (
            !finePointer.matches
        ) {
            return;
        }

        /*
         * Camada próxima:
         * maior deslocamento.
         */

        const nearX =
            gsap.quickTo(
                near,
                "x",
                {
                    duration: 0.8,
                    ease:
                        "power3.out",
                },
            );

        const nearY =
            gsap.quickTo(
                near,
                "y",
                {
                    duration: 0.8,
                    ease:
                        "power3.out",
                },
            );

        /*
         * Camada intermediária.
         */

        const midX =
            gsap.quickTo(
                mid,
                "x",
                {
                    duration: 1,
                    ease:
                        "power3.out",
                },
            );

        const midY =
            gsap.quickTo(
                mid,
                "y",
                {
                    duration: 1,
                    ease:
                        "power3.out",
                },
            );

        /*
         * Fundo:
         * deslocamento mínimo.
         */

        const farX =
            gsap.quickTo(
                far,
                "x",
                {
                    duration: 1.2,
                    ease:
                        "power3.out",
                },
            );

        const farY =
            gsap.quickTo(
                far,
                "y",
                {
                    duration: 1.2,
                    ease:
                        "power3.out",
                },
            );

        function handlePointerMove(
            event: PointerEvent,
        ) {
            const normalizedX =
                event.clientX /
                window.innerWidth -
                0.5;

            const normalizedY =
                event.clientY /
                window.innerHeight -
                0.5;

            nearX(
                normalizedX * -42,
            );

            nearY(
                normalizedY * -30,
            );

            midX(
                normalizedX * -20,
            );

            midY(
                normalizedY * -14,
            );

            farX(
                normalizedX * -7,
            );

            farY(
                normalizedY * -5,
            );
        }

        window.addEventListener(
            "pointermove",
            handlePointerMove,
            {
                passive: true,
            },
        );

        return () => {
            window.removeEventListener(
                "pointermove",
                handlePointerMove,
            );
        };
    }, [
        runtime.ready,
        runtime.reducedMotion,
    ]);

    /*
     * ============================================================
     * CHAOS V1 SCROLL TIMELINE
     * ============================================================
     *
     * Essa timeline continua temporariamente.
     *
     * Estamos mantendo a cena antiga funcional enquanto construímos
     * o novo sistema cinematográfico por cima dela.
     */

    useGSAP(
        () => {
            const currentSection =
                section.current;

            const currentStage =
                stage.current;

            if (
                !currentSection ||
                !currentStage ||
                !runtime.ready
            ) {
                return;
            }

            /*
             * ----------------------------------------------------------
             * ELEMENT COLLECTION
             * ----------------------------------------------------------
             */

            const items =
                Array.from(
                    currentSection.querySelectorAll<HTMLElement>(
                        "[data-chaos-item]",
                    ),
                );

            const driftElements =
                Array.from(
                    currentSection.querySelectorAll<HTMLElement>(
                        "[data-chaos-drift]",
                    ),
                );

            if (
                items.length === 0
            ) {
                return;
            }

            /*
             * ----------------------------------------------------------
             * INITIAL VISUAL STATE
             * ----------------------------------------------------------
             */

            gsap.set(
                currentStage,
                {
                    backgroundColor:
                        "#ffffff",
                },
            );

            gsap.set(
                items,
                {
                    autoAlpha: 0,
                    scale: 0.84,
                    x: 0,
                    y: 0,
                    filter:
                        "blur(0px)",
                },
            );

            gsap.set(
                [
                    movingCopy.current,
                    everySecondCopy.current,
                    tooMuchCopy.current,
                    notEnoughCopy.current,
                    questionCopy.current,
                ],
                {
                    autoAlpha: 0,
                },
            );

            gsap.set(
                movingCopy.current,
                {
                    y: 36,
                },
            );

            gsap.set(
                everySecondCopy.current,
                {
                    y: 18,
                },
            );

            gsap.set(
                tooMuchCopy.current,
                {
                    y: 45,
                    scale: 0.92,
                },
            );

            gsap.set(
                notEnoughCopy.current,
                {
                    y: 35,
                },
            );

            gsap.set(
                questionCopy.current,
                {
                    y: 30,
                },
            );

            /*
             * ==========================================================
             * REDUCED MOTION VERSION
             * ==========================================================
             */

            if (
                runtime.reducedMotion
            ) {
                gsap.set(
                    items,
                    {
                        scale: 1,
                    },
                );

                const reducedTimeline =
                    gsap.timeline({
                        scrollTrigger: {
                            trigger:
                                currentSection,

                            start:
                                "top top",

                            end:
                                "bottom bottom",

                            scrub: 0.5,
                        },
                    });

                /*
                 * Opening.
                 */

                reducedTimeline.fromTo(
                    movingCopy.current,
                    {
                        autoAlpha: 0,
                        y: 20,
                    },
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.12,
                    },
                    0,
                );

                /*
                 * Data appears without
                 * aggressive trajectories.
                 */

                reducedTimeline.to(
                    items,
                    {
                        autoAlpha: 0.72,
                        duration: 0.18,
                        stagger: 0.01,
                    },
                    0.16,
                );

                /*
                 * Opening copy leaves.
                 */

                reducedTimeline.to(
                    movingCopy.current,
                    {
                        autoAlpha: 0,
                        duration: 0.08,
                    },
                    0.34,
                );

                /*
                 * Typographic climax.
                 */

                reducedTimeline.fromTo(
                    tooMuchCopy.current,
                    {
                        autoAlpha: 0,
                    },
                    {
                        autoAlpha: 1,
                        duration: 0.1,
                    },
                    0.38,
                );

                reducedTimeline.fromTo(
                    notEnoughCopy.current,
                    {
                        autoAlpha: 0,
                    },
                    {
                        autoAlpha: 1,
                        duration: 0.1,
                    },
                    0.48,
                );

                /*
                 * Climax disappears.
                 */

                reducedTimeline.to(
                    [
                        tooMuchCopy.current,
                        notEnoughCopy.current,
                    ],
                    {
                        autoAlpha: 0,
                        duration: 0.08,
                    },
                    0.62,
                );

                /*
                 * Data fades.
                 */

                reducedTimeline.to(
                    items,
                    {
                        autoAlpha: 0.08,
                        duration: 0.1,
                    },
                    0.64,
                );

                /*
                 * World enters darkness.
                 */

                reducedTimeline.to(
                    currentStage,
                    {
                        backgroundColor:
                            "#080A10",
                        duration: 0.12,
                    },
                    0.64,
                );

                /*
                 * Final question.
                 */

                reducedTimeline.fromTo(
                    questionCopy.current,
                    {
                        autoAlpha: 0,
                        y: 16,
                    },
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.12,
                    },
                    0.76,
                );

                return;
            }

            /*
             * ==========================================================
             * CONTINUOUS MICRO DRIFT
             * ==========================================================
             *
             * data-chaos-item:
             * trajetória principal ligada ao scroll.
             *
             * data-chaos-drift:
             * movimento interno independente.
             */

            const driftTweens =
                driftElements.map(
                    (
                        element,
                        index,
                    ) => {
                        const direction =
                            index % 2 === 0
                                ? 1
                                : -1;

                        const horizontalDistance =
                            4 +
                            (index % 3) * 3;

                        const verticalDistance =
                            5 +
                            (index % 4) * 2;

                        const rotationAmount =
                            0.8 +
                            (index % 3) * 0.4;

                        const duration =
                            2.2 +
                            (index % 4) *
                            0.55;

                        return gsap.to(
                            element,
                            {
                                x:
                                    direction *
                                    horizontalDistance,

                                y:
                                    -direction *
                                    verticalDistance,

                                rotation:
                                    direction *
                                    rotationAmount,

                                duration,

                                ease:
                                    "sine.inOut",

                                repeat: -1,

                                yoyo: true,
                            },
                        );
                    },
                );

            /*
             * ==========================================================
             * MAIN SCROLL TIMELINE
             * ==========================================================
             */

            const timeline =
                gsap.timeline({
                    scrollTrigger: {
                        trigger:
                            currentSection,

                        start:
                            "top top",

                        end:
                            "bottom bottom",

                        scrub: 0.85,

                        /*
                         * A intensidade do drift
                         * acompanha a progressão.
                         */
                        onUpdate: (
                            self,
                        ) => {
                            const progress =
                                self.progress;

                            let speed = 0;

                            /*
                             * Opening:
                             * dados quase imóveis.
                             */

                            if (
                                progress <
                                0.16
                            ) {
                                speed =
                                    0.35;
                            }

                            /*
                             * Crescimento gradual
                             * do caos.
                             */

                            else if (
                                progress <
                                0.58
                            ) {
                                speed =
                                    gsap.utils.mapRange(
                                        0.16,
                                        0.58,
                                        0.55,
                                        1.8,
                                        progress,
                                    );
                            }

                            /*
                             * Freeze:
                             * energia cai até zero.
                             */

                            else if (
                                progress <
                                0.72
                            ) {
                                speed =
                                    gsap.utils.mapRange(
                                        0.58,
                                        0.72,
                                        1.8,
                                        0,
                                        progress,
                                    );
                            }

                            driftTweens.forEach(
                                (tween) => {
                                    tween.timeScale(
                                        Math.max(
                                            0,
                                            speed,
                                        ),
                                    );
                                },
                            );
                        },
                    },
                });

            /*
             * ==========================================================
             * BEAT — OPENING
             * ==========================================================
             */

            timeline.fromTo(
                movingCopy.current,
                {
                    autoAlpha: 0,
                    y: 36,
                },
                {
                    autoAlpha: 1,
                    y: 0,

                    duration: 0.12,

                    ease:
                        "power3.out",
                },
                0,
            );

            timeline.fromTo(
                everySecondCopy.current,
                {
                    autoAlpha: 0,
                    y: 18,
                },
                {
                    autoAlpha: 1,
                    y: 0,

                    duration: 0.1,

                    ease:
                        "power3.out",
                },
                0.1,
            );

            /*
             * ==========================================================
             * BEAT — DATA ARRIVAL
             * ==========================================================
             */

            const firstWave =
                items.slice(
                    0,
                    6,
                );

            const secondWave =
                items.slice(
                    6,
                    12,
                );

            const thirdWave =
                items.slice(
                    12,
                );

            timeline.to(
                firstWave,
                {
                    autoAlpha: 1,
                    scale: 1,

                    duration: 0.1,

                    stagger:
                        0.015,
                },
                0.17,
            );

            timeline.to(
                secondWave,
                {
                    autoAlpha: 1,
                    scale: 1,

                    duration: 0.1,

                    stagger:
                        0.012,
                },
                0.27,
            );

            timeline.to(
                thirdWave,
                {
                    autoAlpha: 1,
                    scale: 1,

                    duration: 0.1,

                    stagger:
                        0.01,
                },
                0.36,
            );

            /*
             * ==========================================================
             * BEAT — DATA TRAJECTORIES
             * ==========================================================
             */

            items.forEach(
                (
                    item,
                    index,
                ) => {
                    const moveX =
                        Number(
                            item.dataset
                                .moveX ??
                            0,
                        );

                    const moveY =
                        Number(
                            item.dataset
                                .moveY ??
                            0,
                        );

                    const rotation =
                        Number(
                            item.dataset
                                .rotation ??
                            0,
                        );

                    gsap.set(
                        item,
                        {
                            rotation,
                        },
                    );

                    timeline.to(
                        item,
                        {
                            x:
                                moveX,

                            y:
                                moveY,

                            rotation:
                                rotation +
                                (
                                    index %
                                        2 ===
                                        0
                                        ? 7
                                        : -7
                                ),

                            duration:
                                0.4,

                            ease:
                                "none",
                        },

                        0.24 +
                        (
                            index %
                            5
                        ) *
                        0.012,
                    );
                },
            );

            /*
             * ==========================================================
             * BEAT — OPENING COPY LEAVES
             * ==========================================================
             */

            timeline.to(
                movingCopy.current,
                {
                    autoAlpha: 0,

                    y: -26,

                    duration: 0.08,
                },
                0.47,
            );

            timeline.to(
                everySecondCopy.current,
                {
                    autoAlpha: 0,

                    y: -16,

                    duration: 0.08,
                },
                0.5,
            );

            /*
             * ==========================================================
             * BEAT — TOO MUCH DATA
             * ==========================================================
             */

            timeline.fromTo(
                tooMuchCopy.current,
                {
                    autoAlpha: 0,

                    scale: 0.92,

                    y: 45,
                },
                {
                    autoAlpha: 1,

                    scale: 1,

                    y: 0,

                    duration: 0.12,

                    ease:
                        "power3.out",
                },
                0.51,
            );

            /*
             * ==========================================================
             * BEAT — NOT ENOUGH CLARITY
             * ==========================================================
             */

            timeline.fromTo(
                notEnoughCopy.current,
                {
                    autoAlpha: 0,

                    y: 35,
                },
                {
                    autoAlpha: 1,

                    y: 0,

                    duration: 0.11,

                    ease:
                        "power3.out",
                },
                0.59,
            );

            /*
             * ==========================================================
             * BEAT — FREEZE
             * ==========================================================
             */

            timeline.to(
                items,
                {
                    opacity:
                        0.32,

                    scale:
                        0.98,

                    duration:
                        0.09,
                },
                0.69,
            );

            /*
             * ==========================================================
             * BEAT — HEADLINES LEAVE
             * ==========================================================
             */

            timeline.to(
                [
                    tooMuchCopy.current,
                    notEnoughCopy.current,
                ],
                {
                    autoAlpha: 0,

                    y: -25,

                    duration:
                        0.09,
                },
                0.72,
            );

            /*
             * ==========================================================
             * BEAT — DARKNESS
             * ==========================================================
             */

            timeline.to(
                currentStage,
                {
                    backgroundColor:
                        "#080A10",

                    duration:
                        0.12,

                    ease:
                        "none",
                },
                0.75,
            );

            timeline.to(
                items,
                {
                    autoAlpha:
                        0.09,

                    filter:
                        "blur(2px)",

                    duration:
                        0.1,
                },
                0.75,
            );

            /*
             * ==========================================================
             * BEAT — QUESTION
             * ==========================================================
             */

            timeline.fromTo(
                questionCopy.current,
                {
                    autoAlpha: 0,

                    y: 30,
                },
                {
                    autoAlpha: 1,

                    y: 0,

                    duration:
                        0.13,

                    ease:
                        "power3.out",
                },
                0.988,
            );

            /*
             * ==========================================================
             * CLEANUP
             * ==========================================================
             */

            return () => {
                driftTweens.forEach(
                    (tween) => {
                        tween.kill();
                    },
                );
            };
        },
        {
            scope:
                section,

            dependencies: [
                runtime.ready,
                runtime.reducedMotion,
            ],

            revertOnUpdate:
                true,
        },
    );

    /*
     * ============================================================
     * RENDER DATA LAYER
     * ============================================================
     *
     * A PARTE 2 continua exatamente daqui.
     */
    function renderLayer(
        layer: ChaosLayer,
    ) {
        return chaosItems
            .filter(
                (item) =>
                    item.layer ===
                    layer,
            )
            .map(
                (item) => (
                    <div
                        key={item.id}
                        data-chaos-item
                        data-move-x={
                            item.moveX
                        }
                        data-move-y={
                            item.moveY
                        }
                        data-rotation={
                            item.rotate
                        }
                        className={`absolute ${item.mobileHidden
                            ? "hidden md:block"
                            : "block"
                            }`}
                        style={{
                            left:
                                `${item.x}%`,

                            top:
                                `${item.y}%`,
                        }}
                    >
                        <ChaosDataCard
                            label={t(
                                `items.${item.labelKey}`,
                            )}
                            value={
                                item.value
                            }
                            variant={
                                item.variant
                            }
                        />
                    </div>
                ),
            );
    }

    /*
     * ============================================================
     * RENDER
     * ============================================================
     */

    return (
        <section
            ref={section}
            id="top"
            className="relative"
            style={{
                height:
                    `${CHAOS_RUNWAY_VH}vh`,
            }}
        >
            <div
                ref={stage}
                className="
    relative
    h-screen
    overflow-hidden
    bg-white
  "
            >
                {/* ====================================================== */}
                {/* HEAVY WORLD                                            */}
                {/* ====================================================== */}

                <div
                    ref={heavyWorld}
                    data-chaos-heavy-world
                    className="
      absolute
      inset-0
      will-change-opacity
    "
                >
                    <ChaosCameraRig
                        progressRef={
                            director.progress
                        }
                    >
                        <ChaosGravitySystem
                            progressRef={
                                director.progress
                            }
                            reducedMotion={
                                runtime.reducedMotion
                            }
                        >
                            <ChaosWorld />

                            <ChaosMicroField
                                progressRef={
                                    director.progress
                                }
                                reducedMotion={
                                    runtime.reducedMotion
                                }
                            />
                        </ChaosGravitySystem>
                    </ChaosCameraRig>
                </div>

                {/* ====================================================== */}
                {/* FINAL STAGE                                            */}
                {/* IMPORTANTE: FORA DO HEAVY WORLD                        */}
                {/* ====================================================== */}

                <ChaosNarrativeOverlay
                    progressRef={director.progress}
                    reducedMotion={runtime.reducedMotion}
                />

                <ChaosFinalStage
                    progressRef={
                        director.progress
                    }
                    heavyWorldRef={
                        heavyWorld
                    }
                    reducedMotion={
                        runtime.reducedMotion
                    }
                />

                {/* ====================================================== */}
                {/* ATMOSPHERE                                             */}
                {/* ====================================================== */}

                <ChaosDepthAtmosphere
                    progressRef={
                        director.progress
                    }
                />

                {/* ====================================================== */}
                {/* HUD                                                    */}
                {/* ====================================================== */}

                <ExperienceProgress
                    sceneLabel="CHAOS"
                    markers={
                        CHAOS_CINEMATIC_MARKERS
                    }
                    progressRef={
                        director.progress
                    }
                    activeMarkerIndex={
                        director.activeMarkerIndex
                    }
                    visible={
                        director.isActive
                    }
                />
            </div>
        </section>
    );
}