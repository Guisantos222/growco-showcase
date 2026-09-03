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
  SpatialTransitionScene,
} from "@/three/scenes/SpatialTransitionScene";

gsap.registerPlugin(
  useGSAP,
  ScrollTrigger,
);

export function SpatialTransitionTest() {
  const section =
    useRef<HTMLElement>(
      null,
    );

  const introCopy =
    useRef<HTMLDivElement>(
      null,
    );

  const transitionCopy =
    useRef<HTMLDivElement>(
      null,
    );

  const destinationCopy =
    useRef<HTMLDivElement>(
      null,
    );

  const progress =
    useRef(0);

  useGSAP(
    () => {
      if (!section.current) {
        return;
      }

      const timeline =
        gsap.timeline({
          scrollTrigger: {
            trigger:
              section.current,

            start:
              "top top",

            end:
              "bottom bottom",

            scrub: 1,

            onUpdate: (
              self,
            ) => {
              progress.current =
                self.progress;
            },
          },
        });

      gsap.set(
        [
          transitionCopy.current,
          destinationCopy.current,
        ],
        {
          autoAlpha: 0,
          y: 24,
        },
      );

      gsap.set(
        introCopy.current,
        {
          autoAlpha: 1,
          y: 0,
        },
      );

      timeline.to(
        introCopy.current,
        {
          autoAlpha: 0,
          y: -24,
          duration: 0.14,
        },
        0.18,
      );

      timeline.fromTo(
        transitionCopy.current,
        {
          autoAlpha: 0,
          y: 24,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.12,
        },
        0.34,
      );

      timeline.to(
        transitionCopy.current,
        {
          autoAlpha: 0,
          y: -24,
          duration: 0.12,
        },
        0.56,
      );

      timeline.fromTo(
        destinationCopy.current,
        {
          autoAlpha: 0,
          y: 24,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.14,
        },
        0.72,
      );
    },
    {
      scope: section,
    },
  );

  return (
    <section
      ref={section}
      className="relative h-[420vh] bg-[#080a10]"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* CANVAS */}

        <Canvas
          dpr={[1, 1.5]}
          camera={{
            position: [
              -0.55,
              0.75,
              10.5,
            ],
            fov: 45,
            near: 0.1,
            far: 40,
          }}
          gl={{
            antialias: true,
            powerPreference:
              "high-performance",
          }}
        >
          <SpatialTransitionScene
            progressRef={
              progress
            }
          />
        </Canvas>

        {/* FIXED LABEL */}

        <div className="pointer-events-none absolute left-6 top-6 z-20 md:left-10 md:top-10">
          <p className="text-xs uppercase tracking-[0.3em] text-[#0BA5FF]">
            Spatial Transition
          </p>
        </div>

        {/* INTRO COPY */}

        <div
          ref={introCopy}
          className="pointer-events-none absolute left-6 top-1/2 z-20 max-w-xl -translate-y-1/2 md:left-10"
        >
          <p className="text-sm uppercase tracking-[0.24em] text-neutral-500">
            Layer 01
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-7xl">
            Enter the system.
          </h1>

          <p className="mt-5 max-w-md leading-relaxed text-neutral-400">
            A informação deixa de existir em uma superfície plana e passa a ocupar profundidade.
          </p>
        </div>

        {/* TRANSITION COPY */}

        <div
          ref={transitionCopy}
          className="pointer-events-none absolute left-1/2 top-[18%] z-20 w-full max-w-lg -translate-x-1/2 px-6 text-center"
        >
          <p className="text-sm uppercase tracking-[0.24em] text-[#0BA5FF]">
            Passage
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-5xl">
            Don&apos;t change pages.
          </h2>

          <p className="mt-4 text-neutral-400">
            Move through them.
          </p>
        </div>

        {/* DESTINATION COPY */}

        <div
          ref={destinationCopy}
          className="pointer-events-none absolute bottom-[12%] left-1/2 z-20 w-full max-w-2xl -translate-x-1/2 px-6 text-center"
        >
          <p className="text-sm uppercase tracking-[0.24em] text-[#0BA5FF]">
            Layer 02
          </p>

          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-6xl">
            Everything connected.
          </h2>
        </div>

        {/* DEPTH MAP */}

        <div className="pointer-events-none absolute bottom-6 left-6 z-20 hidden items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-neutral-600 md:flex md:left-10 md:bottom-10">
          <span>
            Entry
          </span>

          <span>
            →
          </span>

          <span>
            Passage
          </span>

          <span>
            →
          </span>

          <span>
            System
          </span>
        </div>

        {/* SCROLL INDICATOR */}

        <div className="pointer-events-none absolute bottom-6 right-6 z-20 md:bottom-10 md:right-10">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-600">
            Travel
          </p>

          <div className="ml-auto mt-3 h-14 w-px bg-gradient-to-b from-[#0BA5FF] to-transparent" />
        </div>
      </div>
    </section>
  );
}