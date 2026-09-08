"use client";

import {
  useEffect,
  useRef,
} from "react";

import {
  gsap,
} from "gsap";

import type {
  MutableRefObject,
} from "react";

import type {
  SceneMarker,
} from "@/experience/director/sceneMarkers";

type ExperienceProgressProps = {
  sceneLabel: string;

  markers:
    readonly SceneMarker[];

  progressRef:
    MutableRefObject<number>;

  activeMarkerIndex:
    number;

  visible:
    boolean;
};

export function ExperienceProgress({
  sceneLabel,
  markers,
  progressRef,
  activeMarkerIndex,
  visible,
}: ExperienceProgressProps) {
  const fill =
    useRef<HTMLDivElement>(
      null,
    );

  const percentage =
    useRef<HTMLSpanElement>(
      null,
    );

  useEffect(() => {
    function update() {
      const progress =
        Math.min(
          1,
          Math.max(
            0,
            progressRef.current,
          ),
        );

      if (
        fill.current
      ) {
        gsap.set(
          fill.current,
          {
            scaleX:
              progress,
          },
        );
      }

      if (
        percentage.current
      ) {
        percentage.current.textContent =
          `${Math.round(
            progress * 100,
          )}%`;
      }
    }

    gsap.ticker.add(
      update,
    );

    return () => {
      gsap.ticker.remove(
        update,
      );
    };
  }, [
    progressRef,
  ]);

  const activeMarker =
    markers[
      activeMarkerIndex
    ];

  return (
    <aside
      aria-hidden="true"
      className={`
        pointer-events-none
        absolute
        bottom-6
        left-1/2
        z-[90]
        w-[calc(100%-2rem)]
        max-w-4xl
        -translate-x-1/2
        transition-opacity
        duration-300
        md:bottom-8

        ${
          visible
            ? "opacity-100"
            : "opacity-0"
        }
      `}
    >
      <div className="rounded-[1.25rem] border border-white/10 bg-black/70 px-4 py-3 text-white shadow-2xl backdrop-blur-xl md:px-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#0BA5FF]">
              {sceneLabel}
            </span>

            <span className="truncate text-[10px] uppercase tracking-[0.16em] text-white/45">
              {
                activeMarker
                  ?.label
              }
            </span>
          </div>

          <span
            ref={
              percentage
            }
            className="font-mono text-[9px] tabular-nums text-white/35"
          >
            0%
          </span>
        </div>

        <div className="relative mt-3 h-px bg-white/15">
          <div
            ref={fill}
            className="absolute inset-y-0 left-0 w-full origin-left scale-x-0 bg-[#0BA5FF]"
          />

          {markers.map(
            (
              marker,
              index,
            ) => (
              <span
                key={
                  marker.id
                }
                className={`
                  absolute
                  top-1/2
                  h-2
                  w-2
                  -translate-x-1/2
                  -translate-y-1/2
                  rounded-full
                  border

                  ${
                    index <=
                    activeMarkerIndex
                      ? "border-[#0BA5FF] bg-[#0BA5FF]"
                      : "border-white/25 bg-[#080A10]"
                  }
                `}
                style={{
                  left:
                    `${marker.progress * 100}%`,
                }}
              />
            ),
          )}
        </div>
      </div>
    </aside>
  );
}