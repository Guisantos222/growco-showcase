"use client";

import {
  useEffect,
  useRef,
} from "react";

import {
  ProductStage,
} from "@/components/showcase/scenes/product/ProductStage";

import {
  PRODUCT_RUNWAY_VH,
} from "@/components/showcase/scenes/product/productTimeline";

export function ProductScene() {
  const sectionRef =
    useRef<HTMLElement>(
      null,
    );

  const progressRef =
    useRef(
      0,
    );

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;

      const section =
        sectionRef.current;

      if (!section) {
        return;
      }

      const rect =
        section.getBoundingClientRect();

      const scrollable =
        Math.max(
          1,
          section.offsetHeight -
            window.innerHeight,
        );

      progressRef.current =
        clamp01(
          -rect.top /
            scrollable,
        );
    };

    const scheduleUpdate = () => {
      if (frame) {
        return;
      }

      frame =
        requestAnimationFrame(
          update,
        );
    };

    window.addEventListener(
      "scroll",
      scheduleUpdate,
      {
        passive: true,
      },
    );

    window.addEventListener(
      "resize",
      scheduleUpdate,
    );

    update();

    return () => {
      if (frame) {
        cancelAnimationFrame(
          frame,
        );
      }

      window.removeEventListener(
        "scroll",
        scheduleUpdate,
      );

      window.removeEventListener(
        "resize",
        scheduleUpdate,
      );
    };
  }, []);

  return (
    <section
      ref={
        sectionRef
      }
      id="produto"
      style={{
        height:
          `${PRODUCT_RUNWAY_VH}vh`,
        contain:
          "layout style",
      }}
    >
      <div
        style={{
          position:
            "sticky",
          top:
            0,
          height:
            "100vh",
          overflow:
            "hidden",
          background:
            "#030508",
          contain:
            "paint",
        }}
      >
        <ProductStage
          progressRef={
            progressRef
          }
        />
      </div>
    </section>
  );
}

function clamp01(
  value: number,
) {
  return Math.min(
    1,
    Math.max(
      0,
      value,
    ),
  );
}
