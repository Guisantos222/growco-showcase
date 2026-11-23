"use client";

import {
  useEffect,
  useRef,
} from "react";

import type {
  MutableRefObject,
  ReactNode,
} from "react";

import {
  gsap,
} from "gsap";

import {
  CONTROL_SCENE,
  controlPoint,
} from "@/components/showcase/scenes/control/controlTimeline";

type ControlTunnelRevealProps = {
  progressRef: MutableRefObject<number>;
  reducedMotion?: boolean;
  children: ReactNode;
};

export function ControlTunnelReveal({
  progressRef,
  reducedMotion = false,
  children,
}: ControlTunnelRevealProps) {
  const rootRef =
    useRef<HTMLDivElement>(
      null,
    );

  const veilRef =
    useRef<HTMLDivElement>(
      null,
    );

  const centerLightRef =
    useRef<HTMLDivElement>(
      null,
    );

  useEffect(() => {
    const root =
      rootRef.current;

    const veil =
      veilRef.current;

    const centerLight =
      centerLightRef.current;

    if (
      !root ||
      !veil ||
      !centerLight
    ) {
      return;
    }

    const update = () => {
      const progress =
        clamp01(
          progressRef.current,
        );

      /*
       * O túnel começa antes do fim completo da poeira.
       * Isso elimina a sensação de "esperar outra cena carregar".
       */
      const reveal =
        smootherstep(
          smoothRange(
            progress,
            controlPoint(
              CONTROL_SCENE.activation,
              0.58,
            ),
            controlPoint(
              CONTROL_SCENE.portal,
              0.22,
            ),
          ),
        );

      const lightUp =
        smootherstep(
          smoothRange(
            reveal,
            0.08,
            0.78,
          ),
        );

      root.style.visibility =
        reveal <= 0.001
          ? "hidden"
          : "visible";

      root.style.opacity =
        `${reveal}`;

      root.style.transform = `
        scale(
          ${
            reducedMotion
              ? 1
              : mix(
                  1.045,
                  1,
                  reveal,
                )
          }
        )
      `;

      root.style.filter =
        `blur(${
          reducedMotion
            ? 0
            : mix(
                7,
                0,
                reveal,
              )
        }px)`;

      veil.style.opacity =
        `${mix(
          0.92,
          0,
          reveal,
        )}`;

      centerLight.style.opacity =
        `${0.12 + lightUp * 0.58}`;

      centerLight.style.transform = `
        translate3d(
          -50%,
          -50%,
          0
        )
        scale(
          ${mix(
            0.62,
            1.35,
            lightUp,
          )}
        )
      `;
    };

    gsap.ticker.add(update);
    update();

    return () => {
      gsap.ticker.remove(update);
    };
  }, [
    progressRef,
    reducedMotion,
  ]);

  return (
    <div
      ref={rootRef}
      className="
        absolute
        inset-0
        z-[20]
        invisible
        overflow-hidden
        bg-[#0A0F14]
        opacity-0
        will-change-[transform,opacity,filter]
      "
    >
      {children}

      <div
        ref={centerLightRef}
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[46%]
          z-[4]
          h-[54vh]
          w-[min(74vw,980px)]
          rounded-[50%]
          bg-[radial-gradient(ellipse_at_center,rgba(110,205,255,0.18)_0%,rgba(11,165,255,0.08)_28%,rgba(11,165,255,0)_72%)]
          opacity-0
          mix-blend-screen
          blur-[22px]
          will-change-[transform,opacity]
        "
      />

      <div
        ref={veilRef}
        className="
          pointer-events-none
          absolute
          inset-0
          z-[5]
          bg-[#0A0F14]
          opacity-95
          will-change-opacity
        "
      />
    </div>
  );
}

function mix(
  start: number,
  end: number,
  amount: number,
) {
  return (
    start +
    (end - start) *
      amount
  );
}

function smoothRange(
  value: number,
  start: number,
  end: number,
) {
  if (value <= start) {
    return 0;
  }

  if (value >= end) {
    return 1;
  }

  return (
    (value - start) /
    (end - start)
  );
}

function smootherstep(
  value: number,
) {
  const t = clamp01(value);

  return (
    t *
    t *
    t *
    (
      t *
      (
        t * 6 - 15
      ) +
      10
    )
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
