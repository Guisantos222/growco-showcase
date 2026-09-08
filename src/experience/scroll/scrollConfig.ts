export const SMOOTH_SCROLL_CONFIG = {
  /*
   * Quanto menor, mais "pesado"
   * e amortecido fica o scroll.
   *
   * Default do Lenis é próximo
   * de 0.1.
   */
  lerp: 0.085,

  /*
   * Reduz um pouco a violência
   * de rodinhas que trabalham
   * em grandes steps.
   */
  wheelMultiplier: 0.85,

  /*
   * Mantemos touch próximo do
   * comportamento original.
   */
  touchMultiplier: 1,

  smoothWheel: true,

  /*
   * Não imitamos inertia touch.
   * Queremos preservar melhor
   * comportamento mobile nativo.
   */
  syncTouch: false,

  /*
   * Nossa navbar usa #anchors.
   */
  anchors: true,

  overscroll: true,

  /*
   * O RAF será fornecido pelo
   * ticker do GSAP.
   */
  autoRaf: false,

  /*
   * Lenis passa a respeitar
   * prefers-reduced-motion.
   */
  respectReducedMotion: true,
} as const;

export const SCENE_DIRECTOR_CONFIG = {
  /*
   * Segunda camada de suavização.
   *
   * Lenis suaviza o scroll físico.
   * Director suaviza o tempo
   * cinematográfico.
   */
  progressDamping: 12,

  /*
   * Tempo sem novo input antes
   * de considerar snap.
   */
  snapDelayMs: 190,

  /*
   * Só snapamos quando o usuário
   * já terminou relativamente
   * próximo de um beat.
   */
  snapRadius: 0.032,

  /*
   * Tempo para assentamento.
   */
  snapDuration: 0.58,

  /*
   * Quando a velocidade ainda
   * é alta, esperamos antes
   * de tentar o snap.
   */
  velocityThreshold: 0.12,
} as const;

export function cinematicEase(
  progress: number,
) {
  return (
    1 -
    Math.pow(
      1 - progress,
      3,
    )
  );
}