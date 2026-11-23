"use client";

import type {
  MutableRefObject,
} from "react";

import {
  StationShell,
} from "@/components/showcase/scenes/product/stations/StationShell";

export function PeopleStation({
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
          ? "PESSOAS + AÇÃO"
          : "PEOPLE + ACTION"
      }
    >
      <div
        className="
          grid
          grid-cols-[0.92fr_1.08fr]
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
              items-center
              gap-4
            "
          >
            <div
              className="
                grid
                h-14
                w-14
                place-items-center
                rounded-2xl
                bg-[#0BA5FF]
                text-lg
                font-black
                text-white
              "
            >
              M
            </div>

            <div>
              <div
                className="
                  text-xl
                  font-black
                "
              >
                Mariana
              </div>

              <div
                className="
                  mt-1
                  text-xs
                  font-bold
                  text-[#70838E]
                "
              >
                {
                  isPt
                    ? "Operações / Estoque"
                    : "Operations / Stock"
                }
              </div>
            </div>
          </div>

          <div
            className="
              mt-6
              rounded-2xl
              border
              border-[#0BA5FF]/24
              bg-[#EAF7FF]
              p-4
            "
          >
            <div
              className="
                text-[9px]
                font-black
                tracking-[0.15em]
                text-[#0878BA]
              "
            >
              {
                isPt
                  ? "PRIORIDADE ALTA"
                  : "HIGH PRIORITY"
              }
            </div>

            <div
              className="
                mt-2
                text-sm
                font-black
              "
            >
              {
                isPt
                  ? "Revisar pedido de reposição"
                  : "Review restock order"
              }
            </div>
          </div>
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
            WORKFLOW
          </div>

          <div
            className="
              mt-4
              space-y-3
            "
          >
            {[
              isPt
                ? "Venda registrada"
                : "Sale registered",
              isPt
                ? "Estoque atualizado"
                : "Stock updated",
              isPt
                ? "Meta recalculada"
                : "Goal recalculated",
              isPt
                ? "Responsável acionado"
                : "Owner notified",
            ].map(
              (
                label,
                index,
              ) => (
                <div
                  key={
                    label
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
                    gap-3
                    rounded-xl
                    border
                    border-white/10
                    bg-white/5
                    px-4
                    py-3
                    opacity-20
                    will-change-[transform,opacity]
                  "
                >
                  <div
                    className="
                      grid
                      h-7
                      w-7
                      place-items-center
                      rounded-lg
                      bg-[#0BA5FF]
                      text-[10px]
                      font-black
                    "
                  >
                    ✓
                  </div>

                  <span
                    className="
                      text-xs
                      font-bold
                      text-white/70
                    "
                  >
                    {
                      label
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
