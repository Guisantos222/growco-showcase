/*
 * ============================================================
 * CHAOS — MASTER SCENE CLOCK
 * ============================================================
 *
 * O CHAOS possui:
 *
 * 1900vh
 *
 * dividido em:
 *
 * 19 cenas
 *
 * Portanto cada cena recebe
 * aproximadamente 100vh de
 * scroll físico.
 *
 * Não pensamos mais o ato como
 * dezenas de porcentagens soltas.
 *
 * Pensamos:
 *
 * SCENE
 * +
 * posição local dentro da scene.
 */

export const CHAOS_RUNWAY_VH =
  2700;

export const CHAOS_SCENE_COUNT =
  27;

export const CHAOS_SCENE_SPAN =
  1 /
  CHAOS_SCENE_COUNT;

/*
 * ============================================================
 * SCENE INDEX
 * ============================================================
 */

export const CHAOS_SCENE = {
  /*
   * ==========================================================
   * ORIGINAL JOURNEY
   * ==========================================================
   */

  opening: 0,

  firstSignal: 1,

  rightTravel: 2,

  rightEdge: 3,

  swing: 4,

  rise: 5,

  overview: 6,

  ledge: 7,

  drop: 8,

  impact: 9,

  rebound: 10,

  deepRun: 11,

  crossWorld: 12,

  chaosMaximum: 13,

  /*
   * ==========================================================
   * FINAL FOCUS
   * ==========================================================
   */

  focus: 14,

  approach: 15,

  hotTopics: 16,

  ringSettle: 17,

  ringPlay: 18,

  /*
   * ==========================================================
   * SEQUENTIAL RESOLUTION
   * ==========================================================
   */

  consume1: 19,

  consume2: 20,

  consume3: 21,

  consume4: 22,

  consume5: 23,

  consume6: 24,

  /*
   * ==========================================================
   * RESOLUTION
   * ==========================================================
   */

  coreResolve: 25,

  brand: 26,

  /*
   * ==========================================================
   * COMPATIBILITY ALIASES
   * ==========================================================
   *
   * Alguns sistemas antigos ainda
   * usam estes nomes.
   */

  orbit: 14,

  gravityLock: 15,

  spaghettify: 16,

  collapse: 19,
} as const;

/*
 * ============================================================
 * SCENE POSITION
 * ============================================================
 *
 * scene = índice da cena
 *
 * local =
 * 0   começo
 * 0.5 metade
 * 1   final
 */

export function chaosPoint(
  scene: number,
  local = 0,
) {
  return clamp01(
    (
      scene +
      local
    ) /
      CHAOS_SCENE_COUNT,
  );
}

/*
 * Retorna exatamente o começo
 * de uma cena.
 */

export function chaosSceneStart(
  scene: number,
) {
  return chaosPoint(
    scene,
    0,
  );
}

/*
 * ============================================================
 * MASTER TIMELINE
 * ============================================================
 *
 * Os valores abaixo continuam
 * disponíveis para todo o código
 * existente.
 *
 * Só que agora são derivados
 * do relógio de cenas.
 */

export const CHAOS_TIMELINE = {
  /*
   * ==========================================================
   * SCENE 01 — OPENING
   * ==========================================================
   */

  entry:
    chaosPoint(
      CHAOS_SCENE.opening,
      0,
    ),

  movement:
    chaosPoint(
      CHAOS_SCENE.opening,
      0.32,
    ),

  /*
   * ==========================================================
   * SCENE 02 — FIRST SIGNAL
   * ==========================================================
   */

  firstSignal:
    chaosPoint(
      CHAOS_SCENE.firstSignal,
      0.12,
    ),

  signals:
    chaosPoint(
      CHAOS_SCENE.firstSignal,
      0.68,
    ),

  /*
   * ==========================================================
   * SCENE 03 — RIGHT TRAVEL
   * ==========================================================
   */

  rightCorridor:
    chaosPoint(
      CHAOS_SCENE.rightTravel,
      0.08,
    ),

  rightDepth:
    chaosPoint(
      CHAOS_SCENE.rightTravel,
      0.72,
    ),

  /*
   * ==========================================================
   * SCENE 04 — RIGHT EDGE
   * ==========================================================
   */

  rightEdge:
    chaosPoint(
      CHAOS_SCENE.rightEdge,
      0.1,
    ),

  curveEntry:
    chaosPoint(
      CHAOS_SCENE.rightEdge,
      0.75,
    ),

  /*
   * ==========================================================
   * SCENE 05 — SWING
   * ==========================================================
   */

  swing:
    chaosPoint(
      CHAOS_SCENE.swing,
      0.18,
    ),

  leftDepth:
    chaosPoint(
      CHAOS_SCENE.swing,
      0.82,
    ),

  /*
   * ==========================================================
   * SCENE 06 — RISE
   * ==========================================================
   */

  riseEntry:
    chaosPoint(
      CHAOS_SCENE.rise,
      0.08,
    ),

  rise:
    chaosPoint(
      CHAOS_SCENE.rise,
      0.42,
    ),

  highPass:
    chaosPoint(
      CHAOS_SCENE.rise,
      0.88,
    ),

  /*
   * ==========================================================
   * SCENE 07 — OVERVIEW
   * ==========================================================
   */

  overview:
    chaosPoint(
      CHAOS_SCENE.overview,
      0.12,
    ),

  overviewBreathe:
    chaosPoint(
      CHAOS_SCENE.overview,
      0.68,
    ),

  /*
   * ==========================================================
   * SCENE 08 — LEDGE
   * ==========================================================
   */

  ledge:
    chaosPoint(
      CHAOS_SCENE.ledge,
      0.08,
    ),

  lookDown:
    chaosPoint(
      CHAOS_SCENE.ledge,
      0.64,
    ),

  /*
   * ==========================================================
   * SCENE 09 — DROP
   * ==========================================================
   */

  dropStart:
    chaosPoint(
      CHAOS_SCENE.drop,
      0.1,
    ),

  dropMid:
    chaosPoint(
      CHAOS_SCENE.drop,
      0.62,
    ),

  /*
   * ==========================================================
   * SCENE 10 — IMPACT
   * ==========================================================
   */

  impact:
    chaosPoint(
      CHAOS_SCENE.impact,
      0.12,
    ),

  recovery:
    chaosPoint(
      CHAOS_SCENE.impact,
      0.68,
    ),

  /*
   * ==========================================================
   * SCENE 11 — REBOUND
   * ==========================================================
   */

  rebound:
    chaosPoint(
      CHAOS_SCENE.rebound,
      0.08,
    ),

  reboundHigh:
    chaosPoint(
      CHAOS_SCENE.rebound,
      0.78,
    ),

  /*
   * ==========================================================
   * SCENE 12 — DEEP RUN
   * ==========================================================
   */

  deepRun:
    chaosPoint(
      CHAOS_SCENE.deepRun,
      0.08,
    ),

  deepPass:
    chaosPoint(
      CHAOS_SCENE.deepRun,
      0.72,
    ),

  /*
   * ==========================================================
   * SCENE 13 — CROSS WORLD
   * ==========================================================
   */

  crossWorld:
    chaosPoint(
      CHAOS_SCENE.crossWorld,
      0.08,
    ),

  crossWorldRise:
    chaosPoint(
      CHAOS_SCENE.crossWorld,
      0.72,
    ),

  /*
   * ==========================================================
   * SCENE 14 — CHAOS MAXIMUM
   * ==========================================================
   */

  chaosMaximum:
    chaosPoint(
      CHAOS_SCENE.chaosMaximum,
      0.1,
    ),

  /*
   * ==========================================================
   * SCENE 15 — ORBIT
   * ==========================================================
   *
   * Uma cena inteira dedicada
   * à descoberta da órbita.
   */

  orbitStart:
    chaosPoint(
      CHAOS_SCENE.orbit,
      0.04,
    ),

  /*
   * Orbit Mid só acontece
   * na cena seguinte.
   *
   * Portanto a órbita ganha
   * mais de 100vh de duração.
   */

  orbitMid:
    chaosPoint(
      CHAOS_SCENE.gravityLock,
      0.12,
    ),

  /*
   * ==========================================================
   * SCENE 16 — GRAVITY LOCK
   * ==========================================================
   */

  gravityLock:
    chaosPoint(
      CHAOS_SCENE.gravityLock,
      0.64,
    ),

  /*
   * ==========================================================
   * SCENE 17 — SPAGHETTIFICATION
   * ==========================================================
   */

  spaghettify:
    chaosPoint(
      CHAOS_SCENE.spaghettify,
      0.12,
    ),

  /*
   * ==========================================================
   * SCENE 18 — COLLAPSE
   * ==========================================================
   */

  collapseReady:
    chaosPoint(
      CHAOS_SCENE.collapse,
      0.05,
    ),

  eventHorizon:
    chaosPoint(
      CHAOS_SCENE.collapse,
      0.82,
    ),

  /*
   * ==========================================================
   * SCENE 19 — RESOLUTION
   * ==========================================================
   */

  silence:
    chaosPoint(
      CHAOS_SCENE.brand,
      0.08,
    ),

  brand:
    chaosPoint(
      CHAOS_SCENE.brand,
      0.48,
    ),

  exit:
    1,
} as const;

/*
 * ============================================================
 * CHAOS FINAL ACT
 * ============================================================
 *
 * As últimas cinco cenas possuem
 * funções muito claras.
 */

export const CHAOS_FINAL_ACT = {
  /*
   * ==========================================================
   * CAMERA FOCUS
   * ==========================================================
   */

  focusStart:
    chaosSceneStart(
      CHAOS_SCENE.focus,
    ),

  focusEnd:
    chaosSceneStart(
      CHAOS_SCENE.approach,
    ),

  /*
   * ==========================================================
   * APPROACH
   * ==========================================================
   */

  distillStart:
    chaosSceneStart(
      CHAOS_SCENE.approach,
    ),

  distillEnd:
    chaosSceneStart(
      CHAOS_SCENE.hotTopics,
    ),

  /*
   * ==========================================================
   * HOT TOPIC FORMATION
   * ==========================================================
   */

  hotTopicsStart:
    chaosSceneStart(
      CHAOS_SCENE.hotTopics,
    ),

  hotTopicsEnd:
    chaosSceneStart(
      CHAOS_SCENE.ringSettle,
    ),

  /*
   * ==========================================================
   * RING SETTLE
   * ==========================================================
   */

  ringSettleStart:
    chaosSceneStart(
      CHAOS_SCENE.ringSettle,
    ),

  ringSettleEnd:
    chaosSceneStart(
      CHAOS_SCENE.ringPlay,
    ),

  /*
   * ==========================================================
   * CIRANDA
   * ==========================================================
   */

  ringPlayStart:
    chaosSceneStart(
      CHAOS_SCENE.ringPlay,
    ),

  ringPlayEnd:
    chaosSceneStart(
      CHAOS_SCENE.consume1,
    ),

  /*
   * ==========================================================
   * SEQUENTIAL CONSUME
   * ==========================================================
   */

  consumeStart:
    chaosSceneStart(
      CHAOS_SCENE.consume1,
    ),

  consumeEnd:
    chaosSceneStart(
      CHAOS_SCENE.coreResolve,
    ),

  /*
   * ==========================================================
   * CORE
   * ==========================================================
   */

  coreResolveStart:
    chaosSceneStart(
      CHAOS_SCENE.coreResolve,
    ),

  coreResolveEnd:
    chaosSceneStart(
      CHAOS_SCENE.brand,
    ),

  /*
   * ==========================================================
   * BRAND
   * ==========================================================
   */

  brandStart:
    chaosSceneStart(
      CHAOS_SCENE.brand,
    ),

  brandEnd:
    1,
} as const;

/*
 * ============================================================
 * HOT TOPIC CONSUME WINDOWS
 * ============================================================
 *
 * Cada card recebe UMA CENA INTEIRA.
 *
 * ≈ 100vh por card.
 */

export const CHAOS_CONSUME_WINDOWS =
  [
    {
      index: 0,

      start:
        chaosSceneStart(
          CHAOS_SCENE.consume1,
        ),

      end:
        chaosSceneStart(
          CHAOS_SCENE.consume2,
        ),
    },

    {
      index: 1,

      start:
        chaosSceneStart(
          CHAOS_SCENE.consume2,
        ),

      end:
        chaosSceneStart(
          CHAOS_SCENE.consume3,
        ),
    },

    {
      index: 2,

      start:
        chaosSceneStart(
          CHAOS_SCENE.consume3,
        ),

      end:
        chaosSceneStart(
          CHAOS_SCENE.consume4,
        ),
    },

    {
      index: 3,

      start:
        chaosSceneStart(
          CHAOS_SCENE.consume4,
        ),

      end:
        chaosSceneStart(
          CHAOS_SCENE.consume5,
        ),
    },

    {
      index: 4,

      start:
        chaosSceneStart(
          CHAOS_SCENE.consume5,
        ),

      end:
        chaosSceneStart(
          CHAOS_SCENE.consume6,
        ),
    },

    {
      index: 5,

      start:
        chaosSceneStart(
          CHAOS_SCENE.consume6,
        ),

      end:
        chaosSceneStart(
          CHAOS_SCENE.coreResolve,
        ),
    },
  ] as const;

/*
 * ============================================================
 * LOCAL SCENE PROGRESS
 * ============================================================
 *
 * Isso será especialmente útil
 * na tipografia.
 *
 * Ex:
 *
 * sceneProgress(progress, 4)
 *
 * devolve:
 *
 * 0 → 1
 *
 * somente durante a cena 4.
 */

export function chaosSceneProgress(
  progress: number,
  scene: number,
) {
  const start =
    chaosSceneStart(
      scene,
    );

  const end =
    chaosPoint(
      scene,
      1,
    );

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

  return (
    progress -
    start
  ) /
    (
      end -
      start
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