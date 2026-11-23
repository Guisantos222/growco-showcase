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
  ProductRoads,
} from "@/components/showcase/scenes/product/ProductRoads";

import {
  ProductFlowNetwork,
} from "@/components/showcase/scenes/product/ProductFlowNetwork";

import {
  ProductSectorLayer,
} from "@/components/showcase/scenes/product/ProductSectorLayer";

import {
  ProductPeopleLayer,
} from "@/components/showcase/scenes/product/ProductPeopleLayer";

import {
  getProductTimelineState,
} from "@/components/showcase/scenes/product/productTimeline";

import {
  PRODUCT_REFERENCE_VIEW,
} from "@/components/showcase/scenes/product/productWorldGeometry";

import styles from "@/components/showcase/scenes/product/ProductScene.module.css";

type ProductWorldProps = {
  progressRef:
    MutableRefObject<number>;
};

export function ProductWorld({
  progressRef,
}: ProductWorldProps) {
  const worldRef =
    useRef<HTMLDivElement>(
      null,
    );

  const scalerRef =
    useRef<HTMLDivElement>(
      null,
    );

  const cameraRef =
    useRef<HTMLDivElement>(
      null,
    );

  useEffect(() => {
    let previousProgress =
      Number.NaN;

    let fit =
      1;

    const updateFit = () => {
      fit =
        Math.min(
          window.innerWidth /
            PRODUCT_REFERENCE_VIEW.width,
          window.innerHeight /
            PRODUCT_REFERENCE_VIEW.height,
        );

      if (
        scalerRef.current
      ) {
        scalerRef.current.style.transform =
          `translate(-50%, -50%) scale(${fit})`;
      }
    };

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

      if (
        worldRef.current
      ) {
        worldRef.current.style.opacity =
          `${state.worldReveal}`;
      }

      if (
        cameraRef.current
      ) {
        const translateX =
          PRODUCT_REFERENCE_VIEW.width /
            2 -
          state.camera.centerX *
            state.camera.zoom;

        const translateY =
          PRODUCT_REFERENCE_VIEW.height /
            2 -
          state.camera.centerY *
            state.camera.zoom;

        cameraRef.current.style.transform =
          `translate3d(${translateX}px, ${translateY}px, 0) scale(${state.camera.zoom})`;
      }
    };

    updateFit();

    window.addEventListener(
      "resize",
      updateFit,
    );

    gsap.ticker.add(
      update,
    );

    update();

    return () => {
      gsap.ticker.remove(
        update,
      );

      window.removeEventListener(
        "resize",
        updateFit,
      );
    };
  }, [
    progressRef,
  ]);

  return (
    <div
      ref={
        worldRef
      }
      className={
        styles.worldViewport
      }
    >
      <div
        ref={
          scalerRef
        }
        className={
          styles.worldScaler
        }
      >
        <div
          ref={
            cameraRef
          }
          className={
            styles.worldCamera
          }
        >
          <ProductRoads />

          <ProductFlowNetwork
            progressRef={
              progressRef
            }
          />

          <ProductSectorLayer
            progressRef={
              progressRef
            }
          />

          <ProductPeopleLayer
            progressRef={
              progressRef
            }
          />
        </div>
      </div>
    </div>
  );
}
