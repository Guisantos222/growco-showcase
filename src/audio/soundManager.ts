import { Howl, Howler } from "howler";

export type SoundId =
  | "uiClick"
  | "dataSend"
  | "dataArrive"
  | "success";

type SoundDefinition = {
  src: string;
  volume: number;
};

const soundDefinitions: Record<
  SoundId,
  SoundDefinition
> = {
  uiClick: {
    src: "/audio/lab/ui-click.wav",
    volume: 0.35,
  },

  dataSend: {
    src: "/audio/lab/data-send.wav",
    volume: 0.35,
  },

  dataArrive: {
    src: "/audio/lab/data-arrive.wav",
    volume: 0.3,
  },

  success: {
    src: "/audio/lab/success.wav",
    volume: 0.4,
  },
};

const sounds =
  new Map<SoundId, Howl>();

function getSound(
  id: SoundId,
) {
  const existing =
    sounds.get(id);

  if (existing) {
    return existing;
  }

  const definition =
    soundDefinitions[id];

  const sound =
    new Howl({
      src: [definition.src],

      volume:
        definition.volume,

      preload: true,
    });

  sounds.set(
    id,
    sound,
  );

  return sound;
}

export function playSound(
  id: SoundId,
) {
  const sound =
    getSound(id);

  sound.play();
}

export function setGlobalVolume(
  volume: number,
) {
  Howler.volume(
    Math.min(
      1,
      Math.max(0, volume),
    ),
  );
}

export function muteAllSounds() {
  Howler.mute(true);
}

export function unmuteAllSounds() {
  Howler.mute(false);
}