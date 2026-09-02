"use client";

import {
  useEffect,
  useRef,
} from "react";

import {
  onExperienceEvent,
  type ExperienceEventMap,
  type ExperienceEventName,
} from "@/experience/events/experienceEvents";

export function useExperienceEvent<
  K extends ExperienceEventName,
>(
  eventName: K,
  handler: (
    payload: ExperienceEventMap[K],
  ) => void,
) {
  const handlerRef =
    useRef(handler);

  useEffect(() => {
    handlerRef.current =
      handler;
  }, [handler]);

  useEffect(() => {
    return onExperienceEvent(
      eventName,
      (payload) => {
        handlerRef.current(
          payload,
        );
      },
    );
  }, [eventName]);
}