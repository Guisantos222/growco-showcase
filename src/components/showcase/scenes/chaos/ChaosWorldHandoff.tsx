"use client";

import {
  useEffect,
} from "react";

import type {
  MutableRefObject,
  RefObject,
} from "react";

import {
  gsap,
} from "gsap";

import {
  CHAOS_TIMELINE as T,
} from "@/components/showcase/scenes/chaos/chaosTimeline";

type ChaosWorldHandoffProps = {
  progressRef:
    MutableRefObject<number>;

  stageRef:
    RefObject<HTMLElement | null>;
};

export function ChaosWorldHandoff({
  progressRef,
  stageRef,
}: ChaosWorldHandoffProps) {
  useEffect(() => {
    const stage =
      stageRef.current;

    if (!stage) {
      return;
    }

    const heavyWorld =
      stage.querySelector<HTMLElement>(
        "[data-chaos-heavy-world]",
      );

    if (
      !heavyWorld
    ) {
      return;
    }

    function update() {
        const stage =
      stageRef.current;

    if (!stage) {
      return;
    }
        
    const heavyWorld =
      stage.querySelector<HTMLElement>(
        "[data-chaos-heavy-world]",
      );

    if (
      !heavyWorld
    ) {
      return;
    }
      const progress =
        progressRef.current;

      /*
       * Até Chaos Maximum:
       * mundo normal.
       */

      const fade =
        smoothRange(
          progress,
          T.orbitStart,
          T.gravityLock,
        );

      heavyWorld.style.opacity =
        `${
          1 -
          fade
        }`;

      /*
       * Quando já desapareceu,
       * desligamos completamente
       * hit/render compositing.
       */

      if (
        fade >=
        0.999
      ) {
        heavyWorld.style.visibility =
          "hidden";
      } else {
        heavyWorld.style.visibility =
          "visible";
      }
    }

    gsap.ticker.add(
      update,
    );

    update();

    return () => {
      gsap.ticker.remove(
        update,
      );

      heavyWorld.style.opacity =
        "1";

      heavyWorld.style.visibility =
        "visible";
    };
  }, [
    progressRef,
    stageRef,
  ]);

  return null;
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