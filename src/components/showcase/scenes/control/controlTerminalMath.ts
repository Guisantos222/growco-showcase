import {
  CatmullRomCurve3,
  Quaternion,
  Vector3,
} from "three";

import {
  CONTROL_TERMINAL,
} from "@/components/showcase/scenes/control/controlWorldConfig";

export type ControlTunnelFrame = {
  center:
    Vector3;

  tangent:
    Vector3;

  side:
    Vector3;

  up:
    Vector3;
};

export type ControlTerminalWallFrame =
  ControlTunnelFrame & {
    quaternion:
      Quaternion;

    cameraNormal:
      Vector3;
  };

export type ControlTerminalHoleFrame =
  ControlTunnelFrame & {
    position:
      Vector3;

    yaw:
      number;
  };

/*
 * ============================================================================
 * SHARED TERMINAL GEOMETRY
 * ============================================================================
 *
 * Terminal wall, terminal lines, 3D brand and camera all need the exact same
 * physical reference frame.
 *
 * Keeping this in one file prevents the different systems from slowly
 * drifting apart as the tunnel is edited.
 */

export function getControlTunnelFrame(
  curve:
    CatmullRomCurve3,

  t:
    number,
):
  ControlTunnelFrame {
  const center =
    curve.getPointAt(
      t,
    );

  const tangent =
    curve
      .getTangentAt(
        t,
      )
      .normalize();

  const worldUp =
    new Vector3(
      0,
      1,
      0,
    );

  const side =
    new Vector3()
      .crossVectors(
        tangent,
        worldUp,
      )
      .normalize();

  const up =
    new Vector3()
      .crossVectors(
        side,
        tangent,
      )
      .normalize();

  return {
    center,
    tangent,
    side,
    up,
  };
}

export function getControlTerminalWallFrame(
  curve:
    CatmullRomCurve3,
):
  ControlTerminalWallFrame {
  const frame =
    getControlTunnelFrame(
      curve,
      CONTROL_TERMINAL.wallT,
    );

  const quaternion =
    new Quaternion();

  quaternion.setFromUnitVectors(
    new Vector3(
      0,
      0,
      1,
    ),
    frame.tangent,
  );

  /*
   * +Z of the wall points in the direction of increasing curve t.
   * The camera approaches from smaller t, therefore -tangent is the
   * camera-facing normal.
   */
  const cameraNormal =
    frame.tangent
      .clone()
      .negate();

  return {
    ...frame,

    quaternion,

    cameraNormal,
  };
}

export function getControlTerminalHoleFrame(
  curve:
    CatmullRomCurve3,
):
  ControlTerminalHoleFrame {
  const frame =
    getControlTunnelFrame(
      curve,
      CONTROL_TERMINAL.holeT,
    );

  const position =
    frame.center
      .clone();

  /*
   * Must match the floor position used by ControlEntryTunnel.
   */
  position.y -=
    3.695;

  const yaw =
    Math.atan2(
      frame.tangent.x,
      -frame.tangent.z,
    );

  return {
    ...frame,

    position,

    yaw,
  };
}

export function getControlCeilingPoint(
  curve:
    CatmullRomCurve3,

  t:
    number,

  lane:
    number,
) {
  const frame =
    getControlTunnelFrame(
      curve,
      t,
    );

  return frame.center
    .clone()
    .addScaledVector(
      frame.up,
      4.52,
    )
    .addScaledVector(
      frame.side,
      lane,
    );
}
