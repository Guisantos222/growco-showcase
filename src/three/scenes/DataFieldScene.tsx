"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { Line, Text } from "@react-three/drei";
import { useDemoStore } from "@/store/demoStore";

import { DataNode } from "@/three/objects/DataNode";

export function DataFieldScene() {
    const group = useRef<Group>(null);
    const registerSale = useDemoStore(
        (state) => state.registerSale,
    );

    function handleNodeClick() {
        registerSale({
            id: crypto.randomUUID(),
            product: "Café Especial",
            quantity: 2,
            total: 119.8,
        });
    }

    useFrame((state) => {
        if (!group.current) {
            return;
        }

        const targetX = state.pointer.y * 0.18;
        const targetY = state.pointer.x * 0.25;

        group.current.rotation.x +=
            (targetX - group.current.rotation.x) * 0.04;

        group.current.rotation.y +=
            (targetY - group.current.rotation.y) * 0.04;
    });

    return (
        <group ref={group}>
            <Line
                points={[[0, 0, 0], [-2, 1, 0]]}
                color="#0BA5FF"
                lineWidth={1}
            />

            <Line
                points={[[0, 0, 0], [2, 1, -1]]}
                color="#0BA5FF"
                lineWidth={1}
            />

            <Line
                points={[[0, 0, 0], [-1.5, -1.5, -2]]}
                color="#0BA5FF"
                lineWidth={1}
            />

            <Line
                points={[[0, 0, 0], [1.5, -1.5, 1]]}
                color="#0BA5FF"
                lineWidth={1}
            />
            <Text
                position={[0, 0, 0]}
                fontSize={0.5}
                color="white"
                anchorX="center"
                anchorY="middle"
            >
                growCo.
            </Text>
            <DataNode
                position={[-2, 1, 0]}
                onClick={handleNodeClick}
            />
            <DataNode position={[2, 1, -1]} />
            <DataNode position={[-1.5, -1.5, -2]} />
            <DataNode position={[1.5, -1.5, 1]} />
        </group>
    );
}