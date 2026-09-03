import {
  defineRouting,
} from "next-intl/routing";

export const locales = [
  "pt",
  "en",
] as const;

export type AppLocale =
  (typeof locales)[number];

export const routing =
  defineRouting({
    locales,

    defaultLocale:
      "pt",

    localePrefix:
      "always",
  });

export function isAppLocale(
  value:
    | string
    | undefined,
): value is AppLocale {
  if (!value) {
    return false;
  }

  return locales.includes(
    value as AppLocale,
  );
}