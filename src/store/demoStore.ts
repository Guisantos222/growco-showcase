import { create } from "zustand";

export type DemoSale = {
  id: string;
  product: string;
  quantity: number;
  total: number;
};

type DemoState = {
  employeeName: string;

  clockedIn: boolean;
  activeEmployees: number;

  revenue: number;
  stock: number;
  goalProgress: number;

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

    return {
      revenue: state.revenue + sale.total,
      stock: state.stock - sale.quantity,
      goalProgress: Math.min(100, state.goalProgress + 1),
      lastSale: sale,
      saleError: null,
    };
  }),

  resetDemo: () => set(initialState),
}));