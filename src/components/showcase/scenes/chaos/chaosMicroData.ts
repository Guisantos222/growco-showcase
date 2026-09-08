export type ChaosMicroDepth =
  | "far"
  | "middle"
  | "near"
  | "foreground";

export type ChaosMicroVariant =
  | "tag"
  | "metric"
  | "warning"
  | "log"
  | "dot"
  | "bar";

export type ChaosMicroSize =
  | "xs"
  | "sm"
  | "md";

export type ChaosMicroLabelKey =
  | "pending"
  | "updated"
  | "error"
  | "today"
  | "pix"
  | "invoice"
  | "goal"
  | "messages"
  | "stockLow"
  | "sale"
  | "order"
  | "report"
  | "approved"
  | "processing"
  | "late"
  | "sync"
  | "cash"
  | "employee"
  | "alert"
  | "new";

export type ChaosMicroDatum = {
  id: string;

  labelKey:
    ChaosMicroLabelKey;

  value?: string;

  variant:
    ChaosMicroVariant;

  depth:
    ChaosMicroDepth;

  size:
    ChaosMicroSize;

  /*
   * Mesma coordenada espacial
   * usada pelo ChaosWorld.
   *
   * width  = 3200
   * height = 2200
   */
  x: number;
  y: number;
  z: number;

  rotation: number;

  /*
   * Quando esse micro-sinal
   * começará a existir na
   * experiência.
   *
   * 3C-B2 usará este valor.
   */
  revealAt: number;

  /*
   * Parâmetros determinísticos
   * para o movimento futuro.
   */
  driftX: number;
  driftY: number;

  phase: number;

  mobileHidden?: boolean;
};

/*
 * ============================================================
 * MICRO INFORMATION FIELD
 * ============================================================
 *
 * Nenhum Math.random().
 *
 * As posições foram distribuídas
 * manualmente para complementar
 * os clusters principais.
 */

export const chaosMicroSignals:
  ChaosMicroDatum[] = [
  /*
   * ==========================================================
   * CENTRAL / EARLY SIGNALS
   * ==========================================================
   */

  {
    id: "micro-sale-01",

    labelKey: "sale",
    value: "+ R$ 42,00",

    variant: "metric",
    depth: "near",
    size: "sm",

    x: 1280,
    y: 920,
    z: 95,

    rotation: -4,

    revealAt: 0.15,

    driftX: 14,
    driftY: -10,

    phase: 0.12,
  },

  {
    id: "micro-messages-01",

    labelKey: "messages",

    variant: "tag",
    depth: "middle",
    size: "xs",

    x: 1940,
    y: 1120,
    z: 5,

    rotation: 5,

    revealAt: 0.17,

    driftX: -10,
    driftY: 15,

    phase: 0.41,
  },

  {
    id: "micro-order-01",

    labelKey: "order",
    value: "#4902",

    variant: "log",
    depth: "far",
    size: "sm",

    x: 1540,
    y: 750,
    z: -75,

    rotation: -3,

    revealAt: 0.19,

    driftX: 8,
    driftY: 12,

    phase: 0.74,
  },

  /*
   * ==========================================================
   * RIGHT / OPERATIONS
   * ==========================================================
   */

  {
    id: "micro-stock-01",

    labelKey:
      "stockLow",
    value: "2 un.",

    variant: "warning",
    depth: "near",
    size: "sm",

    x: 2230,
    y: 610,
    z: 120,

    rotation: 6,

    revealAt: 0.225,

    driftX: -16,
    driftY: 9,

    phase: 0.31,
  },

  {
    id: "micro-updated-01",

    labelKey:
      "updated",
    value: "09:58",

    variant: "tag",
    depth: "far",
    size: "xs",

    x: 2440,
    y: 980,
    z: -95,

    rotation: -5,

    revealAt: 0.245,

    driftX: 11,
    driftY: -7,

    phase: 0.56,
  },

  {
    id: "micro-sync-01",

    labelKey: "sync",

    variant: "bar",
    depth: "middle",
    size: "md",

    x: 2670,
    y: 540,
    z: 15,

    rotation: 4,

    revealAt: 0.265,

    driftX: -12,
    driftY: 15,

    phase: 0.83,
  },

  {
    id: "micro-pending-01",

    labelKey:
      "pending",
    value: "4",

    variant: "warning",
    depth: "foreground",
    size: "xs",

    x: 2910,
    y: 900,
    z: 205,

    rotation: -8,

    revealAt: 0.29,

    driftX: -20,
    driftY: -12,

    phase: 0.18,

    mobileHidden: true,
  },

  /*
   * ==========================================================
   * LEFT / SALES + FINANCE
   * ==========================================================
   */

  {
    id: "micro-pix-01",

    labelKey: "pix",
    value: "R$ 890",

    variant: "metric",
    depth: "near",
    size: "sm",

    x: 720,
    y: 820,
    z: 105,

    rotation: 5,

    revealAt: 0.335,

    driftX: 18,
    driftY: -9,

    phase: 0.66,
  },

  {
    id: "micro-approved-01",

    labelKey:
      "approved",

    variant: "dot",
    depth: "middle",
    size: "xs",

    x: 440,
    y: 1230,
    z: 0,

    rotation: -4,

    revealAt: 0.36,

    driftX: 11,
    driftY: 13,

    phase: 0.27,
  },

  {
    id: "micro-invoice-01",

    labelKey:
      "invoice",
    value: "R$ 340",

    variant: "log",
    depth: "far",
    size: "sm",

    x: 940,
    y: 1560,
    z: -80,

    rotation: 6,

    revealAt: 0.39,

    driftX: -9,
    driftY: 10,

    phase: 0.9,
  },

  {
    id: "micro-late-01",

    labelKey: "late",

    variant: "warning",
    depth: "foreground",
    size: "md",

    x: 310,
    y: 1710,
    z: 225,

    rotation: -9,

    revealAt: 0.415,

    driftX: 24,
    driftY: -17,

    phase: 0.48,

    mobileHidden: true,
  },

  /*
   * ==========================================================
   * RISE / UPPER WORLD
   * ==========================================================
   */

  {
    id: "micro-report-01",

    labelKey:
      "report",
    value: "Q4",

    variant: "tag",
    depth: "middle",
    size: "sm",

    x: 1210,
    y: 330,
    z: 5,

    rotation: -6,

    revealAt: 0.44,

    driftX: 13,
    driftY: 8,

    phase: 0.22,
  },

  {
    id: "micro-goal-01",

    labelKey: "goal",
    value: "72%",

    variant: "bar",
    depth: "near",
    size: "md",

    x: 1780,
    y: 260,
    z: 100,

    rotation: 4,

    revealAt: 0.46,

    driftX: -12,
    driftY: 10,

    phase: 0.59,
  },

  {
    id: "micro-employee-01",

    labelKey:
      "employee",
    value: "08:01",

    variant: "log",
    depth: "far",
    size: "sm",

    x: 2240,
    y: 350,
    z: -110,

    rotation: 5,

    revealAt: 0.48,

    driftX: -7,
    driftY: 9,

    phase: 0.8,
  },

  /*
   * ==========================================================
   * OVERVIEW DENSITY
   * ==========================================================
   */

  {
    id: "micro-cash-01",

    labelKey: "cash",
    value: "R$ 4.280",

    variant: "metric",
    depth: "middle",
    size: "md",

    x: 1070,
    y: 1280,
    z: 0,

    rotation: -4,

    revealAt: 0.51,

    driftX: 15,
    driftY: -13,

    phase: 0.36,
  },

  {
    id: "micro-processing-01",

    labelKey:
      "processing",

    variant: "bar",
    depth: "far",
    size: "md",

    x: 2130,
    y: 1390,
    z: -95,

    rotation: 4,

    revealAt: 0.535,

    driftX: -10,
    driftY: 7,

    phase: 0.68,
  },

  {
    id: "micro-new-01",

    labelKey: "new",
    value: "12",

    variant: "dot",
    depth: "near",
    size: "xs",

    x: 2560,
    y: 1280,
    z: 115,

    rotation: -5,

    revealAt: 0.55,

    driftX: -16,
    driftY: -13,

    phase: 0.11,
  },

  /*
   * ==========================================================
   * POST-IMPACT / REBOUND
   * ==========================================================
   */

  {
    id: "micro-sale-02",

    labelKey: "sale",
    value: "+ R$ 215",

    variant: "metric",
    depth: "foreground",
    size: "md",

    x: 2490,
    y: 1570,
    z: 235,

    rotation: 8,

    revealAt: 0.735,

    driftX: -25,
    driftY: 18,

    phase: 0.43,

    mobileHidden: true,
  },

  {
    id: "micro-alert-01",

    labelKey: "alert",
    value: "5",

    variant: "warning",
    depth: "near",
    size: "sm",

    x: 2820,
    y: 1210,
    z: 130,

    rotation: -7,

    revealAt: 0.755,

    driftX: -20,
    driftY: 13,

    phase: 0.71,
  },

  {
    id: "micro-order-02",

    labelKey: "order",
    value: "#4911",

    variant: "log",
    depth: "middle",
    size: "sm",

    x: 2080,
    y: 1700,
    z: 15,

    rotation: 6,

    revealAt: 0.77,

    driftX: 14,
    driftY: -16,

    phase: 0.24,
  },

  /*
   * ==========================================================
   * DEEP RUN
   * ==========================================================
   */

  {
    id: "micro-error-01",

    labelKey: "error",
    value: "SYNC",

    variant: "warning",
    depth: "foreground",
    size: "md",

    x: 1730,
    y: 1430,
    z: 250,

    rotation: -11,

    revealAt: 0.79,

    driftX: 26,
    driftY: 19,

    phase: 0.52,

    mobileHidden: true,
  },

  {
    id: "micro-pix-02",

    labelKey: "pix",
    value: "+ R$ 120",

    variant: "metric",
    depth: "near",
    size: "sm",

    x: 1430,
    y: 1740,
    z: 135,

    rotation: 7,

    revealAt: 0.805,

    driftX: -19,
    driftY: -14,

    phase: 0.87,
  },

  {
    id: "micro-today-01",

    labelKey: "today",
    value: "17:00",

    variant: "tag",
    depth: "middle",
    size: "xs",

    x: 1140,
    y: 1450,
    z: 5,

    rotation: -6,

    revealAt: 0.815,

    driftX: 13,
    driftY: 17,

    phase: 0.33,
  },

  /*
   * ==========================================================
   * CROSS WORLD
   * ==========================================================
   */

  {
    id: "micro-sale-03",

    labelKey: "sale",
    value: "+ R$ 64,90",

    variant: "metric",
    depth: "foreground",
    size: "sm",

    x: 650,
    y: 1040,
    z: 220,

    rotation: -9,

    revealAt: 0.835,

    driftX: 28,
    driftY: -11,

    phase: 0.61,

    mobileHidden: true,
  },

  {
    id: "micro-pending-02",

    labelKey:
      "pending",
    value: "11",

    variant: "warning",
    depth: "near",
    size: "xs",

    x: 430,
    y: 740,
    z: 120,

    rotation: 8,

    revealAt: 0.845,

    driftX: 17,
    driftY: 18,

    phase: 0.14,
  },

  {
    id: "micro-report-02",

    labelKey:
      "report",
    value: "18 pág.",

    variant: "log",
    depth: "far",
    size: "sm",

    x: 820,
    y: 540,
    z: -120,

    rotation: 5,

    revealAt: 0.855,

    driftX: -9,
    driftY: 13,

    phase: 0.77,
  },

  /*
   * ==========================================================
   * CHAOS MAXIMUM
   * ==========================================================
   */

  {
    id: "micro-error-02",

    labelKey: "error",
    value: "500",

    variant: "warning",
    depth: "foreground",
    size: "md",

    x: 1180,
    y: 880,
    z: 260,

    rotation: 12,

    revealAt: 0.865,

    driftX: 31,
    driftY: -23,

    phase: 0.21,

    mobileHidden: true,
  },

  {
    id: "micro-messages-02",

    labelKey:
      "messages",
    value: "12",

    variant: "tag",
    depth: "near",
    size: "sm",

    x: 1470,
    y: 1280,
    z: 145,

    rotation: -8,

    revealAt: 0.872,

    driftX: -24,
    driftY: 18,

    phase: 0.47,
  },

  {
    id: "micro-invoice-02",

    labelKey:
      "invoice",
    value: "R$ 1.840",

    variant: "log",
    depth: "middle",
    size: "md",

    x: 1870,
    y: 760,
    z: 20,

    rotation: 9,

    revealAt: 0.878,

    driftX: 20,
    driftY: 21,

    phase: 0.72,
  },

  {
    id: "micro-stock-02",

    labelKey:
      "stockLow",
    value: "1 un.",

    variant: "warning",
    depth: "foreground",
    size: "sm",

    x: 2110,
    y: 1140,
    z: 240,

    rotation: -13,

    revealAt: 0.884,

    driftX: -29,
    driftY: -18,

    phase: 0.93,

    mobileHidden: true,
  },

  {
    id: "micro-goal-02",

    labelKey: "goal",
    value: "68%",

    variant: "bar",
    depth: "near",
    size: "md",

    x: 2450,
    y: 980,
    z: 125,

    rotation: 8,

    revealAt: 0.889,

    driftX: -21,
    driftY: 15,

    phase: 0.38,
  },

  {
    id: "micro-alert-02",

    labelKey: "alert",
    value: "URGENTE",

    variant: "warning",
    depth: "foreground",
    size: "md",

    x: 2760,
    y: 1430,
    z: 270,

    rotation: 14,

    revealAt: 0.892,

    driftX: 34,
    driftY: -25,

    phase: 0.57,

    mobileHidden: true,
  },

  {
    id: "micro-sync-02",

    labelKey: "sync",
    value: "84%",

    variant: "bar",
    depth: "middle",
    size: "sm",

    x: 950,
    y: 1860,
    z: 10,

    rotation: -9,

    revealAt: 0.894,

    driftX: 22,
    driftY: -17,

    phase: 0.81,
  },
];