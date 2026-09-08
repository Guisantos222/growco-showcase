import type {
  ReactNode,
} from "react";

export type ChaosGravityDepth =
  | "background"
  | "far"
  | "middle"
  | "near"
  | "foreground";

type ChaosGravityNodeProps = {
  id: string;

  x: number;
  y: number;
  z: number;

  depth:
    ChaosGravityDepth;

  children:
    ReactNode;
};

export function ChaosGravityNode({
  id,
  x,
  y,
  z,
  depth,
  children,
}: ChaosGravityNodeProps) {
  return (
  <div
    data-chaos-gravity-node
    data-chaos-gravity-id={
      id
    }
    data-chaos-gravity-x={
      x
    }
    data-chaos-gravity-y={
      y
    }
    data-chaos-gravity-z={
      z
    }
    data-chaos-gravity-depth={
      depth
    }
    className="
      transform-gpu
      [transform-style:preserve-3d]
      will-change-transform
    "
  >
    <div
      data-chaos-gravity-body
      className="
        transform-gpu
        [transform-style:preserve-3d]
        will-change-transform
      "
    >
      {children}
    </div>
  </div>
);
}