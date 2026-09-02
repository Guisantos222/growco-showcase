"use client";

import {
  playSound,
} from "@/audio/soundManager";

import {
  useExperienceEvent,
} from "@/experience/hooks/useExperienceEvent";

import {
  useDemoStore,
} from "@/store/demoStore";

import {
  useSoundStore,
} from "@/store/soundStore";

export function ExperienceDirector() {
  const registerSale =
    useDemoStore(
      (state) =>
        state.registerSale,
    );

  const resetDemo =
    useDemoStore(
      (state) =>
        state.resetDemo,
    );

  const soundEnabled =
    useSoundStore(
      (state) =>
        state.enabled,
    );

  useExperienceEvent(
    "SALE_STARTED",
    () => {
      if (
        soundEnabled
      ) {
        playSound(
          "dataSend",
        );
      }
    },
  );

  useExperienceEvent(
    "DATA_ARRIVED",
    ({ sale }) => {
      registerSale(
        sale,
      );

      if (
        soundEnabled
      ) {
        playSound(
          "dataArrive",
        );
      }
    },
  );

  useExperienceEvent(
    "SALE_COMPLETED",
    () => {
      if (
        soundEnabled
      ) {
        playSound(
          "success",
        );
      }
    },
  );

  useExperienceEvent(
    "DEMO_RESET",
    () => {
      resetDemo();
    },
  );

  return null;
}