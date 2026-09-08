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
  sampleChaosCameraPath,
} from "@/components/showcase/scenes/chaos/chaosCameraPath";

type ChaosCameraDebugProps = {
  progressRef:
    MutableRefObject<number>;

  visible?: boolean;
};

export function ChaosCameraDebug({
  progressRef,
  visible = false,
}: ChaosCameraDebugProps) {
  const output =
    useRef<HTMLPreElement>(
      null,
    );

  useEffect(() => {
    if (
      !visible
    ) {
      return;
    }

    function update() {
      if (
        !output.current
      ) {
        return;
      }

      const progress =
        progressRef.current;

      const camera =
        sampleChaosCameraPath(
          progress,
        );

      output.current.textContent = [
        `progress ${format(
          progress,
          3,
        )}`,

        ``,

        `x       ${format(
          camera.x,
          0,
        )}`,

        `y       ${format(
          camera.y,
          0,
        )}`,

        `z       ${format(
          camera.z,
          0,
        )}`,

        ``,

        `scale   ${format(
          camera.scale,
          3,
        )}`,

        ``,

        `rotX    ${format(
          camera.rotationX,
          2,
        )}`,

        `rotY    ${format(
          camera.rotationY,
          2,
        )}`,

        `rotZ    ${format(
          camera.rotationZ,
          2,
        )}`,

        ``,

        `persp   ${format(
          camera.perspective,
          0,
        )}`,
      ].join(
        "\n",
      );
    }

    gsap.ticker.add(
      update,
    );

    update();

    return () => {
      gsap.ticker.remove(
        update,
      );
    };
  }, [
    progressRef,
    visible,
  ]);

  if (
    !visible
  ) {
    return null;
  }

  return (
    <pre
      ref={output}
      aria-hidden="true"
      className="
        pointer-events-none
        absolute
        left-5
        top-24
        z-[200]
        rounded-xl
        border
        border-white/10
        bg-black/80
        p-4
        font-mono
        text-[9px]
        leading-relaxed
        text-white/60
        backdrop-blur-xl
      "
    />
  );
}

function format(
  value: number,
  decimals: number,
) {
  return value.toFixed(
    decimals,
  );
}