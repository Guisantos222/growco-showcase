import {
    getTranslations,
} from "next-intl/server";

import {
    ChaosScene,
} from "@/components/showcase/scenes/chaos/ChaosScene";

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
            <ChaosScene />

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
            className="flex min-h-[70vh] scroll-mt-28 items-center border-t border-white/10 bg-[#080A10] px-6 text-white"
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