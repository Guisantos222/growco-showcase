"use client";

export const PRODUCT_REFERENCE_VIEW = {
  width: 1600,
  height: 900,
} as const;

export const PRODUCT_WORLD_SIZE = {
  width: 3200,
  height: 1800,
} as const;

export const PRODUCT_GATEWAY = {
  x: 1600,
  y: 790,
} as const;

export const PRODUCT_ENTRY_LANES = [
  1570,
  1582,
  1594,
  1606,
  1618,
  1630,
] as const;

export const PRODUCT_HANDOFF_HORIZONTAL_Y = [
  420,
  432,
  444,
  456,
  468,
  480,
] as const;

export const PRODUCT_LAYOUT = {
  campus: {
    left: 1110,
    top: 525,
    width: 980,
  },
  sales: {
    left: 330,
    top: 980,
    width: 650,
  },
  operations: {
    left: 2280,
    top: 990,
    width: 560,
  },
  finance: {
    left: 2380,
    top: 330,
    width: 270,
  },
  intelligence: {
    left: 1478,
    top: 675,
    width: 244,
    height: 244,
  },
  people: {
    manager: {
      left: 1745,
      top: 1285,
      width: 30,
    },
    finance: {
      left: 2460,
      top: 690,
      width: 27,
    },
    logistics: {
      left: 905,
      top: 1270,
      width: 30,
    },
    general: {
      left: 2070,
      top: 1285,
      width: 29,
    },
  },
} as const;

/*
 * Os caminhos abaixo são a "infraestrutura" do mini mundo.
 * ProductRoads e ProductFlowNetwork usam a mesma geometria para
 * evitar que os dados cortem prédios ou atravessem setores sem lógica.
 */
export const PRODUCT_ROAD_PATHS = {
  entry:
    "M 1600 0 L 1600 610 L 1600 705",
  west:
    "M 1540 820 L 1390 900 L 1200 985 L 1010 1065 L 875 1125",
  northEast:
    "M 1660 770 L 1845 665 L 2070 575 L 2325 485",
  southEast:
    "M 1665 845 L 1890 930 L 2125 1025 L 2305 1100",
  south:
    "M 1600 865 L 1600 1020 L 1635 1170 L 1650 1270",
  westLoop:
    "M 875 1190 L 1115 1305 L 1435 1360",
  eastLoop:
    "M 1765 1360 L 2050 1325 L 2295 1210",
} as const;

export const PRODUCT_FLOW_PATHS = {
  sales:
    "M 1542 817 L 1388 894 L 1195 979 L 1004 1058 L 865 1117",
  stock:
    "M 1554 830 L 1400 908 L 1208 994 L 1017 1073 L 879 1131",
  finance:
    "M 1655 766 L 1840 660 L 2065 570 L 2320 480",
  reports:
    "M 1668 779 L 1852 674 L 2078 584 L 2333 494",
  operations:
    "M 1666 847 L 1890 932 L 2124 1028 L 2298 1103",
  people:
    "M 1600 868 L 1600 1018 L 1636 1170 L 1651 1270",
} as const;
