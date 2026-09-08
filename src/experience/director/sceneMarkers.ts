import {
  CHAOS_SCENE,
  chaosSceneStart,
} from "@/components/showcase/scenes/chaos/chaosTimeline";

/*
 * ============================================================
 * SCENE MARKER TYPE
 * ============================================================
 */

export type SceneMarker = {
  id: string;

  label: string;

  progress: number;

  snap?: boolean;

  hold?: boolean;
};

/*
 * ============================================================
 * CHAOS CINEMATIC MARKERS
 * ============================================================
 *
 * Agora temos:
 *
 * 19 cenas
 * 19 markers
 *
 * Cada marker representa o
 * início de uma cena.
 *
 * Isso deixa a HUD distribuída
 * uniformemente pela timeline.
 */

export const CHAOS_CINEMATIC_MARKERS =
  [
    /*
     * ========================================================
     * 01 — OPENING
     * ========================================================
     */

    {
      id: "opening",

      label: "Entry",

      progress:
        chaosSceneStart(
          CHAOS_SCENE.opening,
        ),
    },

    /*
     * ========================================================
     * 02 — FIRST SIGNAL
     * ========================================================
     */

    {
      id: "first-signal",

      label:
        "First Signal",

      progress:
        chaosSceneStart(
          CHAOS_SCENE.firstSignal,
        ),
    },

    /*
     * ========================================================
     * 03 — RIGHT TRAVEL
     * ========================================================
     */

    {
      id: "right-travel",

      label:
        "Right Travel",

      progress:
        chaosSceneStart(
          CHAOS_SCENE.rightTravel,
        ),
    },

    /*
     * ========================================================
     * 04 — RIGHT EDGE
     * ========================================================
     */

    {
      id: "right-edge",

      label:
        "Right Edge",

      progress:
        chaosSceneStart(
          CHAOS_SCENE.rightEdge,
        ),
    },

    /*
     * ========================================================
     * 05 — SWING
     * ========================================================
     */

    {
      id: "swing",

      label:
        "Swing",

      progress:
        chaosSceneStart(
          CHAOS_SCENE.swing,
        ),
    },

    /*
     * ========================================================
     * 06 — RISE
     * ========================================================
     */

    {
      id: "rise",

      label:
        "Rise",

      progress:
        chaosSceneStart(
          CHAOS_SCENE.rise,
        ),
    },

    /*
     * ========================================================
     * 07 — OVERVIEW
     * ========================================================
     */

    {
      id: "overview",

      label:
        "Overview",

      progress:
        chaosSceneStart(
          CHAOS_SCENE.overview,
        ),
    },

    /*
     * ========================================================
     * 08 — LEDGE
     * ========================================================
     */

    {
      id: "ledge",

      label:
        "Ledge",

      progress:
        chaosSceneStart(
          CHAOS_SCENE.ledge,
        ),
    },

    /*
     * ========================================================
     * 09 — DROP
     * ========================================================
     */

    {
      id: "drop",

      label:
        "Drop",

      progress:
        chaosSceneStart(
          CHAOS_SCENE.drop,
        ),
    },

    /*
     * ========================================================
     * 10 — IMPACT
     * ========================================================
     */

    {
      id: "impact",

      label:
        "Impact",

      progress:
        chaosSceneStart(
          CHAOS_SCENE.impact,
        ),
    },

    /*
     * ========================================================
     * 11 — REBOUND
     * ========================================================
     */

    {
      id: "rebound",

      label:
        "Rebound",

      progress:
        chaosSceneStart(
          CHAOS_SCENE.rebound,
        ),
    },

    /*
     * ========================================================
     * 12 — DEEP RUN
     * ========================================================
     */

    {
      id: "deep-run",

      label:
        "Deep Run",

      progress:
        chaosSceneStart(
          CHAOS_SCENE.deepRun,
        ),
    },

    /*
     * ========================================================
     * 13 — CROSS WORLD
     * ========================================================
     */

    {
      id: "cross-world",

      label:
        "Cross World",

      progress:
        chaosSceneStart(
          CHAOS_SCENE.crossWorld,
        ),
    },

    /*
     * ========================================================
     * 14 — CHAOS MAXIMUM
     * ========================================================
     */

    {
      id: "chaos-maximum",

      label:
        "Chaos Maximum",

      progress:
        chaosSceneStart(
          CHAOS_SCENE.chaosMaximum,
        ),
    },

    /*
     * ========================================================
     * 15 — ORBIT
     * ========================================================
     */

   {
  id: "focus",

  label: "Focus",

  progress:
    chaosSceneStart(
      CHAOS_SCENE.focus,
    ),
},

{
  id: "approach",

  label: "Approach",

  progress:
    chaosSceneStart(
      CHAOS_SCENE.approach,
    ),
},

{
  id: "hot-topics",

  label: "Hot Topics",

  progress:
    chaosSceneStart(
      CHAOS_SCENE.hotTopics,
    ),
},

{
  id: "ring-settle",

  label: "Settle",

  progress:
    chaosSceneStart(
      CHAOS_SCENE.ringSettle,
    ),
},

{
  id: "ring-play",

  label: "Ciranda",

  progress:
    chaosSceneStart(
      CHAOS_SCENE.ringPlay,
    ),
},

{
  id: "consume-1",

  label: "Resolve 01",

  progress:
    chaosSceneStart(
      CHAOS_SCENE.consume1,
    ),
},

{
  id: "consume-2",

  label: "Resolve 02",

  progress:
    chaosSceneStart(
      CHAOS_SCENE.consume2,
    ),
},

{
  id: "consume-3",

  label: "Resolve 03",

  progress:
    chaosSceneStart(
      CHAOS_SCENE.consume3,
    ),
},

{
  id: "consume-4",

  label: "Resolve 04",

  progress:
    chaosSceneStart(
      CHAOS_SCENE.consume4,
    ),
},

{
  id: "consume-5",

  label: "Resolve 05",

  progress:
    chaosSceneStart(
      CHAOS_SCENE.consume5,
    ),
},

{
  id: "consume-6",

  label: "Resolve 06",

  progress:
    chaosSceneStart(
      CHAOS_SCENE.consume6,
    ),
},

{
  id: "core",

  label: "Core",

  progress:
    chaosSceneStart(
      CHAOS_SCENE.coreResolve,
    ),
},

{
  id: "brand",

  label: "growCo.",

  progress:
    chaosSceneStart(
      CHAOS_SCENE.brand,
    ),
},
  ];