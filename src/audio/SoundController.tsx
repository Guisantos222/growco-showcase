"use client";

import { useEffect } from "react";

import {
  muteAllSounds,
  setGlobalVolume,
  unmuteAllSounds,
} from "./soundManager";

import { useSoundStore } from "@/store/soundStore";

export function SoundController() {
  const enabled =
    useSoundStore(
      (state) => state.enabled,
    );

  const volume =
    useSoundStore(
      (state) => state.volume,
    );

  useEffect(() => {
    setGlobalVolume(volume);
  }, [volume]);

  useEffect(() => {
    if (enabled) {
      unmuteAllSounds();
    } else {
      muteAllSounds();
    }
  }, [enabled]);

  return null;
}