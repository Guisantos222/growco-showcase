"use client";

import type {
  MutableRefObject,
} from "react";

import {
  Badge,
  MetricTile,
  StationShell,
} from "@/components/showcase/scenes/product/stations/StationShell";

export function SalesStockStation({
  isPt,
  stockFillRef,
}: {
  isPt: boolean;
  stockFillRef: MutableRefObject<HTMLDivElement | null>;
}) {
  return (
    <StationShell
      label={
        isPt
          ? "VENDAS + ESTOQUE"
          : "SALES + STOCK"
      }
      accent
    >
      <div
        className="
          grid
          grid-cols-[1.08fr_0.92fr]
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
                  text-[#7ED3FF]
                "
              >
                LIVE SALE
              </div>

              <div
                className="
                  mt-3
                  text-[36px]
                  font-black
                  tracking-[-0.07em]
                "
              >
                R$ 2.480
              </div>
            </div>

            <div
              className="
                grid
                h-11
                w-11
                place-items-center
                rounded-2xl
                bg-[#0BA5FF]
                text-sm
                font-black
              "
            >
              ✓
            </div>
          </div>

          <div
            className="
              mt-6
              flex
              h-20
              items-end
              gap-2
            "
          >
            {[
              24,
              38,
              31,
              45,
              52,
              64,
              76,
            ].map(
              (
                height,
                index,
              ) => (
                <div
                  key={index}
                  className="
                    flex-1
                    rounded-t-md
                    bg-[#0BA5FF]
                  "
                  style={{
                    height:
                      `${height}%`,
                    opacity:
                      0.3 +
                      index *
                        0.09,
                  }}
                />
              ),
            )}
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
              flex
              items-center
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
                {isPt ? "ESTOQUE" : "STOCK"}
              </div>

              <div
                className="
                  mt-2
                  text-2xl
                  font-black
                "
              >
                14 un.
              </div>
            </div>

            <Badge
              label="-4"
            />
          </div>

          <div
            className="
              mt-5
              grid
              grid-cols-5
              gap-2
            "
          >
            {Array.from({
              length:
                15,
            }).map(
              (
                _,
                index,
              ) => (
                <div
                  key={index}
                  className="
                    relative
                    h-11
                    overflow-hidden
                    rounded-lg
                    bg-[#ECF2F5]
                  "
                >
                  <div
                    ref={
                      index ===
                      13
                        ? stockFillRef
                        : undefined
                    }
                    className={`
                      absolute
                      inset-x-0
                      bottom-0
                      ${
                        index >
                        11
                          ? "bg-[#0BA5FF]"
                          : "bg-[#B8C9D2]"
                      }
                    `}
                    style={{
                      height:
                        `${
                          42 +
                          (
                            index *
                            13
                          ) %
                            44
                        }%`,
                    }}
                  />
                </div>
              ),
            )}
          </div>
        </div>
      </div>

      <div
        className="
          mt-4
          grid
          grid-cols-4
          gap-3
        "
      >
        <MetricTile
          label={
            isPt
              ? "Pedido"
              : "Order"
          }
          value="#4821"
        />

        <MetricTile
          label={
            isPt
              ? "Receita"
              : "Revenue"
          }
          value="+2.480"
        />

        <MetricTile
          label="SKU"
          value="A-204"
        />

        <MetricTile
          label={
            isPt
              ? "Origem"
              : "Source"
          }
          value="POS"
        />
      </div>
    </StationShell>
  );
}
