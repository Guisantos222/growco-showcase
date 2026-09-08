"use client";

import {
  useEffect,
  useRef,
} from "react";

import {
  CHAOS_FINAL_ACT,
  CHAOS_TIMELINE as T,
} from "@/components/showcase/scenes/chaos/chaosTimeline";


import type {
  MutableRefObject,
  ReactNode,
} from "react";

import {
  gsap,
} from "gsap";

import {
  CHAOS_WORLD,
} from "@/components/showcase/scenes/chaos/chaosWorldData";

import {
  sampleChaosCameraPath,
  type ChaosCameraState,
} from "@/components/showcase/scenes/chaos/chaosCameraPath";


type ChaosCameraRigProps = {
  progressRef:
  MutableRefObject<number>;

  children:
  ReactNode;

  debug?: boolean;
};

export function ChaosCameraRig({
  progressRef,
  children,
  debug = false,
}: ChaosCameraRigProps) {
  const viewport =
    useRef<HTMLDivElement>(
      null,
    );

  const camera =
    useRef<HTMLDivElement>(
      null,
    );

  const currentState =
    useRef<ChaosCameraState | null>(
      null,
    );

  useEffect(() => {
    const viewportElement =
      viewport.current;

    const cameraElement =
      camera.current;

    if (
      !viewportElement ||
      !cameraElement
    ) {
      return;
    }

    /*
     * Criamos aliases não-nulos
     * para o TypeScript parar de
     * reclamar dentro do ticker.
     */
    const viewportNode:
      HTMLDivElement =
      viewportElement;

    const cameraNode:
      HTMLDivElement =
      cameraElement;

    /*
     * Estado inicial da câmera.
     */
    currentState.current =
      sampleChaosCameraPath(
        progressRef.current,
      );

    /*
     * Mais profundidade perceptiva.
     */

function updateCamera(
  time: number,
  deltaTime: number,
) {
 const progress =
  progressRef.current;

/*
 * Durante a sucção,
 * a câmera deixa de viajar.
 *
 * Toda energia visual deve
 * vir dos objetos entrando
 * no centro.
 */

/*
 * Depois da aproximação,
 * a câmera fica travada
 * no enquadramento final.
 *
 * A partir daqui quem assume
 * é ChaosFinalStage.
 */

const cameraProgress =
  Math.min(
    progress,
    CHAOS_FINAL_ACT
      .hotTopicsStart,
  );

const targetState =
  sampleChaosCameraPath(
    cameraProgress,
  );

  const current =
    currentState.current;

  /*
   * Caso excepcional:
   * inicializa o estado interno
   * antes de continuar.
   */
  if (!current) {
    currentState.current = {
      ...targetState,
    };

    return;
  }

  const dt =
    Math.min(
      deltaTime / 1000,
      0.05,
    );

  /*
   * ============================================================
   * DYNAMIC CAMERA ENERGY
   * ============================================================
   */

  const dropEnergy =
  createEnvelope(
    progress,
    T.lookDown,
    T.dropMid,
    T.recovery,
  );

 const impactEnergy =
  createEnvelope(
    progress,
    T.dropMid,
    T.impact,
    T.recovery,
  );

  /*
 * ============================================================
 * GRAVITY CAMERA ENERGY
 * ============================================================
 */

const gravityEnergy =
  smoothRange(
    progress,
    T.chaosMaximum,
    T.gravityLock,
  );

const gravityLock =
  smoothRange(
    progress,
    T.orbitMid,
    T.spaghettify,
  );

const collapseCameraSettle =
  smoothRange(
    progress,
    T.gravityLock,
    T.spaghettify,
  );

  /*
   * Durante a viagem normal
   * a câmera é mais pesada.
   *
   * Durante a queda,
   * responde mais rápido.
   */

  const positionDamping =
    mix(
      3.25,
      5.3,
      dropEnergy,
    );

  const scaleDamping =
    mix(
      3,
      5,
      dropEnergy,
    );

  const rotationDamping =
    mix(
      3.35,
      5.6,
      dropEnergy,
    );

  const zDamping =
    mix(
      3.1,
      5.4,
      dropEnergy,
    );

  const perspectiveDamping =
    mix(
      2.9,
      5,
      dropEnergy,
    );

  /*
   * ============================================================
   * CAMERA INERTIA
   * ============================================================
   */

  current.x =
    damp(
      current.x,
      targetState.x,
      positionDamping,
      dt,
    );

  current.y =
    damp(
      current.y,
      targetState.y,
      positionDamping,
      dt,
    );

  current.scale =
    damp(
      current.scale,
      targetState.scale,
      scaleDamping,
      dt,
    );

  current.rotationX =
    damp(
      current.rotationX,
      targetState.rotationX,
      rotationDamping,
      dt,
    );

  current.rotationY =
    damp(
      current.rotationY,
      targetState.rotationY,
      rotationDamping,
      dt,
    );

  current.rotationZ =
    damp(
      current.rotationZ,
      targetState.rotationZ,
      rotationDamping,
      dt,
    );

  current.z =
    damp(
      current.z,
      targetState.z,
      zDamping,
      dt,
    );

  current.perspective =
    damp(
      current.perspective,
      targetState.perspective,
      perspectiveDamping,
      dt,
    );

  /*
   * ============================================================
   * WORLD OFFSET
   * ============================================================
   */

  const baseOffsetX =
    CHAOS_WORLD.width /
      2 -
    current.x;

  const baseOffsetY =
    CHAOS_WORLD.height /
      2 -
    current.y;

  /*
   * ============================================================
   * DEPTH
   * ============================================================
   */

  const depthBoost =
    mix(
      1.55,
      1.9,
      dropEnergy,
    );

  const baseDepthZ =
    current.z *
    depthBoost;

  /*
   * ============================================================
   * IMPACT SHAKE
   * ============================================================
   *
   * Determinístico:
   * nenhum Math.random().
   */

  const shakeX =
    Math.sin(
      time * 52,
    ) *
    impactEnergy *
    9;

  const shakeY =
    Math.cos(
      time * 61,
    ) *
    impactEnergy *
    6;

  const shakeZ =
    Math.sin(
      time * 43,
    ) *
    impactEnergy *
    14;

  const shakeRoll =
    Math.sin(
      time * 48,
    ) *
    impactEnergy *
    0.75;

    /*
 * ============================================================
 * GRAVITY CAMERA DRIFT
 * ============================================================
 *
 * Movimento pequeno.
 *
 * O path principal continua
 * responsável pela câmera.
 */

/*
 * ============================================================
 * FINAL FOCUS SETTLE
 * ============================================================
 *
 * Conforme entramos no ato final,
 * a câmera perde o movimento
 * gravitacional residual.
 */

const finalFocusSettle =
  smoothRange(
    progress,
    CHAOS_FINAL_ACT
      .focusStart,
    CHAOS_FINAL_ACT
      .focusEnd,
  );

/*
 * ============================================================
 * GRAVITY CAMERA DRIFT
 * ============================================================
 */

const gravityCameraX =
  Math.sin(
    time * 0.42,
  ) *
  gravityEnergy *
  (
    18 -
    gravityLock * 10
  ) *
  (
    1 -
    finalFocusSettle
  );

const gravityCameraY =
  Math.cos(
    time * 0.36,
  ) *
  gravityEnergy *
  (
    12 -
    gravityLock * 7
  ) *
  (
    1 -
    finalFocusSettle
  );

const gravityCameraRoll =
  Math.sin(
    time * 0.31,
  ) *
  gravityEnergy *
  (
    0.85 -
    gravityLock * 0.55
  ) *
  (
    1 -
    finalFocusSettle
  );



  const offsetX =
  baseOffsetX +
  shakeX +
  gravityCameraX;

const offsetY =
  baseOffsetY +
  shakeY +
  gravityCameraY;

  const depthZ =
    baseDepthZ +
    shakeZ;

  /*
   * ============================================================
   * PERSPECTIVE ORIGIN
   * ============================================================
   */

  const perspectiveOriginX =
    clamp(
      50 +
        current.rotationY *
          0.7,
      42,
      58,
    );

  const perspectiveOriginY =
    clamp(
      50 +
        current.rotationX *
          0.55,
      43,
      69,
    );

  /*
   * ============================================================
   * APPLY CAMERA
   * ============================================================
   */

  cameraNode.style.transform = `
    translate3d(
      ${offsetX}px,
      ${offsetY}px,
      ${depthZ}px
    )

    rotateX(
      ${-current.rotationX}deg
    )

    rotateY(
      ${-current.rotationY}deg
    )

   rotateZ(
  ${
    -current.rotationZ +
    shakeRoll +
    gravityCameraRoll
  }deg
)

    scale(
      ${current.scale}
    )
  `;

  /*
   * IMPORTANTE:
   *
   * Estas linhas precisam ficar
   * DENTRO de updateCamera(),
   * porque usam "current".
   */

  viewportNode.style.perspective =
    `${current.perspective}px`;

  viewportNode.style.perspectiveOrigin =
    `${perspectiveOriginX}% ${perspectiveOriginY}%`;
}
    updateCamera(
      0,
      16,
    );

    gsap.ticker.add(
      updateCamera,
    );

    return () => {
      gsap.ticker.remove(
        updateCamera,
      );
    };
  }, [
    progressRef,
  ]);

  return (
    <div
      ref={viewport}
      data-chaos-camera-viewport
      className="
        absolute
        inset-0
        overflow-hidden
        [perspective:1800px]
        [perspective-origin:50%_50%]
      "
    >
      <div
        ref={camera}
        data-chaos-camera
        className="
          absolute
          inset-0
          origin-center
          [transform-style:preserve-3d]
          will-change-transform
        "
      >
        {children}
      </div>

      {debug && (
        <>
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              left-1/2
              top-0
              z-[300]
              h-full
              w-px
              -translate-x-1/2
              bg-red-500/30
            "
          />

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              left-0
              top-1/2
              z-[300]
              h-px
              w-full
              -translate-y-1/2
              bg-red-500/30
            "
          />

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              z-[301]
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              border
              border-red-500/50
              bg-black/80
              px-3
              py-1.5
              font-mono
              text-[9px]
              uppercase
              tracking-[0.18em]
              text-white
            "
          >
            Camera
          </div>
        </>
      )}
    </div>
  );
}

function damp(
  current: number,
  target: number,
  lambda: number,
  deltaTime: number,
) {
  return current + (
    target - current
  ) * (
      1 -
      Math.exp(
        -lambda * deltaTime,
      )
    );
}

function mix(
  start: number,
  end: number,
  progress: number,
) {
  return (
    start +
    (
      end -
      start
    ) *
      progress
  );
}

function clamp(
  value: number,
  min: number,
  max: number,
) {
  return Math.min(
    max,
    Math.max(
      min,
      value,
    ),
  );
}

/*
 * Gera:
 *
 * 0 → 1 → 0
 *
 * dentro de uma janela
 * específica de progress.
 */

function createEnvelope(
  progress: number,
  start: number,
  peak: number,
  end: number,
) {
  if (
    progress <= start ||
    progress >= end
  ) {
    return 0;
  }

  if (
    progress <= peak
  ) {
    return smoothstep(
      (
        progress -
        start
      ) /
        (
          peak -
          start
        ),
    );
  }

  return (
    1 -
    smoothstep(
      (
        progress -
        peak
      ) /
        (
          end -
          peak
        ),
    )
  );
}

function smoothstep(
  value: number,
) {
  const t =
    clamp(
      value,
      0,
      1,
    );

  return (
    t *
    t *
    (
      3 -
      2 * t
    )
  );
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