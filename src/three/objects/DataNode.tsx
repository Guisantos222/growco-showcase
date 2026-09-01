"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useDemoStore } from "@/store/demoStore";
import type { Mesh } from "three";

type DataNodeProps = {
    position?: [number, number, number];
    onClick?: () => void;
};

export function DataNode({
    position = [0, 0, 0],
    onClick,
}: DataNodeProps) {
    const mesh = useRef<Mesh>(null);

    const revenue = useDemoStore(
  (state) => state.revenue,
);

    useFrame((state) => {
  if (!mesh.current) {
    return;
  }

  mesh.current.rotation.y += 0.005;

  mesh.current.position.y =
    position[1] +
    Math.sin(state.clock.elapsedTime + position[0]) * 0.08;

  const revenueIncrease = revenue - 31480;

  const targetScale =
    1 + Math.min(revenueIncrease / 5000, 0.4);

  const currentScale = mesh.current.scale.x;

  const nextScale =
    currentScale +
    (targetScale - currentScale) * 0.06;

  mesh.current.scale.setScalar(nextScale);
});

    return (
        <mesh
            ref={mesh}
            position={position}
            onClick={onClick}
        >
            <sphereGeometry args={[0.65, 48, 48]} />

            <meshStandardMaterial
                color="#0BA5FF"
                roughness={0.25}
                metalness={0.1}
            />
        </mesh>
    );
}