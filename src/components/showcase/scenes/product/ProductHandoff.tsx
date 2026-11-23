"use client";

import {
  useEffect,
  useRef,
} from "react";

import type {
  MutableRefObject,
} from "react";

import {
  gsap,
} from "gsap";

import {
  HANDOFF_STROKE,
  HANDOFF_STROKE_WIDTH,
  PRODUCT_HANDOFF_LANES,
  createProductHandoffPoints,
  pointsToSvgPath,
} from "@/components/showcase/scenes/shared/controlProductHandoff";

import {
  getProductTimelineState,
} from "@/components/showcase/scenes/product/productTimeline";

import styles from "@/components/showcase/scenes/product/ProductScene.module.css";

type ProductHandoffProps = {
  progressRef:
    MutableRefObject<number>;
};

/*
 * CONTROL já termina em phase=0:
 *
 *        ||||||
 *
 * Portanto o PRODUCT começa com EXATAMENTE phase=0.
 * Não existe rotação, morph ou reposicionamento aqui.
 */
export function ProductHandoff({
  progressRef,
}: ProductHandoffProps) {
  const svgRef =
    useRef<SVGSVGElement>(
      null,
    );

  useEffect(() => {
    let previousProgress =
      Number.NaN;

    const update = () => {
      const progress =
        progressRef.current;

      if (
        Number.isFinite(
          previousProgress,
        ) &&
        Math.abs(
          progress -
          previousProgress,
        ) <
          0.00001
      ) {
        return;
      }

      previousProgress =
        progress;

      if (
        !svgRef.current
      ) {
        return;
      }

      const state =
        getProductTimelineState(
          progress,
        );

      svgRef.current.style.opacity =
        `${state.handoffOpacity}`;
    };

    gsap.ticker.add(
      update,
    );

    update();

    return () => {
      gsap.ticker.remove(
        update,
      );
    };
  }, [
    progressRef,
  ]);

  return (
    <svg
      ref={
        svgRef
      }
      viewBox="0 0 1600 900"
      preserveAspectRatio="none"
      className={
        styles.handoffSvg
      }
      aria-hidden="true"
    >
      {
        PRODUCT_HANDOFF_LANES.map(
          (
            lane,
          ) => (
            <path
              key={
                lane
              }
              d={
                pointsToSvgPath(
                  createProductHandoffPoints(
                    lane,
                    0,
                  ),
                )
              }
              fill="none"
              stroke={
                HANDOFF_STROKE
              }
              strokeWidth={
                HANDOFF_STROKE_WIDTH
              }
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          ),
        )
      }
    </svg>
  );
}
