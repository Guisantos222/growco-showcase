"use client";

import type {
  PanoramaFocus,
  PanoramaSector,
} from "@/components/showcase/lab/product-panorama/productPanoramaConfig";

import {
  PANORAMA_ASSETS,
  PANORAMA_FOCUS,
} from "@/components/showcase/lab/product-panorama/productPanoramaConfig";

import {
  ProductFlowNetwork,
} from "@/components/showcase/lab/product-panorama/ProductFlowNetwork";

import styles from "@/components/showcase/lab/product-panorama/ProductPanoramaLab.module.css";

export function ProductPanoramaWorld({
  focus,
}: {
  focus:
    PanoramaFocus;
}) {
  const config =
    PANORAMA_FOCUS[
      focus
    ];

  const selected =
    new Set(
      config.sectors,
    );

  const isOverview =
    focus ===
      "overview" ||
    focus ===
      "unified";

  const sectorClass = (
    sector:
      PanoramaSector,
  ) => {
    if (
      isOverview
    ) {
      return styles.assetActive;
    }

    if (
      selected.has(
        sector,
      )
    ) {
      return styles.assetSelected;
    }

    return styles.assetDimmed;
  };

  return (
    <div
      className={
        styles.worldViewport
      }
    >
      <div
        className={
          styles.worldBackdrop
        }
      />

      <div
        className={
          styles.worldGrid
        }
      />

      <div
        className={
          styles.ambientGlowA
        }
      />

      <div
        className={
          styles.ambientGlowB
        }
      />

      <div
        className={
          styles.entryLabel
        }
      >
        CONTROL FLOW
      </div>

      <div
        className={
          styles.worldScale
        }
      >
        <div
          className={
            styles.worldStage
          }
          style={{
            transform:
              `translate3d(${
                config.translateX
              }%, ${
                config.translateY
              }%, 0) scale(${
                config.scale
              })`,
          }}
        >
          <ProductFlowNetwork
            focus={
              focus
            }
          />

          <Asset
            src={
              PANORAMA_ASSETS.campus
            }
            alt=""
            className={`
              ${
                styles.campus
              }
              ${
                sectorClass(
                  "campus",
                )
              }
            `}
          />

          <div
            className={`
              ${
                styles.logisticsWrap
              }
              ${
                sectorClass(
                  "sales",
                )
              }
            `}
          >
            <Asset
              src={
                PANORAMA_ASSETS.logistics
              }
              alt=""
              className={
                styles.assetFull
              }
            />

            <SectorTag
              eyebrow="LIVE"
              title="VENDAS + ESTOQUE"
              tone="blue"
            />
          </div>

          <div
            className={`
              ${
                styles.operationsWrap
              }
              ${
                sectorClass(
                  "operations",
                )
              }
            `}
          >
            <Asset
              src={
                PANORAMA_ASSETS.operations
              }
              alt=""
              className={
                styles.assetFull
              }
            />

            <SectorTag
              eyebrow="92%"
              title="OPERAÇÕES"
              tone="neutral"
            />
          </div>

          <div
            className={`
              ${
                styles.officeWrap
              }
              ${
                sectorClass(
                  "finance",
                )
              }
            `}
          >
            <Asset
              src={
                PANORAMA_ASSETS.office
              }
              alt=""
              className={
                styles.assetFull
              }
            />

            <SectorTag
              eyebrow="+8,4%"
              title="FINANCEIRO"
              tone="neutral"
            />
          </div>

          <div
            className={`
              ${
                styles.coreWrap
              }
              ${
                sectorClass(
                  "intelligence",
                )
              }
            `}
          >
            <GrowCoCore
              active={
                focus ===
                  "intelligence" ||
                focus ===
                  "unified"
              }
            />
          </div>

          <Worker
            src={
              PANORAMA_ASSETS.manager
            }
            className={`
              ${
                styles.workerManager
              }
              ${
                sectorClass(
                  "people",
                )
              }
            `}
            label="GESTÃO"
          />

          <Worker
            src={
              PANORAMA_ASSETS.finance
            }
            className={`
              ${
                styles.workerFinance
              }
              ${
                sectorClass(
                  "people",
                )
              }
            `}
            label="FINANCEIRO"
          />

          <Worker
            src={
              PANORAMA_ASSETS.logisticsWorker
            }
            className={`
              ${
                styles.workerLogistics
              }
              ${
                sectorClass(
                  "people",
                )
              }
            `}
            label="ESTOQUE"
          />

          <Worker
            src={
              PANORAMA_ASSETS.generalWorker
            }
            className={`
              ${
                styles.workerGeneral
              }
              ${
                sectorClass(
                  "people",
                )
              }
            `}
            label="OPERAÇÃO"
          />

          <DataPulse
            className={
              styles.pulseSales
            }
            active={
              focus ===
                "sales" ||
              focus ===
                "intelligence" ||
              focus ===
                "unified"
            }
          />

          <DataPulse
            className={
              styles.pulseFinance
            }
            active={
              focus ===
                "finance" ||
              focus ===
                "intelligence" ||
              focus ===
                "unified"
            }
          />

          <DataPulse
            className={
              styles.pulseOperations
            }
            active={
              focus ===
                "operations" ||
              focus ===
                "intelligence" ||
              focus ===
                "unified"
            }
          />

          <DataPulse
            className={
              styles.pulsePeople
            }
            active={
              focus ===
                "people" ||
              focus ===
                "intelligence" ||
              focus ===
                "unified"
            }
          />
        </div>
      </div>
    </div>
  );
}

function Asset({
  src,
  alt,
  className,
}: {
  src:
    string;

  alt:
    string;

  className:
    string;
}) {
  return (
    <img
      src={
        src
      }
      alt={
        alt
      }
      draggable={
        false
      }
      className={
        className
      }
    />
  );
}

function Worker({
  src,
  className,
  label,
}: {
  src:
    string;

  className:
    string;

  label:
    string;
}) {
  return (
    <div
      className={
        className
      }
    >
      <img
        src={
          src
        }
        alt=""
        draggable={
          false
        }
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
          label
        }
      </div>
    </div>
  );
}

function GrowCoCore({
  active,
}: {
  active:
    boolean;
}) {
  return (
    <div
      className={`
        ${
          styles.core
        }
        ${
          active
            ? styles.coreActive
            : ""
        }
      `}
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
  );
}

function SectorTag({
  eyebrow,
  title,
  tone,
}: {
  eyebrow:
    string;

  title:
    string;

  tone:
    "blue" |
    "neutral";
}) {
  return (
    <div
      className={`
        ${
          styles.sectorTag
        }
        ${
          tone ===
          "blue"
            ? styles.sectorTagBlue
            : ""
        }
      `}
    >
      <span>
        {
          eyebrow
        }
      </span>

      <strong>
        {
          title
        }
      </strong>
    </div>
  );
}

function DataPulse({
  className,
  active,
}: {
  className:
    string;

  active:
    boolean;
}) {
  return (
    <div
      className={`
        ${
          styles.dataPulse
        }
        ${
          className
        }
        ${
          active
            ? styles.dataPulseActive
            : ""
        }
      `}
    >
      <span />
    </div>
  );
}
