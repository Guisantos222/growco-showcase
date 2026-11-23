"use client";

import type {
  PanoramaFocusConfig,
} from "@/components/showcase/lab/product-panorama/productPanoramaConfig";

import styles from "@/components/showcase/lab/product-panorama/ProductPanoramaLab.module.css";

export function ProductFocusPanel({
  config,
  isPt,
}: {
  config:
    PanoramaFocusConfig;

  isPt:
    boolean;
}) {
  const sideClass =
    config.panelSide ===
    "left"
      ? styles.panelLeft
      : styles.panelRight;

  return (
    <aside
      className={`
        ${
          styles.focusPanel
        }
        ${
          sideClass
        }
      `}
    >
      <div
        className={
          styles.panelEyebrow
        }
      >
        {
          isPt
            ? config.eyebrowPt
            : config.eyebrowEn
        }
      </div>

      <h2
        className={
          styles.panelTitle
        }
      >
        {
          isPt
            ? config.titlePt
            : config.titleEn
        }
      </h2>

      <p
        className={
          styles.panelBody
        }
      >
        {
          isPt
            ? config.bodyPt
            : config.bodyEn
        }
      </p>

      <div
        className={
          styles.metricsGrid
        }
      >
        {
          config.metrics.map(
            (
              metric,
            ) => (
              <div
                key={
                  `${
                    config.id
                  }-${
                    metric.labelPt
                  }`
                }
                className={`
                  ${
                    styles.metricCard
                  }
                  ${
                    metric.accent
                      ? styles.metricCardAccent
                      : ""
                  }
                `}
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

      {
        config.id ===
          "intelligence" && (
          <div
            className={
              styles.insightBox
            }
          >
            <div
              className={
                styles.insightLabel
              }
            >
              GROWCO INSIGHT
            </div>

            <div
              className={
                styles.insightTitle
              }
            >
              {
                isPt
                  ? "Revisar reposição agora"
                  : "Review replenishment now"
              }
            </div>

            <div
              className={
                styles.insightBody
              }
            >
              {
                isPt
                  ? "Ritmo de vendas acima do normal com cobertura curta de estoque."
                  : "Sales velocity is above normal while stock coverage is short."
              }
            </div>
          </div>
        )
      }
    </aside>
  );
}
