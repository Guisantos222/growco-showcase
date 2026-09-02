import fs from "node:fs";
import path from "node:path";

const SAMPLE_RATE = 44100;

function createTone({
  frequency,
  duration,
  volume = 0.25,
  fade = true,
}) {
  const sampleCount =
    Math.floor(SAMPLE_RATE * duration);

  const buffer =
    Buffer.alloc(44 + sampleCount * 2);

  const dataSize = sampleCount * 2;

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);

  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(
    SAMPLE_RATE * 2,
    28,
  );
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);

  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (
    let i = 0;
    i < sampleCount;
    i += 1
  ) {
    const time =
      i / SAMPLE_RATE;

    let envelope = 1;

    if (fade) {
      const progress =
        i / sampleCount;

      envelope =
        Math.sin(
          Math.PI * progress,
        );
    }

    const sample =
      Math.sin(
        2 *
          Math.PI *
          frequency *
          time,
      ) *
      volume *
      envelope;

    buffer.writeInt16LE(
      Math.floor(sample * 32767),
      44 + i * 2,
    );
  }

  return buffer;
}

const outputDirectory =
  path.join(
    process.cwd(),
    "public",
    "audio",
    "lab",
  );

fs.mkdirSync(
  outputDirectory,
  {
    recursive: true,
  },
);

const sounds = [
  {
    name: "ui-click.wav",
    frequency: 700,
    duration: 0.07,
  },
  {
    name: "data-send.wav",
    frequency: 440,
    duration: 0.16,
  },
  {
    name: "data-arrive.wav",
    frequency: 880,
    duration: 0.12,
  },
  {
    name: "success.wav",
    frequency: 1050,
    duration: 0.2,
  },
];

for (const sound of sounds) {
  const file = createTone(sound);

  fs.writeFileSync(
    path.join(
      outputDirectory,
      sound.name,
    ),
    file,
  );

  console.log(
    `Generated ${sound.name}`,
  );
}