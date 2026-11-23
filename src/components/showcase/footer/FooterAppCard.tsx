import {
  ArrowUpRight,
} from "lucide-react";

import {
  useTranslations,
} from "next-intl";

import {
  GROWCO_LINKS,
  isExternalUrl,
} from "@/components/showcase/footer/footerConfig";

/*
 * ============================================================================
 * FOOTER APP CARD — QR CODE
 * ============================================================================
 *
 * Canto reservado para o QR code que leva ao app da growCo.
 *
 * Para ativar o QR real:
 *   1. salve a imagem em /public (ex.: public/brand/growco-app-qr.png)
 *   2. defina NEXT_PUBLIC_GROWCO_APP_QR_SRC=/brand/growco-app-qr.png
 *      (.env.local no dev, ou variável na Vercel + novo deploy)
 *
 * O slot é um quadrado fixo de 9.5rem com fundo branco e margem
 * interna (a "quiet zone" que o leitor de QR precisa). Use uma imagem
 * QUADRADA, de preferência com fundo branco ou transparente.
 *
 * Enquanto não há imagem, o slot mostra um QR ilustrativo
 * (não escaneável) só para segurar o espaço do layout.
 *
 * Atributos data-footer-scan / data-footer-reveal são
 * lidos pelo ShowcaseFooter para animar.
 */

export function FooterAppCard() {
  const t =
    useTranslations(
      "Showcase.footer.app",
    );

  const href =
    GROWCO_LINKS.app ||
    "#footer";

  const external =
    isExternalUrl(href);

  return (
    <div
      data-footer-reveal
      className="relative w-full max-w-md rounded-[2rem] border border-white/10 bg-[#0C111B]/90 p-5 shadow-2xl shadow-black/40 backdrop-blur-xl"
    >
      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <div className="relative h-[9.5rem] w-[9.5rem] shrink-0">
          <Corner className="left-0 top-0 rounded-tl-2xl border-l-2 border-t-2" />

          <Corner className="right-0 top-0 rounded-tr-2xl border-r-2 border-t-2" />

          <Corner className="bottom-0 left-0 rounded-bl-2xl border-b-2 border-l-2" />

          <Corner className="bottom-0 right-0 rounded-br-2xl border-b-2 border-r-2" />

          <div className="absolute inset-[0.6rem] overflow-hidden rounded-xl bg-white">
            {GROWCO_LINKS.appQrImage ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={
                  GROWCO_LINKS.appQrImage
                }
                alt={t(
                  "qrAlt",
                )}
                className="h-full w-full object-contain p-1.5"
              />
            ) : (
              <QrPlaceholder
                label={t(
                  "qrPlaceholder",
                )}
              />
            )}

            <span
              data-footer-scan
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 h-[2px] bg-[#0BA5FF]"
              style={{
                top: "8%",

                boxShadow:
                  "0 0 14px 2px rgba(11, 165, 255, 0.7)",
              }}
            />
          </div>
        </div>

        <div className="min-w-0">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#0BA5FF]">
            {t("eyebrow")}
          </p>

          <p className="mt-2 text-lg font-semibold leading-tight tracking-tight text-white">
            {t("title")}
          </p>

          <p className="mt-2 text-sm leading-relaxed text-neutral-400">
            {t(
              "description",
            )}
          </p>
        </div>
      </div>

      <a
        href={href}
        {...(external
          ? {
              target:
                "_blank",

              rel: "noopener noreferrer",
            }
          : {})}
        className="group mt-5 flex items-center justify-between rounded-full bg-[#0BA5FF] px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:scale-[1.015] hover:bg-[#2DB4FF]"
      >
        {t("cta")}

        <ArrowUpRight
          size={16}
          strokeWidth={2.2}
          className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </a>
    </div>
  );
}

type CornerProps = {
  className: string;
};

/*
 * Colchetes azuis nos cantos do slot:
 * enquadram a área de leitura.
 */
function Corner({
  className,
}: CornerProps) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute h-5 w-5 border-[#0BA5FF] ${className}`}
    />
  );
}

/*
 * ----------------------------------------------------------------------------
 * QR ILUSTRATIVO
 * ----------------------------------------------------------------------------
 *
 * Grade 29x29 (QR versão 3): três marcadores de canto
 * reais + módulos suaves e determinísticos no miolo.
 */

const QR_SIZE = 29;

const QR_MODULES = (() => {
  const modules: Array<
    [number, number]
  > = [];

  for (
    let y = 0;
    y < QR_SIZE;
    y++
  ) {
    for (
      let x = 0;
      x < QR_SIZE;
      x++
    ) {
      const inFinder =
        (x < 9 && y < 9) ||
        (x > 19 && y < 9) ||
        (x < 9 && y > 19);

      if (inFinder) {
        continue;
      }

      if (
        (x * 7 +
          y * 13 +
          x * y) %
          5 ===
        0
      ) {
        modules.push([
          x,
          y,
        ]);
      }
    }
  }

  return modules;
})();

const FINDERS: ReadonlyArray<
  [number, number]
> = [
  [1, 1],
  [21, 1],
  [1, 21],
];

type QrPlaceholderProps = {
  label: string;
};

function QrPlaceholder({
  label,
}: QrPlaceholderProps) {
  return (
    <svg
      viewBox={`0 0 ${QR_SIZE} ${QR_SIZE}`}
      role="img"
      aria-label={label}
      className="h-full w-full p-1.5"
      shapeRendering="crispEdges"
    >
      {QR_MODULES.map(
        ([x, y]) => (
          <rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width={1}
            height={1}
            fill="#0B1019"
            opacity={0.16}
          />
        ),
      )}

      {FINDERS.map(
        ([x, y]) => (
          <g
            key={`${x}-${y}`}
          >
            <rect
              x={x}
              y={y}
              width={7}
              height={7}
              fill="#0B1019"
            />

            <rect
              x={x + 1}
              y={y + 1}
              width={5}
              height={5}
              fill="#FFFFFF"
            />

            <rect
              x={x + 2}
              y={y + 2}
              width={3}
              height={3}
              fill="#0B1019"
            />
          </g>
        ),
      )}
    </svg>
  );
}
