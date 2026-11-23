import {
    SoundController,
} from "@/audio/SoundController";

import {
    BackToLanding,
} from "@/components/showcase/BackToLanding";

import {
    ExperienceStage,
} from "@/components/showcase/ExperienceStage";

import {
    GlobalNavigation,
} from "@/components/showcase/GlobalNavigation";

import {
    RuntimeBridge,
} from "@/components/showcase/RuntimeBridge";

import {
    SmoothScrollProvider,
} from "@/experience/scroll/SmoothScrollProvider";

type ShowcaseShellProps = {
    children:
    React.ReactNode;
};

export function ShowcaseShell({
    children,
}: ShowcaseShellProps) {
    return (
        <SmoothScrollProvider>
            <RuntimeBridge />

            <SoundController />

            <GlobalNavigation />

            <BackToLanding />

            <ExperienceStage>
                {children}
            </ExperienceStage>
        </SmoothScrollProvider>
    );
}