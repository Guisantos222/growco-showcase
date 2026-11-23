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
  CONTROL_DEPTH_PER_SCENE,
  CONTROL_SCENE,
  CONTROL_SCENE_COUNT,
  controlPoint,
} from "@/components/showcase/scenes/control/controlTimeline";

type ControlTunnelProps = {
  progressRef:
    MutableRefObject<number>;

  reducedMotion?: boolean;
};

const FRAME_COUNT =
  CONTROL_SCENE_COUNT +
  8;

const FRAME_START_Z =
  -900;

export function ControlTunnel({
  progressRef,
  reducedMotion = false,
}: ControlTunnelProps) {
  const shellRef =
    useRef<HTMLDivElement>(
      null,
    );

  const guideLineRef =
    useRef<HTMLDivElement>(
      null,
    );

  useEffect(() => {
    const shell =
      shellRef.current;

    const guideLine =
      guideLineRef.current;

    if (
      !shell ||
      !guideLine
    ) {
      return;
    }

    const update = (
      time: number,
    ) => {
      const progress =
        progressRef.current;

      const birth =
        smootherstep(
          smoothRange(
            progress,
            controlPoint(
              CONTROL_SCENE.portal,
              0.35,
            ),
            controlPoint(
              CONTROL_SCENE.tunnelBirth,
              0.8,
            ),
          ),
        );

      shell.style.opacity =
        `${birth}`;

      const lineReveal =
        smootherstep(
          smoothRange(
            progress,
            controlPoint(
              CONTROL_SCENE.activation,
              0.32,
            ),
            controlPoint(
              CONTROL_SCENE.salesArrival,
              0.3,
            ),
          ),
        );

      guideLine.style.opacity =
        `${lineReveal}`;

      guideLine.style.transform = `
        translate3d(
          -50%,
          0,
          0
        )
        scaleX(
          ${lineReveal}
        )
      `;

      if (
        !reducedMotion
      ) {
        const pulse =
          0.84 +
          Math.sin(
            time *
            1.2,
          ) *
            0.08;

        guideLine.style.setProperty(
          "--control-line-pulse",
          `${pulse}`,
        );
      }
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
      ref={shellRef}
      className="
        absolute
        inset-0
        opacity-0
        [transform-style:preserve-3d]
      "
    >
      {Array.from({
        length:
          FRAME_COUNT,
      }).map(
        (
          _,
          index,
        ) => {
          const z =
            FRAME_START_Z -
            index *
              CONTROL_DEPTH_PER_SCENE;

          const major =
            index % 4 === 0;

          return (
            <div
              key={
                `control-frame-${index}`
              }
              className={`
                absolute
                left-1/2
                top-1/2
                h-[min(64vh,650px)]
                w-[min(78vw,1040px)]
                border
                [transform-style:preserve-3d]

                ${
                  major
                    ? "border-[#0BA5FF]/26"
                    : "border-[#111820]/10"
                }
              `}
              style={{
                transform: `
                  translate3d(
                    -50%,
                    -50%,
                    ${z}px
                  )
                `,
              }}
            >
              <FrameCorner
                position="top-left"
                active={
                  major
                }
              />

              <FrameCorner
                position="top-right"
                active={
                  major
                }
              />

              <FrameCorner
                position="bottom-left"
                active={
                  major
                }
              />

              <FrameCorner
                position="bottom-right"
                active={
                  major
                }
              />

              {major ? (
                <span
                  className="
                    absolute
                    left-5
                    top-4
                    font-mono
                    text-[9px]
                    font-bold
                    tracking-[0.18em]
                    text-[#0BA5FF]/48
                  "
                >
                  {String(
                    index + 1,
                  ).padStart(
                    2,
                    "0",
                  )}
                </span>
              ) : null}
            </div>
          );
        },
      )}

      {/*
       * Linha-base.
       *
       * Nesta primeira foundation ela serve
       * como a trilha que nasce da growCo.
       * O sistema de seis linhas vem depois.
       */}

      <div
        ref={guideLineRef}
        className="
          absolute
          left-1/2
          top-[18%]
          z-[5]
          h-[3px]
          w-[min(64vw,840px)]
          origin-left
          rounded-full
          bg-[#0BA5FF]
          opacity-0
          shadow-[0_0_18px_rgba(11,165,255,0.18)]
          will-change-[transform,opacity]
          [opacity:var(--control-line-pulse,1)]
        "
      />

      {/*
       * Vanishing rails.
       *
       * São discretos e só existem para
       * reforçar a leitura espacial.
       */}

      <div
        className="
          absolute
          left-[20%]
          top-[18%]
          h-[1px]
          w-[60%]
          bg-gradient-to-r
          from-transparent
          via-[#0B1017]/12
          to-transparent
        "
      />

      <div
        className="
          absolute
          bottom-[18%]
          left-[20%]
          h-[1px]
          w-[60%]
          bg-gradient-to-r
          from-transparent
          via-[#0B1017]/10
          to-transparent
        "
      />
    </div>
  );
}

type FrameCornerProps = {
  position:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";

  active:
    boolean;
};

function FrameCorner({
  position,
  active,
}: FrameCornerProps) {
  const placement =
    position ===
    "top-left"
      ? "left-[-1px] top-[-1px]"
      : position ===
          "top-right"
        ? "right-[-1px] top-[-1px]"
        : position ===
            "bottom-left"
          ? "bottom-[-1px] left-[-1px]"
          : "bottom-[-1px] right-[-1px]";

  return (
    <span
      className={`
        absolute
        h-3
        w-3
        border-[#0BA5FF]

        ${placement}

        ${
          position.includes(
            "top",
          )
            ? "border-t"
            : "border-b"
        }

        ${
          position.includes(
            "left",
          )
            ? "border-l"
            : "border-r"
        }

        ${
          active
            ? "opacity-80"
            : "opacity-20"
        }
      `}
    />
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
