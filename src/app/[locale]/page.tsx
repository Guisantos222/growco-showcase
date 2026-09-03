import {
  getTranslations,
} from "next-intl/server";

import {
  ShowcaseShell,
} from "@/components/showcase/ShowcaseShell";

export default async function ShowcasePage() {
  const t =
    await getTranslations(
      "Showcase.foundation",
    );

  return (
    <ShowcaseShell>
      <section
        id="top"
        className="flex min-h-screen items-center bg-white px-6 pb-20 pt-32 text-[#080a10]"
      >
        <div className="mx-auto w-full max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#0BA5FF]">
            {t("eyebrow")}
          </p>

          <div className="mt-6 inline-flex rounded-full border border-black/10 px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-neutral-500">
            {t("status")}
          </div>

          <h1 className="mt-8 max-w-5xl text-6xl font-semibold leading-[0.95] tracking-[-0.055em] md:text-8xl lg:text-[7rem]">
            {t("title")}
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-neutral-500 md:text-xl">
            {t(
              "description",
            )}
          </p>
        </div>
      </section>

      <FoundationSection
        id="product"
        eyebrow="01"
        title={
          t(
            "productTitle",
          )
        }
        description={
          t(
            "productDescription",
          )
        }
      />

      <FoundationSection
        id="demo"
        eyebrow="02"
        title={
          t(
            "demoTitle",
          )
        }
        description={
          t(
            "demoDescription",
          )
        }
      />

      <FoundationSection
        id="pricing"
        eyebrow="03"
        title={
          t(
            "pricingTitle",
          )
        }
        description={
          t(
            "pricingDescription",
          )
        }
      />
    </ShowcaseShell>
  );
}

type FoundationSectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
};

function FoundationSection({
  id,
  eyebrow,
  title,
  description,
}: FoundationSectionProps) {
  return (
    <section
      id={id}
      className="flex min-h-[70vh] scroll-mt-28 items-center border-t border-white/10 bg-[#080a10] px-6 text-white"
    >
      <div className="mx-auto w-full max-w-7xl">
        <p className="text-sm text-[#0BA5FF]">
          {eyebrow}
        </p>

        <h2 className="mt-4 text-5xl font-semibold tracking-tight md:text-7xl">
          {title}
        </h2>

        <p className="mt-5 max-w-xl text-neutral-400">
          {description}
        </p>
      </div>
    </section>
  );
}