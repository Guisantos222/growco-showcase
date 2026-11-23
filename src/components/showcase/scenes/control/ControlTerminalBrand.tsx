"use client";

import {
  useEffect,
  useMemo,
  useRef,
} from "react";

import type {
  MutableRefObject,
} from "react";

import {
  useThree,
} from "@react-three/fiber";

import {
  Text,
} from "@react-three/drei";

import {
  gsap,
} from "gsap";

import {
  CatmullRomCurve3,
  Group,
  Mesh,
  PlaneGeometry,
} from "three";

import {
  CONTROL_TERMINAL,
} from "@/components/showcase/scenes/control/controlWorldConfig";

import {
  getControlTerminalWallFrame,
} from "@/components/showcase/scenes/control/controlTerminalMath";

type ControlTerminalBrandProps = {
  curve:
    CatmullRomCurve3;

  travelRef:
    MutableRefObject<number>;
};

/*
 * ============================================================================
 * CONTROL TERMINAL BRAND — POLISHED
 * ============================================================================
 *
 * Goal:
 * - look like the attached growCo. wordmark;
 * - keep the exact writing "growCo.";
 * - blue front face, subtle 3D depth;
 * - readable from camera, centered on final wall;
 * - no mirrored / skewed weirdness.
 *
 * Instead of trying to fake the logo with abstract strokes, this version uses
 * layered 3D text planes:
 *
 * 1. rear depth slab
 * 2. mid slab
 * 3. front face
 *
 * This keeps the visual close to the real logo while still feeling modeled
 * and embedded in the tunnel world.
 */

export function ControlTerminalBrand({
  curve,
  travelRef,
}: ControlTerminalBrandProps) {
  const {
    invalidate,
  } =
    useThree();

  const wall =
    useMemo(
      () =>
        getControlTerminalWallFrame(
          curve,
        ),
      [
        curve,
      ],
    );

  const rootRef =
    useRef<Group>(
      null,
    );

  const faceRef =
    useRef<Group>(
      null,
    );

  const plateRef =
    useRef<Mesh>(
      null,
    );

  const backPlateGeometry =
    useMemo(
      () =>
        new PlaneGeometry(
          4.9,
          1.85,
          1,
          1,
        ),
      [],
    );

  useEffect(() => {
    let previousTravel =
      Number.NaN;

    const update = () => {
      const travel =
        Math.max(
          0,
          travelRef.current,
        );

      if (
        Number.isFinite(
          previousTravel,
        ) &&
        Math.abs(
          travel -
          previousTravel,
        ) <
          0.00001
      ) {
        return;
      }

      previousTravel =
        travel;

      const build =
        smootherstep(
          range(
            travel,
            CONTROL_TERMINAL.brandBuildStart,
            CONTROL_TERMINAL.brandBuildEnd,
          ),
        );

      const fadeOut =
        smootherstep(
          range(
            travel,
            CONTROL_TERMINAL.brandFadeStart,
            CONTROL_TERMINAL.brandFadeEnd,
          ),
        );

      const visibleAmount =
        Math.max(
          0,
          1 - fadeOut,
        );

      const root =
        rootRef.current;

      const face =
        faceRef.current;

      const plate =
        plateRef.current;

      if (root) {
        root.visible =
          visibleAmount >
          0.001;

        const introY =
          mix(
            0.18,
            0,
            build,
          );

        const introZ =
          mix(
            0.16,
            0,
            build,
          );

        root.position.set(
          wall.center.x,
          wall.center.y +
            0.72 +
            introY,
          wall.center.z,
        );

        root.quaternion.copy(
          wall.quaternion,
        );

        root.scale.setScalar(
          mix(
            0.82,
            1,
            build,
          ) *
            visibleAmount,
        );
      }

      if (face) {
        face.rotation.set(
          0,
          Math.PI,
          mix(
            0.09,
            0,
            build,
          ),
        );

        face.position.z =
          -0.12 -
          introZValue(
            build,
          );

        face.position.y =
          mix(
            0.04,
            0,
            build,
          );
      }

      if (plate) {
        plate.visible =
          visibleAmount >
          0.001;
        plate.scale.set(
          mix(
            0.86,
            1,
            build,
          ),
          mix(
            0.72,
            1,
            build,
          ),
          1,
        );
      }

      invalidate();
    };

    gsap.ticker.add(
      update,
    );
    update();

    return () => {
      gsap.ticker.remove(
        update,
      );
    };
  }, [
    invalidate,
    travelRef,
    wall,
  ]);

  return (
    <group
      ref={rootRef}
      name="control-terminal-brand"
    >
      {/*
       * Soft dark plate behind the logo. Keeps the wordmark readable and
       * anchors it physically on the terminal wall.
       */}
      <mesh
        ref={plateRef}
        geometry={
          backPlateGeometry
        }
        position={[
          0,
          0,
          -0.145,
        ]}
      >
        <meshStandardMaterial
          color="#0A1320"
          transparent
          opacity={0.94}
          roughness={0.78}
          metalness={0.08}
        />
      </mesh>

      <group
        ref={faceRef}
        position={[
          0,
          0,
          -0.12,
        ]}
      >
        {/*
         * Rear depth layer
         */}
        <Text
          anchorX="center"
          anchorY="middle"
          fontSize={0.92}
          letterSpacing={-0.028}
          position={[
            0.03,
            -0.03,
            -0.06,
          ]}
          color="#0A3F68"
          fillOpacity={1}
        >
          growCo.
        </Text>

        {/*
         * Mid layer
         */}
        <Text
          anchorX="center"
          anchorY="middle"
          fontSize={0.92}
          letterSpacing={-0.028}
          position={[
            0.016,
            -0.016,
            -0.03,
          ]}
          color="#1F6FAE"
          fillOpacity={1}
        >
          growCo.
        </Text>

        {/*
         * Front face
         */}
        <Text
          anchorX="center"
          anchorY="middle"
          fontSize={0.92}
          letterSpacing={-0.028}
          position={[
            0,
            0,
            0,
          ]}
          color="#4FA6FF"
          fillOpacity={1}
        >
          growCo.
        </Text>

        {/*
         * Crisp highlight
         */}
        <Text
          anchorX="center"
          anchorY="middle"
          fontSize={0.92}
          letterSpacing={-0.028}
          position={[
            -0.012,
            0.012,
            0.012,
          ]}
          color="#7CC4FF"
          fillOpacity={0.18}
        >
          growCo.
        </Text>
      </group>

      {/*
       * Localized glow around the finished wordmark.
       */}
      <pointLight
        position={[
          0,
          0.08,
          -0.56,
        ]}
        color="#53AEFF"
        intensity={2.35}
        distance={7.2}
        decay={2}
      />
    </group>
  );
}

function introZValue(
  build:
    number,
) {
  return mix(
    0.08,
    0,
    build,
  );
}

function range(
  value:
    number,
  start:
    number,
  end:
    number,
) {
  if (
    value <=
    start
  ) {
    return 0;
  }

  if (
    value >=
    end
  ) {
    return 1;
  }

  return (
    value -
    start
  ) /
  (
    end -
    start
  );
}

function smootherstep(
  value:
    number,
) {
  const t =
    Math.min(
      1,
      Math.max(
        0,
        value,
      ),
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
