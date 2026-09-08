"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Lenis from "lenis";

import {
  gsap,
} from "gsap";

import {
  ScrollTrigger,
} from "gsap/ScrollTrigger";

import {
  SMOOTH_SCROLL_CONFIG,
} from "@/experience/scroll/scrollConfig";

import {
  SmoothScrollContext,
} from "@/experience/scroll/useSmoothScroll";

gsap.registerPlugin(
  ScrollTrigger,
);

type SmoothScrollProviderProps = {
  children:
    React.ReactNode;
};

export function SmoothScrollProvider({
  children,
}: SmoothScrollProviderProps) {
  const [
    lenis,
    setLenis,
  ] =
    useState<Lenis | null>(
      null,
    );

  const [
    ready,
    setReady,
  ] =
    useState(false);

  useEffect(() => {
    /*
     * ==========================================================
     * LENIS INSTANCE
     * ==========================================================
     */

    const instance =
      new Lenis({
        ...SMOOTH_SCROLL_CONFIG,
      });

    /*
     * Lenis altera a posição
     * de scroll.
     *
     * ScrollTrigger precisa
     * recalcular suas posições.
     */

    instance.on(
      "scroll",
      ScrollTrigger.update,
    );

    /*
     * ==========================================================
     * GSAP ↔ LENIS RAF
     * ==========================================================
     *
     * GSAP fornece segundos.
     * Lenis espera milissegundos.
     */

    function updateLenis(
      time: number,
    ) {
      instance.raf(
        time * 1000,
      );
    }

    gsap.ticker.add(
      updateLenis,
    );

    /*
     * Não queremos que o GSAP
     * tente compensar frames
     * atrasados saltando tempo.
     */

    gsap.ticker.lagSmoothing(
      0,
    );

    /*
     * ==========================================================
     * PUBLISH TO REACT
     * ==========================================================
     *
     * Não chamamos setState
     * sincronamente dentro
     * do effect.
     *
     * Publicamos a instância
     * no próximo frame.
     */

    const publishFrame =
      window.requestAnimationFrame(
        () => {
          setLenis(
            instance,
          );

          setReady(
            true,
          );

          ScrollTrigger.refresh();
        },
      );

    /*
     * ==========================================================
     * CLEANUP
     * ==========================================================
     */

    return () => {
      window.cancelAnimationFrame(
        publishFrame,
      );

      gsap.ticker.remove(
        updateLenis,
      );

      instance.destroy();
    };
  }, []);

  /*
   * Só recriamos o objeto
   * de contexto quando seus
   * valores realmente mudam.
   */

  const value =
    useMemo(
      () => ({
        lenis,
        ready,
      }),
      [
        lenis,
        ready,
      ],
    );

  return (
    <SmoothScrollContext.Provider
      value={value}
    >
      {children}
    </SmoothScrollContext.Provider>
  );
}