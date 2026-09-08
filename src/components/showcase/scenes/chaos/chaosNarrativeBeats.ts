import {
  CHAOS_SCENE,
  chaosPoint,
} from "@/components/showcase/scenes/chaos/chaosTimeline";

export type ChaosNarrativeBeat = {
  id:
    | "signal"
    | "fragmentation"
    | "reaction"
    | "noise"
    | "disconnect";

  start: number;
  enterEnd: number;
  holdEnd: number;
  end: number;

  x: number;
  y: number;

  enterX: number;
  enterY: number;
  enterZ: number;

  exitX: number;
  exitY: number;
  exitZ: number;

  rotateX: number;
  rotateY: number;
  rotateZ: number;

  scale: number;

  width:
    | "large"
    | "massive";

  align:
    | "left"
    | "center"
    | "right";

  hero?: boolean;
};

export const CHAOS_NARRATIVE_BEATS:
  readonly ChaosNarrativeBeat[] = [
  /*
   * ============================================================
   * 01 — MOVIMENTO
   * ============================================================
   *
   * Primeiros sinais.
   * Grande, mas deslocado para a esquerda.
   */

  {
    id: "signal",

    start:
      chaosPoint(
        CHAOS_SCENE.firstSignal,
        0.15,
      ),

    enterEnd:
      chaosPoint(
        CHAOS_SCENE.firstSignal,
        0.48,
      ),

    holdEnd:
      chaosPoint(
        CHAOS_SCENE.rightTravel,
        0.72,
      ),

    end:
      chaosPoint(
        CHAOS_SCENE.rightEdge,
        0.08,
      ),

    x: 0.29,
    y: 0.31,

    enterX: -170,
    enterY: 30,
    enterZ: 360,

    exitX: 110,
    exitY: -18,
    exitZ: -180,

    rotateX: 5,
    rotateY: 17,
    rotateZ: -2.5,

    scale: 1,

    width: "large",
    align: "left",
  },

  /*
   * ============================================================
   * 02 — FRAGMENTAÇÃO
   * ============================================================
   *
   * O texto troca de lado para acompanhar
   * a mudança de direção da câmera.
   */

  {
    id: "fragmentation",

    start:
      chaosPoint(
        CHAOS_SCENE.rightEdge,
        0.3,
      ),

    enterEnd:
      chaosPoint(
        CHAOS_SCENE.swing,
        0.08,
      ),

    holdEnd:
      chaosPoint(
        CHAOS_SCENE.rise,
        0.45,
      ),

    end:
      chaosPoint(
        CHAOS_SCENE.rise,
        0.9,
      ),

    x: 0.71,
    y: 0.30,

    enterX: 180,
    enterY: 18,
    enterZ: 340,

    exitX: -100,
    exitY: -35,
    exitZ: -170,

    rotateX: 3,
    rotateY: -18,
    rotateZ: 2.5,

    scale: 1.02,

    width: "large",
    align: "right",
  },

  /*
   * ============================================================
   * 03 — EFEITO EM CADEIA
   * ============================================================
   *
   * Mais baixo no quadro.
   * Libera a zona superior para o mundo.
   */

  {
    id: "reaction",

    start:
      chaosPoint(
        CHAOS_SCENE.overview,
        0.12,
      ),

    enterEnd:
      chaosPoint(
        CHAOS_SCENE.overview,
        0.48,
      ),

    holdEnd:
      chaosPoint(
        CHAOS_SCENE.ledge,
        0.7,
      ),

    end:
      chaosPoint(
        CHAOS_SCENE.drop,
        0.28,
      ),

    x: 0.31,
    y: 0.68,

    enterX: -120,
    enterY: 105,
    enterZ: 390,

    exitX: 45,
    exitY: -120,
    exitZ: -210,

    rotateX: -7,
    rotateY: 12,
    rotateZ: -3,

    scale: 1.03,

    width: "large",
    align: "left",
  },

  /*
   * ============================================================
   * 04 — SOBRECARGA
   * ============================================================
   */

  {
    id: "noise",

    start:
      chaosPoint(
        CHAOS_SCENE.impact,
        0.12,
      ),

    enterEnd:
      chaosPoint(
        CHAOS_SCENE.impact,
        0.48,
      ),

    holdEnd:
      chaosPoint(
        CHAOS_SCENE.rebound,
        0.82,
      ),

    end:
      chaosPoint(
        CHAOS_SCENE.deepRun,
        0.82,
      ),

    x: 0.70,
    y: 0.64,

    enterX: 155,
    enterY: 80,
    enterZ: 350,

    exitX: -80,
    exitY: -55,
    exitZ: -190,

    rotateX: -5,
    rotateY: -15,
    rotateZ: 3,

    scale: 1.02,

    width: "large",
    align: "right",
  },

  /*
   * ============================================================
   * 05 — TESE DO CHAOS
   * ============================================================
   *
   * Última mensagem.
   *
   * Ela termina NO COMEÇO DO FOCUS.
   * Depois disso não existe mais texto narrativo:
   *
   * focus
   * approach
   * hot topics
   * ring settle
   * ciranda
   * consume
   * brand
   *
   * ficam visualmente limpos.
   */

  {
    id: "disconnect",

    start:
      chaosPoint(
        CHAOS_SCENE.crossWorld,
        0.08,
      ),

    enterEnd:
      chaosPoint(
        CHAOS_SCENE.crossWorld,
        0.42,
      ),

    holdEnd:
      chaosPoint(
        CHAOS_SCENE.chaosMaximum,
        0.72,
      ),

    end:
      chaosPoint(
        CHAOS_SCENE.focus,
        0.48,
      ),

    x: 0.5,
    y: 0.48,

    enterX: 0,
    enterY: 72,
    enterZ: 460,

    exitX: 0,
    exitY: -55,
    exitZ: -250,

    rotateX: 8,
    rotateY: 0,
    rotateZ: -1.5,

    scale: 1.08,

    width: "massive",
    align: "center",

    hero: true,
  },
] as const;
