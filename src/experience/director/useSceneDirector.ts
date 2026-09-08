"use client";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import type {
    RefObject,
} from "react";

import {
    gsap,
} from "gsap";

import {
    ScrollTrigger,
} from "gsap/ScrollTrigger";

import type {
    SceneMarker,
} from "@/experience/director/sceneMarkers";

import {
    cinematicEase,
    SCENE_DIRECTOR_CONFIG,
} from "@/experience/scroll/scrollConfig";

import {
    useSmoothScroll,
} from "@/experience/scroll/useSmoothScroll";

gsap.registerPlugin(
    ScrollTrigger,
);

type UseSceneDirectorOptions = {
    sectionRef:
    RefObject<HTMLElement | null>;

    pinRef?:
    RefObject<HTMLElement | null>;

    markers:
    readonly SceneMarker[];

    enableSnap?: boolean;
};

export function useSceneDirector({
    sectionRef,
    pinRef,
    markers,
    enableSnap = true,
}: UseSceneDirectorOptions) {
    const {
        lenis,
        ready,
    } =
        useSmoothScroll();

    /*
     * ScrollTrigger escreve aqui.
     */
    const targetProgress =
        useRef(0);

    /*
     * O restante da experiência
     * lerá este valor.
     */
    const progress =
        useRef(0);

    const triggerRef =
        useRef<
            ScrollTrigger | null
        >(null);

    const activeRef =
        useRef(false);

    const snappingRef =
        useRef(false);

    const [
        activeMarkerIndex,
        setActiveMarkerIndex,
    ] =
        useState(0);

    const [
        isActive,
        setIsActive,
    ] =
        useState(false);

    useEffect(() => {
        const section =
            sectionRef.current;

        if (
            !section ||
            !ready ||
            !lenis
        ) {
            return;
        }
        const lenisInstance =
            lenis;

        /*
         * SCROLL → TARGET PROGRESS
         */

        const trigger =
            ScrollTrigger.create({
                trigger: section,

                start: "top top",

                end: "bottom bottom",

                pin:
                    pinRef?.current ??
                    false,

                pinSpacing:
                    false,

                anticipatePin:
                    1,

                invalidateOnRefresh:
                    true,

                onUpdate(
                    self,
                ) {
                    targetProgress.current =
                        self.progress;
                },

                onEnter() {
                    activeRef.current =
                        true;

                    setIsActive(
                        true,
                    );
                },

                onEnterBack() {
                    activeRef.current =
                        true;

                    setIsActive(
                        true,
                    );
                },

                onLeave() {
                    activeRef.current =
                        false;

                    setIsActive(
                        false,
                    );
                },

                onLeaveBack() {
                    activeRef.current =
                        false;

                    setIsActive(
                        false,
                    );
                },
            });

        triggerRef.current =
            trigger;

        targetProgress.current =
            trigger.progress;

        progress.current =
            trigger.progress;

        if (
            trigger.isActive ||
            trigger.progress === 0
        ) {
            activeRef.current =
                true;

            setIsActive(
                true,
            );
        }

        /*
         * TARGET PROGRESS
         *       ↓
         * CINEMATIC PROGRESS
         */

        function updateProgress(
            _time: number,
            deltaTime: number,
        ) {
            const target =
                targetProgress.current;

            if (
                lenisInstance.prefersReducedMotion
            ) {
                progress.current =
                    target;
            } else {
                const deltaSeconds =
                    Math.min(
                        deltaTime /
                        1000,
                        0.05,
                    );

                const blend =
                    1 -
                    Math.exp(
                        -SCENE_DIRECTOR_CONFIG.progressDamping *
                        deltaSeconds,
                    );

                progress.current +=
                    (
                        target -
                        progress.current
                    ) *
                    blend;
            }

            const nextMarker =
                findActiveMarkerIndex(
                    progress.current,
                    markers,
                );

            setActiveMarkerIndex(
                (current) =>
                    current ===
                        nextMarker
                        ? current
                        : nextMarker,
            );
        }

        gsap.ticker.add(
            updateProgress,
        );

        /*
         * SOFT SNAP
         */

        let snapTimer:
            number | null =
            null;

        function clearSnapTimer() {
            if (
                snapTimer === null
            ) {
                return;
            }

            window.clearTimeout(
                snapTimer,
            );

            snapTimer =
                null;
        }

        function scheduleSnap() {
            if (
                !enableSnap ||
                !activeRef.current ||
                snappingRef.current
            ) {
                return;
            }

            clearSnapTimer();

            snapTimer =
                window.setTimeout(
                    trySnap,

                    SCENE_DIRECTOR_CONFIG.snapDelayMs,
                );
        }

        function trySnap() {
            if (
                !enableSnap ||
                !activeRef.current ||
                snappingRef.current
            ) {
                return;
            }

            /*
             * Ainda existe bastante
             * velocidade.
             *
             * Esperamos o movimento
             * perder energia.
             */
            if (
                Math.abs(
                    lenisInstance.velocity,
                ) >
                SCENE_DIRECTOR_CONFIG.velocityThreshold
            ) {
                scheduleSnap();

                return;
            }

            const snapMarkers =
                markers.filter(
                    (marker) =>
                        marker.snap,
                );

            if (
                snapMarkers.length ===
                0
            ) {
                return;
            }

            const currentProgress =
                targetProgress.current;

            const nearest =
                snapMarkers.reduce(
                    (
                        closest,
                        marker,
                    ) => {
                        const closestDistance =
                            Math.abs(
                                closest.progress -
                                currentProgress,
                            );

                        const markerDistance =
                            Math.abs(
                                marker.progress -
                                currentProgress,
                            );

                        return markerDistance <
                            closestDistance
                            ? marker
                            : closest;
                    },
                );

            const distance =
                Math.abs(
                    nearest.progress -
                    currentProgress,
                );

            /*
             * Longe demais:
             * não interferimos.
             */
            if (
                distance >
                SCENE_DIRECTOR_CONFIG.snapRadius
            ) {
                return;
            }

            /*
             * Já estamos praticamente
             * no marker.
             */
            if (
                distance <
                0.0015
            ) {
                return;
            }

            const sceneStart =
                trigger.start;

            const sceneEnd =
                trigger.end;

            const scrollDistance =
                sceneEnd -
                sceneStart;

            const destination =
                sceneStart +
                scrollDistance *
                nearest.progress;

            snappingRef.current =
                true;

            lenisInstance.scrollTo(
                destination,
                {
                    duration:
                        SCENE_DIRECTOR_CONFIG.snapDuration,

                    easing:
                        cinematicEase,

                    /*
                     * Importante:
                     * não sequestramos o
                     * controle do usuário.
                     */
                    lock: false,

                    onComplete() {
                        snappingRef.current =
                            false;
                    },
                },
            );
        }

        window.addEventListener(
            "wheel",
            scheduleSnap,
            {
                passive: true,
            },
        );

        window.addEventListener(
            "touchend",
            scheduleSnap,
            {
                passive: true,
            },
        );

        return () => {
            clearSnapTimer();

            window.removeEventListener(
                "wheel",
                scheduleSnap,
            );

            window.removeEventListener(
                "touchend",
                scheduleSnap,
            );

            gsap.ticker.remove(
                updateProgress,
            );

            trigger.kill();

            triggerRef.current =
                null;
        };
    }, [
        ready,
        lenis,
        sectionRef,
        pinRef,
        markers,
        enableSnap,
    ]);

    return {
        progress,

        targetProgress,

        activeMarkerIndex,

        activeMarker:
            markers[
            activeMarkerIndex
            ],

        isActive,

        triggerRef,
    };
}

function findActiveMarkerIndex(
    progress: number,
    markers:
        readonly SceneMarker[],
) {
    let activeIndex = 0;

    for (
        let index = 0;
        index <
        markers.length;
        index += 1
    ) {
        if (
            progress + 0.0001 >=
            markers[index].progress
        ) {
            activeIndex =
                index;

            continue;
        }

        break;
    }

    return activeIndex;
}