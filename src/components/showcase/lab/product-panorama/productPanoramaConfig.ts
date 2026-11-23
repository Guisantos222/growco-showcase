"use client";

export type PanoramaFocus =
  | "overview"
  | "sales"
  | "operations"
  | "finance"
  | "people"
  | "intelligence"
  | "unified";

export type PanoramaSector =
  | "campus"
  | "sales"
  | "operations"
  | "finance"
  | "people"
  | "intelligence";

export type PanoramaFocusConfig = {
  id: PanoramaFocus;
  labelPt: string;
  labelEn: string;
  eyebrowPt: string;
  eyebrowEn: string;
  titlePt: string;
  titleEn: string;
  bodyPt: string;
  bodyEn: string;
  scale: number;
  translateX: number;
  translateY: number;
  panelSide: "left" | "right";
  sectors: PanoramaSector[];
  metrics: Array<{
    labelPt: string;
    labelEn: string;
    value: string;
    accent?: boolean;
  }>;
};

export const PANORAMA_FOCUS_ORDER: PanoramaFocus[] = [
  "overview",
  "sales",
  "operations",
  "finance",
  "people",
  "intelligence",
  "unified",
];

export const PANORAMA_FOCUS: Record<
  PanoramaFocus,
  PanoramaFocusConfig
> = {
  overview: {
    id: "overview",
    labelPt: "Visão geral",
    labelEn: "Overview",
    eyebrowPt: "OPERAÇÃO CONECTADA",
    eyebrowEn: "CONNECTED OPERATION",
    titlePt: "A empresa inteira em um único contexto.",
    titleEn: "The whole company in one operational context.",
    bodyPt:
      "O panorama mostra vendas, estoque, operação, financeiro, pessoas e inteligência funcionando simultaneamente.",
    bodyEn:
      "The panorama shows sales, stock, operations, finance, people and intelligence working simultaneously.",
    scale: 1,
    translateX: 0,
    translateY: 0,
    panelSide: "left",
    sectors: [
      "campus",
      "sales",
      "operations",
      "finance",
      "people",
      "intelligence",
    ],
    metrics: [
      {
        labelPt: "Receita",
        labelEn: "Revenue",
        value: "R$ 82.430",
      },
      {
        labelPt: "Estoque",
        labelEn: "Stock",
        value: "14 un.",
      },
      {
        labelPt: "Meta",
        labelEn: "Goal",
        value: "74%",
      },
    ],
  },

  sales: {
    id: "sales",
    labelPt: "Vendas + Estoque",
    labelEn: "Sales + Stock",
    eyebrowPt: "VENDAS + ESTOQUE",
    eyebrowEn: "SALES + STOCK",
    titlePt: "Uma venda movimenta a operação inteira.",
    titleEn: "One sale moves the whole operation.",
    bodyPt:
      "A venda registra receita, reduz o estoque e cria contexto para metas, financeiro e decisões de reposição.",
    bodyEn:
      "A sale records revenue, reduces stock and creates context for goals, finance and replenishment decisions.",
    scale: 1.16,
    translateX: 11,
    translateY: -2,
    panelSide: "right",
    sectors: [
      "sales",
    ],
    metrics: [
      {
        labelPt: "Venda",
        labelEn: "Sale",
        value: "R$ 2.480",
        accent: true,
      },
      {
        labelPt: "Estoque",
        labelEn: "Stock",
        value: "14 un.",
      },
      {
        labelPt: "Movimento",
        labelEn: "Movement",
        value: "-4 un.",
      },
      {
        labelPt: "Ritmo",
        labelEn: "Velocity",
        value: "+18%",
      },
    ],
  },

  operations: {
    id: "operations",
    labelPt: "Operações",
    labelEn: "Operations",
    eyebrowPt: "OPERAÇÕES + METAS",
    eyebrowEn: "OPERATIONS + GOALS",
    titlePt: "A execução acompanha o ritmo do negócio.",
    titleEn: "Execution follows the pace of the business.",
    bodyPt:
      "A área operacional recebe o mesmo contexto e transforma mudanças de demanda em prioridade, execução e acompanhamento de meta.",
    bodyEn:
      "Operations receive the same context and turn demand changes into priorities, execution and goal tracking.",
    scale: 1.18,
    translateX: -10,
    translateY: -2,
    panelSide: "left",
    sectors: [
      "operations",
    ],
    metrics: [
      {
        labelPt: "Eficiência",
        labelEn: "Efficiency",
        value: "92%",
        accent: true,
      },
      {
        labelPt: "Meta",
        labelEn: "Goal",
        value: "74%",
      },
      {
        labelPt: "Pendências",
        labelEn: "Pending",
        value: "3",
      },
    ],
  },

  finance: {
    id: "finance",
    labelPt: "Financeiro",
    labelEn: "Finance",
    eyebrowPt: "FINANCEIRO + RELATÓRIOS",
    eyebrowEn: "FINANCE + REPORTS",
    titlePt: "O financeiro enxerga o que está acontecendo agora.",
    titleEn: "Finance sees what is happening right now.",
    bodyPt:
      "Receita, projeção e fluxo deixam de existir em uma aba isolada e passam a responder aos acontecimentos da operação.",
    bodyEn:
      "Revenue, projections and cash flow stop living in isolation and start responding to operational events.",
    scale: 1.22,
    translateX: -13,
    translateY: 8,
    panelSide: "left",
    sectors: [
      "finance",
    ],
    metrics: [
      {
        labelPt: "Receita",
        labelEn: "Revenue",
        value: "R$ 82.430",
        accent: true,
      },
      {
        labelPt: "Projeção",
        labelEn: "Projection",
        value: "+8,4%",
      },
      {
        labelPt: "Margem",
        labelEn: "Margin",
        value: "31,2%",
      },
    ],
  },

  people: {
    id: "people",
    labelPt: "Pessoas",
    labelEn: "People",
    eyebrowPt: "PESSOAS + AÇÃO",
    eyebrowEn: "PEOPLE + ACTION",
    titlePt: "O contexto chega a quem pode agir.",
    titleEn: "Context reaches the person who can act.",
    bodyPt:
      "Gestores e equipes recebem responsabilidade, prioridade e informação conectadas ao evento que originou a necessidade.",
    bodyEn:
      "Managers and teams receive responsibility, priority and information tied to the event that created the need.",
    scale: 1.08,
    translateX: 0,
    translateY: -2,
    panelSide: "right",
    sectors: [
      "people",
    ],
    metrics: [
      {
        labelPt: "Ativos",
        labelEn: "Active",
        value: "12",
        accent: true,
      },
      {
        labelPt: "Cobertura",
        labelEn: "Coverage",
        value: "96%",
      },
      {
        labelPt: "Pendências",
        labelEn: "Pending",
        value: "2",
      },
    ],
  },

  intelligence: {
    id: "intelligence",
    labelPt: "Inteligência",
    labelEn: "Intelligence",
    eyebrowPt: "GROWCO INTELLIGENCE",
    eyebrowEn: "GROWCO INTELLIGENCE",
    titlePt: "Dados conectados viram entendimento.",
    titleEn: "Connected data becomes understanding.",
    bodyPt:
      "O núcleo growCo. cruza sinais da empresa para identificar ritmo, risco e oportunidade antes da operação perder o momento.",
    bodyEn:
      "The growCo. core crosses company signals to identify pace, risk and opportunity before the operation loses momentum.",
    scale: 1.12,
    translateX: 0,
    translateY: 0,
    panelSide: "right",
    sectors: [
      "intelligence",
    ],
    metrics: [
      {
        labelPt: "Demanda",
        labelEn: "Demand",
        value: "+18,4%",
        accent: true,
      },
      {
        labelPt: "Risco",
        labelEn: "Risk",
        value: "Médio",
      },
      {
        labelPt: "Cobertura",
        labelEn: "Coverage",
        value: "3 vendas",
      },
    ],
  },

  unified: {
    id: "unified",
    labelPt: "Tudo conectado",
    labelEn: "Unified",
    eyebrowPt: "VISÃO INTEGRADA",
    eyebrowEn: "UNIFIED VIEW",
    titlePt: "Uma empresa legível como um único sistema.",
    titleEn: "A company readable as one system.",
    bodyPt:
      "Todos os setores voltam a ganhar presença, agora ligados pelo mesmo fluxo de contexto, dados e decisões.",
    bodyEn:
      "Every sector returns to full presence, now connected by the same flow of context, data and decisions.",
    scale: 0.98,
    translateX: 0,
    translateY: 0,
    panelSide: "right",
    sectors: [
      "campus",
      "sales",
      "operations",
      "finance",
      "people",
      "intelligence",
    ],
    metrics: [
      {
        labelPt: "Áreas",
        labelEn: "Areas",
        value: "6/6",
        accent: true,
      },
      {
        labelPt: "Contexto",
        labelEn: "Context",
        value: "Live",
      },
      {
        labelPt: "Status",
        labelEn: "Status",
        value: "Conectado",
      },
    ],
  },
};

export const PANORAMA_ASSETS = {
  campus:
    "/assets/product/world/campus-base.svg",
  logistics:
    "/assets/product/world/sector-logistics.svg",
  operations:
    "/assets/product/world/sector-operations.svg",
  office:
    "/assets/product/world/office-building.svg",
  manager:
    "/assets/product/world/worker-manager.svg",
  finance:
    "/assets/product/world/worker-finance.svg",
  logisticsWorker:
    "/assets/product/world/worker-logistics.svg",
  generalWorker:
    "/assets/product/world/worker-general.svg",
} as const;
