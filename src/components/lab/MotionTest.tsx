"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function MotionTest() {
  const container = useRef<HTMLDivElement>(null);
  const data = useRef<HTMLDivElement>(null);

  useGSAP(
  () => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    });

    timeline
      .fromTo(
        data.current,
        {
          x: "-40vw",
          scale: 0.5,
          rotation: -20,
        },
        {
          x: 0,
          scale: 1,
          rotation: 0,
          duration: 1,
        },
      )
      .to(data.current, {
        scale: 1.8,
        duration: 1,
      })
      .to(data.current, {
        x: "40vw",
        scale: 0.6,
        rotation: 20,
        duration: 1,
      });
  },
  {
    scope: container,
  },
);

  return (
    <section
      ref={container}
      className="relative min-h-[300vh] overflow-hidden bg-white"
    >
      <div className="flex h-screen items-center justify-center">
        <h1 className="text-center text-6xl font-semibold tracking-tight text-black">
          Scroll.
        </h1>
      </div>

      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <div
          ref={data}
          className="flex h-32 w-32 items-center justify-center rounded-3xl bg-[#0BA5FF] text-lg font-semibold text-white shadow-xl"
        >
          +12%
        </div>
      </div>
    </section>
  );
}