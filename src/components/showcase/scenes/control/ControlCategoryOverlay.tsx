"use client";

import {
  useEffect,
  useMemo,
  useRef,
} from "react";

import type {
  MutableRefObject,
} from "react";

import {
  gsap,
} from "gsap";

import {
  CONTROL_CATEGORIES,
  getCategoryTiming,
} from "@/components/showcase/scenes/control/controlWorldConfig";

import type {
  ControlCategoryId,
} from "@/components/showcase/scenes/control/controlWorldConfig";

type ControlCategoryOverlayProps = {
  travelRef:
    MutableRefObject<number>;

  locale:
    string;
};

type CategoryCopy = {
  label:
    string;

  title:
    string;

  description:
    string;

  metric:
    string;

  metricLabel:
    string;

  flow:
    string;
};

/*
 * ============================================================================
 * SCREEN-SPACE CATEGORY COPY
 * ============================================================================
 *
 * Why screen-space?
 *
 * Previous versions used Html transform inside the 3D wall.
 * That introduced:
 *
 * - perspective-related flicker;
 * - occlusion surprises;
 * - hard-to-read typography;
 * - another possible reason why only one station looked stable.
 *
 * Now:
 *
 * - objects/charts are real 3D;
 * - copy is normal DOM;
 * - both use the SAME category timing.
 *
 * So the world keeps perspective while text remains consistently readable.
 */

export function ControlCategoryOverlay({
  travelRef,
  locale,
}: ControlCategoryOverlayProps) {
  const cardRefs =
    useRef<
      Array<
        HTMLDivElement | null
      >
    >([]);

  const copy =
    useMemo(
      () =>
        createCopy(
          locale,
        ),
      [
        locale,
      ],
    );

  useEffect(() => {
    let previousTravel =
      -1;

    const update = () => {
      const travel =
        Math.max(
          0,
          travelRef.current,
        );

      if (
        Math.abs(
          travel -
          previousTravel,
        ) <
        0.00001
      ) {
        return;
      }

      previousTravel =
        travel;

      CONTROL_CATEGORIES.forEach(
        (
          category,
          index,
        ) => {
          const card =
            cardRefs.current[
              index
            ];

          if (!card) {
            return;
          }

          const timing =
            getCategoryTiming(
              category,
            );

          const enter =
            smootherstep(
              range(
                travel,
                timing.enterStart +
                  0.2,
                timing.buildStart +
                  0.82,
              ),
            );

          const exit =
            smootherstep(
              range(
                travel,
                timing.holdEnd,
                timing.exitEnd,
              ),
            );

          const opacity =
            enter *
            (
              1 -
              exit
            );

          card.style.opacity =
            `${opacity}`;

          card.style.visibility =
            opacity <=
            0.001
              ? "hidden"
              : "visible";

          const direction =
            category.side ===
            "right"
              ? 1
              : -1;

          card.style.transform = `
            translate3d(
              ${
                direction *
                (
                  20 -
                  enter *
                    20 +
                  exit *
                    12
                )
              }px,
              ${
                12 -
                enter *
                  12 +
                exit *
                  8
              }px,
              0
            )
          `;
        },
      );
    };

    gsap.ticker.add(
      update,
    );

    update();

    return () => {
      gsap.ticker.remove(
        update,
      );
    };
  }, [
    travelRef,
  ]);

  return (
    <div
      aria-hidden="true"
      className="
        pointer-events-none
        absolute
        inset-0
        z-[32]
        overflow-hidden
      "
    >
      {
        CONTROL_CATEGORIES.map(
          (
            category,
            index,
          ) => {
            const content =
              copy[
                category.id
              ];

            const isRight =
              category.side ===
              "right";

            return (
              <div
                key={
                  `control-copy-${category.id}`
                }
                ref={(
                  element,
                ) => {
                  cardRefs.current[
                    index
                  ] =
                    element;
                }}
                className={`
                  invisible
                  absolute
                  top-[22%]
                  w-[min(330px,34vw)]
                  opacity-0
                  will-change-[transform,opacity]
                  ${
                    isRight
                      ? "right-[7vw]"
                      : "left-[7vw]"
                  }
                `}
              >
                <div
                  className="
                    flex
                    items-center
                    gap-2.5
                  "
                >
                  <span
                    className="
                      h-[7px]
                      w-[7px]
                      rounded-full
                      bg-[#0BA5FF]
                      shadow-[0_0_18px_rgba(11,165,255,0.62)]
                    "
                  />

                  <span
                    className="
                      font-mono
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.24em]
                      text-[#80D5FB]
                    "
                  >
                    {
                      category.number
                    }{" "}
                    /{" "}
                    {
                      content.label
                    }
                  </span>
                </div>

                <div
                  className="
                    mt-4
                    text-[clamp(1.45rem,2.45vw,2.8rem)]
                    font-black
                    leading-[0.92]
                    tracking-[-0.055em]
                    text-white
                  "
                >
                  {
                    content.title
                  }
                </div>

                <div
                  className="
                    mt-3
                    max-w-[30ch]
                    text-[clamp(0.72rem,0.9vw,0.9rem)]
                    font-medium
                    leading-[1.55]
                    text-white/48
                  "
                >
                  {
                    content.description
                  }
                </div>

                <div
                  className="
                    mt-6
                    flex
                    items-end
                    gap-5
                  "
                >
                  <div>
                    <div
                      className="
                        font-mono
                        text-[8px]
                        font-bold
                        uppercase
                        tracking-[0.2em]
                        text-white/30
                      "
                    >
                      {
                        content.metricLabel
                      }
                    </div>

                    <div
                      className="
                        mt-1
                        text-[clamp(1.35rem,2.25vw,2.5rem)]
                        font-black
                        tracking-[-0.06em]
                        text-[#BDEBFF]
                      "
                    >
                      {
                        content.metric
                      }
                    </div>
                  </div>

                  <div
                    className="
                      mb-1
                      h-px
                      min-w-8
                      flex-1
                      bg-gradient-to-r
                      from-[#0BA5FF]/65
                      to-transparent
                    "
                  />
                </div>

                <div
                  className="
                    mt-3
                    max-w-[30ch]
                    text-[10px]
                    font-semibold
                    leading-[1.45]
                    text-white/34
                  "
                >
                  {
                    content.flow
                  }
                </div>
              </div>
            );
          },
        )
      }
    </div>
  );
}

function createCopy(
  locale:
    string,
):
  Record<
    ControlCategoryId,
    CategoryCopy
  > {
  const pt =
    locale.startsWith(
      "pt",
    );

  if (!pt) {
    return {
      sales: {
        label:
          "SALES",

        title:
          "A sale starts the flow.",

        description:
          "The event is registered once and immediately becomes usable context.",

        metric:
          "$2,480",

        metricLabel:
          "NEW REVENUE",

        flow:
          "The source leaves Sales and climbs into the shared ceiling route.",
      },

      stock: {
        label:
          "INVENTORY",

        title:
          "Availability reacts.",

        description:
          "The same event updates inventory without another disconnected handoff.",

        metric:
          "-4 units",

        metricLabel:
          "AUTOMATIC CHANGE",

        flow:
          "A second source joins the route without replacing the first.",
      },

      finance: {
        label:
          "FINANCE",

        title:
          "Cash flow receives context.",

        description:
          "Revenue stays attached to the event that generated the operational change.",

        metric:
          "+$2,480",

        metricLabel:
          "REVENUE",

        flow:
          "Financial context becomes the third persistent signal.",
      },

      people: {
        label:
          "PEOPLE",

        title:
          "Responsibility becomes visible.",

        description:
          "The people who need to react receive the event with its operational context.",

        metric:
          "3 owners",

        metricLabel:
          "RESPONSIBLE",

        flow:
          "Ownership joins the same connected route.",
      },

      goals: {
        label:
          "GOALS",

        title:
          "Progress follows reality.",

        description:
          "Targets react to what actually happened instead of waiting for manual reconciliation.",

        metric:
          "74%",

        metricLabel:
          "CURRENT GOAL",

        flow:
          "Direction becomes the fifth layer of the shared flow.",
      },

      reports: {
        label:
          "REPORTS",

        title:
          "The event becomes interpretation.",

        description:
          "Six operational perspectives arrive as one connected view.",

        metric:
          "1 → 6",

        metricLabel:
          "CONNECTED AREAS",

        flow:
          "The sixth source completes the first version of the system.",
      },
    };
  }

  return {
    sales: {
      label:
        "VENDAS",

      title:
        "Uma venda inicia o fluxo.",

      description:
        "O evento é registrado uma vez e imediatamente vira contexto utilizável.",

      metric:
        "R$ 2.480",

      metricLabel:
        "NOVA RECEITA",

      flow:
        "A origem sai de Vendas e sobe até a rota compartilhada no teto.",
    },

    stock: {
      label:
        "ESTOQUE",

      title:
        "A disponibilidade reage.",

      description:
        "O mesmo evento atualiza o estoque sem exigir outro repasse desconectado.",

      metric:
        "-4 un.",

      metricLabel:
        "ALTERAÇÃO AUTOMÁTICA",

      flow:
        "Uma segunda origem entra na rota sem apagar a primeira.",
    },

    finance: {
      label:
        "FINANCEIRO",

      title:
        "O caixa recebe contexto.",

      description:
        "A receita permanece ligada ao evento que gerou a mudança operacional.",

      metric:
        "+R$ 2.480",

      metricLabel:
        "RECEITA",

      flow:
        "O contexto financeiro vira o terceiro sinal persistente.",
    },

    people: {
      label:
        "PESSOAS",

      title:
        "A responsabilidade fica visível.",

      description:
        "Quem precisa reagir recebe o evento junto do contexto da operação.",

      metric:
        "3 responsáveis",

      metricLabel:
        "ACIONADOS",

      flow:
        "Responsabilidade entra na mesma rota conectada.",
    },

    goals: {
      label:
        "METAS",

      title:
        "O progresso acompanha a realidade.",

      description:
        "As metas reagem ao que aconteceu sem depender de reconciliação manual.",

      metric:
        "74%",

      metricLabel:
        "META ATUAL",

      flow:
        "Direção vira a quinta camada do fluxo compartilhado.",
    },

    reports: {
      label:
        "RELATÓRIOS",

      title:
        "O evento vira interpretação.",

      description:
        "Seis perspectivas operacionais chegam como uma única visão conectada.",

      metric:
        "1 → 6",

      metricLabel:
        "ÁREAS CONECTADAS",

      flow:
        "A sexta origem completa a primeira versão do sistema.",
    },
  };
}

function range(
  value:
    number,

  start:
    number,

  end:
    number,
) {
  if (
    value <=
    start
  ) {
    return 0;
  }

  if (
    value >=
    end
  ) {
    return 1;
  }

  return (
    value -
    start
  ) /
  (
    end -
    start
  );
}

function smootherstep(
  value:
    number,
) {
  const t =
    Math.min(
      1,
      Math.max(
        0,
        value,
      ),
    );

  return (
    t *
    t *
    t *
    (
      t *
      (
        t *
        6 -
        15
      ) +
      10
    )
  );
}
