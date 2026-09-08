import type {
  Metadata,
} from "next";

import {
  NextIntlClientProvider,
} from "next-intl";

import {
  notFound,
} from "next/navigation";

import {
  setRequestLocale,
} from "next-intl/server";

import "@/app/globals.css";

import "lenis/dist/lenis.css";

import {
  isAppLocale,
  routing,
} from "@/i18n/routing";

export const metadata: Metadata = {
  title:
    "growCo. — Connected business management",

  description:
    "A connected business management ecosystem built around data in motion.",
};

export function generateStaticParams() {
  return routing.locales.map(
    (locale) => ({
      locale,
    }),
  );
}

type LocaleLayoutProps = {
  children:
    React.ReactNode;

  params: Promise<{
    locale: string;
  }>;
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const {
    locale,
  } = await params;

  if (
    !isAppLocale(locale)
  ) {
    notFound();
  }

  setRequestLocale(
    locale,
  );

  const htmlLanguage =
    locale === "pt"
      ? "pt-BR"
      : "en";

  return (
    <html
      lang={htmlLanguage}
    >
      <body>
        <NextIntlClientProvider>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}