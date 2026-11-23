import {
  Archivo_Black,
} from "next/font/google";

/*
 * ============================================================================
 * FOOTER MARQUEE — GROWCO EM LOOP
 * ============================================================================
 *
 * Esta peça é só estrutura (sem estado, sem efeitos).
 * Quem anima é o ShowcaseFooter, localizando os elementos
 * pelos atributos data-footer-*:
 *
 * - data-footer-band        faixa; o overflow dela é a "costura" por
 *                           onde as letras descem
 * - data-footer-band-inner  desce de cima para baixo junto com o scroll
 * - data-footer-track       trilho que corre em loop (translate em px)
 *
 * O trilho tem DOIS grupos idênticos, e o ShowcaseFooter mede o
 * primeiro. Deslocar exatamente a largura de um grupo devolve o
 * desenho ao ponto de partida, então o loop recomeça sem salto.
 *
 * A faixa NÃO tem caixa própria no topo: o fundo nasce da mesma cor
 * da ProductScene (#030508) e só escurece/azula para baixo. Assim
 * não aparece uma "placa" entrando; só as letras saindo da cena.
 */

const archivoBlack =
  Archivo_Black({
    subsets: [
      "latin",
    ],

    weight: "400",
  });

/*
 * Toda a tipografia da faixa é em "em",
 * então escalar a palavra = mudar só esta linha.
 */
export const FOOTER_BAND_FONT_SIZE =
  "clamp(5rem, 19vw, 21rem)";

const WORDS_PER_GROUP = 4;

const GROUPS = [
  0,
  1,
] as const;

export function FooterMarquee() {
  return (
    <div
      data-footer-band
      className="relative shrink-0 overflow-hidden border-b border-white/10"
      style={{
        fontSize:
          FOOTER_BAND_FONT_SIZE,

        height: "1em",

        background:
          "linear-gradient(180deg, #030508 0%, #0B1019 100%)",
      }}
    >
      {/*
       * Texto acessível único.
       * O trilho visual é decorativo.
       */}
      <span className="sr-only">
        GROWCO
      </span>

      {/*
       * As bordas laterais dissolvem o texto em vez de cortá-lo seco.
       * Máscara (e não overlay) porque o fundo da faixa é um degradê.
       */}
      <div
        data-footer-band-inner
        className="h-full will-change-transform"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent 0%, black 9%, black 91%, transparent 100%)",

          WebkitMaskImage:
            "linear-gradient(90deg, transparent 0%, black 9%, black 91%, transparent 100%)",
        }}
      >
        <div
          data-footer-track
          aria-hidden="true"
          className={`${archivoBlack.className} flex h-full w-max items-center whitespace-nowrap will-change-transform`}
          style={{
            lineHeight: 0.9,

            letterSpacing:
              "-0.02em",
          }}
        >
          {GROUPS.map(
            (group) => (
              <div
                key={group}
                className="flex shrink-0 items-center"
              >
                {Array.from(
                  {
                    length:
                      WORDS_PER_GROUP,
                  },
                  (_, index) => (
                    <MarqueeWord
                      key={index}
                      outlined={
                        index %
                          2 ===
                        1
                      }
                    />
                  ),
                )}
              </div>
            ),
          )}
        </div>
      </div>

      {/*
       * Brilho azul discreto na base:
       * o azul é energia, não massa.
       */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, transparent 58%, rgba(11, 165, 255, 0.09) 100%)",
        }}
      />
    </div>
  );
}

type MarqueeWordProps = {
  outlined: boolean;
};

function MarqueeWord({
  outlined,
}: MarqueeWordProps) {
  return (
    <span className="flex shrink-0 items-center gap-[0.2em] pr-[0.2em]">
      <span
        style={
          outlined
            ? {
                color:
                  "transparent",

                WebkitTextStroke:
                  "0.012em rgba(247, 248, 250, 0.42)",
              }
            : {
                color:
                  "#F7F8FA",
              }
        }
      >
        GROWCO
      </span>

      <span
        className="inline-block h-[0.1em] w-[0.1em] rounded-full bg-[#0BA5FF]"
        style={{
          boxShadow:
            "0 0 0.35em rgba(11, 165, 255, 0.75)",
        }}
      />
    </span>
  );
}
