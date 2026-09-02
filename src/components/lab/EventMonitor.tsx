"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  onAnyExperienceEvent,
  type ExperienceEventName,
} from "@/experience/events/experienceEvents";

type EventLogItem = {
  id: number;
  type: ExperienceEventName;
  time: string;
};

export function EventMonitor() {
  const [
    events,
    setEvents,
  ] = useState<
    EventLogItem[]
  >([]);

  const counter =
    useRef(0);

  useEffect(() => {
    return onAnyExperienceEvent(
      (event) => {
        counter.current += 1;

        const now =
          new Date();

        const time =
          now.toLocaleTimeString(
            "pt-BR",
            {
              hour12: false,
            },
          );

        setEvents(
          (current) => [
            {
              id:
                counter.current,
              type:
                event.type,
              time,
            },
            ...current,
          ].slice(0, 8),
        );
      },
    );
  }, []);

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-7">
      <p className="text-sm uppercase tracking-[0.25em] text-[#0BA5FF]">
        Event Stream
      </p>

      <h2 className="mt-3 text-2xl font-semibold">
        Experience Events
      </h2>

      {events.length === 0 ? (
        <p className="mt-6 text-neutral-500">
          Nenhum evento disparado.
        </p>
      ) : (
        <div className="mt-6 space-y-2">
          {events.map(
            (event) => (
              <div
                key={event.id}
                className="flex items-center justify-between rounded-2xl border border-white/5 bg-black/20 px-4 py-3"
              >
                <span className="font-mono text-sm text-white">
                  {
                    event.type
                  }
                </span>

                <span className="text-xs text-neutral-600">
                  {
                    event.time
                  }
                </span>
              </div>
            ),
          )}
        </div>
      )}
    </section>
  );
}