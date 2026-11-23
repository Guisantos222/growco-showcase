"use client";

import type {
  MutableRefObject,
} from "react";

import {
  DarkChip,
  StationShell,
} from "@/components/showcase/scenes/product/stations/StationShell";

export function IntelligenceStation({
  isPt,
  rowsRef,
}: {
  isPt: boolean;
  rowsRef:
    MutableRefObject<
      Array<
        HTMLDivElement | null
      >
    >;
}) {
  return (
    <StationShell
      label={
        isPt
          ? "INTELIGÊNCIA OPERACIONAL"
          : "OPERATIONAL INTELLIGENCE"
      }
      accent
    >
      <div
        className="
          grid
          grid-cols-[1.04fr_0.96fr]
          gap-4
        "
      >
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
            GROWCO INSIGHT
          </div>

          <div
            className="
              mt-4
              text-[34px]
              font-black
              leading-[0.96]
              tracking-[-0.065em]
            "
          >
            {
              isPt
                ? "A demanda acelerou."
                : "Demand accelerated."
            }
          </div>

          <div
            className="
              mt-5
              grid
              grid-cols-3
              gap-2
            "
          >
            <DarkChip
              label={
                isPt
                  ? "Ritmo"
                  : "Velocity"
              }
              value="+18%"
            />

            <DarkChip
              label={
                isPt
                  ? "Risco"
                  : "Risk"
              }
              value="médio"
            />

            <DarkChip
              label={
                isPt
                  ? "Cobertura"
                  : "Coverage"
              }
              value="3"
            />
          </div>
        </div>

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
              text-[9px]
              font-black
              tracking-[0.16em]
              text-[#7A8D98]
            "
          >
            {
              isPt
                ? "INTERPRETAÇÃO"
                : "INTERPRETATION"
            }
          </div>

          <div
            className="
              mt-4
              space-y-3
            "
          >
            {[
              [
                isPt
                  ? "ritmo de vendas"
                  : "sales velocity",
                "+18%",
              ],
              [
                isPt
                  ? "estoque atual"
                  : "current stock",
                "14",
              ],
              [
                isPt
                  ? "vendas até ruptura"
                  : "sales to stockout",
                "3",
              ],
            ].map(
              (
                item,
                index,
              ) => (
                <div
                  key={
                    item[
                      0
                    ]
                  }
                  ref={(
                    element: HTMLDivElement | null,
                  ) => {
                    rowsRef.current[
                      index
                    ] =
                      element;
                  }}
                  className="
                    flex
                    items-center
                    justify-between
                    rounded-xl
                    bg-[#F2F6F8]
                    px-4
                    py-3
                    opacity-0
                    will-change-[transform,opacity]
                  "
                >
                  <span
                    className="
                      text-xs
                      font-bold
                      text-[#6F828E]
                    "
                  >
                    {
                      item[
                        0
                      ]
                    }
                  </span>

                  <span
                    className="
                      text-sm
                      font-black
                    "
                  >
                    {
                      item[
                        1
                      ]
                    }
                  </span>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </StationShell>
  );
}
