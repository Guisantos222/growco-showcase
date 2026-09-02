"use client";

import { Canvas } from "@react-three/fiber";

import { SaleReactionScene } from "@/three/scenes/SalaReactionScene";

export function SpatialReactionTest() {
  return (
    <section className="relative min-h-[560px] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03]">
      <div className="pointer-events-none absolute left-7 top-7 z-10">
        <p className="text-sm uppercase tracking-[0.25em] text-[#0BA5FF]">
          Spatial Reaction
        </p>

        <h2 className="mt-2 text-2xl font-semibold text-white">
          The company reacts in space.
        </h2>

        <p className="mt-2 max-w-md text-sm leading-relaxed text-neutral-400">
          A mesma operação também modifica a representação espacial do
          ecossistema.
        </p>
      </div>

      <Canvas
        dpr={[1, 1.5]}
        camera={{
          position: [0, 0.4, 7],
          fov: 45,
        }}
      >
        <ambientLight
          intensity={1.1}
        />

        <directionalLight
          position={[4, 5, 6]}
          intensity={2.2}
        />

        <pointLight
          position={[0, 0, 2]}
          intensity={8}
          color="#0BA5FF"
          distance={8}
        />

        <SaleReactionScene />
      </Canvas>
    </section>
  );
}