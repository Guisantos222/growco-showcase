"use client";

import { Canvas } from "@react-three/fiber";

import { RevenueWatcher } from "@/components/lab/RevenueWatcher";
import { DataFieldScene } from "@/three/scenes/DataFieldScene";

export function ThreeTest() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-neutral-950">
      <Canvas
        camera={{
          position: [3, 2, 5],
          fov: 45,
        }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={1.2} />

        <directionalLight
          position={[3, 4, 5]}
          intensity={2}
        />

        <DataFieldScene />
      </Canvas>

      <RevenueWatcher />
    </section>
  );
}