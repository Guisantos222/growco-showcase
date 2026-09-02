"use client";

import { useSoundStore } from "@/store/soundStore";

export function SoundToggle() {
  const enabled = useSoundStore(
    (state) => state.enabled,
  );

  const toggleSound = useSoundStore(
    (state) => state.toggleSound,
  );

  return (
    <button
      type="button"
      onClick={toggleSound}
      className="fixed right-6 top-6 z-50 rounded-full border border-white/10 bg-black/60 px-5 py-3 text-sm text-white backdrop-blur-xl"
    >
      Sound {enabled ? "On" : "Off"}
    </button>
  );
}