"use client";

import {
  useTranslations,
} from "next-intl";

import {
  ChaosSignal,
} from "@/components/showcase/scenes/chaos/ChaosSignal";

import {
  CHAOS_WORLD,
  chaosClusters,
  chaosWorldSignals,
} from "@/components/showcase/scenes/chaos/chaosWorldData";

type ChaosWorldProps = {
  debug?: boolean;
};

export function ChaosWorld({
  debug = false,
}: ChaosWorldProps) {
  const t =
    useTranslations(
      "Showcase.chaos",
    );

  return (
    <div
      data-chaos-world
      className="
        absolute
        left-1/2
        top-1/2
        transform-gpu
        [transform-style:preserve-3d]
        will-change-transform
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
      {/* ================================================ */}
      {/* WORLD BACKGROUND                                 */}
      {/* ================================================ */}

      <div
        aria-hidden="true"
        className="
          absolute
          inset-0
          overflow-hidden
          rounded-[5rem]
        "
      >
        {/* MAIN WORLD GRID */}

        <div
          className="absolute inset-0 opacity-[0.055]"
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(8,10,16,0.18) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(8,10,16,0.18) 1px,
                transparent 1px
              )
            `,

            backgroundSize:
              "96px 96px",
          }}
        />

        {/* VERY LARGE BACKGROUND WORDS */}

        <BackgroundWord
          text="SALES"
          x={180}
          y={180}
          rotation={-4}
        />

        <BackgroundWord
          text="OPERATIONS"
          x={1080}
          y={120}
          rotation={2}
        />

        <BackgroundWord
          text="PEOPLE"
          x={2380}
          y={260}
          rotation={-3}
        />

        <BackgroundWord
          text="FINANCE"
          x={190}
          y={1850}
          rotation={3}
        />

        <BackgroundWord
          text="MANAGEMENT"
          x={1750}
          y={2050}
          rotation={-2}
        />
      </div>

      {/* ================================================ */}
      {/* DEBUG CLUSTERS                                   */}
      {/* ================================================ */}

      {debug &&
        chaosClusters.map(
          (cluster) => (
            <div
              key={
                cluster.id
              }
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                rounded-full
                border
                border-dashed
                border-[#0BA5FF]/30
              "
              style={{
                left:
                  cluster.centerX -
                  cluster.radius,

                top:
                  cluster.centerY -
                  cluster.radius,

                width:
                  cluster.radius *
                  2,

                height:
                  cluster.radius *
                  2,
              }}
            >
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-[#0BA5FF]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#0BA5FF]">
                {
                  cluster.label
                }
              </span>
            </div>
          ),
        )}

      {/* ================================================ */}
      {/* WORLD CENTER                                     */}
      {/* ================================================ */}

      {debug && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute z-[200] h-px w-16 bg-red-500"
            style={{
              left:
                CHAOS_WORLD.width /
                  2 -
                32,

              top:
                CHAOS_WORLD.height /
                2,
            }}
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute z-[200] h-16 w-px bg-red-500"
            style={{
              left:
                CHAOS_WORLD.width /
                2,

              top:
                CHAOS_WORLD.height /
                  2 -
                32,
            }}
          />
        </>
      )}

      {/* ================================================ */}
      {/* SIGNALS                                          */}
      {/* ================================================ */}

      {chaosWorldSignals.map(
        (signal) => (
          <ChaosSignal
            key={
              signal.id
            }
            id={
              signal.id
            }
            kind={
              signal.kind
            }
            label={t(
              `items.${signal.labelKey}`,
            )}
            value={
              signal.value
            }
            variant={
              signal.variant
            }
            depth={
              signal.depth
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
            width={
              signal.width
            }
            rotation={
              signal.rotation
            }
            scale={
              signal.scale
            }
            revealBeat={
              signal.revealBeat
            }
            mobileHidden={
              signal.mobileHidden
            }
          />
        ),
      )}
    </div>
  );
}

type BackgroundWordProps = {
  text: string;

  x: number;
  y: number;

  rotation: number;
};

function BackgroundWord({
  text,
  x,
  y,
  rotation,
}: BackgroundWordProps) {
  return (
    <span
      aria-hidden="true"
      className="
        pointer-events-none
        absolute
        whitespace-nowrap
        text-[11rem]
        font-black
        leading-none
        tracking-[-0.09em]
        text-[#080A10]/[0.025]
      "
      style={{
        left: x,
        top: y,

        transform:
          `rotate(${rotation}deg)`,
      }}
    >
      {text}
    </span>
  );
}