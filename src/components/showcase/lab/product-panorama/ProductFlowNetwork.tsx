"use client";

import type {
  PanoramaFocus,
} from "@/components/showcase/lab/product-panorama/productPanoramaConfig";

import styles from "@/components/showcase/lab/product-panorama/ProductPanoramaLab.module.css";

type FlowId =
  | "sales"
  | "stock"
  | "finance"
  | "people"
  | "operations"
  | "reports";

const FLOW_TO_FOCUS: Record<
  FlowId,
  PanoramaFocus[]
> = {
  sales: [
    "sales",
    "intelligence",
    "unified",
  ],
  stock: [
    "sales",
    "intelligence",
    "unified",
  ],
  finance: [
    "finance",
    "intelligence",
    "unified",
  ],
  people: [
    "people",
    "intelligence",
    "unified",
  ],
  operations: [
    "operations",
    "intelligence",
    "unified",
  ],
  reports: [
    "finance",
    "intelligence",
    "unified",
  ],
};

export function ProductFlowNetwork({
  focus,
}: {
  focus:
    PanoramaFocus;
}) {
  const isUnified =
    focus ===
      "overview" ||
    focus ===
      "unified";

  const isActive = (
    id:
      FlowId,
  ) =>
    isUnified ||
    FLOW_TO_FOCUS[
      id
    ].includes(
      focus,
    );

  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="none"
      className={
        styles.flowSvg
      }
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="flowGradient"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="0%"
            stopColor="#78d2ff"
            stopOpacity="0.9"
          />

          <stop
            offset="100%"
            stopColor="#0BA5FF"
            stopOpacity="1"
          />
        </linearGradient>

        <filter
          id="flowGlow"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feGaussianBlur
            stdDeviation="5"
            result="blur"
          />

          <feMerge>
            <feMergeNode
              in="blur"
            />
            <feMergeNode
              in="SourceGraphic"
            />
          </feMerge>
        </filter>
      </defs>

      <FlowPath
        d="M 694 0 L 694 122 C 694 180 717 214 760 250 C 782 269 795 297 800 348"
        active={
          isActive(
            "sales",
          )
        }
      />

      <FlowPath
        d="M 736 0 L 736 132 C 736 201 755 229 782 256 C 800 274 806 302 808 348"
        active={
          isActive(
            "stock",
          )
        }
      />

      <FlowPath
        d="M 778 0 L 778 154 C 778 218 789 260 812 348"
        active={
          isActive(
            "finance",
          )
        }
      />

      <FlowPath
        d="M 820 0 L 820 154 C 820 219 817 260 816 348"
        active={
          isActive(
            "people",
          )
        }
      />

      <FlowPath
        d="M 862 0 L 862 136 C 862 196 849 229 833 257 C 822 277 820 306 820 348"
        active={
          isActive(
            "operations",
          )
        }
      />

      <FlowPath
        d="M 904 0 L 904 120 C 904 181 881 213 851 249 C 832 272 825 299 824 348"
        active={
          isActive(
            "reports",
          )
        }
      />

      <BranchPath
        d="M 808 420 C 690 454 564 479 392 500"
        active={
          isActive(
            "sales",
          ) ||
          isActive(
            "stock",
          )
        }
      />

      <BranchPath
        d="M 821 412 C 951 422 1080 396 1246 250"
        active={
          isActive(
            "finance",
          ) ||
          isActive(
            "reports",
          )
        }
      />

      <BranchPath
        d="M 820 426 C 958 485 1075 528 1260 560"
        active={
          isActive(
            "operations",
          )
        }
      />

      <BranchPath
        d="M 790 430 C 745 511 717 584 703 655"
        active={
          isActive(
            "people",
          )
        }
      />

      <circle
        cx="814"
        cy="391"
        r="68"
        fill="rgba(11,165,255,0.05)"
        stroke="rgba(11,165,255,0.20)"
        strokeWidth="1.5"
      />

      <circle
        cx="814"
        cy="391"
        r="45"
        fill="rgba(11,165,255,0.05)"
        stroke="rgba(11,165,255,0.35)"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function FlowPath({
  d,
  active,
}: {
  d:
    string;

  active:
    boolean;
}) {
  return (
    <path
      d={
        d
      }
      fill="none"
      stroke={
        active
          ? "url(#flowGradient)"
          : "rgba(116,155,176,0.16)"
      }
      strokeWidth={
        active
          ? 4.2
          : 2
      }
      strokeLinecap="round"
      filter={
        active
          ? "url(#flowGlow)"
          : undefined
      }
      className={
        styles.flowPath
      }
    />
  );
}

function BranchPath({
  d,
  active,
}: {
  d:
    string;

  active:
    boolean;
}) {
  return (
    <path
      d={
        d
      }
      fill="none"
      stroke={
        active
          ? "#0BA5FF"
          : "rgba(116,155,176,0.12)"
      }
      strokeWidth={
        active
          ? 3
          : 1.5
      }
      strokeLinecap="round"
      strokeDasharray={
        active
          ? "9 12"
          : "4 13"
      }
      className={
        styles.branchPath
      }
    />
  );
}
