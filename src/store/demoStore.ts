import { create } from "zustand";

export type DemoSale = {
  id: string;
  product: string;
  quantity: number;
  total: number;
};

export type RevenuePoint = {
  id: string;
  label: string;
  value: number;
};

type DemoState = {
  employeeName: string;

  clockedIn: boolean;
  activeEmployees: number;

  revenue: number;
  stock: number;
  goalProgress: number;

  revenueHistory: RevenuePoint[];
  saleCount: number;

  lastSale: DemoSale | null;
  saleError: string | null;

  clockIn: () => void;
  registerSale: (sale: DemoSale) => void;
  resetDemo: () => void;
};

const initialState = {
  employeeName: "Ricardo",

  clockedIn: false,
  activeEmployees: 7,

  revenue: 31480,
  stock: 24,
  goalProgress: 72,

  revenueHistory: [
    {
      id: "base-1",
      label: "10h",
      value: 30240,
    },
    {
      id: "base-2",
      label: "11h",
      value: 30680,
    },
    {
      id: "base-3",
      label: "12h",
      value: 30990,
    },
    {
      id: "base-4",
      label: "13h",
      value: 31120,
    },
    {
      id: "base-5",
      label: "14h",
      value: 31360,
    },
    {
      id: "base-6",
      label: "Agora",
      value: 31480,
    },
  ],

  saleCount: 0,

  lastSale: null,
  saleError: null,
};

export const useDemoStore = create<DemoState>((set) => ({
  ...initialState,

  clockIn: () =>
    set((state) => {
      if (state.clockedIn) {
        return state;
      }

      return {
        clockedIn: true,
        activeEmployees: state.activeEmployees + 1,
      };
    }),

  registerSale: (sale) =>
    set((state) => {
      if (sale.quantity <= 0) {
        return {
          saleError: "A quantidade da venda deve ser maior que zero.",
        };
      }

      if (sale.quantity > state.stock) {
        return {
          saleError: "Estoque insuficiente para realizar esta venda.",
        };
      }

      const nextRevenue = state.revenue + sale.total;
      const nextSaleCount = state.saleCount + 1;

      return {
        revenue: nextRevenue,

        stock: state.stock - sale.quantity,

        goalProgress: Math.min(
          100,
          state.goalProgress + 1,
        ),

        lastSale: sale,

        saleError: null,

        saleCount: nextSaleCount,

        revenueHistory: [
          ...state.revenueHistory,
          {
            id: sale.id,
            label: `V${nextSaleCount}`,
            value: nextRevenue,
          },
        ].slice(-8),
      };
    }),

  resetDemo: () => set(initialState),
}));