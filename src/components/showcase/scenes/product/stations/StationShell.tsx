"use client";

import type {
  ReactNode,
} from "react";

export function StationShell({
  label,
  accent = false,
  children,
}: {
  label: string;
  accent?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className="
        rounded-[30px]
        border
        border-[#173C50]/10
        bg-[#F9FBFC]
        p-4
        shadow-[0_34px_100px_rgba(19,57,82,0.16)]
      "
    >
      <div
        className="
          mb-3
          flex
          items-center
          justify-between
          px-1
        "
      >
        <div
          className="
            text-[10px]
            font-black
            uppercase
            tracking-[0.2em]
            text-[#557080]
          "
        >
          {label}
        </div>

        <div
          className={`
            h-2
            w-2
            rounded-full
            ${
              accent
                ? "bg-[#0BA5FF] shadow-[0_0_14px_rgba(11,165,255,0.55)]"
                : "bg-[#9FB3BE]"
            }
          `}
        />
      </div>

      {children}
    </div>
  );
}

export function Badge({
  label,
}: {
  label: string;
}) {
  return (
    <div
      className="
        rounded-full
        bg-[#EAF7FF]
        px-3
        py-1.5
        text-[9px]
        font-black
        tracking-[0.1em]
        text-[#0878BA]
      "
    >
      {label}
    </div>
  );
}

export function MetricTile({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-[#173C50]/8
        bg-white
        p-3
      "
    >
      <div
        className="
          text-[9px]
          font-black
          text-[#7A8D98]
        "
      >
        {label}
      </div>

      <div
        className="
          mt-1.5
          text-sm
          font-black
          text-[#0B1620]
        "
      >
        {value}
      </div>
    </div>
  );
}

export function DarkChip({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      className="
        rounded-xl
        border
        border-white/10
        bg-white/5
        p-3
      "
    >
      <div
        className="
          text-[8px]
          font-black
          text-white/35
        "
      >
        {label}
      </div>

      <div
        className="
          mt-1
          text-sm
          font-black
          text-white
        "
      >
        {value}
      </div>
    </div>
  );
}
