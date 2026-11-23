/*
 * ============================================================================
 * CONTROL ENTRY TIMING
 * ============================================================================
 *
 * Esta entrada não deve parecer apressada.
 *
 * A lógica é dividida em blocos largos e legíveis:
 *
 * 1. texto entra;
 * 2. texto respira;
 * 3. texto se desfaz em pó;
 * 4. silêncio visual;
 * 5. túnel nasce;
 * 6. túnel assume completamente.
 *
 * Nada aqui usa microintervalos.
 */

export const CONTROL_ENTRY_SCROLL_VH = 420;

export const CONTROL_ENTRY = {
  /*
   * 0% → 12%
   * ~50vh
   *
   * O texto começa imediatamente quando CONTROL assume
   * e entra com calma.
   */
  textStart: 0.0,
  textFull: 0.12,

  /*
   * 12% → 58%
   * ~193vh
   *
   * Hold principal.
   * A pergunta fica inteira e completamente legível.
   */
  holdStart: 0.12,
  holdEnd: 0.33,

  /*
   * 58% → 82%
   * ~101vh
   *
   * Dissolução longa.
   * A transformação em pó tem tempo para ser percebida.
   */
  dustStart: 0.33,
  dustEnd: 0.82,

  /*
   * 82% → 90%
   * ~34vh
   *
   * Respiro depois da poeira.
   * Tela escura antes da arquitetura começar.
   */
  breathStart: 0.82,
  breathEnd: 0.90,

  /*
   * 90% → 97%
   * ~29vh
   *
   * O túnel nasce devagar da escuridão.
   */
  tunnelStart: 0.90,
  tunnelReadable: 0.97,

  /*
   * 97% → 100%
   * ~13vh
   *
   * Pequeno assentamento antes de entrar
   * no movimento contínuo do CONTROL.
   */
  tunnelFull: 1.0,
} as const;
