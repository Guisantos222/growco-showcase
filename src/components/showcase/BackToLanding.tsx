"use client";

import {
  useRef,
} from "react";

import {
  ArrowLeft,
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
  GROWCO_LINKS,
} from "@/components/showcase/footer/footerConfig";

gsap.registerPlugin(
  useGSAP,
  ScrollTrigger,
);

/*
 * Distância de scroll (px) em que o botão
 * desaparece por completo.
 *
 * Ele existe só no início da showcase.
 */
const FADE_DISTANCE = 320;

export function BackToLanding() {
  const t =
    useTranslations(
      "Showcase.backToLanding",
    );

  /*
   * Duas camadas, dois donos:
   *
   * - fadeRef  -> controlado pelo scroll
   * - linkRef  -> animação de entrada
   *
   * Assim as duas animações nunca
   * disputam a mesma propriedade.
   */

  const fadeRef =
    useRef<HTMLDivElement>(
      null,
    );

  const linkRef =
    useRef<HTMLAnchorElement>(
      null,
    );

  useGSAP(
    () => {
      const fade =
        fadeRef.current;

      const link =
        linkRef.current;

      if (!fade || !link) {
        return;
      }

      const media =
        gsap.matchMedia();

      media.add(
        "(prefers-reduced-motion: no-preference)",
        () => {
          gsap.from(
            link,
            {
              autoAlpha: 0,
              x: -18,
              duration: 0.9,
              delay: 0.7,
              ease: "power3.out",
            },
          );
        },
      );

      const trigger =
        ScrollTrigger.create({
          start: 0,

          end: FADE_DISTANCE,

          onUpdate: (
            self,
          ) => {
            /*
             * autoAlpha em 0 também aplica
             * visibility: hidden, então o
             * botão deixa de ser clicável
             * e focável quando some.
             */
            gsap.set(
              fade,
              {
                autoAlpha:
                  1 -
                  self.progress,

                y:
                  self.progress *
                  -14,
              },
            );
          },
        });

      return () => {
        trigger.kill();

        media.revert();
      };
    },
    {
      scope: fadeRef,
    },
  );

  return (
    <div
      ref={fadeRef}
      className="pointer-events-none fixed inset-x-0 top-[4.75rem] z-[95] px-4 md:top-[5.4rem] md:px-6"
    >
      <div className="mx-auto max-w-7xl">
        <a
          ref={linkRef}
          href={
            GROWCO_LINKS.landing
          }
          aria-label={
            t("aria")
          }
          className="group pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/75 py-2 pl-3 pr-4 text-xs font-medium text-white shadow-2xl shadow-black/10 backdrop-blur-xl transition hover:border-[#0BA5FF]/40 hover:bg-black/85"
        >
          <span className="grid h-6 w-6 place-items-center rounded-full bg-white/10 transition group-hover:bg-[#0BA5FF]">
            <ArrowLeft
              size={13}
              strokeWidth={2.2}
              className="transition-transform duration-300 group-hover:-translate-x-0.5"
            />
          </span>

          {t("label")}
        </a>
      </div>
    </div>
  );
}
