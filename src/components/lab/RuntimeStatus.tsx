"use client";

import {
  useExperienceRuntime,
} from "@/experience/hooks/useExperienceRuntime";

export function RuntimeStatus() {
  const runtime =
    useExperienceRuntime();

  return (
    <section className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-[#0BA5FF]">
            Runtime
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            Production readiness
          </h2>
        </div>

        {!runtime.ready ? (
          <span className="text-sm text-neutral-500">
            Detecting...
          </span>
        ) : (
          <div className="flex flex-wrap gap-3">
            <RuntimeBadge
              label="WebGL"
              value={
                runtime.webglSupported
                  ? "Available"
                  : "Fallback"
              }
            />

            <RuntimeBadge
              label="Motion"
              value={
                runtime.reducedMotion
                  ? "Reduced"
                  : "Full"
              }
            />

            <RuntimeBadge
              label="Quality"
              value={runtime.quality.toUpperCase()}
            />
          </div>
        )}
      </div>
    </section>
  );
}

type RuntimeBadgeProps = {
  label: string;
  value: string;
};

function RuntimeBadge({
  label,
  value,
}: RuntimeBadgeProps) {
  return (
    <div className="rounded-full border border-white/10 bg-black/20 px-4 py-2">
      <span className="text-xs text-neutral-500">
        {label}
      </span>

      <span className="ml-2 text-xs font-medium text-white">
        {value}
      </span>
    </div>
  );
}