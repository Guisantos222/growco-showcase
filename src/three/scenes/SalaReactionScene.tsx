"use client";

import {
  useEffect,
  useRef,
} from "react";

import {
  Line,
  Text,
} from "@react-three/drei";

import { useFrame } from "@react-three/fiber";

import type {
  Group,
  Mesh,
  MeshStandardMaterial,
} from "three";

import { useDemoStore } from "@/store/demoStore";

export function SaleReactionScene() {
  const group = useRef<Group>(null);

  const core = useRef<Mesh>(null);

  const financeNode = useRef<Mesh>(null);
  const stockNode = useRef<Mesh>(null);
  const goalNode = useRef<Mesh>(null);

  const coreMaterial =
    useRef<MeshStandardMaterial>(null);

  const pulse = useRef(0);

  const lastSaleId = useDemoStore(
    (state) => state.lastSale?.id ?? null,
  );

  const revenue = useDemoStore(
    (state) => state.revenue,
  );

  const stock = useDemoStore(
    (state) => state.stock,
  );

  const goalProgress = useDemoStore(
    (state) => state.goalProgress,
  );

  useEffect(() => {
    if (!lastSaleId) {
      pulse.current = 0;
      return;
    }

    pulse.current = 1;
  }, [lastSaleId]);

  useFrame((state, delta) => {
    if (
      !group.current ||
      !core.current ||
      !financeNode.current ||
      !stockNode.current ||
      !goalNode.current
    ) {
      return;
    }

    // Cursor / pointer influencia suavemente o ecossistema.
    const targetRotationX =
      state.pointer.y * 0.12;

    const targetRotationY =
      state.pointer.x * 0.18;

    group.current.rotation.x +=
      (
        targetRotationX -
        group.current.rotation.x
      ) * 0.035;

    group.current.rotation.y +=
      (
        targetRotationY -
        group.current.rotation.y
      ) * 0.035;

    // Movimento contínuo do núcleo.
    core.current.rotation.y +=
      delta * 0.35;

    core.current.rotation.x +=
      delta * 0.15;

    // Pulso provocado por uma nova venda.
    pulse.current = Math.max(
      0,
      pulse.current - delta * 0.8,
    );

    const pulseWave =
      Math.sin(
        pulse.current *
          Math.PI,
      ) *
      pulse.current;

    const coreTargetScale =
      1 + pulseWave * 0.65;

    const currentCoreScale =
      core.current.scale.x;

    const nextCoreScale =
      currentCoreScale +
      (
        coreTargetScale -
        currentCoreScale
      ) *
        0.12;

    core.current.scale.setScalar(
      nextCoreScale,
    );

    // Receita afeta o módulo financeiro.
    const revenueIncrease =
      revenue - 31480;

    const financeTargetScale =
      1 +
      Math.min(
        revenueIncrease / 4000,
        0.22,
      );

    financeNode.current.scale.setScalar(
      financeNode.current.scale.x +
        (
          financeTargetScale -
          financeNode.current.scale.x
        ) *
          0.06,
    );

    // Estoque menor = módulo mais "urgente".
    const stockPressure =
      1 -
      stock / 24;

    const stockTargetScale =
      1 +
      Math.max(
        0,
        stockPressure,
      ) *
        0.18;

    stockNode.current.scale.setScalar(
      stockNode.current.scale.x +
        (
          stockTargetScale -
          stockNode.current.scale.x
        ) *
          0.06,
    );

    // Meta progride espacialmente.
    const goalTargetScale =
      1 +
      Math.max(
        0,
        goalProgress - 72,
      ) *
        0.012;

    goalNode.current.scale.setScalar(
      goalNode.current.scale.x +
        (
          goalTargetScale -
          goalNode.current.scale.x
        ) *
          0.06,
    );

    if (coreMaterial.current) {
      coreMaterial.current.emissiveIntensity =
        0.4 +
        pulseWave * 1.8;
    }

    // Respiração dos módulos.
    const time =
      state.clock.elapsedTime;

    financeNode.current.position.y =
      0.2 +
      Math.sin(time * 0.9) *
        0.04;

    stockNode.current.position.y =
      1.8 +
      Math.sin(
        time * 0.85 + 1,
      ) *
        0.04;

    goalNode.current.position.y =
      -1.4 +
      Math.sin(
        time * 0.8 + 2,
      ) *
        0.04;
  });

  return (
    <group ref={group}>
      {/* CORE */}

      <mesh ref={core}>
        <icosahedronGeometry
          args={[0.7, 2]}
        />

        <meshStandardMaterial
          ref={coreMaterial}
          color="#0BA5FF"
          emissive="#0BA5FF"
          emissiveIntensity={0.4}
          roughness={0.2}
          metalness={0.15}
        />
      </mesh>

      <Text
        position={[0, -1.15, 0]}
        fontSize={0.32}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        growCo.
      </Text>

      {/* FINANCE */}

      <mesh
        ref={financeNode}
        position={[-2.8, 0.2, -0.6]}
      >
        <sphereGeometry
          args={[0.42, 32, 32]}
        />

        <meshStandardMaterial
          color="#0BA5FF"
          roughness={0.3}
        />
      </mesh>

      <Text
        position={[-2.8, -0.55, -0.6]}
        fontSize={0.23}
        color="white"
        anchorX="center"
      >
        FINANCEIRO
      </Text>

      {/* STOCK */}

      <mesh
        ref={stockNode}
        position={[0.2, 1.8, -1]}
      >
        <sphereGeometry
          args={[0.42, 32, 32]}
        />

        <meshStandardMaterial
          color="#0BA5FF"
          roughness={0.3}
        />
      </mesh>

      <Text
        position={[0.2, 2.55, -1]}
        fontSize={0.23}
        color="white"
        anchorX="center"
      >
        ESTOQUE
      </Text>

      {/* GOAL */}

      <mesh
        ref={goalNode}
        position={[2.8, -1.4, 0.3]}
      >
        <sphereGeometry
          args={[0.42, 32, 32]}
        />

        <meshStandardMaterial
          color="#0BA5FF"
          roughness={0.3}
        />
      </mesh>

      <Text
        position={[2.8, -2.15, 0.3]}
        fontSize={0.23}
        color="white"
        anchorX="center"
      >
        META
      </Text>

      {/* CONNECTIONS */}

      <Line
        points={[
          [0, 0, 0],
          [-2.8, 0.2, -0.6],
        ]}
        color="#0BA5FF"
        transparent
        opacity={0.35}
        lineWidth={1}
      />

      <Line
        points={[
          [0, 0, 0],
          [0.2, 1.8, -1],
        ]}
        color="#0BA5FF"
        transparent
        opacity={0.35}
        lineWidth={1}
      />

      <Line
        points={[
          [0, 0, 0],
          [2.8, -1.4, 0.3],
        ]}
        color="#0BA5FF"
        transparent
        opacity={0.35}
        lineWidth={1}
      />
    </group>
  );
}