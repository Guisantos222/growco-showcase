"use client";

import {
  useMemo,
} from "react";

import {
  BackSide,
  CatmullRomCurve3,
  DoubleSide,
  Quaternion,
  Vector3,
} from "three";

import {
  CONTROL_TERMINAL,
} from "@/components/showcase/scenes/control/controlWorldConfig";

type ControlTerminalStageProps = {
  curve:
    CatmullRomCurve3;
};

type WallTransform = {
  position:
    Vector3;

  quaternion:
    Quaternion;
};

type HoleTransform = {
  position:
    Vector3;

  yaw:
    number;
};

/*
 * ============================================================================
 * CONTROL TERMINAL STAGE — PHYSICAL ARCHITECTURE
 * ============================================================================
 *
 * This component owns the static PHYSICAL END of the CONTROL tunnel.
 *
 * Animated systems are intentionally separated into:
 *
 * - ControlTerminalBrand;
 * - ControlTerminalFlow;
 * - ControlTunnelCamera.
 *
 * This file remains the stable architecture those systems attach to.
 *
 * It provides:
 *
 * 1. a real terminal wall perpendicular to the tunnel path;
 * 2. a recessed central brand mounting zone;
 * 3. a real-looking floor aperture;
 * 4. a dark vertical shaft under the aperture;
 * 5. terminal lighting;
 * 6. physical anchors for future line and camera systems.
 */

export function ControlTerminalStage({
  curve,
}: ControlTerminalStageProps) {
  const wall =
    useMemo(
      () =>
        getWallTransform(
          curve,
          CONTROL_TERMINAL.wallT,
        ),
      [
        curve,
      ],
    );

  const hole =
    useMemo(
      () =>
        getHoleTransform(
          curve,
          CONTROL_TERMINAL.holeT,
        ),
      [
        curve,
      ],
    );

  return (
    <group
      name="control-terminal-stage"
    >
      {/*
       * ======================================================================
       * FINAL WALL
       * ======================================================================
       *
       * A circular cap matches the current tunnel section better than a
       * disconnected rectangular "screen".
       *
       * The wall is matte and only slightly brighter than the tunnel shell.
       */}
      <group
        name="control-terminal-wall"
        position={[
          wall.position.x,
          wall.position.y,
          wall.position.z,
        ]}
        quaternion={
          wall.quaternion
        }
      >
        <mesh>
          <circleGeometry
            args={[
              4.92,
              64,
            ]}
          />

          <meshStandardMaterial
            color="#16313D"
            roughness={
              0.93
            }
            metalness={
              0.035
            }
            emissive="#071720"
            emissiveIntensity={
              0.34
            }
            side={
              DoubleSide
            }
          />
        </mesh>

        {/*
         * Wide architectural recess.
         *
         * Part 2 will construct growCo. INSIDE this area.
         */}
        <mesh
          position={[
            0,
            0.62,
            -0.035,
          ]}
        >
          <boxGeometry
            args={[
              5.45,
              2.05,
              0.12,
            ]}
          />

          <meshStandardMaterial
            color="#0D222C"
            roughness={
              0.9
            }
            metalness={
              0.035
            }
            emissive="#06131B"
            emissiveIntensity={
              0.2
            }
          />
        </mesh>

        {/*
         * Brand construction anchor.
         *
         * Intentionally empty in Part 1.
         */}
        <group
          name="control-terminal-brand-anchor"
          position={[
            0,
            0.62,
            -0.13,
          ]}
        />

        {/*
         * Terminal architectural light bars.
         *
         * They frame the destination instead of outlining the entire wall.
         */}
        <mesh
          position={[
            -3.18,
            0.7,
            -0.08,
          ]}
        >
          <boxGeometry
            args={[
              0.075,
              2.7,
              0.045,
            ]}
          />

          <meshBasicMaterial
            color="#77D1F8"
            transparent
            opacity={
              0.52
            }
            toneMapped={
              false
            }
          />
        </mesh>

        <mesh
          position={[
            3.18,
            0.7,
            -0.08,
          ]}
        >
          <boxGeometry
            args={[
              0.075,
              2.7,
              0.045,
            ]}
          />

          <meshBasicMaterial
            color="#77D1F8"
            transparent
            opacity={
              0.52
            }
            toneMapped={
              false
            }
          />
        </mesh>

        <mesh
          position={[
            0,
            2.18,
            -0.08,
          ]}
        >
          <boxGeometry
            args={[
              3.0,
              0.055,
              0.04,
            ]}
          />

          <meshBasicMaterial
            color="#8EDBFA"
            transparent
            opacity={
              0.38
            }
            toneMapped={
              false
            }
          />
        </mesh>

        {/*
         * Soft destination lighting.
         */}
        <pointLight
          position={[
            0,
            0.9,
            -2.3,
          ]}
          color="#8BD8F8"
          intensity={
            7.4
          }
          distance={
            15
          }
          decay={
            2
          }
        />

        <pointLight
          position={[
            0,
            -2.35,
            -1.4,
          ]}
          color="#3CAFE3"
          intensity={
            3.1
          }
          distance={
            10
          }
          decay={
            2
          }
        />

        {/*
         * Future line descent anchor:
         *
         * Part 3 will use this group as the point where the six
         * ceiling lanes bend downward across the final wall.
         */}
        <group
          name="control-terminal-line-descent-anchor"
          position={[
            0,
            3.95,
            0.1,
          ]}
        />
      </group>

      {/*
       * ======================================================================
       * FLOOR APERTURE
       * ======================================================================
       *
       * The existing floor ribbon remains intact underneath.
       *
       * We visually cut through it using a deep black aperture surface,
       * a bright-but-restrained rim and an actual dark shaft below.
       *
       * In the camera-fall pass we can hide/cut the underlying floor only
       * during the final drop if necessary.
       */}
      <group
        name="control-terminal-hole"
        position={[
          hole.position.x,
          hole.position.y,
          hole.position.z,
        ]}
        rotation={[
          0,
          hole.yaw,
          0,
        ]}
      >
        {/*
         * Black mouth.
         */}
        <mesh
          rotation={[
            -Math.PI /
              2,
            0,
            0,
          ]}
          position={[
            0,
            0.035,
            0,
          ]}
        >
          <circleGeometry
            args={[
              1.72,
              64,
            ]}
          />

          <meshBasicMaterial
            color="#010203"
            side={
              DoubleSide
            }
            toneMapped={
              false
            }
          />
        </mesh>

        {/*
         * Matte structural ring.
         */}
        <mesh
          rotation={[
            Math.PI /
              2,
            0,
            0,
          ]}
          position={[
            0,
            0.06,
            0,
          ]}
        >
          <torusGeometry
            args={[
              1.78,
              0.105,
              16,
              72,
            ]}
          />

          <meshStandardMaterial
            color="#173541"
            roughness={
              0.72
            }
            metalness={
              0.09
            }
            emissive="#09212D"
            emissiveIntensity={
              0.34
            }
          />
        </mesh>


        {/*
         * ACTUAL SHAFT VOLUME
         *
         * Open-ended cylinder viewed from inside.
         */}
        <mesh
          position={[
            0,
            -4.0,
            0,
          ]}
        >
          <cylinderGeometry
            args={[
              1.68,
              1.86,
              8.1,
              48,
              1,
              true,
            ]}
          />

          <meshStandardMaterial
            color="#061018"
            roughness={
              0.94
            }
            metalness={
              0.025
            }
            emissive="#030A0F"
            emissiveIntensity={
              0.22
            }
            side={
              BackSide
            }
          />
        </mesh>

        {/*
         * Very distant dark cap.
         * This prevents the shaft from reading as a shallow cylinder.
         */}
        <mesh
          rotation={[
            -Math.PI /
              2,
            0,
            0,
          ]}
          position={[
            0,
            -8.02,
            0,
          ]}
        >
          <circleGeometry
            args={[
              1.84,
              48,
            ]}
          />

          <meshBasicMaterial
            color="#000102"
            side={
              DoubleSide
            }
          />
        </mesh>


        {/*
         * Future camera target.
         *
         * Part 4 will smoothly pitch toward this anchor and then
         * continue down the shaft.
         */}
        <group
          name="control-terminal-fall-target"
          position={[
            0,
            -3.2,
            0,
          ]}
        />

        {/*
         * Future line sink target.
         */}
        <group
          name="control-terminal-line-sink"
          position={[
            0,
            -0.15,
            0,
          ]}
        />
      </group>
    </group>
  );
}

/*
 * ============================================================================
 * TRANSFORMS
 * ============================================================================
 */

function getWallTransform(
  curve:
    CatmullRomCurve3,

  t:
    number,
):
  WallTransform {
  const position =
    curve.getPointAt(
      t,
    );

  const tangent =
    curve
      .getTangentAt(
        t,
      )
      .normalize();

  const quaternion =
    new Quaternion();

  /*
   * circleGeometry normal = +Z.
   *
   * Align it with the tunnel path.
   * Material is DoubleSide, so camera-facing orientation remains safe.
   */
  quaternion.setFromUnitVectors(
    new Vector3(
      0,
      0,
      1,
    ),
    tangent,
  );

  return {
    position,

    quaternion,
  };
}

function getHoleTransform(
  curve:
    CatmullRomCurve3,

  t:
    number,
):
  HoleTransform {
  const position =
    curve.getPointAt(
      t,
    );

  const tangent =
    curve
      .getTangentAt(
        t,
      )
      .normalize();

  /*
   * Match the same world-floor height used by ControlEntryTunnel.
   */
  position.y -=
    3.695;

  const yaw =
    Math.atan2(
      tangent.x,
      -tangent.z,
    );

  return {
    position,

    yaw,
  };
}
