import { SoundController } from "@/audio/SoundController";

import { ExperienceDirector } from "@/experience/events/ExperienceDirector";

import { MiniRevenueChart } from "@/components/lab/MiniRevenueChart";
import { SaleInsight } from "@/components/lab/SaleInsight";
import { SalePropagationTest } from "@/components/lab/SalePropagationTest";
import { SoundToggle } from "@/components/lab/SoundToggle";
import { SpatialReactionTest } from "@/components/lab/SpatialReactionTest";
import { EventMonitor } from "@/components/lab/EventMonitor";

export default function SalePropagationLabPage() {
  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-16 text-white">
      <SoundController />

      <ExperienceDirector />

      <SoundToggle />

      <SalePropagationTest />

      <div className="mx-auto mt-6 grid max-w-7xl gap-6 lg:grid-cols-2">
        <MiniRevenueChart />

        <SaleInsight />
      </div>

      <div className="mx-auto mt-6 max-w-7xl">
        <SpatialReactionTest />
      </div>

      <div className="mx-auto mt-6 max-w-7xl">
        <EventMonitor />
      </div>
    </main>
  );
}