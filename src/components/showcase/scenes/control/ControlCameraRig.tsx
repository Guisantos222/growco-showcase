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
  CONTROL_TRAVEL_DEPTH,
  controlPoint,
} from "@/components/showcase/scenes/control/controlTimeline";

type ControlCameraRigProps = {
  progressRef:
    MutableRefObject<number>;

  reducedMotion?: boolean;

  children:
    ReactNode;
};

type CameraPose = {
  x: number;
  y: number;
  yaw: number;
  pitch: number;
  roll: number;
};

const CAMERA_KEYFRAMES = [
  {
    progress:
      controlPoint(
        CONTROL_SCENE.tunnelBirth,
        0,
      ),
    x: 0,
    y: 0,
    yaw: 0,
    pitch: 0,
    roll: 0,
  },
  {
    progress:
      controlPoint(
        CONTROL_SCENE.salesPass,
        0.5,
      ),
    x: -86,
    y: 20,
    yaw: -2.7,
    pitch: 0.6,
    roll: -0.4,
  },
  {
    progress:
      controlPoint(
        CONTROL_SCENE.stockConnection,
        0.5,
      ),
    x: 94,
    y: -12,
    yaw: 3.2,
    pitch: -0.5,
    roll: 0.5,
  },
  {
    progress:
      controlPoint(
        CONTROL_SCENE.financeConnection,
        0.5,
      ),
    x: -72,
    y: 24,
    yaw: -2.5,
    pitch: 0.7,
    roll: -0.35,
  },
  {
    progress:
      controlPoint(
        CONTROL_SCENE.peopleConnection,
        0.5,
      ),
    x: 84,
    y: -20,
    yaw: 2.8,
    pitch: -0.6,
    roll: 0.35,
  },
  {
    progress:
      controlPoint(
        CONTROL_SCENE.goalsConnection,
        0.5,
      ),
    x: -68,
    y: 14,
    yaw: -2.2,
    pitch: 0.4,
    roll: -0.3,
  },
  {
    progress:
      controlPoint(
        CONTROL_SCENE.interpretation,
        0.5,
      ),
    x: 58,
    y: -14,
    yaw: 1.8,
    pitch: -0.35,
    roll: 0.25,
  },
  {
    progress:
      controlPoint(
        CONTROL_SCENE.fullVelocity,
        0.65,
      ),
    x: 0,
    y: 0,
    yaw: 0,
    pitch: 0,
    roll: 0,
  },
  {
    progress: 1,
    x: 0,
    y: 0,
    yaw: 0,
    pitch: 0,
    roll: 0,
  },
] as const;

export function ControlCameraRig({
  progressRef,
  reducedMotion = false,
  children,
}: ControlCameraRigProps) {
  const worldRef =
    useRef<HTMLDivElement>(
      null,
    );

  useEffect(() => {
    const world =
      worldRef.current;

    if (!world) {
      return;
    }

    let currentX = 0;
    let currentY = 0;
    let currentYaw = 0;
    let currentPitch = 0;
    let currentRoll = 0;
    let currentZ = 0;

    const update = () => {
      const progress =
        Math.min(
          1,
          Math.max(
            0,
            progressRef.current,
          ),
        );

      const pose =
        sampleCameraPose(
          progress,
        );

      const targetZ =
        progress *
        CONTROL_TRAVEL_DEPTH;

      const damping =
        reducedMotion
          ? 1
          : 0.085;

      currentX =
        mix(
          currentX,
          pose.x,
          damping,
        );

      currentY =
        mix(
          currentY,
          pose.y,
          damping,
        );

      currentYaw =
        mix(
          currentYaw,
          pose.yaw,
          damping,
        );

      currentPitch =
        mix(
          currentPitch,
          pose.pitch,
          damping,
        );

      currentRoll =
        mix(
          currentRoll,
          pose.roll,
          damping,
        );

      currentZ =
        mix(
          currentZ,
          targetZ,
          reducedMotion
            ? 1
            : 0.11,
        );

      world.style.transform = `
        translate3d(
          ${-currentX}px,
          ${-currentY}px,
          ${currentZ}px
        )
        rotateX(
          ${-currentPitch}deg
        )
        rotateY(
          ${-currentYaw}deg
        )
        rotateZ(
          ${-currentRoll}deg
        )
      `;
    };

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
    reducedMotion,
  ]);

  return (
    <div
      className="
        absolute
        inset-0
        [transform-style:preserve-3d]
      "
    >
      <div
        ref={worldRef}
        className="
          absolute
          inset-0
          [transform-origin:50%_50%]
          [transform-style:preserve-3d]
          will-change-transform
        "
      >
        {children}
      </div>
    </div>
  );
}

function sampleCameraPose(
  progress: number,
): CameraPose {
  const first =
    CAMERA_KEYFRAMES[0];

  if (
    progress <=
    first.progress
  ) {
    return {
      x: first.x,
      y: first.y,
      yaw: first.yaw,
      pitch: first.pitch,
      roll: first.roll,
    };
  }

  for (
    let index = 0;
    index <
    CAMERA_KEYFRAMES.length -
      1;
    index += 1
  ) {
    const current =
      CAMERA_KEYFRAMES[
        index
      ];

    const next =
      CAMERA_KEYFRAMES[
        index + 1
      ];

    if (
      progress >
      next.progress
    ) {
      continue;
    }

    const local =
      smootherstep(
        range(
          progress,
          current.progress,
          next.progress,
        ),
      );

    return {
      x:
        mix(
          current.x,
          next.x,
          local,
        ),

      y:
        mix(
          current.y,
          next.y,
          local,
        ),

      yaw:
        mix(
          current.yaw,
          next.yaw,
          local,
        ),

      pitch:
        mix(
          current.pitch,
          next.pitch,
          local,
        ),

      roll:
        mix(
          current.roll,
          next.roll,
          local,
        ),
    };
  }

  const last =
    CAMERA_KEYFRAMES[
      CAMERA_KEYFRAMES.length -
        1
    ];

  return {
    x: last.x,
    y: last.y,
    yaw: last.yaw,
    pitch: last.pitch,
    roll: last.roll,
  };
}

function mix(
  start: number,
  end: number,
  amount: number,
) {
  return (
    start +
    (
      end -
      start
    ) *
      amount
  );
}

function range(
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
