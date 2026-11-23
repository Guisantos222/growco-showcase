"use client";

export type ControlCategoryId =
  | "sales"
  | "stock"
  | "finance"
  | "people"
  | "goals"
  | "reports";

export type ControlWallSide =
  | "left"
  | "right";

export type ControlCategoryDefinition = {
  id:
    ControlCategoryId;

  number:
    string;

  side:
    ControlWallSide;

  /*
   * Real position inside the same 3D curve used by the camera.
   *
   * This is now the single source of truth.
   * We no longer hand-write unrelated "travel" timings.
   */
  t:
    number;

  /*
   * Horizontal ceiling lane.
   */
  lineLane:
    number;
};

export type ControlCategoryTiming = {
  stationTravel:
    number;

  enterStart:
    number;

  buildStart:
    number;

  buildEnd:
    number;

  connectorStart:
    number;

  connectorEnd:
    number;

  lineStart:
    number;

  lineEnd:
    number;

  holdEnd:
    number;

  exitEnd:
    number;
};

/*
 * ============================================================================
 * CAMERA / WORLD SYNCHRONIZATION
 * ============================================================================
 *
 * IMPORTANT:
 *
 * TunnelCameraController must use these exact values too.
 *
 * Previously:
 *
 * - category position used curve t;
 * - category timing used unrelated hand-authored travel numbers;
 *
 * so a category could animate before the camera had reached the physical
 * installation. That was one of the main reasons only one station seemed
 * to appear reliably.
 */

export const CONTROL_CAMERA_START_T =
  0.018;

export const CONTROL_CAMERA_T_PER_TRAVEL =
  0.0285;

/*
 * Ceiling lines keep travelling beyond the final category.
 * Later this area becomes the "all systems connected" section.
 */
export const CONTROL_LINE_END_T =
  0.86;

/*
 * ============================================================================
 * TERMINAL ZONE
 * ============================================================================
 *
 * Reports is no longer the end of the world.
 *
 * After the sixth category:
 *
 * - all ceiling lines keep travelling together;
 * - the tunnel clears;
 * - the terminal wall becomes the visual destination;
 * - the camera stops its normal forward motion BEFORE the floor opening;
 * - future exit-camera logic will take control from that point.
 *
 * Everything is still expressed in the SAME physical curve space.
 */

/*
 * IMPORTANT FIX
 * =============
 *
 * Part 1 previously stopped the camera at 0.845 even though:
 *
 *   holeT = 0.872
 *   wallT = 0.925
 *
 * Therefore the camera stopped BEFORE the terminal architecture was
 * actually reachable. Because this end of the tunnel is curved, the wall
 * could remain completely occluded around the bend.
 *
 * The normal tunnel equation may continue evaluating up to this point,
 * but ControlTunnelCamera now blends away from it much earlier during the
 * terminal takeover. Keeping this upper clamp generous prevents accidental
 * dead zones when scrolling backward/forward across the handoff.
 */
export const CONTROL_CAMERA_FORWARD_END_T =
  0.93;

export const CONTROL_TERMINAL = {
  approachStartT:
    0.64,

  ceilingRunStartT:
    0.585,

  lineTurnT:
    CONTROL_LINE_END_T,

  holeT:
    0.895,

  wallT:
    0.955,

  approachStart:
    travelAtCurveT(
      0.64,
    ),

  wallRevealStart:
    travelAtCurveT(
      0.70,
    ),

  terminalReadable:
    travelAtCurveT(
      0.76,
    ),

  brandBuildStart:
    travelAtCurveT(
      0.72,
    ),

  brandBuildEnd:
    travelAtCurveT(
      0.81,
    ),

  cameraTakeoverStart:
    travelAtCurveT(
      0.805,
    ),

  flowStart:
    travelAtCurveT(
      0.80,
    ),

  lineTurnStart:
    travelAtCurveT(
      CONTROL_LINE_END_T,
    ),

  lineDescentEnd:
    travelAtCurveT(
      CONTROL_LINE_END_T,
    ) +
    1.45,

  lookDownStart:
    travelAtCurveT(
      CONTROL_LINE_END_T,
    ) +
    0.72,

  /*
   * Shaft strands begin BEFORE the camera has fully entered the aperture.
   * This removes the dead-scroll gap after entering the hole.
   */
  shaftLineStart:
    travelAtCurveT(
      CONTROL_LINE_END_T,
    ) +
    1.12,

  shaftLineFull:
    travelAtCurveT(
      CONTROL_LINE_END_T,
    ) +
    1.42,

  brandFadeStart:
    travelAtCurveT(
      CONTROL_LINE_END_T,
    ) +
    1.42,

  brandFadeEnd:
    travelAtCurveT(
      CONTROL_LINE_END_T,
    ) +
    1.82,

  fallStart:
    travelAtCurveT(
      CONTROL_LINE_END_T,
    ) +
    1.08,

  /*
   * CAMERA creates the perspective transition.
   *
   * At first we look down the shaft, so the parallel strands naturally
   * converge toward a vanishing point.
   *
   * Then the camera orbits to a side/front view of the SAME straight
   * physical strands. No line gymnastics are needed.
   */
  perspectiveTurnStart:
    travelAtCurveT(
      CONTROL_LINE_END_T,
    ) +
    1.52,

  perspectiveTurnEnd:
    travelAtCurveT(
      CONTROL_LINE_END_T,
    ) +
    2.48,

  /*
   * 2D only appears once the camera is already almost front-facing.
   */
  handoffOverlayStart:
    travelAtCurveT(
      CONTROL_LINE_END_T,
    ) +
    2.32,

  handoffOverlayFull:
    travelAtCurveT(
      CONTROL_LINE_END_T,
    ) +
    2.58,

  /*
   * Only a tiny final fit from projected straight 3D strands to PRODUCT's
   * exact vertical bundle.
   */
  handoffMorphStart:
    travelAtCurveT(
      CONTROL_LINE_END_T,
    ) +
    2.45,

  handoffMorphEnd:
    travelAtCurveT(
      CONTROL_LINE_END_T,
    ) +
    2.88,

  handoffBackdropStart:
    travelAtCurveT(
      CONTROL_LINE_END_T,
    ) +
    2.48,

  handoffBackdropFull:
    travelAtCurveT(
      CONTROL_LINE_END_T,
    ) +
    2.82,

  fallEnd:
    travelAtCurveT(
      CONTROL_LINE_END_T,
    ) +
    2.48,

  floorRelease:
    travelAtCurveT(
      CONTROL_LINE_END_T,
    ) +
    1.28,

  partialHoldEnd:
    travelAtCurveT(
      CONTROL_LINE_END_T,
    ) +
    2.96,
} as const;

/*
 * Categories are deliberately distributed across more of the tunnel.
 *
 * This makes the camera encounter them one by one instead of compressing
 * everything into the first section.
 */
export const CONTROL_CATEGORIES:
  ControlCategoryDefinition[] = [
  {
    id:
      "sales",

    number:
      "01",

    side:
      "right",

    t:
      0.105,

    lineLane:
      -0.82,
  },

  {
    id:
      "stock",

    number:
      "02",

    side:
      "left",

    t:
      0.19,

    lineLane:
      -0.5,
  },

  {
    id:
      "finance",

    number:
      "03",

    side:
      "right",

    t:
      0.275,

    lineLane:
      -0.17,
  },

  {
    id:
      "people",

    number:
      "04",

    side:
      "left",

    t:
      0.36,

    lineLane:
      0.17,
  },

  {
    id:
      "goals",

    number:
      "05",

    side:
      "right",

    t:
      0.445,

    lineLane:
      0.5,
  },

  {
    id:
      "reports",

    number:
      "06",

    side:
      "left",

    t:
      0.53,

    lineLane:
      0.82,
  },
] as const;

export function travelAtCurveT(
  t:
    number,
) {
  return Math.max(
    0,
    (
      t -
      CONTROL_CAMERA_START_T
    ) /
    CONTROL_CAMERA_T_PER_TRAVEL,
  );
}

/*
 * ============================================================================
 * CATEGORY TIMELINE
 * ============================================================================
 *
 * Every category uses the SAME rhythm relative to its real 3D position.
 *
 * Camera is still approaching:
 *   station begins building.
 *
 * Station becomes readable:
 *   source connector grows from the wall.
 *
 * Connector reaches ceiling:
 *   persistent ceiling line begins.
 *
 * Camera passes:
 *   detailed installation fades,
 *   but the ceiling line remains.
 */

export function getCategoryTiming(
  category:
    ControlCategoryDefinition,
):
  ControlCategoryTiming {
  const stationTravel =
    travelAtCurveT(
      category.t,
    );

  return {
    stationTravel,

    /*
     * IMPORTANT — PREVIEW THE STATION FROM FARTHER AWAY.
     *
     * The previous values started too close to stationTravel.
     * On a curved tunnel, that meant the installation only became
     * readable when it was already close to leaving the viewport.
     *
     * Now the station begins existing ~3.2 travel units before
     * the camera reaches its physical curve position.
     */
    enterStart:
      Math.max(
        0,
        stationTravel -
          3.2,
      ),

    /*
     * Construction begins while the station is still ahead.
     * This is what gives us time to SEE it assembling in perspective.
     */
    buildStart:
      Math.max(
        0,
        stationTravel -
          2.85,
      ),

    buildEnd:
      Math.max(
        0,
        stationTravel -
          1.35,
      ),

    /*
     * Wall -> ceiling branch starts only after most of the station
     * has become identifiable, but still before we reach it.
     */
    connectorStart:
      Math.max(
        0,
        stationTravel -
          1.45,
      ),

    connectorEnd:
      Math.max(
        0,
        stationTravel -
          0.78,
      ),

    /*
     * The persistent ceiling line begins while the source is still
     * comfortably visible in front of the camera.
     */
    lineStart:
      Math.max(
        0,
        stationTravel -
          0.92,
      ),

    lineEnd:
      stationTravel +
      0.72,

    /*
     * Keep the detailed station readable AFTER passing its center.
     * The exit is intentionally slow instead of disappearing as soon
     * as the camera reaches it.
     */
    holdEnd:
      stationTravel +
      0.9,

    exitEnd:
      stationTravel +
      1.85,
  };
}
