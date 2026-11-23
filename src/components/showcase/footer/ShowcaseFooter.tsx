"use client";

import {
  useRef,
} from "react";

import {
  ArrowUp,
  ArrowUpRight,
} from "lucide-react";

import {
  useTranslations,
} from "next-intl";

import {
  gsap,
} from "gsap";

import {
  ScrollTrigger,
} from "gsap/ScrollTrigger";

import {
  useGSAP,
} from "@gsap/react";

import {
  FooterAppCard,
} from "@/components/showcase/footer/FooterAppCard";

import {
  GROWCO_LINKS,
} from "@/components/showcase/footer/footerConfig";

import {
  FooterMarquee,
} from "@/components/showcase/footer/FooterMarquee";

import {
  useSmoothScroll,
} from "@/experience/scroll/useSmoothScroll";

gsap.registerPlugin(
  useGSAP,
  ScrollTrigger,
);

/*
 * ============================================================================
 * SHOWCASE FOOTER
 * ============================================================================
 *
 * Fecha a showcase depois da ProductScene.
 *
 * Letreiro GROWCO em loop horizontal infinito, indo para a direita:
 * corre sozinho, acelera com a velocidade do scroll e pausa fora
 * da tela. O resto do footer é estático.
 *
 * Movimento (ver docs/experience-foundation.md):
 *   - GSAP para timeline, DOM e scroll;
 *   - respeita prefers-reduced-motion (nesse modo o loop não roda).
 */

/*
 * Segundos para o trilho percorrer um grupo inteiro.
 * Maior = mais calmo.
 */
const LOOP_DURATION = 36;

/*
 * Piso de velocidade (px/s), para telas pequenas
 * onde o grupo é curto e o loop ficaria lento demais.
 */
const LOOP_MIN_SPEED = 48;

/*
 * Fora do render de propósito: manter o render puro.
 */
const CURRENT_YEAR =
  new Date().getFullYear();

export function ShowcaseFooter() {
  const t =
    useTranslations(
      "Showcase.footer",
    );

  const brand =
    useTranslations(
      "Showcase.chaos.brand",
    );

  const {
    lenis,
  } =
    useSmoothScroll();

  const rootRef =
    useRef<HTMLElement>(
      null,
    );

  useGSAP(
    () => {
      const root =
        rootRef.current;

      if (!root) {
        return;
      }

      const media =
        gsap.matchMedia();

      media.add(
        "(prefers-reduced-motion: no-preference)",
        () => {
          const track =
            root.querySelector<HTMLElement>(
              "[data-footer-track]",
            );

          const scan =
            root.querySelector<HTMLElement>(
              "[data-footer-scan]",
            );

          /*
           * ----------------------------------------------------------
           * 1. LOOP HORIZONTAL DO GROWCO
           * ----------------------------------------------------------
           *
           * Ticker próprio (sem tween com repeat): a posição é
           * calculada em pixels e "dá a volta" exatamente um grupo
           * depois, então o recomeço é invisível.
           *
           * O trilho tem DOIS grupos idênticos; deslocar um grupo
           * inteiro devolve o desenho ao ponto de partida.
           */

          const firstGroup =
            track?.firstElementChild as HTMLElement | null;

          let groupWidth = 0;

          let x = 0;

          let ready = false;

          let boost = 0;

          let boostTarget = 0;

          const measure =
            () => {
              groupWidth =
                firstGroup?.getBoundingClientRect()
                  .width ?? 0;

              /*
               * Indo para a direita, o trilho começa um grupo
               * à esquerda e anda até 0, quando recomeça.
               */
              if (
                groupWidth &&
                !ready
              ) {
                x = -groupWidth;

                ready = true;
              }
            };

          const tick = (
            _time: number,
            deltaTime: number,
          ) => {
            if (
              !track ||
              !groupWidth
            ) {
              return;
            }

            /*
             * deltaTime vem em ms. O teto evita um "pulo" quando
             * a aba volta de segundo plano.
             */
            const dt =
              Math.min(
                deltaTime,
                64,
              ) / 1000;

            /*
             * O boost do scroll decai sozinho e é suavizado:
             * rolar rápido acelera o texto, e ele volta ao
             * ritmo calmo quando o scroll para.
             */
            boostTarget *=
              Math.exp(
                -dt * 3.5,
              );

            boost +=
              (boostTarget -
                boost) *
              (1 -
                Math.exp(
                  -dt * 9,
                ));

            const speed =
              Math.max(
                groupWidth /
                  LOOP_DURATION,
                LOOP_MIN_SPEED,
              ) *
              (1 + boost);

            x +=
              speed * dt;

            if (x >= 0) {
              x -=
                groupWidth;
            }

            track.style.transform =
              `translate3d(${x}px, 0, 0)`;
          };

          let resizeObserver:
            | ResizeObserver
            | undefined;

          if (
            track &&
            firstGroup
          ) {
            measure();

            /*
             * Re-mede quando o tamanho muda (resize)
             * e quando a fonte termina de carregar.
             */
            resizeObserver =
              new ResizeObserver(
                measure,
              );

            resizeObserver.observe(
              firstGroup,
            );

            void document.fonts?.ready.then(
              measure,
            );
          }

          const scanTween =
            scan
              ? gsap.fromTo(
                  scan,
                  {
                    top: "8%",
                  },
                  {
                    top: "90%",

                    duration: 2.4,

                    ease: "sine.inOut",

                    yoyo: true,

                    repeat: -1,

                    paused: true,
                  },
                )
              : null;

          const setRunning =
            (
              running: boolean,
            ) => {
              if (running) {
                gsap.ticker.add(
                  tick,
                );

                scanTween?.play();

                return;
              }

              gsap.ticker.remove(
                tick,
              );

              scanTween?.pause();
            };

          /*
           * Fora da tela, loop e leitura do QR pausam:
           * zero custo quando não são vistos.
           */
          const visibility =
            ScrollTrigger.create(
              {
                trigger:
                  root,

                start:
                  "top bottom",

                end: "bottom top",

                onToggle: (
                  self,
                ) => {
                  setRunning(
                    self.isActive,
                  );
                },

                onUpdate: (
                  self,
                ) => {
                  boostTarget =
                    Math.max(
                      boostTarget,
                      Math.min(
                        Math.abs(
                          self.getVelocity(),
                        ) / 280,
                        8,
                      ),
                    );
                },
              },
            );

          if (
            visibility.isActive
          ) {
            setRunning(
              true,
            );
          }

          return () => {
            gsap.ticker.remove(
              tick,
            );

            resizeObserver?.disconnect();
          };
        },
      );

      return () => {
        media.revert();
      };
    },
    {
      scope: rootRef,
    },
  );

  function handleBackToTop() {
    if (lenis) {
      lenis.scrollTo(
        0,
        {
          duration: 2.4,
        },
      );

      return;
    }

    window.scrollTo({
      top: 0,

      behavior:
        "smooth",
    });
  }

  return (
    <section
      ref={rootRef}
      id="footer"
      className="relative isolate flex min-h-screen flex-col overflow-hidden bg-[#05070C] text-white"
    >
      <FooterMarquee />

      {/*
       * overflow-hidden: os blocos descem de "trás" do letreiro,
       * então o que ainda está acima é cortado na borda do corpo.
       */}
      <footer
        data-footer-body
        className="relative flex flex-1 flex-col overflow-hidden"
      >
        {/*
         * Mesma linguagem visual da ProductScene:
         * grade técnica discreta + brilho azul como acento.
         */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 12% 88%, rgba(11, 165, 255, 0.07), transparent 38%), linear-gradient(rgba(145, 194, 216, 0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(145, 194, 216, 0.035) 1px, transparent 1px)",

            backgroundSize:
              "auto, 52px 52px, 52px 52px",

            maskImage:
              "linear-gradient(to bottom, black, rgba(0, 0, 0, 0.5) 75%, transparent)",

            WebkitMaskImage:
              "linear-gradient(to bottom, black, rgba(0, 0, 0, 0.5) 75%, transparent)",
          }}
        />

        <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 pb-6 pt-14 md:pt-20">
          <div className="grid flex-1 gap-14 lg:grid-cols-12 lg:grid-rows-1 lg:gap-10">
            <div className="lg:col-span-7">
              <h2
                data-footer-reveal
                className="text-5xl font-semibold leading-[0.98] tracking-tight md:text-7xl"
              >
                {t(
                  "headlineBefore",
                )}{" "}
                <span className="text-[#0BA5FF]">
                  {t(
                    "headlineAccent",
                  )}
                </span>
              </h2>

              <p
                data-footer-reveal
                className="mt-6 max-w-md text-neutral-400"
              >
                {brand(
                  "tagline",
                )}{" "}
                {t(
                  "description",
                )}
              </p>

              <div
                data-footer-reveal
                className="mt-10"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                  {t(
                    "navigateTitle",
                  )}
                </p>

                <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
                  <li>
                    <FooterLink
                      href="#produto"
                    >
                      {t(
                        "linkProduct",
                      )}
                    </FooterLink>
                  </li>

                  <li>
                    <FooterLink
                      onClick={
                        handleBackToTop
                      }
                    >
                      {t(
                        "linkTop",
                      )}
                    </FooterLink>
                  </li>

                  <li>
                    <FooterLink
                      href={
                        GROWCO_LINKS.landing
                      }
                    >
                      {t(
                        "linkLanding",
                      )}
                    </FooterLink>
                  </li>
                </ul>
              </div>
            </div>

            {/*
             * Canto do QR code: base direita do footer.
             * Estrutura e instruções em FooterAppCard.tsx.
             */}
            <div className="flex lg:col-span-5 lg:items-end lg:justify-end">
              <FooterAppCard />
            </div>
          </div>

          <div
            data-footer-reveal
            className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between"
          >
            <p>
              ©{" "}
              {CURRENT_YEAR}{" "}
              <span className="text-neutral-300">
                growCo.
              </span>{" "}
              {t("rights")}
            </p>

            <button
              type="button"
              onClick={
                handleBackToTop
              }
              className="group inline-flex items-center gap-2 self-start rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-neutral-300 transition hover:border-[#0BA5FF]/40 hover:bg-white/5 hover:text-white sm:self-auto"
            >
              {t(
                "backToTop",
              )}

              <ArrowUp
                size={14}
                strokeWidth={2}
                className="transition-transform duration-300 group-hover:-translate-y-0.5"
              />
            </button>
          </div>
        </div>
      </footer>
    </section>
  );
}

type FooterLinkProps = {
  href?: string;

  onClick?: () => void;

  children:
    React.ReactNode;
};

/*
 * Link (âncora/URL) ou botão (ação),
 * com o mesmo visual.
 */
function FooterLink({
  href,
  onClick,
  children,
}: FooterLinkProps) {
  const className =
    "group inline-flex items-center gap-1.5 text-sm text-neutral-300 transition hover:text-white";

  const icon = (
    <ArrowUpRight
      size={14}
      strokeWidth={2}
      className="text-neutral-500 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#0BA5FF]"
    />
  );

  if (href) {
    return (
      <a
        href={href}
        className={
          className
        }
      >
        {children}

        {icon}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={className}
    >
      {children}

      {icon}
    </button>
  );
}
