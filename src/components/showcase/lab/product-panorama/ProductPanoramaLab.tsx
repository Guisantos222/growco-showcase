"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  useLocale,
} from "next-intl";

import type {
  PanoramaFocus,
} from "@/components/showcase/lab/product-panorama/productPanoramaConfig";

import {
  PANORAMA_FOCUS,
  PANORAMA_FOCUS_ORDER,
} from "@/components/showcase/lab/product-panorama/productPanoramaConfig";

import {
  ProductPanoramaWorld,
} from "@/components/showcase/lab/product-panorama/ProductPanoramaWorld";

import {
  ProductFocusPanel,
} from "@/components/showcase/lab/product-panorama/ProductFocusPanel";

import styles from "@/components/showcase/lab/product-panorama/ProductPanoramaLab.module.css";

export function ProductPanoramaLab() {
  const locale =
    useLocale();

  const isPt =
    locale !==
    "en";

  const [
    focus,
    setFocus,
  ] =
    useState<PanoramaFocus>(
      "overview",
    );

  const current =
    useMemo(
      () =>
        PANORAMA_FOCUS[
          focus
        ],
      [
        focus,
      ],
    );

  return (
    <main
      className={
        styles.page
      }
    >
      <div
        className={
          styles.topBar
        }
      >
        <div>
          <div
            className={
              styles.topEyebrow
            }
          >
            PRODUCT PANORAMA LAB
          </div>

          <div
            className={
              styles.topTitle
            }
          >
            growCo. operational ecosystem
          </div>
        </div>

        <div
          className={
            styles.modeBadge
          }
        >
          DEBUG / COMPOSITION
        </div>
      </div>

      <div
        className={
          styles.canvasShell
        }
      >
        <ProductPanoramaWorld
          focus={
            focus
          }
        />

        <ProductFocusPanel
          config={
            current
          }
          isPt={
            isPt
          }
        />

        <div
          className={
            styles.segmentRail
          }
        >
          {
            PANORAMA_FOCUS_ORDER.map(
              (
                item,
                index,
              ) => {
                const itemConfig =
                  PANORAMA_FOCUS[
                    item
                  ];

                const active =
                  item ===
                  focus;

                return (
                  <button
                    key={
                      item
                    }
                    type="button"
                    onClick={() =>
                      setFocus(
                        item,
                      )
                    }
                    className={`
                      ${
                        styles.segmentButton
                      }
                      ${
                        active
                          ? styles.segmentButtonActive
                          : ""
                      }
                    `}
                  >
                    <span
                      className={
                        styles.segmentIndex
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

                    <span>
                      {
                        isPt
                          ? itemConfig.labelPt
                          : itemConfig.labelEn
                      }
                    </span>
                  </button>
                );
              },
            )
          }
        </div>
      </div>
    </main>
  );
}
