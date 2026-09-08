import type {
  ChaosHotTopicTone,
} from "@/components/showcase/scenes/chaos/chaosHotTopics";

type ChaosHotTopicCardProps = {
  index: number;

  eyebrow: string;

  title: string;

  detail: string;

  tone:
    ChaosHotTopicTone;
};

export function ChaosHotTopicCard({
  index,
  eyebrow,
  title,
  detail,
  tone,
}: ChaosHotTopicCardProps) {
  return (
    <article
      data-chaos-hot-topic-card
      className="
        relative
        h-[132px]
        w-[264px]
        overflow-hidden
        rounded-[22px]
        border
        border-white/[0.08]
        bg-[#0B0F14]/[0.97]
        px-5
        py-4
        text-white
        shadow-[0_24px_70px_rgba(0,0,0,0.18)]
      "
    >
      {/* growCo. BLUE SEAM */}

      <div
        className="
          absolute
          bottom-0
          left-0
          top-0
          w-[3px]
          bg-[#0BA5FF]
        "
      />

      {/* SUBTLE INTERNAL BLUE FIELD */}

      <div
        className="
          pointer-events-none
          absolute
          -right-10
          -top-12
          h-28
          w-28
          rounded-full
          bg-[#0BA5FF]/[0.07]
          
        "
      />

      {/* HEADER */}

      <div
        className="
          relative
          flex
          items-center
          justify-between
          gap-4
        "
      >
        <p
          className="
            font-mono
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.16em]
            text-[#0BA5FF]
          "
        >
          gc://fragment_
          {String(
            index + 1,
          ).padStart(
            2,
            "0",
          )}
        </p>

        <BrokenFlowGlyph
          tone={tone}
        />
      </div>

      {/* CATEGORY */}

      <p
        className="
          relative
          mt-3
          text-[8px]
          font-semibold
          uppercase
          tracking-[0.2em]
          text-white/35
        "
      >
        {eyebrow}
      </p>

      {/* PROBLEM */}

      <p
        className="
          relative
          mt-1
          whitespace-nowrap
          text-[16px]
          font-semibold
          tracking-[-0.035em]
          text-white
        "
      >
        {title}
      </p>

      {/* DETAIL */}

      <p
        className="
          relative
          mt-1
          whitespace-nowrap
          text-[10px]
          font-medium
          tracking-[-0.01em]
          text-white/42
        "
      >
        {detail}
      </p>

      {/* BOTTOM SIGNAL */}

      <div
        className="
          absolute
          bottom-0
          left-[3px]
          right-0
          h-px
          bg-white/[0.06]
        "
      >
        <div
          className="
            h-full
            w-[34%]
            bg-[#0BA5FF]/70
          "
        />
      </div>
    </article>
  );
}

function BrokenFlowGlyph({
  tone,
}: {
  tone:
    ChaosHotTopicTone;
}) {
  const signalClass =
    tone ===
    "critical"
      ? "bg-[#ff715b]"
      : tone ===
          "warning"
        ? "bg-[#f5b942]"
        : "bg-[#0BA5FF]";

  return (
    <div
      className="
        flex
        items-center
        gap-1
      "
    >
      <span
        className={`
          h-1.5
          w-1.5
          rounded-full

          ${signalClass}
        `}
      />

      <span
        className="
          h-px
          w-2
          bg-white/20
        "
      />

      <span
        className="
          h-px
          w-1
          bg-transparent
        "
      />

      <span
        className="
          h-px
          w-2
          bg-white/20
        "
      />

      <span
        className="
          h-1.5
          w-1.5
          rounded-full
          border
          border-white/20
        "
      />
    </div>
  );
}