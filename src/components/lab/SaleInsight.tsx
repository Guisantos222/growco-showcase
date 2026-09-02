"use client";

import {
  useRef,
  useState,
} from "react";

import {
  gsap,
} from "gsap";

import {
  useGSAP,
} from "@gsap/react";

import {
  useExperienceEvent,
} from "@/experience/hooks/useExperienceEvent";

import {
  useDemoStore,
} from "@/store/demoStore";

gsap.registerPlugin(
  useGSAP,
);

export function SaleInsight() {
  const panel =
    useRef<HTMLDivElement>(null);

  const lastSale =
    useDemoStore(
      (state) => state.lastSale,
    );

  const revenue =
    useDemoStore(
      (state) => state.revenue,
    );

  const stock =
    useDemoStore(
      (state) => state.stock,
    );

  const goalProgress =
    useDemoStore(
      (state) => state.goalProgress,
    );

  const [
    insightReady,
    setInsightReady,
  ] = useState(false);

  const formattedRevenue =
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(revenue);

  useExperienceEvent(
    "SALE_STARTED",
    () => {
      setInsightReady(
        false,
      );
    },
  );

  useExperienceEvent(
    "AI_INSIGHT_READY",
    () => {
      setInsightReady(
        true,
      );
    },
  );

  useExperienceEvent(
    "DEMO_RESET",
    () => {
      setInsightReady(
        false,
      );
    },
  );

  useGSAP(
    () => {
      if (
        !lastSale ||
        !insightReady
      ) {
        return;
      }

      gsap.fromTo(
        panel.current,
        {
          y: 18,
          opacity: 0.35,
          scale: 0.99,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "power3.out",
        },
      );
    },
    {
      dependencies: [
        lastSale?.id,
        insightReady,
      ],
      scope: panel,
    },
  );

  return (
    <section
      ref={panel}
      className="rounded-[2rem] border border-[#0BA5FF]/25 bg-[#0BA5FF]/10 p-7 md:p-8"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0BA5FF] font-semibold text-white">
          AI
        </div>

        <div>
          <p className="text-sm text-[#0BA5FF]">
            growAI
          </p>

          <p className="text-sm text-neutral-400">
            Operational insight
          </p>
        </div>
      </div>

      {!lastSale ? (
        <p className="mt-8 max-w-2xl text-neutral-400">
          Realize uma venda para que a growAI interprete as mudanças da operação.
        </p>
      ) : !insightReady ? (
        <div className="mt-8">
          <p className="text-sm uppercase tracking-[0.2em] text-[#0BA5FF]">
            Processing
          </p>

          <p className="mt-3 text-neutral-400">
            Analisando as repercussões da operação...
          </p>
        </div>
      ) : (


        <div className="mt-8">
          <h2 className="text-2xl font-semibold">
            A operação repercutiu em toda a empresa.
          </h2>

          <p className="mt-4 max-w-3xl leading-relaxed text-neutral-300">
            A venda de {lastSale.quantity} unidades de{" "}
            {lastSale.product} elevou a receita acumulada para{" "}
            <strong className="text-white">
              {formattedRevenue}
            </strong>
            , reduziu o estoque para{" "}
            <strong className="text-white">
              {stock} unidades
            </strong>{" "}
            e levou a meta atual para{" "}
            <strong className="text-white">
              {goalProgress}%
            </strong>
            .
          </p>

          {stock <= 6 && (
            <p className="mt-4 text-[#0BA5FF]">
              Atenção: o produto está se aproximando de um nível crítico de estoque.
            </p>
          )}
        </div>
      )}
    </section>
  );
}