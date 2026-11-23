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

import type {
  ProductSectorId,
} from "@/components/showcase/scenes/product/productWorldConfig";

import {
  PRODUCT_ASSETS,
} from "@/components/showcase/scenes/product/productWorldConfig";

import {
  getProductTimelineState,
  interpolatedFocusStrength,
  mix,
} from "@/components/showcase/scenes/product/productTimeline";

import styles from "@/components/showcase/scenes/product/ProductScene.module.css";

type ProductSectorLayerProps = {
  progressRef:
    MutableRefObject<number>;
};

type SectorKey =
  Exclude<
    ProductSectorId,
    "people"
  >;

type SectorRefMap =
  Partial<
    Record<
      SectorKey,
      HTMLDivElement | null
    >
  >;

const SECTORS: SectorKey[] = [
  "campus",
  "sales",
  "operations",
  "finance",
  "intelligence",
];

export function ProductSectorLayer({
  progressRef,
}: ProductSectorLayerProps) {
  const sectorRefs =
    useRef<SectorRefMap>({});

  const glowRefs =
    useRef<SectorRefMap>({});

  const shadeRefs =
    useRef<SectorRefMap>({});

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

      SECTORS.forEach(
        (
          sectorId,
        ) => {
          const element =
            sectorRefs.current[
              sectorId
            ];

          const glow =
            glowRefs.current[
              sectorId
            ];

          const shade =
            shadeRefs.current[
              sectorId
            ];

          if (
            !element ||
            !glow ||
            !shade
          ) {
            return;
          }

          const strength =
            interpolatedFocusStrength(
              state.fromFocus,
              state.toFocus,
              sectorId,
              state.segmentMix,
            );

          const exactSelected =
            state.activeFocus ===
              sectorId;

          const baseOpacity =
            sectorId ===
              "campus"
              ? 0.50
              : 0.42;

          element.dataset.active =
            exactSelected
              ? "true"
              : "false";

          element.style.setProperty(
            "--focus-strength",
            `${strength}`,
          );

          element.style.opacity =
            `${
              (
                baseOpacity +
                strength *
                  (
                    1 -
                    baseOpacity
                  )
              ) *
              state.worldReveal
            }`;

          /*
           * Mantemos o SVG limpo:
           * só opacity + transform no wrapper.
           */
          element.style.transform =
            `translate3d(0, ${
              mix(
                4,
                exactSelected
                  ? -8
                  : 0,
                strength,
              )
            }px, 0) scale(${
              mix(
                0.994,
                exactSelected
                  ? 1.035
                  : 1.004,
                strength,
              )
            })`;

          /*
           * Glow e dimming continuam em layers separadas.
           * O glow pode animar o próprio transform sem repintar
           * milhares de paths do SVG.
           */
          glow.style.opacity =
            `${
              exactSelected
                ? 0.74
                : strength *
                    0.24
            }`;

          shade.style.opacity =
            `${
              exactSelected
                ? 0
                : Math.max(
                    0,
                    0.34 -
                      strength *
                        0.28,
                  )
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
      <Sector
        id="campus"
        className={
          styles.campusSector
        }
        src={
          PRODUCT_ASSETS.campus
        }
        sectorRefs={
          sectorRefs
        }
        glowRefs={
          glowRefs
        }
        shadeRefs={
          shadeRefs
        }
        label={null}
        platform={false}
      />

      <Sector
        id="sales"
        className={
          styles.salesSector
        }
        src={
          PRODUCT_ASSETS.logistics
        }
        sectorRefs={
          sectorRefs
        }
        glowRefs={
          glowRefs
        }
        shadeRefs={
          shadeRefs
        }
        label={{
          kicker:
            "LIVE",
          title:
            "VENDAS + ESTOQUE",
        }}
        platform
      />

      <Sector
        id="operations"
        className={
          styles.operationsSector
        }
        src={
          PRODUCT_ASSETS.operations
        }
        sectorRefs={
          sectorRefs
        }
        glowRefs={
          glowRefs
        }
        shadeRefs={
          shadeRefs
        }
        label={{
          kicker:
            "92%",
          title:
            "OPERAÇÕES",
        }}
        platform
      />

      <Sector
        id="finance"
        className={
          styles.financeSector
        }
        src={
          PRODUCT_ASSETS.office
        }
        sectorRefs={
          sectorRefs
        }
        glowRefs={
          glowRefs
        }
        shadeRefs={
          shadeRefs
        }
        label={{
          kicker:
            "+8,4%",
          title:
            "FINANCEIRO",
        }}
        platform
        compact
      />

      <div
        ref={(
          element,
        ) => {
          sectorRefs.current.intelligence =
            element;
        }}
        data-active="false"
        className={`${styles.sector} ${styles.intelligenceSector}`}
      >
        <div
          ref={(
            element,
          ) => {
            glowRefs.current.intelligence =
              element;
          }}
          className={
            styles.sectorGlow
          }
        />

        <div
          className={
            styles.sectorFocusRing
          }
        />

        <div
          ref={(
            element,
          ) => {
            shadeRefs.current.intelligence =
              element;
          }}
          className={
            styles.sectorShade
          }
        />

        <div
          className={
            styles.corePulse
          }
        >
          <div
            className={
              styles.coreOuterRing
            }
          />

          <div
            className={
              styles.coreMiddleRing
            }
          />

          <div
            className={
              styles.coreBody
            }
          >
            <div
              className={
                styles.coreLogo
              }
            >
              growCo.
            </div>

            <div
              className={
                styles.coreCaption
              }
            >
              OPERATIONAL INTELLIGENCE
            </div>

            <div
              className={
                styles.coreStatus
              }
            >
              <span />
              LIVE CONTEXT
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Sector({
  id,
  className,
  src,
  sectorRefs,
  glowRefs,
  shadeRefs,
  label,
  platform,
  compact = false,
}: {
  id:
    SectorKey;

  className:
    string;

  src:
    string;

  sectorRefs:
    MutableRefObject<SectorRefMap>;

  glowRefs:
    MutableRefObject<SectorRefMap>;

  shadeRefs:
    MutableRefObject<SectorRefMap>;

  label:
    {
      kicker: string;
      title: string;
    } | null;

  platform:
    boolean;

  compact?:
    boolean;
}) {
  return (
    <div
      ref={(
        element,
      ) => {
        sectorRefs.current[
          id
        ] =
          element;
      }}
      data-active="false"
      className={`${styles.sector} ${className}`}
    >
      <div
        ref={(
          element,
        ) => {
          glowRefs.current[
            id
          ] =
            element;
        }}
        className={
          styles.sectorGlow
        }
      />

      <div
        className={
          styles.sectorFocusRing
        }
      />

      {
        platform && (
          <div
            className={`${styles.sectorPlatform} ${compact ? styles.sectorPlatformCompact : ""}`}
          />
        )
      }

      <img
        src={
          src
        }
        alt=""
        draggable={
          false
        }
        decoding="async"
        className={
          styles.assetImage
        }
      />

      <div
        ref={(
          element,
        ) => {
          shadeRefs.current[
            id
          ] =
            element;
        }}
        className={
          styles.sectorShade
        }
      />

      {
        label && (
          <div
            className={
              styles.sectorLabel
            }
          >
            <span>
              {
                label.kicker
              }
            </span>

            <strong>
              {
                label.title
              }
            </strong>
          </div>
        )
      }
    </div>
  );
}
