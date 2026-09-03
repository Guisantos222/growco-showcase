import { SoundController } from "@/audio/SoundController";
import { SoundTest } from "@/components/lab/SoundTest";

export default function SoundLabPage() {
  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-16 text-white">
      <SoundController />
      <SoundTest />
    </main>
  );
}