import {
    ChaosScene,
} from "@/components/showcase/scenes/chaos/ChaosScene";

import {
    ControlScene,
} from "@/components/showcase/scenes/control/ControlScene";

import {
    ShowcaseFooter,
} from "@/components/showcase/footer/ShowcaseFooter";

import {
    ShowcaseShell,
} from "@/components/showcase/ShowcaseShell";

import {
    ProductScene,
} from "@/components/showcase/scenes/product/ProductScene";

export default function ShowcasePage() {
    return (
        <ShowcaseShell>
            <ChaosScene />

            <ControlScene />

            <ProductScene />

            <ShowcaseFooter />
        </ShowcaseShell>
    );
}
