"use client";

import {
  PRODUCT_ROAD_PATHS,
  PRODUCT_WORLD_SIZE,
} from "@/components/showcase/scenes/product/productWorldGeometry";

import styles from "@/components/showcase/scenes/product/ProductScene.module.css";

export function ProductRoads() {
  const paths =
    Object.values(
      PRODUCT_ROAD_PATHS,
    );

  return (
    <svg
      viewBox={`0 0 ${PRODUCT_WORLD_SIZE.width} ${PRODUCT_WORLD_SIZE.height}`}
      preserveAspectRatio="none"
      className={
        styles.roadsSvg
      }
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="productRoadFill"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop
            offset="0%"
            stopColor="#122630"
          />

          <stop
            offset="100%"
            stopColor="#0a1921"
          />
        </linearGradient>
      </defs>

      {
        paths.map(
          (
            d,
            index,
          ) => (
            <Road
              key={
                `${index}-${d}`
              }
              d={
                d
              }
            />
          ),
        )
      }

      <Node
        x={
          1600
        }
        y={
          790
        }
        main
      />

      <Node
        x={
          875
        }
        y={
          1125
        }
      />

      <Node
        x={
          2325
        }
        y={
          485
        }
      />

      <Node
        x={
          2305
        }
        y={
          1100
        }
      />

      <Node
        x={
          1650
        }
        y={
          1270
        }
      />
    </svg>
  );
}

function Road({
  d,
}: {
  d:
    string;
}) {
  return (
    <>
      <path
        d={
          d
        }
        fill="none"
        stroke="rgba(0,0,0,.22)"
        strokeWidth="54"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d={
          d
        }
        fill="none"
        stroke="url(#productRoadFill)"
        strokeWidth="46"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d={
          d
        }
        fill="none"
        stroke="rgba(132,184,208,.12)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="14 14"
      />
    </>
  );
}

function Node({
  x,
  y,
  main = false,
}: {
  x:
    number;

  y:
    number;

  main?:
    boolean;
}) {
  return (
    <g>
      {
        main && (
          <circle
            cx={
              x
            }
            cy={
              y
            }
            r="46"
            fill="none"
            stroke="rgba(11,165,255,.18)"
            strokeWidth="2"
            className={
              styles.gatewayPulse
            }
          />
        )
      }

      <circle
        cx={
          x
        }
        cy={
          y
        }
        r={
          main
            ? 34
            : 21
        }
        fill="#09171e"
        stroke={
          main
            ? "rgba(11,165,255,.24)"
            : "rgba(127,181,207,.13)"
        }
        strokeWidth="2"
      />

      <circle
        cx={
          x
        }
        cy={
          y
        }
        r={
          main
            ? 6
            : 4
        }
        fill={
          main
            ? "#0BA5FF"
            : "rgba(95,181,223,.48)"
        }
      />
    </g>
  );
}
