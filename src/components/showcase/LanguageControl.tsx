"use client";

import {
  Languages,
} from "lucide-react";

import {
  useLocale,
} from "next-intl";

import {
  usePathname,
  useRouter,
} from "@/i18n/navigation";

export function LanguageControl() {
  const locale =
    useLocale();

  const pathname =
    usePathname();

  const router =
    useRouter();

  const nextLocale =
    locale === "pt"
      ? "en"
      : "pt";

  function handleLanguageChange() {
    router.replace(
      pathname,
      {
        locale:
          nextLocale,
      },
    );
  }

  return (
    <button
      type="button"
      onClick={
        handleLanguageChange
      }
      aria-label="Change language"
      className="flex h-9 items-center gap-2 rounded-full px-3 text-xs font-medium uppercase tracking-[0.1em] transition hover:bg-white/10"
    >
      <Languages
        size={15}
        strokeWidth={1.8}
      />

      {nextLocale}
    </button>
  );
}