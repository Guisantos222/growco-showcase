import { SoundController } from "@/audio/SoundController";
import { ChartTest } from "@/components/lab/ChartTest";
import { SoundToggle } from "@/components/lab/SoundToggle";
import { SvgDataTest } from "@/components/lab/SvgDataTest";

export default function ChartsLabPage() {
  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-16 text-white">
      <SoundController />

      <SoundToggle />

      <ChartTest />

      <div className="mx-auto max-w-6xl">
        <SvgDataTest />
      </div>
    </main>
  );
}