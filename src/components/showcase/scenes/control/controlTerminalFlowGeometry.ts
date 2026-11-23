"use client";

import {
  CatmullRomCurve3,
  Vector3,
} from "three";

import {
  getControlTerminalHoleFrame,
  getControlTerminalWallFrame,
} from "@/components/showcase/scenes/control/controlTerminalMath";

export type TerminalFlowCurves = {
  descentCurve:
    CatmullRomCurve3;

  shaftCurve:
    CatmullRomCurve3;

  shaftStart:
    Vector3;

  shaftEnd:
    Vector3;
};

/*
 * ============================================================================
 * TERMINAL FLOW GEOMETRY
 * ============================================================================
 *
 * The line has ONE continuous visual logic:
 *
 * ceiling
 * -> final wall
 * -> floor
 * -> hole rim
 * -> short entrance bend
 * -> straight vertical shaft strand
 *
 * The shaft strand itself does NOT fan out, cross, twist or morph.
 * Perspective is created by the CAMERA.
 */
export function createTerminalFlowCurves(
  curve:
    CatmullRomCurve3,

  ceilingLane:
    number,

  index:
    number,
):
  TerminalFlowCurves {
  const wall =
    getControlTerminalWallFrame(
      curve,
    );

  const hole =
    getControlTerminalHoleFrame(
      curve,
    );

  const wallLanes = [
    -2.62,
    -2.28,
    -1.94,
    1.94,
    2.28,
    2.62,
  ];

  const wallLane =
    wallLanes[
      index
    ] ??
    0;

  const wallTop =
    wall.center
      .clone()
      .addScaledVector(
        wall.up,
        4.08,
      )
      .addScaledVector(
        wall.side,
        wallLane,
      )
      .addScaledVector(
        wall.cameraNormal,
        0.12,
      );

  const wallUpper =
    wall.center
      .clone()
      .addScaledVector(
        wall.up,
        2.52,
      )
      .addScaledVector(
        wall.side,
        wallLane,
      )
      .addScaledVector(
        wall.cameraNormal,
        0.12,
      );

  const wallLower =
    wall.center
      .clone()
      .addScaledVector(
        wall.up,
        -2.36,
      )
      .addScaledVector(
        wall.side,
        wallLane *
          0.92,
      )
      .addScaledVector(
        wall.cameraNormal,
        0.12,
      );

  const belowLogo =
    wall.center
      .clone()
      .addScaledVector(
        wall.up,
        -3.38,
      )
      .addScaledVector(
        wall.side,
        wallLane *
          0.56,
      )
      .addScaledVector(
        wall.cameraNormal,
        0.15,
      );

  const holeApproach =
    hole.position
      .clone()
      .addScaledVector(
        hole.tangent,
        1.34,
      )
      .addScaledVector(
        hole.side,
        ceilingLane *
          0.36,
      );

  holeApproach.y +=
    0.11;

  const holeRim =
    hole.position
      .clone()
      .addScaledVector(
        hole.tangent,
        0.5,
      )
      .addScaledVector(
        hole.side,
        ceilingLane *
          0.18,
      );

  holeRim.y +=
    0.07;

  const descentCurve =
    new CatmullRomCurve3(
      [
        wallTop,
        wallUpper,
        wallLower,
        belowLogo,
        holeApproach,
        holeRim,
      ],
      false,
      "catmullrom",
      0.36,
    );

  /*
   * The first shaft point is EXACTLY the descent endpoint.
   * This removes the visible cut/gap before the hole.
   */
  const shaftStart =
    holeRim.clone();

  /*
   * Very short entrance bend:
   * after this point the strand is physically vertical.
   */
  const shaftEntry =
    hole.position
      .clone()
      .addScaledVector(
        hole.side,
        ceilingLane *
          0.18,
      );

  shaftEntry.y -=
    0.34;

  const shaftMid =
    shaftEntry.clone();

  shaftMid.y -=
    3.25;

  const shaftEnd =
    shaftEntry.clone();

  /*
   * Extend well past the final camera framing so the lower endpoint never
   * appears as a floating/open tip during the handoff.
   */
  shaftEnd.y -=
    8.8;

  const shaftCurve =
    new CatmullRomCurve3(
      [
        shaftStart,
        shaftEntry,
        shaftMid,
        shaftEnd,
      ],
      false,
      "catmullrom",
      0.2,
    );

  return {
    descentCurve,
    shaftCurve,
    shaftStart,
    shaftEnd,
  };
}
