import { create } from "zustand";

type SoundState = {
  enabled: boolean;
  volume: number;

  enableSound: () => void;
  disableSound: () => void;
  toggleSound: () => void;

  setVolume: (volume: number) => void;
};

export const useSoundStore = create<SoundState>((set) => ({
  enabled: false,

  volume: 0.65,

  enableSound: () =>
    set({
      enabled: true,
    }),

  disableSound: () =>
    set({
      enabled: false,
    }),

  toggleSound: () =>
    set((state) => ({
      enabled: !state.enabled,
    })),

  setVolume: (volume) =>
    set({
      volume: Math.min(
        1,
        Math.max(0, volume),
      ),
    }),
}));