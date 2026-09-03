"use client";

import {
  ArrowUpRight,
} from "lucide-react";

import {
  useTranslations,
} from "next-intl";

import {
  LanguageControl,
} from "@/components/showcase/LanguageControl";

import {
  ShowcaseSoundControl,
} from "@/components/showcase/ShowcaseSoundControl";

export function GlobalNavigation() {
  const t =
    useTranslations(
      "Showcase.navigation",
    );

  return (
    <nav className="pointer-events-none fixed inset-x-0 top-0 z-[100] px-4 pt-4 md:px-6 md:pt-5">
      <div className="pointer-events-auto mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/10 bg-black/75 px-4 py-2 text-white shadow-2xl shadow-black/10 backdrop-blur-xl md:px-5">
        <a
          href="#top"
          className="flex items-center gap-2 font-semibold tracking-tight"
        >
          <span className="h-2 w-2 rounded-full bg-[#0BA5FF]" />

          growCo.
        </a>

        <div className="hidden items-center gap-1 md:flex">
          <NavLink href="#product">
            {t("product")}
          </NavLink>

          <NavLink href="#demo">
            {t("demo")}
          </NavLink>

          <NavLink href="#pricing">
            {t("pricing")}
          </NavLink>
        </div>

        <div className="flex items-center gap-1">
          <ShowcaseSoundControl />

          <LanguageControl />

          <a
            href="#demo"
            className="ml-1 hidden items-center gap-2 rounded-full bg-[#0BA5FF] px-4 py-2 text-xs font-semibold text-white transition hover:scale-[1.02] md:flex"
          >
            {t("cta")}

            <ArrowUpRight
              size={14}
            />
          </a>
        </div>
      </div>
    </nav>
  );
}

type NavLinkProps = {
  href: string;

  children:
    React.ReactNode;
};

function NavLink({
  href,
  children,
}: NavLinkProps) {
  return (
    <a
      href={href}
      className="rounded-full px-4 py-2 text-sm text-neutral-300 transition hover:bg-white/10 hover:text-white"
    >
      {children}
    </a>
  );
}