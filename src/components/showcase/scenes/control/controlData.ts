export type ControlModuleKey =
  | "sales"
  | "stock"
  | "finance"
  | "people"
  | "goals"
  | "reports";

export type ControlModuleDatum = {
  id: ControlModuleKey;

  value: string;

  column: number;
  row: number;
};

export const controlModules:
  ControlModuleDatum[] = [
  {
    id: "sales",
    value: "R$ 31.599,80",
    column: 0,
    row: 0,
  },

  {
    id: "stock",
    value: "22 un.",
    column: 1,
    row: 0,
  },

  {
    id: "finance",
    value: "+ 8,4%",
    column: 2,
    row: 0,
  },

  {
    id: "people",
    value: "8 ativos",
    column: 0,
    row: 1,
  },

  {
    id: "goals",
    value: "73%",
    column: 1,
    row: 1,
  },

  {
    id: "reports",
    value: "Atualizado",
    column: 2,
    row: 1,
  },
];

export type ControlFragmentDatum = {
  id: string;

  labelKey:
    | "sale"
    | "stock"
    | "payment"
    | "message"
    | "goal"
    | "report"
    | "spreadsheet"
    | "employee"
    | "order"
    | "cashflow"
    | "invoice"
    | "schedule";

  value: string;

  startX: number;
  startY: number;

  targetX: number;
  targetY: number;

  rotate: number;

  mobileHidden?: boolean;
};

export const controlFragments:
  ControlFragmentDatum[] = [
  {
    id: "sale",
    labelKey: "sale",
    value: "+ R$119,80",

    startX: 7,
    startY: 23,

    targetX: 22,
    targetY: 42,

    rotate: -7,
  },

  {
    id: "stock",
    labelKey: "stock",
    value: "22 un.",

    startX: 78,
    startY: 18,

    targetX: 50,
    targetY: 42,

    rotate: 5,
  },

  {
    id: "payment",
    labelKey: "payment",
    value: "- R$820",

    startX: 20,
    startY: 64,

    targetX: 78,
    targetY: 42,

    rotate: 6,
  },

  {
    id: "employee",
    labelKey: "employee",
    value: "8 ativos",

    startX: 76,
    startY: 70,

    targetX: 22,
    targetY: 67,

    rotate: -5,
  },

  {
    id: "goal",
    labelKey: "goal",
    value: "73%",

    startX: 48,
    startY: 15,

    targetX: 50,
    targetY: 67,

    rotate: 3,
  },

  {
    id: "report",
    labelKey: "report",
    value: "Q3.pdf",

    startX: 89,
    startY: 45,

    targetX: 78,
    targetY: 67,

    rotate: -6,
  },

  {
    id: "spreadsheet",
    labelKey:
      "spreadsheet",
    value:
      "PLANILHA_FINAL.xlsx",

    startX: 4,
    startY: 82,

    targetX: 50,
    targetY: 53,

    rotate: 7,

    mobileHidden: true,
  },

  {
    id: "message",
    labelKey: "message",
    value: "3 novas",

    startX: 62,
    startY: 83,

    targetX: 22,
    targetY: 53,

    rotate: -4,

    mobileHidden: true,
  },

  {
    id: "order",
    labelKey: "order",
    value: "#4822",

    startX: 38,
    startY: 76,

    targetX: 78,
    targetY: 53,

    rotate: 4,

    mobileHidden: true,
  },

  {
    id: "cashflow",
    labelKey: "cashflow",
    value: "R$31.480",

    startX: 13,
    startY: 40,

    targetX: 35,
    targetY: 42,

    rotate: -5,

    mobileHidden: true,
  },

  {
    id: "invoice",
    labelKey: "invoice",
    value: "Hoje",

    startX: 84,
    startY: 85,

    targetX: 64,
    targetY: 42,

    rotate: 5,

    mobileHidden: true,
  },

  {
    id: "schedule",
    labelKey: "schedule",
    value: "14:30",

    startX: 56,
    startY: 30,

    targetX: 50,
    targetY: 67,

    rotate: -4,

    mobileHidden: true,
  },
];