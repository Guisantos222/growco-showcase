import { RevenueWatcher } from "@/components/lab/RevenueWatcher";
import { StateTest } from "@/components/lab/StateTest";

export default function StateLabPage() {
  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-16 text-white">
      <StateTest />

      <RevenueWatcher />
    </main>
  );
}