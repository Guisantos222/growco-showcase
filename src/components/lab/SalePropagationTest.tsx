"use client";

import {
  useRef,
  useState,
} from "react";

import {
  gsap,
} from "gsap";

import {
  MotionPathPlugin,
} from "gsap/MotionPathPlugin";

import {
  useGSAP,
} from "@gsap/react";

import {
  emitExperienceEvent,
} from "@/experience/events/experienceEvents";

import {
  SALE_TIMING,
} from "@/experience/timelines/saleTiming";

import {
  useDemoStore,
} from "@/store/demoStore";

gsap.registerPlugin(
  useGSAP,
  MotionPathPlugin,
);

const FINANCE_PATH =
  "M 310 280 C 500 280 620 115 860 115";

const STOCK_PATH =
  "M 310 280 C 500 280 650 280 860 280";

const GOAL_PATH =
  "M 310 280 C 500 280 620 445 860 445";

export function SalePropagationTest() {
  const container =
    useRef<HTMLDivElement>(
      null,
    );

  const sourceModule =
    useRef<SVGGElement>(
      null,
    );

  const financeModule =
    useRef<SVGGElement>(
      null,
    );

  const stockModule =
    useRef<SVGGElement>(
      null,
    );

  const goalModule =
    useRef<SVGGElement>(
      null,
    );

  const financePacket =
    useRef<SVGGElement>(
      null,
    );

  const stockPacket =
    useRef<SVGGElement>(
      null,
    );

  const goalPacket =
    useRef<SVGGElement>(
      null,
    );

  const timeline =
    useRef<
      gsap.core.Timeline | null
    >(null);

  const [
    isSequenceRunning,
    setIsSequenceRunning,
  ] = useState(false);

  const revenue =
    useDemoStore(
      (state) =>
        state.revenue,
    );

  const stock =
    useDemoStore(
      (state) =>
        state.stock,
    );

  const goalProgress =
    useDemoStore(
      (state) =>
        state.goalProgress,
    );

  const formattedRevenue =
    new Intl.NumberFormat(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      },
    ).format(revenue);

  useGSAP(
    () => {
      const packets = [
        financePacket.current,
        stockPacket.current,
        goalPacket.current,
      ].filter(Boolean);

      gsap.set(
        packets,
        {
          opacity: 0,
          scale: 0.4,
          transformOrigin:
            "50% 50%",
        },
      );

      return () => {
        timeline.current?.kill();
      };
    },
    {
      scope: container,
    },
  );

  function handleSale() {
    if (
      isSequenceRunning
    ) {
      return;
    }

    if (
      stock < 2
    ) {
      return;
    }

    const source =
      sourceModule.current;

    const finance =
      financeModule.current;

    const stockTarget =
      stockModule.current;

    const goal =
      goalModule.current;

    const financeData =
      financePacket.current;

    const stockData =
      stockPacket.current;

    const goalData =
      goalPacket.current;

    if (
      !source ||
      !finance ||
      !stockTarget ||
      !goal ||
      !financeData ||
      !stockData ||
      !goalData
    ) {
      return;
    }

    setIsSequenceRunning(
      true,
    );

    timeline.current?.kill();

    const packets = [
      financeData,
      stockData,
      goalData,
    ];

    gsap.set(
      packets,
      {
        opacity: 0,
        scale: 0.4,
        x: 0,
        y: 0,
        transformOrigin:
          "50% 50%",
      },
    );

    const sale = {
      id: crypto.randomUUID(),
      product:
        "Café Especial",
      quantity: 2,
      total: 119.8,
    };

    const tl =
      gsap.timeline({
        defaults: {
          ease:
            "power2.inOut",
        },

        onComplete: () => {
          setIsSequenceRunning(
            false,
          );
        },
      });

    timeline.current =
      tl;

    tl.call(
      () => {
        emitExperienceEvent(
          "SALE_STARTED",
          {
            sale,
          },
        );
      },
      [],
      SALE_TIMING.start,
    );

    tl.to(
      source,
      {
        scale: 1.035,
        duration: 0.18,
        transformOrigin:
          "50% 50%",
        yoyo: true,
        repeat: 1,
      },
      SALE_TIMING.sourcePulse,
    );

    tl.to(
      packets,
      {
        opacity: 1,
        scale: 1,
        duration: 0.18,
        stagger: 0.04,
      },
      SALE_TIMING.packetsReveal,
    );

    tl.call(
      () => {
        emitExperienceEvent(
          "DATA_TRAVELING",
          {
            sale,
          },
        );
      },
      [],
      SALE_TIMING.travelStart,
    );

    tl.to(
      financeData,
      {
        duration:
          SALE_TIMING.travelDuration,

        motionPath: {
          path:
            FINANCE_PATH,
          start: 0,
          end: 1,
        },
      },
      SALE_TIMING.travelStart,
    );

    tl.to(
      stockData,
      {
        duration:
          SALE_TIMING.travelDuration,

        motionPath: {
          path:
            STOCK_PATH,
          start: 0,
          end: 1,
        },
      },
      SALE_TIMING.travelStart,
    );

    tl.to(
      goalData,
      {
        duration:
          SALE_TIMING.travelDuration,

        motionPath: {
          path:
            GOAL_PATH,
          start: 0,
          end: 1,
        },
      },
      SALE_TIMING.travelStart,
    );

    tl.call(
      () => {
        emitExperienceEvent(
          "DATA_ARRIVED",
          {
            sale,
          },
        );
      },
      [],
      SALE_TIMING.arrival,
    );

    tl.to(
      [
        finance,
        stockTarget,
        goal,
      ],
      {
        scale: 1.035,
        duration: 0.16,
        transformOrigin:
          "50% 50%",
        yoyo: true,
        repeat: 1,
        stagger: 0.06,
      },
      SALE_TIMING.moduleReaction,
    );

    tl.call(
      () => {
        emitExperienceEvent(
          "SALE_COMPLETED",
          {
            sale,
          },
        );
      },
      [],
      SALE_TIMING.completed,
    );

    tl.to(
      packets,
      {
        opacity: 0,
        scale: 0.25,
        duration: 0.22,
      },
      SALE_TIMING.packetsHide,
    );

    tl.call(
      () => {
        emitExperienceEvent(
          "AI_INSIGHT_READY",
          {
            sale,
          },
        );
      },
      [],
      SALE_TIMING.insightReady,
    );
  }

  function handleReset() {
    timeline.current?.kill();

    setIsSequenceRunning(
      false,
    );

    gsap.set(
      [
        financePacket.current,
        stockPacket.current,
        goalPacket.current,
      ],
      {
        opacity: 0,
        scale: 0.4,
        x: 0,
        y: 0,
      },
    );

    emitExperienceEvent(
      "DEMO_RESET",
      undefined,
    );
  }

  return (
    <div
      ref={container}
      className="mx-auto w-full max-w-7xl"
    >
      <header className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.3em] text-[#0BA5FF]">
          Integrated Experiment
        </p>

        <h1 className="mt-4 text-5xl font-semibold tracking-tight md:text-7xl">
          Sale Propagation
        </h1>

        <p className="mt-6 text-lg leading-relaxed text-neutral-400">
          Uma operação deixa de ser uma ação isolada e passa a repercutir por diferentes áreas da empresa.
        </p>
      </header>

      <section className="mt-12 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03]">
        <svg
          viewBox="0 0 1200 560"
          className="block h-auto w-full"
          role="img"
          aria-label="Propagação visual de uma venda entre vendas, financeiro, estoque e meta"
        >
          <defs>
            <filter
              id="blueGlow"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur
                stdDeviation="6"
                result="blur"
              />

              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path
            d={FINANCE_PATH}
            fill="none"
            stroke="rgba(11,165,255,0.22)"
            strokeWidth="3"
          />

          <path
            d={STOCK_PATH}
            fill="none"
            stroke="rgba(11,165,255,0.22)"
            strokeWidth="3"
          />

          <path
            d={GOAL_PATH}
            fill="none"
            stroke="rgba(11,165,255,0.22)"
            strokeWidth="3"
          />

          <g
            ref={sourceModule}
          >
            <rect
              x="60"
              y="210"
              width="250"
              height="140"
              rx="30"
              fill="#111111"
              stroke="rgba(255,255,255,0.14)"
            />

            <text
              x="90"
              y="252"
              fill="rgba(255,255,255,0.48)"
              fontSize="19"
            >
              VENDA
            </text>

            <text
              x="90"
              y="300"
              fill="white"
              fontSize="31"
              fontWeight="600"
            >
              + R$119,80
            </text>

            <text
              x="90"
              y="330"
              fill="rgba(255,255,255,0.38)"
              fontSize="16"
            >
              Café Especial × 2
            </text>
          </g>

          <g
            ref={financeModule}
          >
            <rect
              x="860"
              y="50"
              width="280"
              height="130"
              rx="30"
              fill="#111111"
              stroke="rgba(255,255,255,0.14)"
            />

            <text
              x="890"
              y="92"
              fill="rgba(255,255,255,0.48)"
              fontSize="18"
            >
              FINANCEIRO
            </text>

            <text
              x="890"
              y="140"
              fill="#0BA5FF"
              fontSize="30"
              fontWeight="600"
            >
              {formattedRevenue}
            </text>
          </g>

          <g
            ref={stockModule}
          >
            <rect
              x="860"
              y="215"
              width="280"
              height="130"
              rx="30"
              fill="#111111"
              stroke="rgba(255,255,255,0.14)"
            />

            <text
              x="890"
              y="257"
              fill="rgba(255,255,255,0.48)"
              fontSize="18"
            >
              ESTOQUE
            </text>

            <text
              x="890"
              y="305"
              fill="white"
              fontSize="30"
              fontWeight="600"
            >
              {stock} unidades
            </text>
          </g>

          <g
            ref={goalModule}
          >
            <rect
              x="860"
              y="380"
              width="280"
              height="130"
              rx="30"
              fill="#111111"
              stroke="rgba(255,255,255,0.14)"
            />

            <text
              x="890"
              y="422"
              fill="rgba(255,255,255,0.48)"
              fontSize="18"
            >
              META
            </text>

            <text
              x="890"
              y="470"
              fill="white"
              fontSize="30"
              fontWeight="600"
            >
              {goalProgress}%
            </text>
          </g>

          <g
            ref={financePacket}
          >
            <circle
              r="18"
              fill="#0BA5FF"
              filter="url(#blueGlow)"
            />

            <text
              x="30"
              y="6"
              fill="#0BA5FF"
              fontSize="17"
              fontWeight="600"
            >
              +R$
            </text>
          </g>

          <g
            ref={stockPacket}
          >
            <circle
              r="18"
              fill="#0BA5FF"
              filter="url(#blueGlow)"
            />

            <text
              x="30"
              y="6"
              fill="#0BA5FF"
              fontSize="17"
              fontWeight="600"
            >
              -2
            </text>
          </g>

          <g
            ref={goalPacket}
          >
            <circle
              r="18"
              fill="#0BA5FF"
              filter="url(#blueGlow)"
            />

            <text
              x="30"
              y="6"
              fill="#0BA5FF"
              fontSize="17"
              fontWeight="600"
            >
              +1%
            </text>
          </g>
        </svg>
      </section>

      <div className="mt-8 flex flex-wrap gap-4">
        <button
          type="button"
          onClick={handleSale}
          disabled={
            isSequenceRunning ||
            stock < 2
          }
          className="rounded-full bg-[#0BA5FF] px-7 py-3 font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-40"
        >
          {stock < 2
            ? "Sem estoque"
            : isSequenceRunning
              ? "Processando..."
              : "Confirmar venda"}
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="rounded-full border border-white/15 px-7 py-3 font-medium text-white"
        >
          Reset demo
        </button>
      </div>
    </div>
  );
}