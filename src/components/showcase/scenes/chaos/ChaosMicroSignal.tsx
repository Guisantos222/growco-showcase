import type {
    CSSProperties,
} from "react";

import type {
    ChaosMicroDatum,
} from "@/components/showcase/scenes/chaos/chaosMicroData";

import {
    ChaosGravityNode,
} from "@/components/showcase/scenes/chaos/ChaosGravityNode";

type ChaosMicroSignalProps = {
    signal:
    ChaosMicroDatum;

    label: string;
};

const sizeClasses = {
    xs: `
    text-[9px]
    px-2.5
    py-1.5
  `,

    sm: `
    text-[10px]
    px-3
    py-2
  `,

    md: `
    text-[11px]
    px-4
    py-2.5
  `,
} as const;

export function ChaosMicroSignal({
    signal,
    label,
}: ChaosMicroSignalProps) {
    const style =
        {
            left:
                signal.x,

            top:
                signal.y,

            transform: `
        translate3d(
          -50%,
          -50%,
          ${signal.z}px
        )

        rotate(
          ${signal.rotation}deg
        )
      `,
        } satisfies CSSProperties;

    return (
        <div
            data-chaos-micro
            data-chaos-micro-id={
                signal.id
            }
            data-chaos-micro-depth={
                signal.depth
            }
            data-chaos-micro-reveal={
                signal.revealAt
            }
            data-chaos-micro-drift-x={
                signal.driftX
            }
            data-chaos-micro-drift-y={
                signal.driftY
            }
            data-chaos-micro-phase={
                signal.phase
            }
            data-chaos-micro-x={
                signal.x
            }

            data-chaos-micro-y={
                signal.y
            }

            data-chaos-micro-z={
                signal.z
            }
            className={`
        absolute
        transform-gpu
        will-change-transform

        ${signal.mobileHidden
                    ? "hidden md:block"
                    : "block"
                }
      `}
            style={style}
        >
            <ChaosGravityNode
                id={
                    signal.id
                }
                x={
                    signal.x
                }
                y={
                    signal.y
                }
                z={
                    signal.z
                }
                depth={
                    signal.depth
                }
            >
                <div
                    data-chaos-micro-motion
                    className="
      transform-gpu
      [transform-style:preserve-3d]
      will-change-transform
    "
                >
                    <MicroSurface
                        signal={
                            signal
                        }
                        label={
                            label
                        }
                    />
                </div>
            </ChaosGravityNode>
        </div>
    );
}

type MicroSurfaceProps = {
    signal:
    ChaosMicroDatum;

    label: string;
};

function MicroSurface({
    signal,
    label,
}: MicroSurfaceProps) {
    switch (
    signal.variant
    ) {
        /*
         * ========================================================
         * TAG
         * ========================================================
         */

        case "tag":
            return (
                <div
                    data-chaos-micro-surface
                    className={`
            flex
            items-center
            gap-2
            whitespace-nowrap
            rounded-full
            border
            border-black/[0.08]
            bg-white/90
            font-semibold
            uppercase
            tracking-[0.16em]
            text-[#080A10]
            shadow-[0_15px_50px_rgba(0,0,0,0.09)]
            backdrop-blur-md

            ${sizeClasses[
                        signal.size
                        ]
                        }
          `}
                >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0BA5FF]" />

                    <span>
                        {label}
                    </span>

                    {signal.value && (
                        <span className="font-mono tracking-normal text-black/40">
                            {
                                signal.value
                            }
                        </span>
                    )}
                </div>
            );

        /*
         * ========================================================
         * METRIC
         * ========================================================
         */

        case "metric":
            return (
                <div
                    data-chaos-micro-surface
                    className={`
            whitespace-nowrap
            rounded-[0.8rem]
            border
            border-[#0BA5FF]/20
            bg-[#0BA5FF]
            font-medium
            text-white
            shadow-[0_18px_60px_rgba(11,165,255,0.18)]

            ${sizeClasses[
                        signal.size
                        ]
                        }
          `}
                >
                    <span className="mr-2 text-[0.72em] font-semibold uppercase tracking-[0.18em] text-white/60">
                        {label}
                    </span>

                    {signal.value && (
                        <span className="font-mono font-semibold tabular-nums">
                            {
                                signal.value
                            }
                        </span>
                    )}
                </div>
            );

        /*
         * ========================================================
         * WARNING
         * ========================================================
         */

        case "warning":
            return (
                <div
                    data-chaos-micro-surface
                    className={`
            flex
            items-center
            gap-2
            whitespace-nowrap
            rounded-[0.75rem]
            border
            border-[#ff715b]/25
            bg-[#17100f]/95
            font-semibold
            uppercase
            tracking-[0.14em]
            text-[#ff8b79]
            shadow-[0_20px_70px_rgba(0,0,0,0.2)]

            ${sizeClasses[
                        signal.size
                        ]
                        }
          `}
                >
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inset-0 rounded-full bg-[#ff715b]/25" />

                        <span className="absolute inset-[2px] rounded-full bg-[#ff715b]" />
                    </span>

                    <span>
                        {label}
                    </span>

                    {signal.value && (
                        <span className="font-mono tracking-normal text-white/55">
                            {
                                signal.value
                            }
                        </span>
                    )}
                </div>
            );

        /*
         * ========================================================
         * LOG
         * ========================================================
         */

        case "log":
            return (
                <div
                    data-chaos-micro-surface
                    className={`
            whitespace-nowrap
            border-l
            border-[#0BA5FF]/60
            bg-[#0B0E14]/85
            font-mono
            text-white/65
            shadow-[0_18px_60px_rgba(0,0,0,0.16)]
            backdrop-blur-sm

            ${sizeClasses[
                        signal.size
                        ]
                        }
          `}
                >
                    <span className="mr-2 text-[#0BA5FF]">
                        /
                    </span>

                    <span className="uppercase tracking-[0.12em]">
                        {label}
                    </span>

                    {signal.value && (
                        <span className="ml-2 text-white">
                            {
                                signal.value
                            }
                        </span>
                    )}
                </div>
            );

        /*
         * ========================================================
         * DOT STATUS
         * ========================================================
         */

        case "dot":
            return (
                <div
                    data-chaos-micro-surface
                    className={`
            flex
            items-center
            gap-2
            whitespace-nowrap
            rounded-full
            border
            border-white/10
            bg-[#0B0E14]/85
            font-medium
            uppercase
            tracking-[0.15em]
            text-white/70
            backdrop-blur-md

            ${sizeClasses[
                        signal.size
                        ]
                        }
          `}
                >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0BA5FF] shadow-[0_0_12px_rgba(11,165,255,0.7)]" />

                    <span>
                        {label}
                    </span>

                    {signal.value && (
                        <span className="font-mono tracking-normal text-white/40">
                            {
                                signal.value
                            }
                        </span>
                    )}
                </div>
            );

        /*
         * ========================================================
         * MICRO BAR
         * ========================================================
         */

        case "bar":
        default:
            return (
                <div
                    data-chaos-micro-surface
                    className={`
            min-w-[125px]
            rounded-[0.85rem]
            border
            border-black/[0.07]
            bg-white/90
            font-medium
            text-[#080A10]
            shadow-[0_16px_55px_rgba(0,0,0,0.09)]

            ${sizeClasses[
                        signal.size
                        ]
                        }
          `}
                >
                    <div className="flex items-center justify-between gap-4">
                        <span className="whitespace-nowrap text-[0.75em] font-semibold uppercase tracking-[0.16em] text-black/45">
                            {label}
                        </span>

                        {signal.value && (
                            <span className="font-mono text-[0.9em] font-semibold tabular-nums">
                                {
                                    signal.value
                                }
                            </span>
                        )}
                    </div>

                    <div className="mt-2 h-[2px] overflow-hidden rounded-full bg-black/[0.06]">
                        <div
                            data-chaos-micro-bar
                            className="h-full w-[72%] rounded-full bg-[#0BA5FF]"
                        />
                    </div>
                </div>
            );
    }
}