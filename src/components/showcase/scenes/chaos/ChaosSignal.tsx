import type {
    CSSProperties,
} from "react";

import {
    AlertTriangle,
    BarChart3,
    Bell,
    CalendarDays,
    FileSpreadsheet,
    FileText,
    Package,
    ReceiptText,
    ShoppingBag,
    Target,
    Users,
    WalletCards,
} from "lucide-react";

import type {
    ChaosSignalKind,
    ChaosSignalVariant,
    ChaosWorldDepth,
} from "@/components/showcase/scenes/chaos/chaosWorldData";

import {
    CHAOS_DEPTH_STYLE,
} from "@/components/showcase/scenes/chaos/chaosWorldData";

import {
  ChaosGravityNode,
} from "@/components/showcase/scenes/chaos/ChaosGravityNode";

type ChaosSignalProps = {
    id: string;

    kind:
    ChaosSignalKind;

    label: string;

    value: string;

    variant:
    ChaosSignalVariant;

    depth:
    ChaosWorldDepth;

    x: number;
    y: number;
    z: number;

    width:
    | "sm"
    | "md"
    | "lg"
    | "xl";

    rotation: number;

    scale?: number;

    revealBeat: string;

    mobileHidden?: boolean;
};

const widthClasses = {
    sm: "min-w-[140px] max-w-[180px]",

    md: "min-w-[180px] max-w-[240px]",

    lg: "min-w-[230px] max-w-[310px]",

    xl: "min-w-[290px] max-w-[390px]",
} as const;

export function ChaosSignal({
    id,
    kind,
    label,
    value,
    variant,
    depth,
    x,
    y,
    z,
    width,
    rotation,
    scale = 1,
    revealBeat,
    mobileHidden,
}: ChaosSignalProps) {
    const depthStyle =
        CHAOS_DEPTH_STYLE[
        depth
        ];


    const style =
        {
            left: x,
            top: y,

            opacity:
                depthStyle.opacity,

            filter:
                depthStyle.blur >
                    0
                    ? `blur(${depthStyle.blur}px)`
                    : undefined,

            transform: `
        translate3d(
          -50%,
          -50%,
          ${z}px
        )
        rotate(${rotation}deg)
        scale(${scale *
                depthStyle.perspectiveScale
                })
      `,
        } satisfies CSSProperties;

    return (
  <article
    data-chaos-world-signal
    data-chaos-id={id}
    data-chaos-kind={kind}
    data-chaos-depth={
      depth
    }
    data-chaos-beat={
      revealBeat
    }
    data-chaos-x={x}
    data-chaos-y={y}
    data-chaos-z={z}
    className={`
      absolute
      transform-gpu
      will-change-transform

      ${
        widthClasses[
          width
        ]
      }

      ${
        mobileHidden
          ? "hidden md:block"
          : "block"
      }
    `}
    style={style}
  >
    <ChaosGravityNode
      id={id}
      x={x}
      y={y}
      z={z}
      depth={depth}
    >
      <div
        data-chaos-signal-surface
        className={`
          relative
          overflow-hidden
          border
          px-5
          py-4
          shadow-[0_28px_90px_rgba(0,0,0,0.14)]

          ${getVariantClasses(
            variant,
          )}
        `}
      >
        <div className="flex items-start justify-between gap-5">
          <div className="min-w-0">
            <p
              className={`
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.22em]

                ${getMutedClasses(
                  variant,
                )}
              `}
            >
              {label}
            </p>

            <p className="mt-2 whitespace-nowrap text-lg font-semibold tracking-[-0.035em] md:text-xl">
              {value}
            </p>
          </div>

          <div
            className={`
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-full

              ${getIconContainerClasses(
                variant,
              )}
            `}
          >
            <SignalIcon
              kind={kind}
            />
          </div>
        </div>

        <SignalDecoration
          kind={kind}
          variant={
            variant
          }
        />
      </div>
    </ChaosGravityNode>
  </article>
);
}

type SignalDecorationProps = {
    kind:
    ChaosSignalKind;

    variant:
    ChaosSignalVariant;
};

function SignalDecoration({
    kind,
    variant,
}: SignalDecorationProps) {
    if (
        kind === "chart" ||
        kind === "revenue" ||
        kind === "metric"
    ) {
        return (
            <div className="mt-5 flex h-9 items-end gap-1">
                {[
                    38,
                    62,
                    45,
                    78,
                    56,
                    92,
                    74,
                ].map(
                    (
                        height,
                        index,
                    ) => (
                        <span
                            key={
                                `${height}-${index}`
                            }
                            className={`
                flex-1
                rounded-t-[2px]

                ${variant ===
                                    "blue"
                                    ? "bg-white/35"
                                    : "bg-[#0BA5FF]/40"
                                }
              `}
                            style={{
                                height:
                                    `${height}%`,
                            }}
                        />
                    ),
                )}
            </div>
        );
    }

    if (
        kind ===
        "spreadsheet" ||
        kind === "document" ||
        kind === "report"
    ) {
        return (
            <div
                className={`
          mt-5
          grid
          grid-cols-4
          gap-px
          overflow-hidden
          rounded-lg
          border

          ${variant ===
                        "paper"
                        ? "border-black/5 bg-black/5"
                        : "border-white/5 bg-white/5"
                    }
        `}
            >
                {Array.from({
                    length: 12,
                }).map(
                    (
                        _,
                        index,
                    ) => (
                        <span
                            key={index}
                            className={`
                h-3

                ${variant ===
                                    "paper"
                                    ? "bg-black/[0.035]"
                                    : "bg-white/[0.035]"
                                }
              `}
                        />
                    ),
                )}
            </div>
        );
    }

    if (
        kind === "goal" ||
        kind === "stock"
    ) {
        return (
            <div
                className={`
          mt-5
          h-1
          overflow-hidden
          rounded-full

          ${variant ===
                        "paper"
                        ? "bg-black/5"
                        : "bg-white/10"
                    }
        `}
            >
                <div className="h-full w-[68%] rounded-full bg-[#0BA5FF]" />
            </div>
        );
    }

    return (
        <div
            className={`
        mt-5
        h-px
        w-full

        ${variant ===
                    "paper"
                    ? "bg-black/5"
                    : "bg-white/10"
                }
      `}
        />
    );
}

function getVariantClasses(
    variant:
        ChaosSignalVariant,
) {
    switch (
    variant
    ) {
        case "blue":
            return `
        rounded-[1.5rem]
        border-transparent
        bg-[#0BA5FF]
        text-white
      `;

        case "warning":
            return `
        rounded-[1.35rem]
        border-[#ff715b]/25
        bg-[#17100f]/95
        text-[#fff7f4]
      `;

        case "dark":
            return `
        rounded-[1.5rem]
        border-white/10
        bg-[#0B0E14]/95
        text-white
      `;

        case "ghost":
            return `
        rounded-[1.5rem]
        border-white/10
        bg-[#111721]/65
        text-white
        backdrop-blur-xl
      `;

        case "paper":
        default:
            return `
        rounded-[1.5rem]
        border-black/[0.08]
        bg-white/95
        text-[#080A10]
      `;
    }
}

function getMutedClasses(
    variant:
        ChaosSignalVariant,
) {
    if (
        variant ===
        "paper"
    ) {
        return "text-black/40";
    }

    if (
        variant ===
        "warning"
    ) {
        return "text-[#ff8b79]/65";
    }

    return "text-white/45";
}

function getIconContainerClasses(
    variant:
        ChaosSignalVariant,
) {
    switch (
    variant
    ) {
        case "blue":
            return `
        bg-white/15
        text-white
      `;

        case "warning":
            return `
        bg-[#ff715b]/10
        text-[#ff8b79]
      `;

        case "paper":
            return `
        bg-black/[0.045]
        text-black/45
      `;

        default:
            return `
        bg-white/[0.07]
        text-white/50
      `;
    }
}

type SignalIconProps = {
  kind:
    ChaosSignalKind;
};

function SignalIcon({
  kind,
}: SignalIconProps) {
  const commonProps = {
    size: 14,
    strokeWidth: 1.8,
  };

  switch (
    kind
  ) {
    case "sale":
    case "order":
      return (
        <ShoppingBag
          {...commonProps}
        />
      );

    case "stock":
      return (
        <Package
          {...commonProps}
        />
      );

    case "message":
    case "notification":
      return (
        <Bell
          {...commonProps}
        />
      );

    case "spreadsheet":
      return (
        <FileSpreadsheet
          {...commonProps}
        />
      );

    case "goal":
    case "metric":
      return (
        <Target
          {...commonProps}
        />
      );

    case "invoice":
      return (
        <ReceiptText
          {...commonProps}
        />
      );

    case "employee":
      return (
        <Users
          {...commonProps}
        />
      );

    case "report":
    case "document":
      return (
        <FileText
          {...commonProps}
        />
      );

    case "payment":
      return (
        <WalletCards
          {...commonProps}
        />
      );

    case "schedule":
      return (
        <CalendarDays
          {...commonProps}
        />
      );

    case "chart":
    case "revenue":
      return (
        <BarChart3
          {...commonProps}
        />
      );

    default:
      return (
        <AlertTriangle
          {...commonProps}
        />
      );
  }
}