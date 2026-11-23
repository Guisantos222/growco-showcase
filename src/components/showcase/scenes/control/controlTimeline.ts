/*
 * ============================================================================
 * CONTROL TIMELINE
 * ============================================================================
 *
 * PART 1 TERMINAL UPDATE
 *
 * The original 2300vh runway was enough for:
 *
 * entry + six categories
 *
 * but NOT enough for:
 *
 * reports
 * -> long all-lines ceiling run
 * -> terminal wall
 * -> wall descent
 * -> floor opening
 * -> camera fall
 *
 * The CONTROL world now intentionally receives a longer physical runway.
 *
 * 3900vh ends CONTROL only a few vh after the final 3D -> SVG handoff.
 * There is no long black hold before PRODUCT.
 *
 * Entry timing remains physical and independent through
 * CONTROL_ENTRY_SCROLL_VH, so increasing this value does NOT slow the
 * question/dust opening.
 */

export const CONTROL_RUNWAY_VH =
  3735;

export const CONTROL_SCENE_COUNT =
  23;

export const CONTROL_SCENE = {
  brandHold:
    0,

  activation:
    1,

  portal:
    2,

  tunnelBirth:
    3,

  salesArrival:
    4,

  salesPass:
    5,

  stockArrival:
    6,

  stockConnection:
    7,

  financeArrival:
    8,

  financeConnection:
    9,

  peopleArrival:
    10,

  peopleConnection:
    11,

  goalsArrival:
    12,

  goalsConnection:
    13,

  reportsArrival:
    14,

  interpretation:
    15,

  allLanes:
    16,

  oneEvent:
    17,

  fullVelocity:
    18,

  tunnelClear:
    19,

  convergence:
    20,

  statement:
    21,

  pullDown:
    22,
} as const;

export type ControlSceneIndex =
  (
    typeof CONTROL_SCENE
  )[
    keyof typeof CONTROL_SCENE
  ];

export function controlSceneStart(
  scene:
    ControlSceneIndex,
) {
  return (
    scene /
    CONTROL_SCENE_COUNT
  );
}

export function controlPoint(
  scene:
    ControlSceneIndex,

  localProgress =
    0,
) {
  return (
    scene +
    Math.min(
      1,
      Math.max(
        0,
        localProgress,
      ),
    )
  ) /
    CONTROL_SCENE_COUNT;
}

export const CONTROL_ACT = {
  entryStart:
    controlSceneStart(
      CONTROL_SCENE.brandHold,
    ),

  entryEnd:
    controlSceneStart(
      CONTROL_SCENE.salesArrival,
    ),

  modulesStart:
    controlSceneStart(
      CONTROL_SCENE.salesArrival,
    ),

  modulesEnd:
    controlSceneStart(
      CONTROL_SCENE.allLanes,
    ),

  integratedStart:
    controlSceneStart(
      CONTROL_SCENE.allLanes,
    ),

  integratedEnd:
    controlSceneStart(
      CONTROL_SCENE.tunnelClear,
    ),

  synthesisStart:
    controlSceneStart(
      CONTROL_SCENE.tunnelClear,
    ),

  synthesisEnd:
    1,
} as const;

export const CONTROL_MODULES = [
  {
    id:
      "sales",

    label:
      "VENDAS",

    arrival:
      CONTROL_SCENE.salesArrival,

    connection:
      CONTROL_SCENE.salesPass,
  },

  {
    id:
      "stock",

    label:
      "ESTOQUE",

    arrival:
      CONTROL_SCENE.stockArrival,

    connection:
      CONTROL_SCENE.stockConnection,
  },

  {
    id:
      "finance",

    label:
      "FINANCEIRO",

    arrival:
      CONTROL_SCENE.financeArrival,

    connection:
      CONTROL_SCENE.financeConnection,
  },

  {
    id:
      "people",

    label:
      "PESSOAS",

    arrival:
      CONTROL_SCENE.peopleArrival,

    connection:
      CONTROL_SCENE.peopleConnection,
  },

  {
    id:
      "goals",

    label:
      "METAS",

    arrival:
      CONTROL_SCENE.goalsArrival,

    connection:
      CONTROL_SCENE.goalsConnection,
  },

  {
    id:
      "reports",

    label:
      "RELATÓRIOS",

    arrival:
      CONTROL_SCENE.reportsArrival,

    connection:
      CONTROL_SCENE.interpretation,
  },
] as const;

export const CONTROL_DEPTH_PER_SCENE =
  420;

export const CONTROL_TRAVEL_DEPTH =
  CONTROL_SCENE_COUNT *
  CONTROL_DEPTH_PER_SCENE;
