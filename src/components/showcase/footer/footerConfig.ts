/*
 * ============================================================================
 * GROWCO LINKS
 * ============================================================================
 *
 * Todos os destinos externos da showcase ficam aqui.
 *
 * Nada é hardcoded nos componentes: quando a landing page e o app
 * estiverem hospedados, basta definir as variáveis na Vercel
 * (Project Settings -> Environment Variables) e fazer um novo deploy.
 *
 *   NEXT_PUBLIC_GROWCO_LANDING_URL   ex.: https://growco.com.br
 *   NEXT_PUBLIC_GROWCO_APP_URL       ex.: https://app.growco.com.br
 *   NEXT_PUBLIC_GROWCO_APP_QR_SRC    ex.: /brand/growco-app-qr.png
 *
 * Importante: variáveis NEXT_PUBLIC_* são embutidas no build, então
 * precisam ser acessadas de forma literal (process.env.NEXT_PUBLIC_X),
 * sem desestruturar nem usar chaves dinâmicas.
 */

export const GROWCO_LINKS = {
  /*
   * Destino do botão "voltar" no início da showcase.
   *
   * Enquanto a landing não existe, cai em "/" (recarrega a showcase).
   */
  landing:
    process.env
      .NEXT_PUBLIC_GROWCO_LANDING_URL ||
    "/",

  /*
   * Destino do botão "Abrir o app" no footer.
   *
   * Vazio = ainda não configurado (o botão fica apontando
   * para o próprio footer).
   */
  app:
    process.env
      .NEXT_PUBLIC_GROWCO_APP_URL ||
    "",

  /*
   * Imagem do QR code do app.
   *
   * Coloque o arquivo em /public (ex.: public/brand/growco-app-qr.png)
   * e aponte o caminho aqui. Vazio = o footer mostra o espaço reservado.
   */
  appQrImage:
    process.env
      .NEXT_PUBLIC_GROWCO_APP_QR_SRC ||
    "",
} as const;

export function isExternalUrl(
  href: string,
) {
  return /^https?:\/\//i.test(
    href,
  );
}
