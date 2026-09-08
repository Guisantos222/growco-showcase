
import {
  CHAOS_FINAL_ACT,
  CHAOS_SCENE,
  CHAOS_TIMELINE as T,
  chaosPoint,
} from "@/components/showcase/scenes/chaos/chaosTimeline";
export type ChaosCameraState = {
  x: number;
  y: number;

  /*
   * Zoom perceptivo.
   *
   * > 1 aproxima.
   * < 1 afasta.
   */
  scale: number;

  /*
   * Rotação no plano da tela.
   */
  rotationZ: number;

  /*
   * Inclinações 3D.
   *
   * Nesta Parte 3A ficaremos
   * bem conservadores com elas.
   *
   * Na Parte 3B elas se tornam
   * muito mais importantes.
   */
  rotationX: number;
  rotationY: number;

  /*
   * Move o mundo ao longo
   * do eixo Z.
   */
  z: number;

  /*
   * Intensidade de perspectiva.
   */
  perspective: number;
};

export type ChaosCameraKeyframe = {
  id: string;

  progress: number;

  state:
    ChaosCameraState;

  /*
   * Curva aplicada entre
   * este frame e o próximo.
   */
  ease:
    | "linear"
    | "smooth"
    | "cinematic"
    | "accelerate"
    | "decelerate";
};

/*
 * ============================================================
 * CAMERA PATH
 * ============================================================
 *
 * O scroll continua descendo.
 *
 * A câmera, porém, viaja
 * horizontalmente, verticalmente
 * e em profundidade.
 */

export const CHAOS_CAMERA_PATH:
  readonly ChaosCameraKeyframe[] = [
  /*
   * ==========================================================
   * ACT I — AWAKENING
   * ==========================================================
   */

  {
    id: "entry",

    progress: T.entry,

    state: {
      x: 1600,
      y: 1100,

      scale: 1.02,

      rotationZ: 0,
      rotationX: 0,
      rotationY: 0,

      z: 0,

      perspective: 1650,
    },

    ease: "smooth",
  },

  {
    id: "drift-in",

    progress: T.movement,

    state: {
      x: 1560,
      y: 1070,

      scale: 1.055,

      rotationZ: -0.15,
      rotationX: 0.15,
      rotationY: -0.6,

      z: 15,

      perspective: 1600,
    },

    ease: "cinematic",
  },

  {
    id: "first-signal",

    progress: T.firstSignal,

    state: {
      x: 1430,
      y: 1010,

      scale: 1.16,

      rotationZ: -0.7,
      rotationX: 0.6,
      rotationY: -2.8,

      z: 75,

      perspective: 1400,
    },

    ease: "cinematic",
  },

  {
    id: "signal-follow",

    progress: T.signals,

    state: {
      x: 1720,
      y: 930,

      scale: 1.14,

      rotationZ: 0.15,
      rotationX: 0.8,
      rotationY: -3.5,

      z: 90,

      perspective: 1320,
    },

    ease: "cinematic",
  },

  /*
   * ==========================================================
   * ACT II — RIGHT TRAVEL
   * ==========================================================
   */

  {
    id: "right-corridor",

    progress: T.rightCorridor,

    state: {
      x: 2170,
      y: 825,

      scale: 1.09,

      rotationZ: 0.8,
      rotationX: 1,
      rotationY: -5.2,

      z: 75,

      perspective: 1200,
    },

    ease: "cinematic",
  },

  {
    id: "right-depth",

    progress: T.rightDepth,

    state: {
      x: 2480,
      y: 760,

      scale: 1.04,

      rotationZ: 1.25,
      rotationX: 1.1,
      rotationY: -6.3,

      z: 55,

      perspective: 1140,
    },

    ease: "cinematic",
  },

  {
    id: "right-edge",

    progress: T.rightEdge,

    state: {
      x: 2810,
      y: 710,

      scale: 0.97,

      rotationZ: 1.8,
      rotationX: 1.3,
      rotationY: -7.8,

      z: 15,

      perspective: 1060,
    },

    ease: "decelerate",
  },

  /*
   * ==========================================================
   * ACT III — GIANT SWING
   * ==========================================================
   */

  {
    id: "curve-entry",

    progress: T.curveEntry,

    state: {
      x: 2460,
      y: 920,

      scale: 0.95,

      rotationZ: 0.5,
      rotationX: 1.8,
      rotationY: -2,

      z: -15,

      perspective: 1040,
    },

    ease: "smooth",
  },

  {
    id: "swing-left",

    progress: T.swing,

    state: {
      x: 980,
      y: 1450,

      scale: 0.87,

      rotationZ: -3.1,
      rotationX: 2.3,
      rotationY: 5.8,

      z: -70,

      perspective: 970,
    },

    ease: "cinematic",
  },

  {
    id: "left-depth",

    progress: T.leftDepth,

    state: {
      x: 650,
      y: 1350,

      scale: 0.81,

      rotationZ: -2.6,
      rotationX: 2.5,
      rotationY: 6.5,

      z: -105,

      perspective: 930,
    },

    ease: "decelerate",
  },

  /*
   * ==========================================================
   * ACT IV — RISE
   * ==========================================================
   */

  {
    id: "rise-entry",

    progress: T.riseEntry,

    state: {
      x: 920,
      y: 1020,

      scale: 0.78,

      rotationZ: -1.4,
      rotationX: 3,
      rotationY: 4,

      z: -120,

      perspective: 910,
    },

    ease: "cinematic",
  },

  {
    id: "rise",

    progress: T.rise,

    state: {
      x: 1620,
      y: 320,

      scale: 0.7,

      rotationZ: 1.6,
      rotationX: 4.5,
      rotationY: -2,

      z: -165,

      perspective: 880,
    },

    ease: "decelerate",
  },

  {
    id: "high-pass",

    progress: T.highPass,

    state: {
      x: 1980,
      y: 400,

      scale: 0.61,

      rotationZ: 1,
      rotationX: 5,
      rotationY: -1,

      z: -220,

      perspective: 860,
    },

    ease: "cinematic",
  },

  /*
   * ==========================================================
   * ACT V — OVERVIEW
   * ==========================================================
   */

  {
    id: "overview",

    progress: T.overview,

    state: {
      x: 1600,
      y: 1080,

      scale: 0.41,

      rotationZ: 0,
      rotationX: 6,

      rotationY: 0,

      z: -305,

      perspective: 825,
    },

    ease: "smooth",
  },

  {
    id: "overview-breathe",

    progress: T.overviewBreathe,

    state: {
      x: 1600,
      y: 1030,

      scale: 0.405,

      rotationZ: 0,
      rotationX: 7,
      rotationY: 0,

      z: -315,

      perspective: 810,
    },

    ease: "smooth",
  },

  /*
   * ==========================================================
   * ACT VI — LEDGE
   * ==========================================================
   */

  {
    id: "ledge",

    progress: T.ledge,

    state: {
      x: 1600,
      y: 950,

      scale: 0.39,

      rotationZ: 0,
      rotationX: 12,
      rotationY: 0,

      z: -345,

      perspective: 760,
    },

    ease: "smooth",
  },

  {
    id: "look-down",

    progress: T.lookDown,

    state: {
      x: 1640,
      y: 880,

      scale: 0.43,

      rotationZ: 0.25,
      rotationX: 31,
      rotationY: -1,

      z: -290,

      perspective: 650,
    },

    ease: "cinematic",
  },

  /*
   * ==========================================================
   * ACT VII — DROP
   * ==========================================================
   */

  {
    id: "drop-start",

    progress: T.dropStart,

    state: {
      x: 1680,
      y: 1010,

      scale: 0.5,

      rotationZ: 0.7,
      rotationX: 39,
      rotationY: -2,

      z: -150,

      perspective: 600,
    },

    ease: "accelerate",
  },

  {
    id: "drop-mid",

    progress: T.dropMid,

    state: {
      x: 1800,
      y: 1510,

      scale: 0.84,

      rotationZ: -0.9,
      rotationX: 23,
      rotationY: 3,

      z: 100,

      perspective: 710,
    },

    ease: "accelerate",
  },

  {
    id: "impact",

    progress: T.impact,

    state: {
      x: 2040,
      y: 1870,

      scale: 1.3,

      rotationZ: -1.8,
      rotationX: 3,
      rotationY: 1,

      z: 260,

      perspective: 1040,
    },

    ease: "decelerate",
  },

  /*
   * ==========================================================
   * ACT VIII — RECOVERY
   * ==========================================================
   */

  {
    id: "recovery",

    progress: T.recovery,

    state: {
      x: 1980,
      y: 1770,

      scale: 1.12,

      rotationZ: -0.5,
      rotationX: 0.8,
      rotationY: 0,

      z: 190,

      perspective: 1190,
    },

    ease: "decelerate",
  },

  /*
   * ==========================================================
   * ACT IX — REBOUND
   * ==========================================================
   *
   * A primeira queda não encerra
   * a experiência.
   *
   * A câmera é lançada novamente.
   */

  {
    id: "rebound",

    progress: T.rebound,

    state: {
      x: 2630,
      y: 1470,

      scale: 1.06,

      rotationZ: 2.2,
      rotationX: 2,
      rotationY: -7,

      z: 130,

      perspective: 1080,
    },

    ease: "cinematic",
  },

  {
    id: "rebound-high",

    progress: T.reboundHigh,

    state: {
      x: 2760,
      y: 1120,

      scale: 1.12,

      rotationZ: 2.7,
      rotationX: 3.5,
      rotationY: -8,

      z: 175,

      perspective: 1000,
    },

    ease: "cinematic",
  },

  /*
   * ==========================================================
   * ACT X — DEEP RUN
   * ==========================================================
   *
   * Passagem bem próxima dos dados.
   */

  {
    id: "deep-run",

    progress: T.deepRun,

    state: {
      x: 1920,
      y: 1320,

      scale: 1.32,

      rotationZ: -0.6,
      rotationX: 3,
      rotationY: 2.5,

      z: 240,

      perspective: 880,
    },

    ease: "cinematic",
  },

  {
    id: "deep-pass",

    progress: T.deepPass,

    state: {
      x: 1380,
      y: 1570,

      scale: 1.42,

      rotationZ: -2.2,
      rotationX: 4,
      rotationY: 6,

      z: 290,

      perspective: 780,
    },

    ease: "cinematic",
  },

  /*
   * ==========================================================
   * ACT XI — CROSS WORLD
   * ==========================================================
   */

  {
    id: "cross-world",

    progress: T.crossWorld,

    state: {
      x: 660,
      y: 1120,

      scale: 1,

      rotationZ: -3.5,
      rotationX: 2.2,
      rotationY: 7,

      z: 55,

      perspective: 900,
    },

    ease: "decelerate",
  },

  {
    id: "cross-world-rise",

    progress: T.crossWorldRise,

    state: {
      x: 980,
      y: 670,

      scale: 0.86,

      rotationZ: -2.2,
      rotationX: 4,
      rotationY: 4,

      z: -40,

      perspective: 930,
    },

    ease: "cinematic",
  },

  /*
   * ==========================================================
   * ACT XII — CHAOS MAXIMUM
   * ==========================================================
   *
   * A câmera chega em um ponto
   * onde conseguiremos aumentar
   * muito a densidade da cena.
   */

  /*
 * ==========================================================
 * FINAL ACT — CHAOS MAXIMUM
 * ==========================================================
 */

{
  id: "chaos-maximum",

  progress:
    T.chaosMaximum,

  state: {
    x: 1700,
    y: 1040,

    scale: 0.74,

    rotationZ: 1.1,
    rotationX: 6,
    rotationY: -2,

    z: -110,

    perspective: 900,
  },

  ease: "cinematic",
},

/*
 * ==========================================================
 * FINAL ACT — FIND CENTER
 * ==========================================================
 *
 * Primeiro:
 *
 * - remove roll
 * - remove pitch
 * - encontra 1600 / 1100
 * - começa a se afastar
 */

{
  id: "final-center",

  progress:
    CHAOS_FINAL_ACT
      .focusStart,

  state: {
    x: 1600,
    y: 1100,

    scale: 0.52,

    rotationZ: 0,
    rotationX: 1.5,
    rotationY: 0,

    z: -220,

    perspective: 940,
  },

  ease: "cinematic",
},

/*
 * ==========================================================
 * FINAL ACT — FAR SHOT
 * ==========================================================
 *
 * Este é o plano distante.
 *
 * O mundo inteiro fica pequeno.
 *
 * O futuro core também estará
 * minúsculo nesse momento.
 */

{
  id: "final-far",

  progress:
    chaosPoint(
      CHAOS_SCENE.orbit,
      0.58,
    ),

  state: {
    x: 1600,
    y: 1100,

    scale: 0.3,

    rotationZ: 0,
    rotationX: 0,
    rotationY: 0,

    z: -355,

    perspective: 1080,
  },

  ease: "decelerate",
},

/*
 * ==========================================================
 * FINAL ACT — FAR HOLD
 * ==========================================================
 *
 * Pequeno período praticamente
 * imóvel antes da aproximação.
 */

{
  id: "final-far-hold",

  progress:
    CHAOS_FINAL_ACT
      .focusEnd,

  state: {
    x: 1600,
    y: 1100,

    scale: 0.3,

    rotationZ: 0,
    rotationX: 0,
    rotationY: 0,

    z: -355,

    perspective: 1080,
  },

  ease: "linear",
},

/*
 * ==========================================================
 * FINAL ACT — APPROACH
 * ==========================================================
 *
 * Um movimento longo e suave
 * em direção ao centro.
 */

{
  id: "final-approach-mid",

  progress:
    chaosPoint(
      CHAOS_SCENE.gravityLock,
      0.52,
    ),

  state: {
    x: 1600,
    y: 1100,

    scale: 0.46,

    rotationZ: 0,
    rotationX: 0,
    rotationY: 0,

    z: -285,

    perspective: 1010,
  },

  ease: "cinematic",
},

/*
 * ==========================================================
 * FINAL ACT — NORMAL CORE SIZE
 * ==========================================================
 *
 * Só depois daqui os Hot Topics
 * começam a entrar.
 */

{
  id: "final-approach-end",

  progress:
    CHAOS_FINAL_ACT
      .distillEnd,

  state: {
    x: 1600,
    y: 1100,

    scale: 0.66,

    rotationZ: 0,
    rotationX: 0,
    rotationY: 0,

    z: -205,

    perspective: 960,
  },

  ease: "decelerate",
},

/*
 * ==========================================================
 * FINAL LOCK
 * ==========================================================
 */

{
  id: "hot-topics",

  progress:
    CHAOS_FINAL_ACT
      .hotTopicsEnd,

  state: {
    x: 1600,
    y: 1100,

    scale: 0.66,

    rotationZ: 0,
    rotationX: 0,
    rotationY: 0,

    z: -205,

    perspective: 960,
  },

  ease: "linear",
},

{
  id: "consume",

  progress:
    CHAOS_FINAL_ACT
      .consumeEnd,

  state: {
    x: 1600,
    y: 1100,

    scale: 0.66,

    rotationZ: 0,
    rotationX: 0,
    rotationY: 0,

    z: -205,

    perspective: 960,
  },

  ease: "linear",
},

{
  id: "exit",

  progress: 1,

  state: {
    x: 1600,
    y: 1100,

    scale: 0.66,

    rotationZ: 0,
    rotationX: 0,
    rotationY: 0,

    z: -205,

    perspective: 960,
  },

  ease: "linear",
},
];
/*
 * ============================================================
 * PATH SAMPLER
 * ============================================================
 *
 * Recebe:
 *
 * 0.000 → 1.000
 *
 * e devolve um estado completo
 * da câmera.
 */

export function sampleChaosCameraPath(
  progress: number,
): ChaosCameraState {
  const normalizedProgress =
    clamp01(
      progress,
    );

  /*
   * Antes do primeiro frame.
   */

  if (
    normalizedProgress <=
    CHAOS_CAMERA_PATH[0]
      .progress
  ) {
    return {
      ...CHAOS_CAMERA_PATH[0]
        .state,
    };
  }

  const lastFrame =
    CHAOS_CAMERA_PATH[
      CHAOS_CAMERA_PATH.length -
        1
    ];

  /*
   * Depois do último frame.
   */

  if (
    normalizedProgress >=
    lastFrame.progress
  ) {
    return {
      ...lastFrame.state,
    };
  }

  /*
   * Procuramos o intervalo:
   *
   * frame A
   * progress atual
   * frame B
   */

  for (
    let index = 0;
    index <
    CHAOS_CAMERA_PATH.length -
      1;
    index += 1
  ) {
    const start =
      CHAOS_CAMERA_PATH[
        index
      ];

    const end =
      CHAOS_CAMERA_PATH[
        index + 1
      ];

    if (
      normalizedProgress <
        start.progress ||
      normalizedProgress >
        end.progress
    ) {
      continue;
    }

    const range =
      end.progress -
      start.progress;

    const localProgress =
      range === 0
        ? 0
        : (
            normalizedProgress -
            start.progress
          ) /
          range;

    const easedProgress =
      applyCameraEase(
        localProgress,
        start.ease,
      );

    return interpolateCameraState(
      start.state,
      end.state,
      easedProgress,
    );
  }

  return {
    ...lastFrame.state,
  };
}

/*
 * ============================================================
 * INTERPOLATION
 * ============================================================
 */

function interpolateCameraState(
  start:
    ChaosCameraState,

  end:
    ChaosCameraState,

  progress: number,
): ChaosCameraState {
  return {
    x: lerp(
      start.x,
      end.x,
      progress,
    ),

    y: lerp(
      start.y,
      end.y,
      progress,
    ),

    scale: lerp(
      start.scale,
      end.scale,
      progress,
    ),

    rotationZ: lerp(
      start.rotationZ,
      end.rotationZ,
      progress,
    ),

    rotationX: lerp(
      start.rotationX,
      end.rotationX,
      progress,
    ),

    rotationY: lerp(
      start.rotationY,
      end.rotationY,
      progress,
    ),

    z: lerp(
      start.z,
      end.z,
      progress,
    ),

    perspective: lerp(
      start.perspective,
      end.perspective,
      progress,
    ),
  };
}

function lerp(
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

/*
 * ============================================================
 * CAMERA EASINGS
 * ============================================================
 */

function applyCameraEase(
  progress: number,

  ease:
    ChaosCameraKeyframe["ease"],
) {
  const t =
    clamp01(
      progress,
    );

  switch (
    ease
  ) {
    case "linear":
      return t;

    /*
     * Smoothstep.
     */
    case "smooth":
      return (
        t *
        t *
        (
          3 -
          2 * t
        )
      );

    /*
     * Ease-in.
     */
    case "accelerate":
      return (
        t *
        t *
        t
      );

    /*
     * Ease-out.
     */
    case "decelerate":
      return (
        1 -
        Math.pow(
          1 - t,
          3,
        )
      );

    /*
     * Smootherstep.
     *
     * Ótimo para movimentos
     * longos de câmera porque
     * velocidade e aceleração
     * chegam suavemente aos
     * extremos.
     */
    case "cinematic":
    default:
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