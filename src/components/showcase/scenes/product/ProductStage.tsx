"use client";

import type {
  MutableRefObject,
} from "react";

import {
  ProductWorld,
} from "@/components/showcase/scenes/product/ProductWorld";

import {
  ProductFocusPanel,
} from "@/components/showcase/scenes/product/ProductFocusPanel";

import {
  ProductHandoff,
} from "@/components/showcase/scenes/product/ProductHandoff";

import styles from "@/components/showcase/scenes/product/ProductScene.module.css";

type ProductStageProps = {
  progressRef:
    MutableRefObject<number>;
};

export function ProductStage({
  progressRef,
}: ProductStageProps) {
  return (
    <div
      className={
        styles.stage
      }
    >
      <div
        className={
          styles.background
        }
      />

      <div
        className={
          styles.grid
        }
      />

      <div
        className={
          styles.glowA
        }
      />

      <div
        className={
          styles.glowB
        }
      />

      <ProductWorld
        progressRef={
          progressRef
        }
      />

      <ProductFocusPanel
        progressRef={
          progressRef
        }
      />

      <ProductHandoff
        progressRef={
          progressRef
        }
      />
    </div>
  );
}
