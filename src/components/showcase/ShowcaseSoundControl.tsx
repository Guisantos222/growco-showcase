"use client";

import {
  Volume2,
  VolumeX,
} from "lucide-react";

import {
  useTranslations,
} from "next-intl";

import {
  useSoundStore,
} from "@/store/soundStore";

export function ShowcaseSoundControl() {
  const t =
    useTranslations(
      "Showcase.navigation",
    );

  const enabled =
    useSoundStore(
      (state) =>
        state.enabled,
    );

  const toggleSound =
    useSoundStore(
      (state) =>
        state.toggleSound,
    );

  const Icon =
    enabled
      ? Volume2
      : VolumeX;

  return (
    <button
      type="button"
      onClick={toggleSound}
      aria-pressed={enabled}
      aria-label={
        enabled
          ? t("soundOn")
          : t("soundOff")
      }
      className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/10"
    >
      <Icon
        size={17}
        strokeWidth={1.8}
      />
    </button>
  );
}