"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useDemoStore } from "@/store/demoStore";

export function ChartTest() {
  const revenue = useDemoStore((state) => state.revenue);
  const stock = useDemoStore((state) => state.stock);
  const goalProgress = useDemoStore((state) => state.goalProgress);

  const revenueHistory = useDemoStore(
    (state) => state.revenueHistory,
  );

  const registerSale = useDemoStore(
    (state) => state.registerSale,
  );

  const resetDemo = useDemoStore(
    (state) => state.resetDemo,
  );

  const saleError = useDemoStore(
    (state) => state.saleError,
  );

  function handleSale() {
    registerSale({
      id: crypto.randomUUID(),
      product: "Café Especial",
      quantity: 2,
      total: 119.8,
    });
  }

  const formattedRevenue = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(revenue);

  return (
    <div className="mx-auto w-full max-w-6xl">
      <header>
        <p className="text-sm uppercase tracking-[0.3em] text-[#0BA5FF]">
          Data Visualization
        </p>

        <h1 className="mt-3 text-5xl font-semibold tracking-tight">
          Revenue Flow
        </h1>

        <p className="mt-4 max-w-2xl text-neutral-400">
          O gráfico reage diretamente às operações realizadas
          no estado global da demo.
        </p>
      </header>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        <Metric
          label="Receita"
          value={formattedRevenue}
        />

        <Metric
          label="Estoque"
          value={`${stock} unidades`}
        />

        <Metric
          label="Meta"
          value={`${goalProgress}%`}
        />
      </div>

      <section className="mt-6 rounded-[2rem] border border-white/10 bg-white/5 p-6 md:p-8">
        <div className="h-[360px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueHistory}>
              <CartesianGrid
                stroke="rgba(255,255,255,0.08)"
                vertical={false}
              />

              <XAxis
                dataKey="label"
                stroke="rgba(255,255,255,0.35)"
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                hide
                domain={["dataMin", "dataMax"]}
              />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="value"
                stroke="#0BA5FF"
                strokeWidth={4}
                dot={{
                  fill: "#0BA5FF",
                  r: 4,
                }}
                activeDot={{
                  r: 7,
                }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="mt-8 flex flex-wrap gap-4">
        <button
          type="button"
          onClick={handleSale}
          disabled={stock < 2}
          className="rounded-full bg-[#0BA5FF] px-6 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {stock >= 2
            ? "Registrar venda"
            : "Sem estoque"}
        </button>

        <button
          type="button"
          onClick={resetDemo}
          className="rounded-full border border-white/15 px-6 py-3 font-medium"
        >
          Reset
        </button>
      </div>

      {saleError && (
        <p className="mt-4 text-sm text-red-400">
          {saleError}
        </p>
      )}
    </div>
  );
}

type MetricProps = {
  label: string;
  value: string;
};

function Metric({ label, value }: MetricProps) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <p className="text-sm text-neutral-500">
        {label}
      </p>

      <p className="mt-3 text-2xl font-semibold">
        {value}
      </p>
    </article>
  );
}