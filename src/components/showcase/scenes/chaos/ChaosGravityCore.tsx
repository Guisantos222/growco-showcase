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
    CHAOS_TIMELINE as T,
} from "@/components/showcase/scenes/chaos/chaosTimeline";

import {
    CHAOS_WORLD,
} from "@/components/showcase/scenes/chaos/chaosWorldData";

type ChaosGravityCoreProps = {
    progressRef:
    MutableRefObject<number>;

    reducedMotion?: boolean;
};

export function ChaosGravityCore({
    progressRef,
    reducedMotion = false,
}: ChaosGravityCoreProps) {
    const root =
        useRef<HTMLDivElement>(
            null,
        );

    const innerCore =
        useRef<HTMLDivElement>(
            null,
        );

    const ringA =
        useRef<HTMLDivElement>(
            null,
        );

    const ringB =
        useRef<HTMLDivElement>(
            null,
        );

    const ringC =
        useRef<HTMLDivElement>(
            null,
        );

    useEffect(() => {
        const rootNode =
            root.current;

        const coreNode =
            innerCore.current;

        const ringANode =
            ringA.current;

        const ringBNode =
            ringB.current;

        const ringCNode =
            ringC.current;

        if (
            !rootNode ||
            !coreNode ||
            !ringANode ||
            !ringBNode ||
            !ringCNode
        ) {
            return;
        }

        /*
     * ============================================================
     * NON-NULL DOM REFERENCES
     * ============================================================
     *
     * O TypeScript pode perder o narrowing
     * dentro do callback do GSAP ticker.
     *
     * Depois do guard acima sabemos que
     * todos esses elementos existem.
     */

        const rootElement:
            HTMLDivElement =
            rootNode;

        const coreElement:
            HTMLDivElement =
            coreNode;

        const ringAElement:
            HTMLDivElement =
            ringANode;

        const ringBElement:
            HTMLDivElement =
            ringBNode;

        const ringCElement:
            HTMLDivElement =
            ringCNode;

        function update(
            time: number,
        ) {
            const progress =
                clamp01(
                    progressRef.current,
                );

            const appear =
                smoothRange(
                    progress,
                    T.chaosMaximum,
                    T.orbitMid,
                );

            const lock =
                smoothRange(
                    progress,
                    T.orbitMid,
                    T.collapseReady,
                );

            const collapse =
                smoothRange(
                    progress,
                    T.spaghettify,
                    T.eventHorizon,
                );

            /*
             * O núcleo ainda é pequeno.
             *
             * O Black Hole real será
             * várias vezes mais intenso.
             */

            const rootScale =
                mix(
                    0.35,
                    1,
                    appear,
                ) *
                mix(
                    1,
                    0.72,
                    collapse,
                );

            rootElement.style.opacity =
                `${appear}`;

            rootElement.style.transform = `
        translate3d(
          -50%,
          -50%,
          140px
        )

        scale(
          ${rootScale}
        )
      `;

            /*
             * Núcleo interno.
             */

            const corePulse =
                reducedMotion
                    ? 0
                    : Math.sin(
                        time *
                        1.8,
                    ) *
                    0.06 *
                    appear *
                    (
                        1 -
                        lock *
                        0.5
                    );

            coreElement.style.transform = `
  scale(
    ${1 +
                corePulse +
                lock * 0.08 +
                collapse * 0.18
                }
  )
`;

            /*
             * Rings.
             */

            const rotationA =
                reducedMotion
                    ? 0
                    : time *
                    6 *
                    appear;

            const rotationB =
                reducedMotion
                    ? 0
                    : -time *
                    4.2 *
                    appear;

            const rotationC =
                reducedMotion
                    ? 0
                    : time *
                    2.8 *
                    appear;

            ringAElement.style.transform = `
        rotate(
          ${rotationA}deg
        )
        scale(
          ${0.7 +
                appear *
                0.3
                }
        )
      `;

            ringBElement.style.transform = `
        rotate(
          ${rotationB}deg
        )
        scale(
          ${0.78 +
                appear *
                0.22
                }
        )
      `;

            ringCElement.style.transform = `
        rotate(
          ${rotationC}deg
        )
        scale(
          ${0.84 +
                appear *
                0.16
                }
        )
      `;

            /*
             * Conforme Gravity Lock cresce,
             * os rings ficam ligeiramente
             * mais definidos.
             */

           ringAElement.style.opacity =
  `${
    (
      0.16 +
      lock * 0.34
    ) *
    (
      1 -
      collapse * 0.85
    )
  }`;

           ringBElement.style.opacity =
  `${
    (
      0.1 +
      lock * 0.22
    ) *
    (
      1 -
      collapse * 0.85
    )
  }`;

ringCElement.style.opacity =
  `${
    (
      0.08 +
      lock * 0.16
    ) *
    (
      1 -
      collapse * 0.85
    )
  }`;
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
            data-chaos-gravity-core-world
            aria-hidden="true"
            className="
      pointer-events-none
      absolute
      left-1/2
      top-1/2
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
            }}
        >
            <div
                ref={root}
                data-chaos-gravity-core
                className="
        pointer-events-none
        absolute
        z-[60]
        h-[300px]
        w-[300px]
        opacity-0
        [transform-style:preserve-3d]
        will-change-transform
      "
                style={{
                    left:
                        CHAOS_WORLD.width /
                        2,

                    top:
                        CHAOS_WORLD.height /
                        2,
                }}
            >
                {/* OUTER RING */}

                <div
                    ref={ringC}
                    className="
          absolute
          inset-[8%]
          rounded-full
          border
          border-black/[0.08]
          opacity-0
          will-change-transform
        "
                >
                    <div className="absolute left-[17%] top-[-3px] h-[6px] w-[22%] rounded-full bg-[#0BA5FF]/40 blur-[1px]" />
                </div>

                {/* MIDDLE RING */}

                <div
                    ref={ringB}
                    className="
          absolute
          inset-[22%]
          rounded-full
          border
          border-dashed
          border-black/[0.15]
          opacity-0
          will-change-transform
        "
                >
                    <div className="absolute right-[7%] top-[8%] h-2 w-2 rounded-full bg-black/50" />
                </div>

                {/* INNER RING */}

                <div
                    ref={ringA}
                    className="
          absolute
          inset-[34%]
          rounded-full
          border
          border-[#0BA5FF]/45
          opacity-0
          shadow-[0_0_40px_rgba(11,165,255,0.10)]
          will-change-transform
        "
                />

                {/* CORE */}

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
          shadow-[0_0_0_8px_rgba(255,255,255,0.7),0_0_0_10px_rgba(11,165,255,0.15),0_0_70px_rgba(11,165,255,0.25)]
          will-change-transform
        "
                />

                {/* CENTER DOT */}

                <div
                    className="
          absolute
          left-1/2
          top-1/2
          h-1.5
          w-1.5
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[#0BA5FF]
          shadow-[0_0_18px_rgba(11,165,255,0.9)]
        "
                />
            </div>
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
            end -
            start
        ) *
        progress
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