"use client";

import { useDemoStore } from "@/store/demoStore";

export function StateTest() {
  const employeeName = useDemoStore((state) => state.employeeName);

  const clockedIn = useDemoStore((state) => state.clockedIn);
  const activeEmployees = useDemoStore((state) => state.activeEmployees);

  const revenue = useDemoStore((state) => state.revenue);
  const stock = useDemoStore((state) => state.stock);
  const goalProgress = useDemoStore((state) => state.goalProgress);

  const lastSale = useDemoStore((state) => state.lastSale);
  const saleError = useDemoStore((state) => state.saleError);

  const clockIn = useDemoStore((state) => state.clockIn);
  const registerSale = useDemoStore((state) => state.registerSale);
  const resetDemo = useDemoStore((state) => state.resetDemo);

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

  const canRegisterSale = stock >= 2;

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-12">
        <p className="text-sm uppercase tracking-[0.3em] text-[#0BA5FF]">
          Zustand Test
        </p>

        <h1 className="mt-3 text-5xl font-semibold tracking-tight">
          Company State
        </h1>

        <p className="mt-4 text-neutral-400">
          Uma ação altera diferentes partes da empresa simultaneamente.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard title="Receita" value={formattedRevenue} />

        <MetricCard title="Estoque" value={`${stock} unidades`} />

        <MetricCard title="Meta" value={`${goalProgress}%`} />

        <MetricCard
          title="Funcionários ativos"
          value={String(activeEmployees)}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <p className="text-sm text-neutral-400">Funcionário</p>

          <h2 className="mt-2 text-3xl font-semibold">{employeeName}</h2>

          <p className="mt-4 text-neutral-400">
            Status:{" "}
            <span className="text-white">
              {clockedIn ? "Em jornada" : "Fora da jornada"}
            </span>
          </p>

          <button
            type="button"
            onClick={clockIn}
            disabled={clockedIn}
            className="mt-8 rounded-full bg-[#0BA5FF] px-6 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            {clockedIn ? "Ponto registrado" : "Bater ponto"}
          </button>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <p className="text-sm text-neutral-400">Operação</p>

          <h2 className="mt-2 text-3xl font-semibold">Café Especial</h2>

          <div className="mt-6 space-y-2 text-neutral-400">
            <p>Quantidade: 2</p>
            <p>Valor: R$ 119,80</p>
          </div>

         <button
            type="button"
            onClick={handleSale}
            disabled={!canRegisterSale}
            className="mt-8 rounded-full bg-white px-6 py-3 font-medium text-black disabled:cursor-not-allowed disabled:opacity-40"
            >
            {canRegisterSale ? "Registrar venda" : "Sem estoque"}
            </button>

            {saleError && (
            <p className="mt-4 text-sm font-medium text-red-400">
                {saleError}
            </p>
            )}
        </section>
      </div>

      <section className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
          Último evento
        </p>

        <div className="mt-4 min-h-14">
          {lastSale ? (
            <>
              <p className="text-xl font-medium">
                Venda de {lastSale.product}
              </p>

              <p className="mt-2 text-neutral-400">
                {lastSale.quantity} unidades — R$ {lastSale.total.toFixed(2)}
              </p>
            </>
          ) : (
            <p className="text-neutral-500">
              Nenhuma venda registrada nesta sessão.
            </p>
          )}
        </div>
      </section>

      <button
        type="button"
        onClick={resetDemo}
        className="mt-8 text-sm text-neutral-400 underline underline-offset-4 hover:text-white"
      >
        Reset demo
      </button>
    </div>
  );
}

type MetricCardProps = {
  title: string;
  value: string;
};

function MetricCard({ title, value }: MetricCardProps) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <p className="text-sm text-neutral-500">{title}</p>

      <p className="mt-3 text-2xl font-semibold">{value}</p>
    </article>
  );
}