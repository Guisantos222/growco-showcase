"use client";

/*
 * ============================================================================
 * SHARED CONTROL -> PRODUCT SEAM
 * ============================================================================
 *
 * One rule only:
 *
 *   CONTROL ends with six parallel vertical lines.
 *   PRODUCT continues those exact same six lines.
 *   The whole bundle rotates smoothly until it becomes horizontal.
 *
 * No spline gymnastics.
 * No lane crossing.
 * No changing lane order.
 * No independent curves.
 */

export const HANDOFF_VIEWBOX = {
  width:
    1600,

  height:
    900,
} as const;

export const HANDOFF_BACKGROUND =
  "#030508";

export const HANDOFF_STROKE =
  "#0BA5FF";

export const HANDOFF_STROKE_WIDTH =
  5.2;

export const HANDOFF_SAMPLE_COUNT =
  28;

export const PRODUCT_HANDOFF_LANES = [
  -2.5,
  -1.5,
  -0.5,
  0.5,
  1.5,
  2.5,
] as const;

export type HandoffPoint = {
  x:
    number;

  y:
    number;
};

/*
 * phase = 0
 *
 *      ||||||
 *      ||||||
 *      ||||||
 *
 * phase = 1
 *
 *  ==================
 *  ==================
 *  ==================
 *
 * Intermediate states are the SAME rigid bundle rotated around the center.
 *
 * Since every line shares exactly the same direction vector and only differs
 * by a perpendicular lane offset, crossing is mathematically impossible.
 */
export function createProductHandoffPoints(
  lane:
    number,

  phase:
    number,

  count =
    HANDOFF_SAMPLE_COUNT,
):
  HandoffPoint[] {
  const amount =
    smootherstep(
      clamp01(
        phase,
      ),
    );

  /*
   * Vertical -> horizontal.
   */
  const angle =
    mix(
      Math.PI /
        2,
      0,
      amount,
    );

  const direction = {
    x:
      Math.cos(
        angle,
      ),

    y:
      Math.sin(
        angle,
      ),
  };

  /*
   * Positive lane stays consistently on the same side of the bundle.
   */
  const normal = {
    x:
      Math.sin(
        angle,
      ),

    y:
      -Math.cos(
        angle,
      ),
  };

  /*
   * The bundle gets slightly longer as it becomes a web data rail.
   * This creates movement without deforming individual lines.
   */
  const halfLength =
    mix(
      590,
      960,
      amount,
    );

  const laneSpacing =
    mix(
      12.5,
      10.5,
      amount,
    );

  /*
   * Tiny shared translation gives a sense that the lines keep travelling
   * instead of merely rotating in place.
   */
  const centerX =
    mix(
      800,
      815,
      amount,
    );

  const centerY =
    mix(
      450,
      462,
      amount,
    );

  return Array.from({
    length:
      count,
  }).map(
    (
      _,
      index,
    ) => {
      const normalized =
        count <=
        1
          ? 0
          : index /
            (
              count -
              1
            );

      const along =
        mix(
          -halfLength,
          halfLength,
          normalized,
        );

      return {
        x:
          centerX +
          direction.x *
            along +
          normal.x *
            lane *
            laneSpacing,

        y:
          centerY +
          direction.y *
            along +
          normal.y *
            lane *
            laneSpacing,
      };
    },
  );
}

export function interpolateHandoffPoints(
  from:
    HandoffPoint[],

  to:
    HandoffPoint[],

  amount:
    number,
):
  HandoffPoint[] {
  const t =
    smootherstep(
      clamp01(
        amount,
      ),
    );

  const count =
    Math.min(
      from.length,
      to.length,
    );

  return Array.from({
    length:
      count,
  }).map(
    (
      _,
      index,
    ) => ({
      x:
        mix(
          from[
            index
          ].x,
          to[
            index
          ].x,
          t,
        ),

      y:
        mix(
          from[
            index
          ].y,
          to[
            index
          ].y,
          t,
        ),
    }),
  );
}

export function pointsToSvgPath(
  points:
    HandoffPoint[],
) {
  if (
    points.length ===
    0
  ) {
    return "";
  }

  return points
    .map(
      (
        point,
        index,
      ) =>
        `${
          index ===
          0
            ? "M"
            : "L"
        } ${point.x.toFixed(
          2,
        )} ${point.y.toFixed(
          2,
        )}`,
    )
    .join(
      " ",
    );
}

function smootherstep(
  value:
    number,
) {
  const t =
    clamp01(
      value,
    );

  return (
    t *
    t *
    t *
    (
      t *
      (
        t *
        6 -
        15
      ) +
      10
    )
  );
}

function mix(
  start:
    number,

  end:
    number,

  amount:
    number,
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

function clamp01(
  value:
    number,
) {
  return Math.min(
    1,
    Math.max(
      0,
      value,
    ),
  );
}
