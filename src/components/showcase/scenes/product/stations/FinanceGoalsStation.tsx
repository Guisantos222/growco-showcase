"use client";

import type {
  MutableRefObject,
} from "react";

import {
  Badge,
  StationShell,
} from "@/components/showcase/scenes/product/stations/StationShell";

export function FinanceGoalsStation({
  isPt,
  goalFillRef,
  financeLineRef,
}: {
  isPt: boolean;
  goalFillRef: MutableRefObject<HTMLDivElement | null>;
  financeLineRef: MutableRefObject<SVGPathElement | null>;
}) {
  return (
    <StationShell
      label={
        isPt
          ? "FINANCEIRO + METAS"
          : "FINANCE + GOALS"
      }
    >
      <div
        className="
          grid
          grid-cols-[1.15fr_0.85fr]
          gap-4
        "
      >
        <div
          className="
            rounded-[24px]
            border
            border-[#173C50]/10
            bg-white
            p-5
          "
        >
          <div
            className="
              flex
              items-start
              justify-between
            "
          >
            <div>
              <div
                className="
                  text-[9px]
                  font-black
                  tracking-[0.16em]
                  text-[#7A8D98]
                "
              >
                FINANCE
              </div>

              <div
                className="
                  mt-2
                  text-3xl
                  font-black
                "
              >
                + R$ 2.480
              </div>
            </div>

            <Badge
              label="LIVE"
            />
          </div>

          <svg
            viewBox="0 0 460 150"
            className="
              mt-5
              h-[145px]
              w-full
            "
          >
            <path
              d="M 8 122 C 62 120 92 96 136 102 C 190 109 218 72 268 78 C 330 84 362 42 450 28"
              fill="none"
              stroke="#D6E1E6"
              strokeWidth="5"
              strokeLinecap="round"
            />

            <path
              ref={
                financeLineRef
              }
              d="M 8 122 C 62 120 92 96 136 102 C 190 109 218 72 268 78 C 330 84 362 42 450 28"
              fill="none"
              stroke="#0BA5FF"
              strokeWidth="7"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div
          className="
            rounded-[24px]
            bg-[#0B1620]
            p-5
            text-white
          "
        >
          <div
            className="
              text-[9px]
              font-black
              tracking-[0.16em]
              text-[#7ED3FF]
            "
          >
            {
              isPt
                ? "META MENSAL"
                : "MONTHLY GOAL"
            }
          </div>

          <div
            className="
              mt-3
              text-[38px]
              font-black
              tracking-[-0.07em]
            "
          >
            74%
          </div>

          <div
            className="
              mt-5
              h-3
              overflow-hidden
              rounded-full
              bg-white/10
            "
          >
            <div
              ref={
                goalFillRef
              }
              className="
                h-full
                rounded-full
                bg-[#0BA5FF]
              "
              style={{
                width:
                  "58%",
              }}
            />
          </div>

          <div
            className="
              mt-6
              rounded-2xl
              border
              border-white/10
              bg-white/5
              p-4
              text-xs
              font-bold
              leading-relaxed
              text-white/60
            "
          >
            {
              isPt
                ? "A mesma venda atualiza receita e progresso."
                : "The same sale updates revenue and progress."
            }
          </div>
        </div>
      </div>
    </StationShell>
  );
}
