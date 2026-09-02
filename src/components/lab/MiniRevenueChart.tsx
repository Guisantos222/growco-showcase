"use client";

import { useRef } from "react";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import { useDemoStore } from "@/store/demoStore";

gsap.registerPlugin(useGSAP);

export function MiniRevenueChart() {
  const container =
    useRef<HTMLDivElement>(null);

  const revenueHistory =
    useDemoStore(
      (state) => state.revenueHistory,
    );

  useGSAP(
    () => {
      gsap.fromTo(
        container.current,
        {
          scale: 1.015,
          y: -4,
        },
        {
          scale: 1,
          y: 0,
          duration: 0.45,
          ease: "power3.out",
        },
      );
    },
    {
      dependencies: [
        revenueHistory,
      ],
      scope: container,
    },
  );

  return (
    <section
      ref={container}
      className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 md:p-8"
    >
      <p className="text-sm text-neutral-500">
        Revenue history
      </p>

      <h2 className="mt-2 text-2xl font-semibold">
        O gráfico também reagiu.
      </h2>

      <div className="mt-8 h-[260px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart
            data={revenueHistory}
          >
            <CartesianGrid
              stroke="rgba(255,255,255,0.06)"
              vertical={false}
            />

            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              stroke="rgba(255,255,255,0.3)"
            />

            <YAxis
              hide
              domain={[
                "dataMin",
                "dataMax",
              ]}
            />

            <Line
              type="monotone"
              dataKey="value"
              stroke="#0BA5FF"
              strokeWidth={4}
              dot={{
                r: 4,
                fill: "#0BA5FF",
              }}
              isAnimationActive={
                false
              }
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}