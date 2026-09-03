import type {
  ChaosCardVariant,
} from "@/components/showcase/scenes/chaos/chaosData";

type ChaosDataCardProps = {
  label: string;
  value: string;

  variant:
    ChaosCardVariant;
};

export function ChaosDataCard({
  label,
  value,
  variant,
}: ChaosDataCardProps) {
  const variantClass =
    variant === "blue"
      ? "border-transparent bg-[#0BA5FF] text-white"
      : variant === "dark"
        ? "border-black/10 bg-[#080A10] text-white"
        : "border-black/10 bg-white/90 text-[#080A10]";

  const mutedClass =
    variant === "light"
      ? "text-black/45"
      : "text-white/50";

  return (
    <div
      data-chaos-drift
      className={`
        min-w-[150px]
        rounded-[1.25rem]
        border
        px-5
        py-4
        shadow-[0_20px_70px_rgba(0,0,0,0.12)]
        backdrop-blur-md
        ${variantClass}
      `}
    >
      <p
        className={`
          text-[10px]
          font-semibold
          uppercase
          tracking-[0.2em]
          ${mutedClass}
        `}
      >
        {label}
      </p>

      <p className="mt-2 whitespace-nowrap text-lg font-semibold tracking-[-0.03em]">
        {value}
      </p>
    </div>
  );
}