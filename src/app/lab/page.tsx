import Link from "next/link";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

import {
  AudioLines,
  BarChart3,
  Boxes,
  Braces,
  Languages,
  MousePointer2,
  Orbit,
  Route,
  TextCursorInput,
  Waypoints,
} from "lucide-react";

const experiments = [
  {
    title: "Motion",
    description: "GSAP, ScrollTrigger e timelines.",
    href: "/lab/motion",
    icon: MousePointer2,
  },
  {
    title: "State",
    description: "Zustand e estado empresarial da demo.",
    href: "/lab/state",
    icon: Braces,
  },
  {
    title: "Three",
    description: "Three.js, R3F, profundidade e WebGL.",
    href: "/lab/three",
    icon: Orbit,
  },
  {
    title: "Charts",
    description: "Recharts, SVG e visualização de dados.",
    href: "/lab/charts",
    icon: BarChart3,
  },
  {
    title: "Sound",
    description: "Howler e arquitetura de áudio.",
    href: "/lab/sound",
    icon: AudioLines,
  },
  {
    title: "i18n",
    description: "Internacionalização da experiência.",
    href: "/lab/i18n",
    icon: Languages,
  },
  {
    title: "Validation",
    description: "Schemas e validação com Zod.",
    href: "/lab/validation",
    icon: Boxes,
  },
  {
    title: "Forms",
    description: "React Hook Form + Zod.",
    href: "/lab/form",
    icon: TextCursorInput,
  },
  {
    title: "Icons",
    description: "Sistema funcional de ícones.",
    href: "/lab/icons",
    icon: Waypoints,
  },
  {
    title: "Sale Propagation",
    description: "Primeiro protótipo completo Data in Motion.",
    href: "/lab/sale-propagation",
    icon: Route,
  },
];

export default function LabPage() {
  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">
        <header>
          <p className="text-sm uppercase tracking-[0.3em] text-[#0BA5FF]">
            growCo. Experience Lab
          </p>

          <h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-tight md:text-7xl">
            Data in Motion Laboratory
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-400">
            Ambiente isolado para desenvolvimento e validação das tecnologias,
            comportamentos e experiências da showcase.
          </p>
        </header>

        <section className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {experiments.map(({ title, description, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group rounded-[2rem] border border-white/10 bg-white/5 p-7 transition hover:border-[#0BA5FF]/40 hover:bg-white/[0.07]"
            >
              <Icon
                size={28}
                strokeWidth={1.6}
                className="text-[#0BA5FF]"
              />

              <h2 className="mt-10 text-2xl font-semibold">
                {title}
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-neutral-400">
                {description}
              </p>

              <p className="mt-8 text-sm text-neutral-500 transition group-hover:text-white">
                Open experiment →
              </p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}