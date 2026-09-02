"use client";

import { useMemo, useRef } from "react";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import { useDemoStore } from "@/store/demoStore";

gsap.registerPlugin(useGSAP);

export function SvgDataTest() {
  const pathRef = useRef<SVGPathElement>(null);

  const revenueHistory = useDemoStore(
    (state) => state.revenueHistory,
  );

  const path = useMemo(() => {
    const values = revenueHistory.map(
      (point) => point.value,
    );

    if (values.length === 0) {
      return "";
    }

    const min = Math.min(...values);
    const max = Math.max(...values);

    const range = Math.max(max - min, 1);

    const width = 720;
    const height = 180;

    const offsetX = 40;
    const offsetY = 40;

    return revenueHistory
      .map((point, index) => {
        const progress =
          revenueHistory.length === 1
            ? 0
            : index /
              (revenueHistory.length - 1);

        const x =
          offsetX +
          progress * width;

        const normalized =
          (point.value - min) / range;

        const y =
          offsetY +
          height -
          normalized * height;

        return `${
          index === 0 ? "M" : "L"
        } ${x} ${y}`;
      })
      .join(" ");
  }, [revenueHistory]);

  useGSAP(
    () => {
      const element = pathRef.current;

      if (!element) {
        return;
      }

      const length =
        element.getTotalLength();

      gsap.fromTo(
        element,
        {
          strokeDasharray: length,
          strokeDashoffset: length,
        },
        {
          strokeDashoffset: 0,
          duration: 0.8,
          ease: "power3.out",
        },
      );
    },
    {
      dependencies: [revenueHistory],
      revertOnUpdate: true,
    },
  );

  return (
    <section className="mt-16 rounded-[2rem] border border-white/10 bg-white/5 p-6 md:p-8">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-[#0BA5FF]">
          Native SVG + GSAP
        </p>

        <h2 className="mt-3 text-3xl font-semibold">
          Artistic Data Path
        </h2>
      </div>

      <svg
        viewBox="0 0 800 260"
        className="mt-8 w-full overflow-visible"
        role="img"
        aria-label="Evolução visual da receita"
      >
        <path
          ref={pathRef}
          d={path}
          fill="none"
          stroke="#0BA5FF"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </section>
  );
}