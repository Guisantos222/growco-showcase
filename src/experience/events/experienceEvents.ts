import type { DemoSale } from "@/store/demoStore";

export type ExperienceEventMap = {
  SALE_STARTED: {
    sale: DemoSale;
  };

  DATA_TRAVELING: {
    sale: DemoSale;
  };

  DATA_ARRIVED: {
    sale: DemoSale;
  };

  SALE_COMPLETED: {
    sale: DemoSale;
  };

  AI_INSIGHT_READY: {
    sale: DemoSale;
  };

  DEMO_RESET: undefined;
};

export type ExperienceEventName =
  keyof ExperienceEventMap;

export type ExperienceEvent = {
  [K in ExperienceEventName]: {
    type: K;
    payload: ExperienceEventMap[K];
  };
}[ExperienceEventName];

type AnyPayload =
  ExperienceEventMap[ExperienceEventName];

type StoredListener = (
  payload: AnyPayload,
) => void;

type AnyEventListener = (
  event: ExperienceEvent,
) => void;

const listeners = new Map<
  ExperienceEventName,
  Set<StoredListener>
>();

const anyEventListeners =
  new Set<AnyEventListener>();

export function emitExperienceEvent<
  K extends ExperienceEventName,
>(
  type: K,
  payload: ExperienceEventMap[K],
) {
  const eventListeners =
    listeners.get(type);

  eventListeners?.forEach(
    (listener) => {
      listener(payload);
    },
  );

  const event = {
    type,
    payload,
  } as ExperienceEvent;

  anyEventListeners.forEach(
    (listener) => {
      listener(event);
    },
  );
}

export function onExperienceEvent<
  K extends ExperienceEventName,
>(
  type: K,
  listener: (
    payload: ExperienceEventMap[K],
  ) => void,
) {
  let eventListeners =
    listeners.get(type);

  if (!eventListeners) {
    eventListeners =
      new Set<StoredListener>();

    listeners.set(
      type,
      eventListeners,
    );
  }

  const storedListener:
    StoredListener = (payload) => {
      listener(
        payload as ExperienceEventMap[K],
      );
    };

  eventListeners.add(
    storedListener,
  );

  return () => {
    eventListeners?.delete(
      storedListener,
    );

    if (
      eventListeners?.size === 0
    ) {
      listeners.delete(type);
    }
  };
}

export function onAnyExperienceEvent(
  listener: AnyEventListener,
) {
  anyEventListeners.add(
    listener,
  );

  return () => {
    anyEventListeners.delete(
      listener,
    );
  };
}