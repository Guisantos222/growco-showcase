import {
  ArrowRight,
  BarChart3,
  Bot,
  Boxes,
  Clock3,
  Languages,
  Package,
  Users,
  Volume2,
} from "lucide-react";

const icons = [
  {
    label: "Dashboard",
    icon: BarChart3,
  },
  {
    label: "Estoque",
    icon: Package,
  },
  {
    label: "Produtos",
    icon: Boxes,
  },
  {
    label: "Pessoas",
    icon: Users,
  },
  {
    label: "Ponto",
    icon: Clock3,
  },
  {
    label: "growAI",
    icon: Bot,
  },
  {
    label: "Idioma",
    icon: Languages,
  },
  {
    label: "Som",
    icon: Volume2,
  },
];

export default function IconsLabPage() {
  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm uppercase tracking-[0.3em] text-[#0BA5FF]">
          Icon System
        </p>

        <h1 className="mt-3 text-5xl font-semibold">
          Lucide Laboratory
        </h1>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {icons.map(
            ({
              label,
              icon: Icon,
            }) => (
              <article
                key={label}
                className="group rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <Icon
                  size={26}
                  strokeWidth={1.7}
                  className="text-[#0BA5FF]"
                />

                <div className="mt-8 flex items-center justify-between">
                  <span>
                    {label}
                  </span>

                  <ArrowRight
                    size={18}
                    className="text-neutral-500 transition-transform group-hover:translate-x-1"
                  />
                </div>
              </article>
            ),
          )}
        </div>
      </div>
    </main>
  );
}