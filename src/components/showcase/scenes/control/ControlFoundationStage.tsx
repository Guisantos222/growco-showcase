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
  ControlCameraRig,
} from "@/components/showcase/scenes/control/ControlCameraRig";

import {
  ControlTunnel,
} from "@/components/showcase/scenes/control/ControlTunnel";

type ControlFoundationStageProps = {
  progressRef: MutableRefObject<number>;
  reducedMotion?: boolean;
};

export function ControlFoundationStage({
  progressRef,
  reducedMotion = false,
}: ControlFoundationStageProps) {
  const ceilingRef =
    useRef<HTMLDivElement>(
      null,
    );

  const floorRef =
    useRef<HTMLDivElement>(
      null,
    );

  const leftShadowRef =
    useRef<HTMLDivElement>(
      null,
    );

  const rightShadowRef =
    useRef<HTMLDivElement>(
      null,
    );

  const fogRef =
    useRef<HTMLDivElement>(
      null,
    );

  useEffect(() => {
    const ceiling =
      ceilingRef.current;

    const floor =
      floorRef.current;

    const leftShadow =
      leftShadowRef.current;

    const rightShadow =
      rightShadowRef.current;

    const fog =
      fogRef.current;

    if (
      !ceiling ||
      !floor ||
      !leftShadow ||
      !rightShadow ||
      !fog
    ) {
      return;
    }

    const update = () => {
      const progress =
        clamp01(
          progressRef.current,
        );

      const entrance =
        smootherstep(
          smoothRange(
            progress,
            0,
            0.13,
          ),
        );

      const travel =
        smootherstep(
          smoothRange(
            progress,
            0.04,
            0.5,
          ),
        );

      ceiling.style.opacity =
        `${0.18 + entrance * 0.42}`;

      floor.style.opacity =
        `${0.28 + entrance * 0.36}`;

      const sway =
        reducedMotion
          ? 0
          : Math.sin(
              progress *
                Math.PI *
                7,
            ) *
            2.4;

      leftShadow.style.transform = `
        translate3d(
          ${sway}px,
          0,
          0
        )
      `;

      rightShadow.style.transform = `
        translate3d(
          ${-sway}px,
          0,
          0
        )
      `;

      fog.style.opacity =
        `${0.14 + travel * 0.23}`;

      fog.style.transform = `
        translate3d(
          -50%,
          -50%,
          0
        )
        scale(
          ${mix(
            0.82,
            1.14,
            travel,
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
      className="
        absolute
        inset-0
        overflow-hidden
        bg-[#070B10]
        [perspective:900px]
        [perspective-origin:50%_48%]
        [transform-style:preserve-3d]
      "
    >
      {/*
       * Base atmosphere.
       */}
      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(ellipse_at_50%_46%,rgba(19,35,48,0.74)_0%,rgba(9,15,21,0.98)_42%,rgba(4,7,11,1)_78%,rgba(2,4,7,1)_100%)]
        "
      />

      {/*
       * Ceiling light.
       * Narrower at the vanishing point.
       */}
      <div
        ref={ceilingRef}
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[-8%]
          h-[55%]
          w-[82%]
          -translate-x-1/2
          opacity-20
          [clip-path:polygon(4%_0,96%_0,60%_100%,40%_100%)]
          bg-[linear-gradient(to_bottom,rgba(96,196,255,0.17),rgba(11,165,255,0.055)_44%,transparent_100%)]
          blur-[10px]
          mix-blend-screen
          will-change-opacity
        "
      />

      {/*
       * Floor shadow/reflection.
       */}
      <div
        ref={floorRef}
        className="
          pointer-events-none
          absolute
          bottom-[-12%]
          left-1/2
          h-[62%]
          w-[92%]
          -translate-x-1/2
          opacity-30
          [clip-path:polygon(38%_0,62%_0,100%_100%,0_100%)]
          bg-[linear-gradient(to_bottom,rgba(11,165,255,0.045),rgba(0,0,0,0.18)_45%,rgba(0,0,0,0.72)_100%)]
          blur-[8px]
          will-change-opacity
        "
      />

      {/*
       * Side occlusion.
       */}
      <div
        ref={leftShadowRef}
        className="
          pointer-events-none
          absolute
          inset-y-0
          left-0
          w-[34%]
          bg-[linear-gradient(to_right,rgba(0,0,0,0.82),rgba(0,0,0,0.30)_52%,transparent)]
          will-change-transform
        "
      />

      <div
        ref={rightShadowRef}
        className="
          pointer-events-none
          absolute
          inset-y-0
          right-0
          w-[34%]
          bg-[linear-gradient(to_left,rgba(0,0,0,0.82),rgba(0,0,0,0.30)_52%,transparent)]
          will-change-transform
        "
      />

      {/*
       * Center haze makes the vanishing point readable.
       */}
      <div
        ref={fogRef}
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[48%]
          h-[44vh]
          w-[min(58vw,760px)]
          rounded-[50%]
          bg-[radial-gradient(ellipse_at_center,rgba(103,205,255,0.14)_0%,rgba(11,165,255,0.055)_34%,transparent_72%)]
          opacity-15
          blur-[30px]
          mix-blend-screen
          will-change-[transform,opacity]
        "
      />

      <ControlCameraRig
        progressRef={progressRef}
        reducedMotion={reducedMotion}
      >
        <ControlTunnel
          progressRef={progressRef}
          reducedMotion={reducedMotion}
        />
      </ControlCameraRig>

      {/*
       * Final vignette creates wall depth instead of a flat black background.
       */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.14)_58%,rgba(0,0,0,0.66)_100%)]
        "
      />

      {/*
       * Very subtle upper/lower film shadow.
       */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[linear-gradient(to_bottom,rgba(0,0,0,0.34),transparent_18%,transparent_76%,rgba(0,0,0,0.52))]
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
  const t =
    clamp01(value);

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
