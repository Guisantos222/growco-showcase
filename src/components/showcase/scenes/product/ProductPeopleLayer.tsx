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
  PRODUCT_ASSETS,
} from "@/components/showcase/scenes/product/productWorldConfig";

import {
  getProductTimelineState,
  interpolatedFocusStrength,
  mix,
} from "@/components/showcase/scenes/product/productTimeline";

import styles from "@/components/showcase/scenes/product/ProductScene.module.css";

type ProductPeopleLayerProps = {
  progressRef:
    MutableRefObject<number>;
};

const PEOPLE = [
  {
    src:
      PRODUCT_ASSETS.manager,
    label:
      "GESTÃO",
    className:
      "manager",
  },
  {
    src:
      PRODUCT_ASSETS.financeWorker,
    label:
      "FINANCEIRO",
    className:
      "finance",
  },
  {
    src:
      PRODUCT_ASSETS.logisticsWorker,
    label:
      "ESTOQUE",
    className:
      "logistics",
  },
  {
    src:
      PRODUCT_ASSETS.generalWorker,
    label:
      "OPERAÇÃO",
    className:
      "general",
  },
] as const;

export function ProductPeopleLayer({
  progressRef,
}: ProductPeopleLayerProps) {
  const refs =
    useRef<
      Array<
        HTMLDivElement | null
      >
    >([]);

  const haloRefs =
    useRef<
      Array<
        HTMLDivElement | null
      >
    >([]);

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

      const state =
        getProductTimelineState(
          progress,
        );

      const strength =
        interpolatedFocusStrength(
          state.fromFocus,
          state.toFocus,
          "people",
          state.segmentMix,
        ) *
        state.worldReveal;

      const active =
        state.activeFocus ===
        "people";

      refs.current.forEach(
        (
          element,
          index,
        ) => {
          const halo =
            haloRefs.current[
              index
            ];

          if (
            !element ||
            !halo
          ) {
            return;
          }

          element.dataset.active =
            active
              ? "true"
              : "false";

          element.style.opacity =
            `${
              0.32 +
              strength *
                0.68
            }`;

          element.style.transform =
            `translate3d(0, ${
              active
                ? -3
                : 0
            }px, 0) scale(${
              mix(
                0.98,
                active
                  ? 1.075
                  : 1,
                strength,
              )
            })`;

          halo.style.opacity =
            `${
              active
                ? 0.74
                : strength *
                    0.16
            }`;
        },
      );
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
    <>
      {
        PEOPLE.map(
          (
            person,
            index,
          ) => (
            <div
              key={
                person.label
              }
              ref={(
                element,
              ) => {
                refs.current[
                  index
                ] =
                  element;
              }}
              data-active="false"
              className={`${styles.worker} ${styles[`worker_${person.className}`]}`}
            >
              <div
                ref={(
                  element,
                ) => {
                  haloRefs.current[
                    index
                  ] =
                    element;
                }}
                className={
                  styles.workerHalo
                }
              />

              <div
                className={
                  styles.workerFocusRing
                }
              />

              <img
                src={
                  person.src
                }
                alt=""
                draggable={
                  false
                }
                decoding="async"
                className={
                  styles.workerImage
                }
              />

              <div
                className={
                  styles.workerLabel
                }
              >
                {
                  person.label
                }
              </div>
            </div>
          ),
        )
      }
    </>
  );
}
