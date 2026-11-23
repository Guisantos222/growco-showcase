"use client";

export type ProductFocus =
  | "overview"
  | "sales"
  | "operations"
  | "finance"
  | "people"
  | "intelligence"
  | "unified";

export type ProductSectorId =
  | "campus"
  | "sales"
  | "operations"
  | "finance"
  | "people"
  | "intelligence";

export type ProductCameraPose = {
  centerX: number;
  centerY: number;
  zoom: number;
};

export type ProductSceneConfig = {
  id: ProductFocus;
  camera: ProductCameraPose;
  panelSide: "left" | "right";
  sectors: ProductSectorId[];
  eyebrowPt: string;
  eyebrowEn: string;
  titlePt: string;
  titleEn: string;
  bodyPt: string;
  bodyEn: string;
  metrics: Array<{
    labelPt: string;
    labelEn: string;
    value: string;
    accent?: boolean;
  }>;
};

/*
 * VECTOR PERFORMANCE MODE
 *
 * Continua 100% SVG.
 * Os arquivos em optimized-svg/ foram limpos estruturalmente:
 * metadata/editor data/comments removidos, números compactados e IDs reduzidos.
 *
 * Importante: eles continuam sendo SVGs vetoriais externos, portanto
 * permanecem nítidos durante zoom e câmera.
 */
export const PRODUCT_ASSETS = {
  campus:
    "/assets/product/world/optimized-svg/campus-base.svg",
  logistics:
    "/assets/product/world/optimized-svg/sector-logistics.svg",
  operations:
    "/assets/product/world/optimized-svg/sector-operations.svg",
  office:
    "/assets/product/world/optimized-svg/office-building.svg",
  manager:
    "/assets/product/world/optimized-svg/worker-manager.svg",
  financeWorker:
    "/assets/product/world/optimized-svg/worker-finance.svg",
  logisticsWorker:
    "/assets/product/world/optimized-svg/worker-logistics.svg",
  generalWorker:
    "/assets/product/world/optimized-svg/worker-general.svg",
} as const;

export const PRODUCT_ARRIVAL_CAMERA: ProductCameraPose = {
  centerX: 1600,
  centerY: 590,
  zoom: 1.06,
};

export const PRODUCT_SCENES: ProductSceneConfig[] = [
  {
    id: "overview",
    camera: {
      centerX: 1600,
      centerY: 895,
      zoom: 0.69,
    },
    panelSide: "left",
    sectors: [
      "campus",
      "sales",
      "operations",
      "finance",
      "people",
      "intelligence",
    ],
    eyebrowPt: "OPERAÇÃO CONECTADA",
    eyebrowEn: "CONNECTED OPERATION",
    titlePt: "A empresa existe além da tela.",
    titleEn: "The company extends beyond the screen.",
    bodyPt:
      "O primeiro enquadramento apresenta o ecossistema sem selecionar um setor. A câmera passa a percorrer a operação conforme o scroll.",
    bodyEn:
      "The first framing introduces the ecosystem without selecting a department. The camera then travels through the operation as you scroll.",
    metrics: [
      { labelPt: "Áreas", labelEn: "Areas", value: "6 conectadas", accent: true },
      { labelPt: "Receita", labelEn: "Revenue", value: "R$ 82.430" },
      { labelPt: "Meta", labelEn: "Goal", value: "74%" },
    ],
  },
  {
    id: "sales",
    camera: {
      centerX: 775,
      centerY: 1115,
      zoom: 0.94,
    },
    panelSide: "right",
    sectors: ["sales"],
    eyebrowPt: "VENDAS + ESTOQUE",
    eyebrowEn: "SALES + STOCK",
    titlePt: "Uma venda movimenta o restante da operação.",
    titleEn: "A sale moves the rest of the operation.",
    bodyPt:
      "O registro da venda altera estoque e cria contexto para as próximas decisões, sem transformar cada módulo em uma ilha.",
    bodyEn:
      "A sale changes stock and creates context for the next decisions without turning each module into an island.",
    metrics: [
      { labelPt: "Venda", labelEn: "Sale", value: "R$ 2.480", accent: true },
      { labelPt: "Estoque", labelEn: "Stock", value: "14 un." },
      { labelPt: "Movimento", labelEn: "Movement", value: "-4 un." },
      { labelPt: "Ritmo", labelEn: "Velocity", value: "+18%" },
    ],
  },
  {
    id: "operations",
    camera: {
      centerX: 2450,
      centerY: 1100,
      zoom: 0.96,
    },
    panelSide: "left",
    sectors: ["operations"],
    eyebrowPt: "OPERAÇÕES + METAS",
    eyebrowEn: "OPERATIONS + GOALS",
    titlePt: "A execução acompanha a mudança.",
    titleEn: "Execution follows the change.",
    bodyPt:
      "Demanda e meta passam a chegar como contexto operacional, permitindo priorizar a execução sem perder a origem do acontecimento.",
    bodyEn:
      "Demand and goals arrive as operational context, allowing execution to be prioritized without losing the event's origin.",
    metrics: [
      { labelPt: "Eficiência", labelEn: "Efficiency", value: "92%", accent: true },
      { labelPt: "Meta", labelEn: "Goal", value: "74%" },
      { labelPt: "Pendências", labelEn: "Pending", value: "3" },
    ],
  },
  {
    id: "finance",
    camera: {
      centerX: 2450,
      centerY: 535,
      zoom: 1.03,
    },
    panelSide: "left",
    sectors: ["finance"],
    eyebrowPt: "FINANCEIRO + RELATÓRIOS",
    eyebrowEn: "FINANCE + REPORTS",
    titlePt: "Os números mantêm a ligação com sua origem.",
    titleEn: "Numbers stay connected to their origin.",
    bodyPt:
      "Receita, margem e projeção deixam de ser apenas números isolados e respondem aos eventos que aconteceram na operação.",
    bodyEn:
      "Revenue, margin and projections stop being isolated numbers and respond to events across the operation.",
    metrics: [
      { labelPt: "Receita", labelEn: "Revenue", value: "R$ 82.430", accent: true },
      { labelPt: "Projeção", labelEn: "Projection", value: "+8,4%" },
      { labelPt: "Margem", labelEn: "Margin", value: "31,2%" },
    ],
  },
  {
    id: "people",
    camera: {
      centerX: 1650,
      centerY: 1325,
      zoom: 0.98,
    },
    panelSide: "right",
    sectors: ["people"],
    eyebrowPt: "PESSOAS + AÇÃO",
    eyebrowEn: "PEOPLE + ACTION",
    titlePt: "O contexto termina em uma decisão humana.",
    titleEn: "Context ends in a human decision.",
    bodyPt:
      "Gestores e equipes recebem responsabilidade e prioridade ligadas ao acontecimento que originou a necessidade.",
    bodyEn:
      "Managers and teams receive responsibility and priority tied to the event that created the need.",
    metrics: [
      { labelPt: "Ativos", labelEn: "Active", value: "12", accent: true },
      { labelPt: "Cobertura", labelEn: "Coverage", value: "96%" },
      { labelPt: "Pendências", labelEn: "Pending", value: "2" },
    ],
  },
  {
    id: "intelligence",
    camera: {
      centerX: 1600,
      centerY: 805,
      zoom: 1.09,
    },
    panelSide: "right",
    sectors: ["intelligence"],
    eyebrowPt: "GROWCO INTELLIGENCE",
    eyebrowEn: "GROWCO INTELLIGENCE",
    titlePt: "Os sinais se encontram antes da decisão.",
    titleEn: "Signals meet before the decision.",
    bodyPt:
      "O núcleo growCo. cruza sinais de vendas, estoque, financeiro, operações e pessoas para identificar ritmo, risco e oportunidade.",
    bodyEn:
      "The growCo. core crosses signals from sales, stock, finance, operations and people to identify pace, risk and opportunity.",
    metrics: [
      { labelPt: "Demanda", labelEn: "Demand", value: "+18,4%", accent: true },
      { labelPt: "Risco", labelEn: "Risk", value: "Médio" },
      { labelPt: "Cobertura", labelEn: "Coverage", value: "3 vendas" },
    ],
  },
  {
    id: "unified",
    camera: {
      centerX: 1600,
      centerY: 920,
      zoom: 0.58,
    },
    panelSide: "right",
    sectors: [
      "campus",
      "sales",
      "operations",
      "finance",
      "people",
      "intelligence",
    ],
    eyebrowPt: "VISÃO INTEGRADA",
    eyebrowEn: "UNIFIED VIEW",
    titlePt: "No final, o mapa inteiro volta a fazer sentido.",
    titleEn: "In the end, the whole map makes sense.",
    bodyPt:
      "Depois de percorrer os setores, a câmera se afasta e mostra a operação completa conectada pelo mesmo fluxo de contexto e dados.",
    bodyEn:
      "After travelling through the departments, the camera pulls back and reveals the whole operation connected by the same context and data flow.",
    metrics: [
      { labelPt: "Áreas", labelEn: "Areas", value: "6/6", accent: true },
      { labelPt: "Contexto", labelEn: "Context", value: "Live" },
      { labelPt: "Status", labelEn: "Status", value: "Conectado" },
    ],
  },
];

export const PRODUCT_SCENE_BY_ID =
  Object.fromEntries(
    PRODUCT_SCENES.map(
      (scene) => [scene.id, scene],
    ),
  ) as Record<ProductFocus, ProductSceneConfig>;
