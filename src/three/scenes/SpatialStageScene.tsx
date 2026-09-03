"use client";

import {
  useMemo,
  useRef,
} from "react";

import {
  RoundedBox,
  Text,
} from "@react-three/drei";

import {
  useFrame,
} from "@react-three/fiber";

import {
  MathUtils,
  Vector3,
} from "three";

import type {
  Group,
} from "three";

type SpatialStageSceneProps = {
  progressRef: {
    current: number;
  };
};

export function SpatialStageScene({
  progressRef,
}: SpatialStageSceneProps) {
  const foreground =
    useRef<Group>(null);

  const midground =
    useRef<Group>(null);

  const productPlane =
    useRef<Group>(null);

  const background =
    useRef<Group>(null);

  const lookTarget =
    useMemo(
      () => new Vector3(),
      [],
    );

  useFrame(
    (state, delta) => {
      const progress =
        MathUtils.clamp(
          progressRef.current,
          0,
          1,
        );

      const pointerX =
        state.pointer.x;

      const pointerY =
        state.pointer.y;

      /*
       * CAMERA
       *
       * Começa longe da composição
       * e atravessa as primeiras
       * camadas durante o scroll.
       */

      const targetCameraZ =
        MathUtils.lerp(
          9.5,
          1.8,
          progress,
        );

      const targetCameraX =
        MathUtils.lerp(
          -0.35,
          0.3,
          progress,
        ) +
        pointerX * 0.28;

      const targetCameraY =
        MathUtils.lerp(
          0.65,
          0.05,
          progress,
        ) +
        pointerY * 0.18;

      state.camera.position.x =
        MathUtils.damp(
          state.camera.position.x,
          targetCameraX,
          4,
          delta,
        );

      state.camera.position.y =
        MathUtils.damp(
          state.camera.position.y,
          targetCameraY,
          4,
          delta,
        );

      state.camera.position.z =
        MathUtils.damp(
          state.camera.position.z,
          targetCameraZ,
          4,
          delta,
        );

      /*
       * O ponto observado também
       * se desloca levemente.
       */

      lookTarget.set(
        MathUtils.lerp(
          -0.3,
          0.25,
          progress,
        ),
        MathUtils.lerp(
          0.2,
          0,
          progress,
        ),
        -1.2,
      );

      state.camera.lookAt(
        lookTarget,
      );

      /*
       * FOREGROUND
       *
       * A camada mais próxima
       * responde mais ao cursor.
       */

      if (foreground.current) {
        foreground.current.position.x =
          MathUtils.damp(
            foreground.current.position.x,
            pointerX * -0.6,
            3,
            delta,
          );

        foreground.current.position.y =
          MathUtils.damp(
            foreground.current.position.y,
            pointerY * -0.35,
            3,
            delta,
          );

        foreground.current.rotation.y =
          MathUtils.damp(
            foreground.current.rotation.y,
            pointerX * 0.08 +
              progress * 0.05,
            3,
            delta,
          );
      }

      /*
       * MIDGROUND
       */

      if (midground.current) {
        midground.current.position.x =
          MathUtils.damp(
            midground.current.position.x,
            pointerX * -0.28,
            3,
            delta,
          );

        midground.current.position.y =
          MathUtils.damp(
            midground.current.position.y,
            pointerY * -0.16,
            3,
            delta,
          );

        midground.current.rotation.y =
          MathUtils.damp(
            midground.current.rotation.y,
            pointerX * 0.04,
            3,
            delta,
          );
      }

      /*
       * PRODUCT PLANE
       *
       * Bem mais estável.
       */

      if (
        productPlane.current
      ) {
        productPlane.current.position.x =
          MathUtils.damp(
            productPlane.current.position.x,
            pointerX * -0.08,
            3,
            delta,
          );

        productPlane.current.position.y =
          MathUtils.damp(
            productPlane.current.position.y,
            pointerY * -0.05,
            3,
            delta,
          );
      }

      /*
       * BACKGROUND
       *
       * Quase não acompanha
       * o cursor.
       */

      if (background.current) {
        background.current.position.x =
          MathUtils.damp(
            background.current.position.x,
            pointerX * 0.06,
            3,
            delta,
          );

        background.current.position.y =
          MathUtils.damp(
            background.current.position.y,
            pointerY * 0.04,
            3,
            delta,
          );
      }
    },
  );

  return (
    <>
      <color
        attach="background"
        args={["#090b12"]}
      />

      <fog
        attach="fog"
        args={[
          "#090b12",
          8,
          18,
        ]}
      />

      {/* LIGHTING */}

      <hemisphereLight
        intensity={1.6}
        color="#dbeeff"
        groundColor="#05070b"
      />

      <directionalLight
        position={[
          -4,
          6,
          8,
        ]}
        intensity={2.8}
      />

      <directionalLight
        position={[
          5,
          -2,
          4,
        ]}
        intensity={1.2}
        color="#0BA5FF"
      />

      {/* ===================== */}
      {/* FOREGROUND            */}
      {/* ===================== */}

      <group ref={foreground}>
        <mesh
          position={[
            -3.2,
            -1.1,
            5,
          ]}
          rotation={[
            1.05,
            0.25,
            0.3,
          ]}
          scale={1.35}
        >
          <torusGeometry
            args={[
              0.85,
              0.34,
              32,
              64,
            ]}
          />

          <meshStandardMaterial
            color="#151a27"
            roughness={0.92}
            metalness={0.02}
          />
        </mesh>

        <RoundedBox
          args={[
            2.2,
            2.5,
            1.6,
          ]}
          radius={0.22}
          smoothness={5}
          position={[
            3.25,
            -0.15,
            4.7,
          ]}
          rotation={[
            0.2,
            -0.48,
            0.18,
          ]}
        >
          <meshStandardMaterial
            color="#171c2a"
            roughness={0.9}
            metalness={0.015}
          />
        </RoundedBox>

        <mesh
          position={[
            0.1,
            2.35,
            4.4,
          ]}
          scale={0.58}
        >
          <sphereGeometry
            args={[
              1,
              48,
              48,
            ]}
          />

          <meshStandardMaterial
            color="#0BA5FF"
            roughness={0.88}
            metalness={0}
          />
        </mesh>
      </group>

      {/* ===================== */}
      {/* MIDGROUND             */}
      {/* ===================== */}

      <group ref={midground}>
        <RoundedBox
          args={[
            1.5,
            1.5,
            1.5,
          ]}
          radius={0.18}
          smoothness={5}
          position={[
            -2.7,
            1.05,
            2.45,
          ]}
          rotation={[
            0.35,
            0.45,
            -0.2,
          ]}
        >
          <meshStandardMaterial
            color="#1a2030"
            roughness={0.94}
            metalness={0}
          />
        </RoundedBox>

        <mesh
          position={[
            2.5,
            1.3,
            2.1,
          ]}
          scale={0.85}
        >
          <icosahedronGeometry
            args={[
              1,
              1,
            ]}
          />

          <meshStandardMaterial
            color="#20283a"
            roughness={0.92}
            metalness={0}
          />
        </mesh>

        <mesh
          position={[
            2.75,
            -1.55,
            1.9,
          ]}
          rotation={[
            1.2,
            0.2,
            0.6,
          ]}
        >
          <torusGeometry
            args={[
              0.75,
              0.25,
              32,
              64,
            ]}
          />

          <meshStandardMaterial
            color="#121722"
            roughness={0.96}
            metalness={0}
          />
        </mesh>

        <mesh
          position={[
            -2,
            -1.65,
            2.2,
          ]}
          scale={0.5}
        >
          <sphereGeometry
            args={[
              1,
              40,
              40,
            ]}
          />

          <meshStandardMaterial
            color="#273149"
            roughness={0.9}
            metalness={0}
          />
        </mesh>
      </group>

      {/* ===================== */}
      {/* PRODUCT PLANE         */}
      {/* ===================== */}

      <group
        ref={productPlane}
        position={[
          0,
          0,
          -0.3,
        ]}
      >
        <RoundedBox
          args={[
            4.6,
            2.6,
            0.62,
          ]}
          radius={0.2}
          smoothness={6}
        >
          <meshStandardMaterial
            color="#141923"
            roughness={0.9}
            metalness={0.01}
          />
        </RoundedBox>

        <Text
          position={[
            0,
            0.28,
            0.36,
          ]}
          fontSize={0.68}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          growCo.
        </Text>

        <Text
          position={[
            0,
            -0.5,
            0.36,
          ]}
          fontSize={0.2}
          color="#7f8b9d"
          anchorX="center"
          anchorY="middle"
        >
          DATA IN MOTION
        </Text>

        <RoundedBox
          args={[
            1.65,
            0.1,
            0.08,
          ]}
          radius={0.04}
          position={[
            0,
            -0.95,
            0.38,
          ]}
        >
          <meshStandardMaterial
            color="#0BA5FF"
            roughness={0.85}
          />
        </RoundedBox>
      </group>

      {/* ===================== */}
      {/* BACKGROUND            */}
      {/* ===================== */}

      <group ref={background}>
        <mesh
          position={[
            3.3,
            1.15,
            -3,
          ]}
          scale={1.55}
        >
          <sphereGeometry
            args={[
              1,
              48,
              48,
            ]}
          />

          <meshStandardMaterial
            color="#151a25"
            roughness={0.96}
            metalness={0}
          />
        </mesh>

        <RoundedBox
          args={[
            2.3,
            2.3,
            2.3,
          ]}
          radius={0.25}
          smoothness={5}
          position={[
            -3.3,
            0.15,
            -3.8,
          ]}
          rotation={[
            0.3,
            0.5,
            0.25,
          ]}
        >
          <meshStandardMaterial
            color="#111620"
            roughness={0.96}
            metalness={0}
          />
        </RoundedBox>

        <mesh
          position={[
            0.2,
            -2.4,
            -4.1,
          ]}
          rotation={[
            1.1,
            0,
            0.3,
          ]}
          scale={1.4}
        >
          <torusGeometry
            args={[
              1,
              0.38,
              32,
              64,
            ]}
          />

          <meshStandardMaterial
            color="#192131"
            roughness={0.94}
            metalness={0}
          />
        </mesh>
      </group>
    </>
  );
}