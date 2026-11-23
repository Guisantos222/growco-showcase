"use client";

import type {
  MutableRefObject,
} from "react";

import {
  MetricTile,
} from "@/components/showcase/scenes/product/stations/StationShell";

export function UnifiedStation({
  isPt,
  panelRef,
}: {
  isPt: boolean;
  panelRef: MutableRefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={
        panelRef
      }
      className="
        overflow-hidden
        rounded-[34px]
        border
        border-[#173C50]/10
        bg-white
        shadow-[0_40px_120px_rgba(19,57,82,0.18)]
        will-change-transform
      "
    >
      <div
        className="
          flex
          h-14
          items-center
          justify-between
          border-b
          border-[#173C50]/8
          px-6
        "
      >
        <div
          className="
            text-xl
            font-black
            tracking-[-0.06em]
            text-[#2E95F5]
          "
        >
          growCo.
        </div>

        <div
          className="
            flex
            items-center
            gap-2
            rounded-full
            bg-[#EAF7FF]
            px-3
            py-1.5
            text-[9px]
            font-black
            text-[#0878BA]
          "
        >
          <span
            className="
              h-1.5
              w-1.5
              rounded-full
              bg-[#0BA5FF]
            "
          />
          LIVE
        </div>
      </div>

      <div
        className="
          grid
          grid-cols-[150px_1fr]
        "
      >
        <div
          className="
            border-r
            border-[#173C50]/8
            bg-[#F6F8F9]
            p-4
          "
        >
          {[
            "Visão",
            "Vendas",
            "Estoque",
            "Financeiro",
            "Pessoas",
            "Metas",
          ].map(
            (
              item,
              index,
            ) => (
              <div
                key={
                  item
                }
                className={`
                  mb-1
                  rounded-lg
                  px-3
                  py-2
                  text-[11px]
                  font-bold
                  ${
                    index ===
                    0
                      ? "bg-[#E8F6FF] text-[#0878BA]"
                      : "text-[#71828D]"
                  }
                `}
              >
                {
                  item
                }
              </div>
            ),
          )}
        </div>

        <div
          className="
            p-5
          "
        >
          <div
            className="
              text-[9px]
              font-black
              tracking-[0.16em]
              text-[#71828D]
            "
          >
            {
              isPt
                ? "VISÃO INTEGRADA"
                : "UNIFIED VIEW"
            }
          </div>

          <div
            className="
              mt-2
              text-[30px]
              font-black
              tracking-[-0.06em]
            "
          >
            {
              isPt
                ? "Sua operação, em contexto."
                : "Your operation, in context."
            }
          </div>

          <div
            className="
              mt-5
              grid
              grid-cols-4
              gap-3
            "
          >
            <MetricTile
              label={
                isPt
                  ? "Receita"
                  : "Revenue"
              }
              value="R$ 2.480"
            />

            <MetricTile
              label={
                isPt
                  ? "Estoque"
                  : "Stock"
              }
              value="14 un."
            />

            <MetricTile
              label={
                isPt
                  ? "Meta"
                  : "Goal"
              }
              value="74%"
            />

            <MetricTile
              label={
                isPt
                  ? "Pessoa"
                  : "Person"
              }
              value="Mariana"
            />
          </div>

          <div
            className="
              mt-4
              grid
              grid-cols-[1.2fr_0.8fr]
              gap-3
            "
          >
            <div
              className="
                flex
                h-28
                items-end
                gap-2
                rounded-2xl
                bg-[#F2F6F8]
                p-4
              "
            >
              {[
                28,
                36,
                33,
                48,
                55,
                63,
                72,
                82,
              ].map(
                (
                  height,
                  index,
                ) => (
                  <div
                    key={
                      index
                    }
                    className="
                      flex-1
                      rounded-t-md
                      bg-[#0BA5FF]
                    "
                    style={{
                      height:
                        `${height}%`,
                      opacity:
                        0.34 +
                        index *
                          0.08,
                    }}
                  />
                ),
              )}
            </div>

            <div
              className="
                rounded-2xl
                bg-[#0B1620]
                p-4
                text-white
              "
            >
              <div
                className="
                  text-[9px]
                  font-black
                  text-[#7ED3FF]
                "
              >
                INSIGHT
              </div>

              <div
                className="
                  mt-3
                  text-lg
                  font-black
                "
              >
                {
                  isPt
                    ? "Demanda acelerando."
                    : "Demand accelerating."
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
