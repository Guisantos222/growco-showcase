export type ChaosLayer =
  | "far"
  | "mid"
  | "near";

export type ChaosCardVariant =
  | "light"
  | "dark"
  | "blue";

export type ChaosLabelKey =
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
  | "cashflow"
  | "schedule";

export type ChaosDatum = {
  id: string;

  labelKey:
    ChaosLabelKey;

  value: string;

  layer:
    ChaosLayer;

  variant:
    ChaosCardVariant;

  x: number;
  y: number;

  rotate: number;

  moveX: number;
  moveY: number;

  mobileHidden?: boolean;
};

export const chaosItems:
  ChaosDatum[] = [
  {
    id: "sale-1",
    labelKey: "sale",
    value: "+ R$ 119,80",
    layer: "near",
    variant: "blue",
    x: 9,
    y: 24,
    rotate: -5,
    moveX: 130,
    moveY: -70,
  },

  {
    id: "stock-1",
    labelKey: "stock",
    value: "12 un.",
    layer: "mid",
    variant: "light",
    x: 72,
    y: 20,
    rotate: 4,
    moveX: -100,
    moveY: 90,
  },

  {
    id: "message-1",
    labelKey: "message",
    value: "09:42",
    layer: "near",
    variant: "dark",
    x: 78,
    y: 59,
    rotate: -4,
    moveX: -150,
    moveY: -55,
  },

  {
    id: "spreadsheet-1",
    labelKey:
      "spreadsheet",
    value:
      "PLANILHA_FINAL.xlsx",
    layer: "mid",
    variant: "light",
    x: 14,
    y: 70,
    rotate: 5,
    moveX: 155,
    moveY: -110,
  },

  {
    id: "goal-1",
    labelKey: "goal",
    value: "68%",
    layer: "near",
    variant: "light",
    x: 62,
    y: 72,
    rotate: 3,
    moveX: -120,
    moveY: -100,
  },

  {
    id: "invoice-1",
    labelKey: "invoice",
    value: "HOJE",
    layer: "far",
    variant: "dark",
    x: 40,
    y: 15,
    rotate: -3,
    moveX: 75,
    moveY: 120,
  },

  {
    id: "employee-1",
    labelKey: "employee",
    value: "7 ativos",
    layer: "mid",
    variant: "light",
    x: 43,
    y: 78,
    rotate: -6,
    moveX: 95,
    moveY: -150,
  },

  {
    id: "report-1",
    labelKey: "report",
    value: "Q3.pdf",
    layer: "far",
    variant: "light",
    x: 84,
    y: 34,
    rotate: 7,
    moveX: -170,
    moveY: 115,
  },

  {
    id: "payment-1",
    labelKey: "payment",
    value: "- R$ 820,00",
    layer: "near",
    variant: "dark",
    x: 25,
    y: 45,
    rotate: 4,
    moveX: 185,
    moveY: 80,
  },

  {
    id: "order-1",
    labelKey: "order",
    value: "#4821",
    layer: "mid",
    variant: "blue",
    x: 54,
    y: 31,
    rotate: -4,
    moveX: -95,
    moveY: 150,
  },

  {
    id: "cashflow-1",
    labelKey: "cashflow",
    value: "R$ 31.480",
    layer: "near",
    variant: "light",
    x: 5,
    y: 52,
    rotate: 7,
    moveX: 180,
    moveY: 35,
    mobileHidden: true,
  },

  {
    id: "schedule-1",
    labelKey: "schedule",
    value: "14:30",
    layer: "far",
    variant: "dark",
    x: 89,
    y: 76,
    rotate: -5,
    moveX: -180,
    moveY: -145,
    mobileHidden: true,
  },

  {
    id: "sale-2",
    labelKey: "sale",
    value: "+ R$ 89,90",
    layer: "mid",
    variant: "light",
    x: 31,
    y: 19,
    rotate: 6,
    moveX: 110,
    moveY: 130,
  },

  {
    id: "stock-2",
    labelKey: "stock",
    value: "4 un.",
    layer: "near",
    variant: "dark",
    x: 66,
    y: 47,
    rotate: -7,
    moveX: -160,
    moveY: 20,
  },

  {
    id: "message-2",
    labelKey: "message",
    value: "3 novas",
    layer: "far",
    variant: "light",
    x: 47,
    y: 56,
    rotate: 3,
    moveX: 70,
    moveY: -140,
  },

  {
    id: "goal-2",
    labelKey: "goal",
    value: "72%",
    layer: "mid",
    variant: "blue",
    x: 18,
    y: 85,
    rotate: -3,
    moveX: 160,
    moveY: -130,
    mobileHidden: true,
  },

  {
    id: "order-2",
    labelKey: "order",
    value: "#4822",
    layer: "near",
    variant: "light",
    x: 75,
    y: 85,
    rotate: 5,
    moveX: -165,
    moveY: -125,
    mobileHidden: true,
  },

  {
    id: "report-2",
    labelKey: "report",
    value: "Setembro",
    layer: "far",
    variant: "dark",
    x: 3,
    y: 12,
    rotate: -4,
    moveX: 175,
    moveY: 140,
    mobileHidden: true,
  },
];