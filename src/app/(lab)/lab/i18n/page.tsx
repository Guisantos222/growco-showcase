import { getTranslations } from "next-intl/server";

export default async function I18nLabPage() {
  const t = await getTranslations("Lab");

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm uppercase tracking-[0.3em] text-[#0BA5FF]">
          {t("eyebrow")}
        </p>

        <h1 className="mt-3 max-w-4xl text-5xl font-semibold tracking-tight md:text-7xl">
          {t("title")}
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-neutral-400">
          {t("description")}
        </p>

        <button
          type="button"
          className="mt-10 rounded-full bg-[#0BA5FF] px-6 py-3 font-medium text-white"
        >
          {t("cta")}
        </button>
      </div>
    </main>
  );
}