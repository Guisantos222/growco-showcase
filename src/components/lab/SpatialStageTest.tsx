"use client";

import {
  useRef,
} from "react";

import {
  Canvas,
} from "@react-three/fiber";

import {
  gsap,
} from "gsap";

import {
  ScrollTrigger,
} from "gsap/ScrollTrigger";

import {
  useGSAP,
} from "@gsap/react";

import {
  SpatialStageScene,
} from "@/three/scenes/SpatialStageScene";

gsap.registerPlugin(
  useGSAP,
  ScrollTrigger,
);

export function SpatialStageTest() {
  const section =
    useRef<HTMLElement>(
      null,
    );

  const progress =
    useRef(0);

  useGSAP(
    () => {
      if (!section.current) {
        return;
      }

      const trigger =
        ScrollTrigger.create({
          trigger:
            section.current,

          start:
            "top top",

          end:
            "bottom bottom",

          onUpdate: (
            self,
          ) => {
            progress.current =
              self.progress;
          },
        });

      return () => {
        trigger.kill();
      };
    },
    {
      scope: section,
    },
  );

  return (
    <section
      ref={section}
      className="relative h-[320vh] bg-[#090b12]"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* INFORMATION */}

        <div className="pointer-events-none absolute left-6 top-6 z-20 md:left-10 md:top-10">
          <p className="text-xs uppercase tracking-[0.3em] text-[#0BA5FF]">
            Spatial Stage
          </p>

          <h1 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight text-white md:text-5xl">
            Enter the system.
          </h1>

          <p className="mt-4 max-w-sm text-sm leading-relaxed text-neutral-400">
            Scroll para atravessar as diferentes camadas da composição.
          </p>
        </div>

        {/* DEPTH LABELS */}

        <div className="pointer-events-none absolute bottom-6 left-6 z-20 hidden gap-8 text-xs uppercase tracking-[0.18em] text-neutral-600 md:flex md:left-10 md:bottom-10">
          <span>
            Foreground
          </span>

          <span>
            Midground
          </span>

          <span>
            Product
          </span>

          <span>
            Depth
          </span>
        </div>

        {/* CANVAS */}

        <Canvas
          dpr={[1, 1.5]}
          camera={{
            position: [
              0,
              0.65,
              9.5,
            ],
            fov: 45,
            near: 0.1,
            far: 30,
          }}
          gl={{
            antialias: true,
            powerPreference:
              "high-performance",
          }}
        >
          <SpatialStageScene
            progressRef={
              progress
            }
          />
        </Canvas>

        {/* SCROLL CUE */}

        <div className="pointer-events-none absolute bottom-6 right-6 z-20 text-right md:bottom-10 md:right-10">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-600">
            Scroll
          </p>

          <div className="ml-auto mt-3 h-12 w-px bg-gradient-to-b from-[#0BA5FF] to-transparent" />
        </div>
      </div>
    </section>
  );
}