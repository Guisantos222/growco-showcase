"use client";

export const HANDOFF_VIEWBOX = {
  width: 1600,
  height: 900,
} as const;

export const HANDOFF_BACKGROUND = "#030508";
export const HANDOFF_STROKE = "#0BA5FF";
export const HANDOFF_STROKE_WIDTH = 5.2;
export const HANDOFF_SAMPLE_COUNT = 28;

export const PRODUCT_HANDOFF_LANES = [
  -2.5,
  -1.5,
  -0.5,
  0.5,
  1.5,
  2.5,
] as const;

export type HandoffPoint = {
  x: number;
  y: number;
};

export function createProductHandoffPoints(
  lane: number,
  phase: number,
  count = HANDOFF_SAMPLE_COUNT,
): HandoffPoint[] {
  const amount = smootherstep(clamp01(phase));

  const angle = mix(
    Math.PI / 2,
    0,
    amount,
  );

  const directionX = Math.cos(angle);
  const directionY = Math.sin(angle);

  const normalX = Math.sin(angle);
  const normalY = -Math.cos(angle);

  const halfLength = mix(
    590,
    960,
    amount,
  );

  const laneSpacing = mix(
    12.5,
    10.5,
    amount,
  );

  const centerX = mix(
    800,
    815,
    amount,
  );

  const centerY = mix(
    450,
    462,
    amount,
  );

  return Array.from(
    { length: count },
    (_, index) => {
      const t =
        count <= 1
          ? 0
          : index / (count - 1);

      const along = mix(
        -halfLength,
        halfLength,
        t,
      );

      return {
        x:
          centerX +
          directionX * along +
          normalX * lane * laneSpacing,

        y:
          centerY +
          directionY * along +
          normalY * lane * laneSpacing,
      };
    },
  );
}

export function interpolateHandoffPoints(
  from: HandoffPoint[],
  to: HandoffPoint[],
  amount: number,
): HandoffPoint[] {
  const t = smootherstep(
    clamp01(amount),
  );

  const count = Math.min(
    from.length,
    to.length,
  );

  return Array.from(
    { length: count },
    (_, index) => ({
      x: mix(
        from[index].x,
        to[index].x,
        t,
      ),

      y: mix(
        from[index].y,
        to[index].y,
        t,
      ),
    }),
  );
}

export function pointsToSvgPath(
  points: HandoffPoint[],
): string {
  if (points.length === 0) {
    return "";
  }

  return points
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`,
    )
    .join(" ");
}

function smootherstep(
  value: number,
): number {
  const t = clamp01(value);

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

function mix(
  start: number,
  end: number,
  amount: number,
): number {
  return start + (end - start) * amount;
}

function clamp01(
  value: number,
): number {
  return Math.min(
    1,
    Math.max(
      0,
      value,
    ),
  );
}
