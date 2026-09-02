import { demoLoginSchema } from "@/schemas/demoLoginSchema";

export default function ValidationLabPage() {
  const validResult = demoLoginSchema.safeParse({
    email: "ricardo@growco.com",
    company: "Demo Company",
  });

  const invalidResult = demoLoginSchema.safeParse({
    email: "teste@growco.com",
    company: "growCo.",
  });

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm uppercase tracking-[0.3em] text-[#0BA5FF]">
          Zod
        </p>

        <h1 className="mt-3 text-5xl font-semibold">
          Validation Laboratory
        </h1>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-neutral-400">
              Dados válidos
            </p>

            <p className="mt-4 text-2xl font-semibold">
              {validResult.success ? "✓ Accepted" : "✗ Rejected"}
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-neutral-400">
              Dados inválidos
            </p>

            <p className="mt-4 text-2xl font-semibold">
              {invalidResult.success ? "✓ Accepted" : "✗ Rejected"}
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}