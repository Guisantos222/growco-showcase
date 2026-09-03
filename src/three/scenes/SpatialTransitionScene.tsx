"use client";

import { useRef } from "react";

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

type SpatialTransitionSceneProps = {
    progressRef: {
        current: number;
    };
};

export function SpatialTransitionScene({
    progressRef,
}: SpatialTransitionSceneProps) {
    const entryLayer =
        useRef<Group>(null);

    const transitionLayer =
        useRef<Group>(null);

    const destinationLayer =
        useRef<Group>(null);

    const farBackground =
        useRef<Group>(null);

    const lookTarget = useRef(
        new Vector3(
            0,
            0,
            1,
        ),
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

            const currentLookTarget =
                lookTarget.current;

            /*
             * CAMERA TRAVEL
             *
             * A câmera realmente atravessa
             * a composição no eixo Z.
             */

            const targetCameraZ =
                MathUtils.lerp(
                    10.5,
                    -5.2,
                    progress,
                );

            const targetCameraX =
                MathUtils.lerp(
                    -0.55,
                    0.35,
                    progress,
                ) +
                pointerX * 0.22;

            const targetCameraY =
                MathUtils.lerp(
                    0.75,
                    0.05,
                    progress,
                ) +
                pointerY * 0.14;

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
             * LOOK TARGET
             *
             * Não olhamos sempre para o
             * mesmo ponto. A atenção também
             * avança pela composição.
             */

            const targetLookX =
                MathUtils.lerp(
                    -0.2,
                    0.15,
                    progress,
                );

            const targetLookY =
                MathUtils.lerp(
                    0.2,
                    0,
                    progress,
                );

            const targetLookZ =
                MathUtils.lerp(
                    1,
                    -9.2,
                    progress,
                );

            currentLookTarget.x =
                MathUtils.damp(
                    currentLookTarget.x,
                    targetLookX,
                    4,
                    delta,
                );

            currentLookTarget.y =
                MathUtils.damp(
                    currentLookTarget.y,
                    targetLookY,
                    4,
                    delta,
                );

            currentLookTarget.z =
                MathUtils.damp(
                    currentLookTarget.z,
                    targetLookZ,
                    4,
                    delta,
                );

            state.camera.lookAt(
                currentLookTarget,
            );
            /*
             * ENTRY PARALLAX
             *
             * Próximo da câmera.
             */

            if (entryLayer.current) {
                entryLayer.current.position.x =
                    MathUtils.damp(
                        entryLayer.current.position.x,
                        pointerX * -0.48,
                        3,
                        delta,
                    );

                entryLayer.current.position.y =
                    MathUtils.damp(
                        entryLayer.current.position.y,
                        pointerY * -0.26,
                        3,
                        delta,
                    );

                entryLayer.current.rotation.y =
                    MathUtils.damp(
                        entryLayer.current.rotation.y,
                        pointerX * 0.07,
                        3,
                        delta,
                    );
            }

            /*
             * TRANSITION GATE
             *
             * Mais pesado e estável.
             */

            if (
                transitionLayer.current
            ) {
                transitionLayer.current.position.x =
                    MathUtils.damp(
                        transitionLayer.current.position.x,
                        pointerX * -0.1,
                        3,
                        delta,
                    );

                transitionLayer.current.rotation.z =
                    MathUtils.damp(
                        transitionLayer.current.rotation.z,
                        pointerX * 0.012,
                        3,
                        delta,
                    );
            }

            /*
             * DESTINATION
             */

            if (
                destinationLayer.current
            ) {
                const reveal =
                    MathUtils.smoothstep(
                        progress,
                        0.55,
                        1,
                    );

                const targetScale =
                    0.94 +
                    reveal * 0.06;

                destinationLayer.current.scale.setScalar(
                    MathUtils.damp(
                        destinationLayer.current.scale.x,
                        targetScale,
                        3,
                        delta,
                    ),
                );

                destinationLayer.current.position.x =
                    MathUtils.damp(
                        destinationLayer.current.position.x,
                        pointerX * -0.05,
                        3,
                        delta,
                    );

                destinationLayer.current.position.y =
                    MathUtils.damp(
                        destinationLayer.current.position.y,
                        pointerY * -0.035,
                        3,
                        delta,
                    );
            }

            /*
             * DISTANT BACKGROUND
             */

            if (
                farBackground.current
            ) {
                farBackground.current.position.x =
                    MathUtils.damp(
                        farBackground.current.position.x,
                        pointerX * 0.035,
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
                args={[
                    "#080a10",
                ]}
            />

            <fog
                attach="fog"
                args={[
                    "#080a10",
                    10,
                    24,
                ]}
            />

            {/* LIGHT */}

            <hemisphereLight
                intensity={1.5}
                color="#e1f1ff"
                groundColor="#040509"
            />

            <directionalLight
                position={[
                    -5,
                    7,
                    8,
                ]}
                intensity={3}
            />

            <directionalLight
                position={[
                    5,
                    -1,
                    5,
                ]}
                intensity={1.4}
                color="#0BA5FF"
            />

            {/* ================================= */}
            {/* ENTRY ENVIRONMENT                 */}
            {/* ================================= */}

            <group
                ref={entryLayer}
            >
                <RoundedBox
                    args={[
                        2.3,
                        1.55,
                        1.8,
                    ]}
                    radius={0.22}
                    smoothness={5}
                    position={[
                        -2.8,
                        0.65,
                        3.6,
                    ]}
                    rotation={[
                        0.28,
                        0.52,
                        -0.2,
                    ]}
                >
                    <meshStandardMaterial
                        color="#171d2a"
                        roughness={0.94}
                        metalness={0}
                    />
                </RoundedBox>

                <mesh
                    position={[
                        2.6,
                        -0.8,
                        3.1,
                    ]}
                    rotation={[
                        1.05,
                        0.15,
                        0.5,
                    ]}
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
                        color="#151a25"
                        roughness={0.95}
                        metalness={0}
                    />
                </mesh>

                <mesh
                    position={[
                        2.05,
                        1.8,
                        2.7,
                    ]}
                    scale={0.92}
                >
                    <icosahedronGeometry
                        args={[
                            1,
                            1,
                        ]}
                    />

                    <meshStandardMaterial
                        color="#222a3b"
                        roughness={0.92}
                        metalness={0}
                    />
                </mesh>

                <mesh
                    position={[
                        -1.6,
                        -1.85,
                        2.65,
                    ]}
                    scale={0.65}
                >
                    <sphereGeometry
                        args={[
                            1,
                            40,
                            40,
                        ]}
                    />

                    <meshStandardMaterial
                        color="#0BA5FF"
                        roughness={0.9}
                        metalness={0}
                    />
                </mesh>

                <RoundedBox
                    args={[
                        3.2,
                        0.9,
                        1.1,
                    ]}
                    radius={0.18}
                    smoothness={5}
                    position={[
                        0.1,
                        -2.25,
                        1.8,
                    ]}
                    rotation={[
                        -0.1,
                        -0.2,
                        0.08,
                    ]}
                >
                    <meshStandardMaterial
                        color="#111722"
                        roughness={0.96}
                        metalness={0}
                    />
                </RoundedBox>
            </group>

            {/* ================================= */}
            {/* TRANSITION GATE                   */}
            {/* ================================= */}

            <group
                ref={transitionLayer}
                position={[
                    0,
                    0,
                    -2.2,
                ]}
            >
                {/* LEFT MASS */}

                <RoundedBox
                    args={[
                        1.25,
                        6,
                        1.55,
                    ]}
                    radius={0.22}
                    smoothness={6}
                    position={[
                        -2.75,
                        0,
                        0,
                    ]}
                >
                    <meshStandardMaterial
                        color="#111721"
                        roughness={0.96}
                        metalness={0}
                    />
                </RoundedBox>

                {/* RIGHT MASS */}

                <RoundedBox
                    args={[
                        1.25,
                        6,
                        1.55,
                    ]}
                    radius={0.22}
                    smoothness={6}
                    position={[
                        2.75,
                        0,
                        0,
                    ]}
                >
                    <meshStandardMaterial
                        color="#151c28"
                        roughness={0.95}
                        metalness={0}
                    />
                </RoundedBox>

                {/* TOP MASS */}

                <RoundedBox
                    args={[
                        4.4,
                        1.2,
                        1.55,
                    ]}
                    radius={0.22}
                    smoothness={6}
                    position={[
                        0,
                        2.45,
                        0,
                    ]}
                >
                    <meshStandardMaterial
                        color="#182130"
                        roughness={0.94}
                        metalness={0}
                    />
                </RoundedBox>

                {/* BOTTOM MASS */}

                <RoundedBox
                    args={[
                        4.4,
                        1.2,
                        1.55,
                    ]}
                    radius={0.22}
                    smoothness={6}
                    position={[
                        0,
                        -2.45,
                        0,
                    ]}
                >
                    <meshStandardMaterial
                        color="#0f141e"
                        roughness={0.97}
                        metalness={0}
                    />
                </RoundedBox>

                {/* BLUE ACCENT */}

                <RoundedBox
                    args={[
                        0.16,
                        3.15,
                        0.08,
                    ]}
                    radius={0.05}
                    smoothness={4}
                    position={[
                        -2.05,
                        0,
                        0.82,
                    ]}
                >
                    <meshStandardMaterial
                        color="#0BA5FF"
                        roughness={0.86}
                        emissive="#0BA5FF"
                        emissiveIntensity={0.35}
                    />
                </RoundedBox>
            </group>

            {/* ================================= */}
            {/* DESTINATION / CONTROL             */}
            {/* ================================= */}

            <group
                ref={destinationLayer}
                position={[
                    0,
                    0,
                    -8.4,
                ]}
                scale={0.94}
            >
                {/* MAIN PRODUCT MASS */}

                <RoundedBox
                    args={[
                        5.8,
                        3.55,
                        0.72,
                    ]}
                    radius={0.26}
                    smoothness={7}
                >
                    <meshStandardMaterial
                        color="#141a25"
                        roughness={0.91}
                        metalness={0.01}
                    />
                </RoundedBox>

                <Text
                    position={[
                        -1.8,
                        1.15,
                        0.4,
                    ]}
                    fontSize={0.28}
                    color="#0BA5FF"
                    anchorX="left"
                >
                    growCo.
                </Text>

                <Text
                    position={[
                        -1.8,
                        0.55,
                        0.4,
                    ]}
                    fontSize={0.48}
                    color="white"
                    anchorX="left"
                >
                    Everything connected.
                </Text>

                {/* DASHBOARD CARD 1 */}

                <RoundedBox
                    args={[
                        1.65,
                        0.92,
                        0.16,
                    ]}
                    radius={0.12}
                    smoothness={5}
                    position={[
                        -1.75,
                        -0.65,
                        0.44,
                    ]}
                >
                    <meshStandardMaterial
                        color="#202838"
                        roughness={0.9}
                    />
                </RoundedBox>

                {/* DASHBOARD CARD 2 */}

                <RoundedBox
                    args={[
                        1.65,
                        0.92,
                        0.16,
                    ]}
                    radius={0.12}
                    smoothness={5}
                    position={[
                        0.1,
                        -0.65,
                        0.44,
                    ]}
                >
                    <meshStandardMaterial
                        color="#1b2331"
                        roughness={0.92}
                    />
                </RoundedBox>

                {/* DASHBOARD CARD 3 */}

                <RoundedBox
                    args={[
                        1.65,
                        0.92,
                        0.16,
                    ]}
                    radius={0.12}
                    smoothness={5}
                    position={[
                        1.95,
                        -0.65,
                        0.44,
                    ]}
                >
                    <meshStandardMaterial
                        color="#18202c"
                        roughness={0.93}
                    />
                </RoundedBox>

                {/* BLUE DATA BAR */}

                <RoundedBox
                    args={[
                        3.6,
                        0.1,
                        0.08,
                    ]}
                    radius={0.04}
                    position={[
                        0,
                        -1.35,
                        0.47,
                    ]}
                >
                    <meshStandardMaterial
                        color="#0BA5FF"
                        roughness={0.86}
                        emissive="#0BA5FF"
                        emissiveIntensity={0.25}
                    />
                </RoundedBox>

                {/* SIDE MASSES */}

                <RoundedBox
                    args={[
                        1.8,
                        2.2,
                        1.7,
                    ]}
                    radius={0.24}
                    smoothness={5}
                    position={[
                        -4.1,
                        0.7,
                        -0.5,
                    ]}
                    rotation={[
                        0.15,
                        0.4,
                        -0.1,
                    ]}
                >
                    <meshStandardMaterial
                        color="#111722"
                        roughness={0.96}
                    />
                </RoundedBox>

                <mesh
                    position={[
                        4.15,
                        -0.8,
                        -0.2,
                    ]}
                    rotation={[
                        1.15,
                        0.2,
                        0.35,
                    ]}
                >
                    <torusGeometry
                        args={[
                            1.05,
                            0.35,
                            32,
                            64,
                        ]}
                    />

                    <meshStandardMaterial
                        color="#171e2b"
                        roughness={0.95}
                    />
                </mesh>
            </group>

            {/* ================================= */}
            {/* FAR BACKGROUND                    */}
            {/* ================================= */}

            <group
                ref={farBackground}
            >
                <mesh
                    position={[
                        -4.5,
                        2.6,
                        -13,
                    ]}
                    scale={2}
                >
                    <sphereGeometry
                        args={[
                            1,
                            40,
                            40,
                        ]}
                    />

                    <meshStandardMaterial
                        color="#111721"
                        roughness={0.97}
                    />
                </mesh>

                <RoundedBox
                    args={[
                        3,
                        3,
                        3,
                    ]}
                    radius={0.3}
                    smoothness={5}
                    position={[
                        4.4,
                        2,
                        -14,
                    ]}
                    rotation={[
                        0.4,
                        0.45,
                        0.2,
                    ]}
                >
                    <meshStandardMaterial
                        color="#0e141d"
                        roughness={0.98}
                    />
                </RoundedBox>
            </group>
        </>
    );
}