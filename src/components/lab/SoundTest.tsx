"use client";

import {
  playSound,
  type SoundId,
} from "@/audio/soundManager";

import { useSoundStore } from "@/store/soundStore";

const soundTests: {
  id: SoundId;
  label: string;
  description: string;
}[] = [
  {
    id: "uiClick",
    label: "UI Click",
    description:
      "Feedback curto de interface.",
  },

  {
    id: "dataSend",
    label: "Data Send",
    description:
      "Informação iniciando uma trajetória.",
  },

  {
    id: "dataArrive",
    label: "Data Arrive",
    description:
      "Informação atingindo um módulo.",
  },

  {
    id: "success",
    label: "Success",
    description:
      "Confirmação positiva de uma operação.",
  },
];

export function SoundTest() {
  const enabled =
    useSoundStore(
      (state) => state.enabled,
    );

  const volume =
    useSoundStore(
      (state) => state.volume,
    );

  const toggleSound =
    useSoundStore(
      (state) => state.toggleSound,
    );

  const setVolume =
    useSoundStore(
      (state) => state.setVolume,
    );

  function handleSound(
    id: SoundId,
  ) {
    if (!enabled) {
      return;
    }

    playSound(id);
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <header>
        <p className="text-sm uppercase tracking-[0.3em] text-[#0BA5FF]">
          Sound System
        </p>

        <h1 className="mt-3 text-5xl font-semibold tracking-tight">
          Audio Laboratory
        </h1>

        <p className="mt-4 max-w-2xl text-neutral-400">
          Feedback sonoro contextual para
          interface, dados e eventos da
          experiência.
        </p>
      </header>

      <section className="mt-12 rounded-[2rem] border border-white/10 bg-white/5 p-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-sm text-neutral-500">
              Global Sound
            </p>

            <p className="mt-2 text-2xl font-semibold">
              {enabled
                ? "Enabled"
                : "Disabled"}
            </p>
          </div>

          <button
            type="button"
            onClick={toggleSound}
            className="rounded-full bg-[#0BA5FF] px-6 py-3 font-medium text-white"
          >
            {enabled
              ? "Disable sound"
              : "Enable sound"}
          </button>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between">
            <label
              htmlFor="sound-volume"
              className="text-sm text-neutral-400"
            >
              Volume
            </label>

            <span className="text-sm text-white">
              {Math.round(
                volume * 100,
              )}
              %
            </span>
          </div>

          <input
            id="sound-volume"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(event) =>
              setVolume(
                Number(
                  event.target.value,
                ),
              )
            }
            className="mt-4 w-full"
          />
        </div>
      </section>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {soundTests.map(
          (sound) => (
            <button
              key={sound.id}
              type="button"
              onClick={() =>
                handleSound(
                  sound.id,
                )
              }
              disabled={!enabled}
              className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-left transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <p className="text-xl font-semibold">
                {sound.label}
              </p>

              <p className="mt-2 text-sm text-neutral-400">
                {
                  sound.description
                }
              </p>
            </button>
          ),
        )}
      </div>
    </div>
  );
}