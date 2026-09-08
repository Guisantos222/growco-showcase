export type ChaosWorldDepth =
  | "background"
  | "far"
  | "middle"
  | "near"
  | "foreground";

export type ChaosSignalVariant =
  | "paper"
  | "dark"
  | "blue"
  | "warning"
  | "ghost";

export type ChaosSignalKind =
  | "sale"
  | "stock"
  | "message"
  | "spreadsheet"
  | "goal"
  | "invoice"
  | "employee"
  | "report"
  | "payment"
  | "order"
  | "revenue"
  | "schedule"
  | "notification"
  | "chart"
  | "document"
  | "metric";

export type ChaosWorldSignal = {
  id: string;

  kind:
    ChaosSignalKind;

  labelKey: string;

  value: string;

  variant:
    ChaosSignalVariant;

  depth:
    ChaosWorldDepth;

  /*
   * Coordenadas dentro do mundo.
   *
   * Não são coordenadas da viewport.
   *
   * O mundo terá aproximadamente:
   *
   * width  = 3200
   * height = 2200
   */
  x: number;
  y: number;
  z: number;

  width:
    | "sm"
    | "md"
    | "lg"
    | "xl";

  rotation: number;

  scale?: number;

  /*
   * Alguns objetos só aparecem
   * quando o mundo já estiver
   * mais carregado.
   *
   * Parte 4 usará isso.
   */
  revealBeat:
    | "entry"
    | "movement"
    | "signals"
    | "lateral"
    | "overload"
    | "collision";

  mobileHidden?: boolean;
};

export type ChaosCluster = {
  id: string;

  label: string;

  /*
   * Apenas orientação de autoria.
   *
   * Não será necessariamente
   * mostrado ao usuário.
   */
  centerX: number;
  centerY: number;

  radius: number;
};

export const CHAOS_WORLD = {
  width: 3200,
  height: 2200,

  /*
   * Ponto inicial aproximado
   * da futura câmera.
   */
  initialCamera: {
    x: 1600,
    y: 1100,
    scale: 1,
    rotation: 0,
  },
} as const;

/*
 * ============================================================
 * AUTHORING CLUSTERS
 * ============================================================
 *
 * Servem para pensarmos espacialmente.
 *
 * O usuário não precisa saber
 * que esses grupos existem.
 */

export const chaosClusters:
  ChaosCluster[] = [
  {
    id: "sales",
    label: "Sales noise",
    centerX: 600,
    centerY: 720,
    radius: 430,
  },

  {
    id: "operations",
    label:
      "Operational noise",
    centerX: 1550,
    centerY: 540,
    radius: 480,
  },

  {
    id: "people",
    label:
      "People noise",
    centerX: 2570,
    centerY: 740,
    radius: 400,
  },

  {
    id: "finance",
    label:
      "Financial noise",
    centerX: 800,
    centerY: 1620,
    radius: 450,
  },

  {
    id: "management",
    label:
      "Management noise",
    centerX: 2130,
    centerY: 1570,
    radius: 540,
  },
];

/*
 * ============================================================
 * CINEMATIC DATA FIELD
 * ============================================================
 *
 * Tudo é determinístico.
 *
 * Nenhum Math.random().
 */

export const chaosWorldSignals:
  ChaosWorldSignal[] = [
  /*
   * ----------------------------------------------------------
   * INITIAL / CENTRAL REGION
   * ----------------------------------------------------------
   */

  {
    id: "sale-central-01",
    kind: "sale",
    labelKey: "sale",
    value: "+ R$ 119,80",
    variant: "blue",
    depth: "near",

    x: 1420,
    y: 1040,
    z: 90,

    width: "md",
    rotation: -3,
    scale: 1.08,

    revealBeat:
      "movement",
  },

  {
    id: "stock-central-01",
    kind: "stock",
    labelKey: "stock",
    value: "12 un.",
    variant: "paper",
    depth: "middle",

    x: 1840,
    y: 890,
    z: 10,

    width: "sm",
    rotation: 4,

    revealBeat:
      "signals",
  },

  {
    id: "message-central-01",
    kind: "message",
    labelKey: "message",
    value: "3 novas",
    variant: "dark",
    depth: "near",

    x: 1760,
    y: 1280,
    z: 70,

    width: "md",
    rotation: -5,

    revealBeat:
      "signals",
  },

  {
    id: "goal-central-01",
    kind: "goal",
    labelKey: "goal",
    value: "68%",
    variant: "paper",
    depth: "far",

    x: 1250,
    y: 1360,
    z: -70,

    width: "sm",
    rotation: 5,

    revealBeat:
      "signals",
  },

  /*
   * ----------------------------------------------------------
   * SALES CLUSTER — LEFT
   * ----------------------------------------------------------
   */

  {
    id: "sale-left-01",
    kind: "sale",
    labelKey: "sale",
    value: "+ R$ 89,90",
    variant: "paper",
    depth: "middle",

    x: 510,
    y: 580,
    z: 0,

    width: "md",
    rotation: 7,

    revealBeat:
      "lateral",
  },

  {
    id: "sale-left-02",
    kind: "sale",
    labelKey: "sale",
    value: "+ R$ 240,00",
    variant: "blue",
    depth: "foreground",

    x: 260,
    y: 850,
    z: 190,

    width: "lg",
    rotation: -9,
    scale: 1.15,

    revealBeat:
      "lateral",

    mobileHidden: true,
  },

  {
    id: "order-left-01",
    kind: "order",
    labelKey: "order",
    value: "#4821",
    variant: "dark",
    depth: "far",

    x: 800,
    y: 410,
    z: -80,

    width: "sm",
    rotation: -5,

    revealBeat:
      "lateral",
  },

  {
    id: "order-left-02",
    kind: "order",
    labelKey: "order",
    value: "#4822",
    variant: "paper",
    depth: "near",

    x: 900,
    y: 880,
    z: 80,

    width: "sm",
    rotation: 6,

    revealBeat:
      "lateral",
  },

  {
    id: "revenue-left-01",
    kind: "revenue",
    labelKey: "cashflow",
    value: "R$ 31.480",
    variant: "ghost",
    depth: "background",

    x: 310,
    y: 370,
    z: -170,

    width: "lg",
    rotation: 3,

    revealBeat:
      "overload",

    mobileHidden: true,
  },

  {
    id: "notification-left-01",
    kind:
      "notification",
    labelKey: "message",
    value: "09:42",
    variant: "warning",
    depth: "middle",

    x: 620,
    y: 1080,
    z: 15,

    width: "sm",
    rotation: -8,

    revealBeat:
      "overload",
  },

  /*
   * ----------------------------------------------------------
   * OPERATIONS CLUSTER — TOP / CENTER
   * ----------------------------------------------------------
   */

  {
    id: "spreadsheet-operations-01",
    kind:
      "spreadsheet",
    labelKey:
      "spreadsheet",
    value:
      "PLANILHA_FINAL.xlsx",
    variant: "paper",
    depth: "near",

    x: 1360,
    y: 330,
    z: 85,

    width: "xl",
    rotation: -4,

    revealBeat:
      "lateral",
  },

  {
    id: "spreadsheet-operations-02",
    kind:
      "spreadsheet",
    labelKey:
      "spreadsheet",
    value:
      "controle_novo_FINAL.xlsx",
    variant: "ghost",
    depth: "far",

    x: 1910,
    y: 280,
    z: -75,

    width: "xl",
    rotation: 5,

    revealBeat:
      "overload",

    mobileHidden: true,
  },

  {
    id: "stock-operations-01",
    kind: "stock",
    labelKey: "stock",
    value: "4 un.",
    variant: "warning",
    depth: "foreground",

    x: 1640,
    y: 510,
    z: 180,

    width: "md",
    rotation: 8,
    scale: 1.12,

    revealBeat:
      "overload",
  },

  {
    id: "document-operations-01",
    kind: "document",
    labelKey: "report",
    value: "inventário.pdf",
    variant: "dark",
    depth: "middle",

    x: 2110,
    y: 620,
    z: 20,

    width: "md",
    rotation: -6,

    revealBeat:
      "overload",
  },

  {
    id: "metric-operations-01",
    kind: "metric",
    labelKey: "goal",
    value: "72%",
    variant: "blue",
    depth: "far",

    x: 1130,
    y: 620,
    z: -50,

    width: "sm",
    rotation: 4,

    revealBeat:
      "overload",
  },

  /*
   * ----------------------------------------------------------
   * PEOPLE CLUSTER — RIGHT
   * ----------------------------------------------------------
   */

  {
    id: "employee-right-01",
    kind: "employee",
    labelKey: "employee",
    value: "7 ativos",
    variant: "paper",
    depth: "middle",

    x: 2480,
    y: 560,
    z: 0,

    width: "md",
    rotation: -5,

    revealBeat:
      "lateral",
  },

  {
    id: "employee-right-02",
    kind: "employee",
    labelKey: "employee",
    value: "8 ativos",
    variant: "blue",
    depth: "near",

    x: 2750,
    y: 820,
    z: 100,

    width: "md",
    rotation: 5,

    revealBeat:
      "overload",
  },

  {
    id: "schedule-right-01",
    kind: "schedule",
    labelKey: "schedule",
    value: "14:30",
    variant: "dark",
    depth: "far",

    x: 2330,
    y: 960,
    z: -60,

    width: "sm",
    rotation: 7,

    revealBeat:
      "lateral",
  },

  {
    id: "message-right-01",
    kind: "message",
    labelKey: "message",
    value: "Preciso de ajuda",
    variant: "paper",
    depth: "foreground",

    x: 2950,
    y: 470,
    z: 210,

    width: "lg",
    rotation: -8,
    scale: 1.12,

    revealBeat:
      "collision",

    mobileHidden: true,
  },

  {
    id: "notification-right-01",
    kind:
      "notification",
    labelKey: "message",
    value: "5 pendentes",
    variant: "warning",
    depth: "middle",

    x: 2610,
    y: 1120,
    z: 20,

    width: "md",
    rotation: -4,

    revealBeat:
      "overload",
  },

  /*
   * ----------------------------------------------------------
   * FINANCE CLUSTER — LOWER LEFT
   * ----------------------------------------------------------
   */

  {
    id: "payment-finance-01",
    kind: "payment",
    labelKey: "payment",
    value: "- R$ 820,00",
    variant: "dark",
    depth: "near",

    x: 550,
    y: 1510,
    z: 90,

    width: "lg",
    rotation: 6,

    revealBeat:
      "lateral",
  },

  {
    id: "payment-finance-02",
    kind: "payment",
    labelKey: "payment",
    value: "- R$ 1.240,50",
    variant: "warning",
    depth: "foreground",

    x: 250,
    y: 1840,
    z: 190,

    width: "lg",
    rotation: -7,
    scale: 1.14,

    revealBeat:
      "collision",

    mobileHidden: true,
  },

  {
    id: "invoice-finance-01",
    kind: "invoice",
    labelKey: "invoice",
    value: "HOJE",
    variant: "warning",
    depth: "middle",

    x: 960,
    y: 1700,
    z: 10,

    width: "sm",
    rotation: -5,

    revealBeat:
      "overload",
  },

  {
    id: "revenue-finance-01",
    kind: "revenue",
    labelKey: "cashflow",
    value: "R$ 31.599,80",
    variant: "blue",
    depth: "far",

    x: 1090,
    y: 1440,
    z: -45,

    width: "lg",
    rotation: 4,

    revealBeat:
      "overload",
  },

  {
    id: "chart-finance-01",
    kind: "chart",
    labelKey: "report",
    value: "↗ 8,4%",
    variant: "ghost",
    depth: "background",

    x: 430,
    y: 1350,
    z: -180,

    width: "xl",
    rotation: -2,

    revealBeat:
      "collision",
  },

  /*
   * ----------------------------------------------------------
   * MANAGEMENT CLUSTER — LOWER RIGHT
   * ----------------------------------------------------------
   */

  {
    id: "report-management-01",
    kind: "report",
    labelKey: "report",
    value: "Q3.pdf",
    variant: "paper",
    depth: "middle",

    x: 2010,
    y: 1450,
    z: 5,

    width: "md",
    rotation: 5,

    revealBeat:
      "lateral",
  },

  {
    id: "report-management-02",
    kind: "report",
    labelKey: "report",
    value: "Setembro",
    variant: "dark",
    depth: "near",

    x: 2450,
    y: 1640,
    z: 95,

    width: "lg",
    rotation: -5,

    revealBeat:
      "overload",
  },

  {
    id: "goal-management-01",
    kind: "goal",
    labelKey: "goal",
    value: "73%",
    variant: "blue",
    depth: "foreground",

    x: 2860,
    y: 1440,
    z: 180,

    width: "md",
    rotation: 7,
    scale: 1.15,

    revealBeat:
      "collision",

    mobileHidden: true,
  },

  {
    id: "document-management-01",
    kind: "document",
    labelKey: "report",
    value: "indicadores.pdf",
    variant: "ghost",
    depth: "far",

    x: 1770,
    y: 1880,
    z: -75,

    width: "lg",
    rotation: -6,

    revealBeat:
      "overload",
  },

  {
    id: "spreadsheet-management-01",
    kind:
      "spreadsheet",
    labelKey:
      "spreadsheet",
    value:
      "METAS_2026_v7.xlsx",
    variant: "paper",
    depth: "middle",

    x: 2330,
    y: 2000,
    z: 25,

    width: "xl",
    rotation: 4,

    revealBeat:
      "collision",
  },

  {
    id: "metric-management-01",
    kind: "metric",
    labelKey: "goal",
    value: "68 → 72 → 73",
    variant: "dark",
    depth: "background",

    x: 2870,
    y: 1950,
    z: -170,

    width: "xl",
    rotation: -3,

    revealBeat:
      "collision",

    mobileHidden: true,
  },

  /*
   * ----------------------------------------------------------
   * EXTRA COLLISION OBJECTS
   * ----------------------------------------------------------
   */

  {
    id: "sale-collision-01",
    kind: "sale",
    labelKey: "sale",
    value: "+ R$ 380,00",
    variant: "blue",
    depth: "foreground",

    x: 1500,
    y: 1900,
    z: 220,

    width: "lg",
    rotation: -10,
    scale: 1.18,

    revealBeat:
      "collision",
  },

  {
    id: "notification-collision-01",
    kind:
      "notification",
    labelKey: "message",
    value: "URGENTE",
    variant: "warning",
    depth: "foreground",

    x: 3030,
    y: 1190,
    z: 230,

    width: "md",
    rotation: 9,
    scale: 1.2,

    revealBeat:
      "collision",

    mobileHidden: true,
  },

  {
    id: "invoice-collision-01",
    kind: "invoice",
    labelKey: "invoice",
    value: "ATRASADO",
    variant: "warning",
    depth: "near",

    x: 1320,
    y: 1570,
    z: 100,

    width: "md",
    rotation: 8,

    revealBeat:
      "collision",
  },

  {
    id: "message-collision-01",
    kind: "message",
    labelKey: "message",
    value: "12 novas",
    variant: "dark",
    depth: "near",

    x: 2180,
    y: 1120,
    z: 110,

    width: "md",
    rotation: -8,

    revealBeat:
      "collision",
  },
];

/*
 * ============================================================
 * DEPTH HELPERS
 * ============================================================
 */

export const CHAOS_DEPTH_STYLE = {
  background: {
    opacity: 0.28,
    blur: 2.2,
    perspectiveScale: 0.76,
  },

  far: {
    opacity: 0.48,
    blur: 1.2,
    perspectiveScale: 0.86,
  },

  middle: {
    opacity: 0.75,
    blur: 0,
    perspectiveScale: 0.96,
  },

  near: {
    opacity: 0.94,
    blur: 0,
    perspectiveScale: 1.06,
  },

  foreground: {
    opacity: 1,
    blur: 0,
    perspectiveScale: 1.18,
  },
} as const satisfies Record<
  ChaosWorldDepth,
  {
    opacity: number;
    blur: number;
    perspectiveScale: number;
  }
>;