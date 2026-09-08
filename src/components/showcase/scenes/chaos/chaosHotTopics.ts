export type ChaosHotTopicTone =
  | "critical"
  | "warning"
  | "friction";

export type ChaosHotTopicDefinition = {
  id: string;

  translationKey: string;

  tone:
    ChaosHotTopicTone;
};

export const CHAOS_HOT_TOPICS:
  readonly ChaosHotTopicDefinition[] =
  [
    {
      id: "finance",

      translationKey:
        "finance",

      tone:
        "critical",
    },

    {
      id: "stock",

      translationKey:
        "stock",

      tone:
        "warning",
    },

    {
      id: "communication",

      translationKey:
        "communication",

      tone:
        "friction",
    },

    {
      id: "management",

      translationKey:
        "management",

      tone:
        "critical",
    },

    {
      id: "goals",

      translationKey:
        "goals",

      tone:
        "warning",
    },

    {
      id: "people",

      translationKey:
        "people",

      tone:
        "friction",
    },
  ] as const;