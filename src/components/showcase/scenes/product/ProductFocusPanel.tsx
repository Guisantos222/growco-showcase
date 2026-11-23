"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  MutableRefObject,
} from "react";

import {
  gsap,
} from "gsap";

import {
  useLocale,
} from "next-intl";

import type {
  ProductFocus,
  ProductSceneConfig,
} from "@/components/showcase/scenes/product/productWorldConfig";

import {
  PRODUCT_SCENE_BY_ID,
  PRODUCT_SCENES,
} from "@/components/showcase/scenes/product/productWorldConfig";

import {
  getProductTimelineState,
} from "@/components/showcase/scenes/product/productTimeline";

import styles from "@/components/showcase/scenes/product/ProductScene.module.css";

type ProductFocusPanelProps = {
  progressRef:
    MutableRefObject<number>;
};

export function ProductFocusPanel({
  progressRef,
}: ProductFocusPanelProps) {
  const locale =
    useLocale();

  const isPt =
    locale !==
    "en";

  const [
    scene,
    setScene,
  ] =
    useState<
      ProductSceneConfig | null
    >(
      null,
    );

  const sceneIdRef =
    useRef<
      ProductFocus | null
    >(
      null,
    );

  const panelRef =
    useRef<HTMLElement>(
      null,
    );

  const railRef =
    useRef<HTMLDivElement>(
      null,
    );

  const progressBarRef =
    useRef<HTMLDivElement>(
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

      const state =
        getProductTimelineState(
          progress,
        );

      const nextId =
        state.activeFocus;

      if (
        nextId !==
        sceneIdRef.current
      ) {
        sceneIdRef.current =
          nextId;

        setScene(
          nextId
            ? PRODUCT_SCENE_BY_ID[
                nextId
              ]
            : null,
        );
      }

      if (
        panelRef.current
      ) {
        panelRef.current.style.opacity =
          `${
            nextId
              ? state.panelVisibility
              : 0
          }`;

        panelRef.current.style.transform =
          `translate3d(0, ${
            14 *
            (
              1 -
              state.panelVisibility
            )
          }px, 0)`;
      }

      if (
        railRef.current
      ) {
        railRef.current.style.opacity =
          `${state.railVisibility}`;

        railRef.current.style.transform =
          `translate3d(-50%, ${
            6 *
            (
              1 -
              state.railVisibility
            )
          }px, 0)`;
      }

      if (
        progressBarRef.current
      ) {
        progressBarRef.current.style.transform =
          `scaleX(${progress})`;
      }
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
      <aside
        ref={
          panelRef
        }
        className={`${styles.focusPanel} ${scene?.panelSide === "right" ? styles.focusPanelRight : styles.focusPanelLeft}`}
        aria-hidden={
          scene
            ? undefined
            : true
        }
      >
        {
          scene && (
            <div
              key={
                scene.id
              }
              className={
                styles.panelContent
              }
            >
              <div
                className={
                  styles.panelTopLine
                }
              >
                <div
                  className={
                    styles.panelEyebrow
                  }
                >
                  {
                    isPt
                      ? scene.eyebrowPt
                      : scene.eyebrowEn
                  }
                </div>

                <div
                  className={
                    styles.panelSceneNumber
                  }
                >
                  {
                    String(
                      PRODUCT_SCENES.findIndex(
                        (
                          candidate,
                        ) =>
                          candidate.id ===
                          scene.id,
                      ) +
                        1,
                    ).padStart(
                      2,
                      "0",
                    )
                  }
                  /
                  {
                    String(
                      PRODUCT_SCENES.length,
                    ).padStart(
                      2,
                      "0",
                    )
                  }
                </div>
              </div>

              <h2
                className={
                  styles.panelTitle
                }
              >
                {
                  isPt
                    ? scene.titlePt
                    : scene.titleEn
                }
              </h2>

              <p
                className={
                  styles.panelBody
                }
              >
                {
                  isPt
                    ? scene.bodyPt
                    : scene.bodyEn
                }
              </p>

              <div
                className={
                  styles.metricsGrid
                }
              >
                {
                  scene.metrics.map(
                    (
                      metric,
                    ) => (
                      <div
                        key={`${scene.id}-${metric.labelPt}`}
                        className={`${styles.metricCard} ${metric.accent ? styles.metricCardAccent : ""}`}
                      >
                        <div
                          className={
                            styles.metricLabel
                          }
                        >
                          {
                            isPt
                              ? metric.labelPt
                              : metric.labelEn
                          }
                        </div>

                        <div
                          className={
                            styles.metricValue
                          }
                        >
                          {
                            metric.value
                          }
                        </div>
                      </div>
                    ),
                  )
                }
              </div>
            </div>
          )
        }
      </aside>

      <div
        ref={
          railRef
        }
        className={
          styles.sceneRail
        }
        aria-hidden="true"
      >
        {
          PRODUCT_SCENES.map(
            (
              candidate,
              index,
            ) => (
              <span
                key={
                  candidate.id
                }
                className={
                  candidate.id ===
                  scene?.id
                    ? styles.sceneDotActive
                    : styles.sceneDot
                }
              >
                {
                  String(
                    index +
                      1,
                  ).padStart(
                    2,
                    "0",
                  )
                }
              </span>
            ),
          )
        }
      </div>

      <div
        className={
          styles.scrollProgressTrack
        }
        aria-hidden="true"
      >
        <div
          ref={
            progressBarRef
          }
          className={
            styles.scrollProgressBar
          }
        />
      </div>
    </>
  );
}
