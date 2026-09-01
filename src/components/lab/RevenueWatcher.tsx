"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import { useDemoStore } from "@/store/demoStore";

gsap.registerPlugin(useGSAP);

export function RevenueWatcher() {
  const container = useRef<HTMLDivElement>(null);

  const revenue = useDemoStore((state) => state.revenue);

  useGSAP(
    () => {
      gsap.fromTo(
        container.current,
        {
          scale: 1.12,
          y: -6,
        },
        {
          scale: 1,
          y: 0,
          duration: 0.55,
          ease: "power3.out",
        },
      );
    },
    {
      dependencies: [revenue],
      scope: container,
    },
  );

  return (
    <aside
      ref={container}
      className="fixed bottom-6 right-6 rounded-full border border-[#0BA5FF]/30 bg-[#0BA5FF]/10 px-5 py-3 backdrop-blur-xl"
    >
      <span className="mr-2 text-sm text-neutral-400">
        Global revenue
      </span>

      <strong className="text-[#0BA5FF]">
        {new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(revenue)}
      </strong>
    </aside>
  );
}