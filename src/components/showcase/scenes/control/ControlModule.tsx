type ControlModuleProps = {
  label: string;
  value: string;
  index: number;
};

export function ControlModule({
  label,
  value,
  index,
}: ControlModuleProps) {
  return (
    <article
      data-control-module
      className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 md:p-6"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="flex items-center justify-between gap-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
          {label}
        </p>

        <span className="font-mono text-[9px] text-white/20">
          0{index + 1}
        </span>
      </div>

      <p className="mt-7 text-2xl font-semibold tracking-[-0.04em] text-white md:text-3xl">
        {value}
      </p>

      <div className="mt-6 h-1 overflow-hidden rounded-full bg-white/5">
        <div
          data-control-module-bar
          className="h-full origin-left rounded-full bg-[#0BA5FF]"
        />
      </div>
    </article>
  );
}