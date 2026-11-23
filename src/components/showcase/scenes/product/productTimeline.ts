"use client";

import type {
  ProductCameraPose,
  ProductFocus,
} from "@/components/showcase/scenes/product/productWorldConfig";

import {
  PRODUCT_ARRIVAL_CAMERA,
  PRODUCT_SCENES,
} from "@/components/showcase/scenes/product/productWorldConfig";

export const PRODUCT_RUNWAY_VH = 1950;

export const PRODUCT_WORLD_REVEAL_START = 0.055;
export const PRODUCT_WORLD_REVEAL_END = 0.145;
export const PRODUCT_STORY_START = 0.175;

type TimelineStop = {
  at: number;
  focus: ProductFocus | null;
  camera: ProductCameraPose;
};

const STOPS: TimelineStop[] = [
  {
    at: 0,
    focus: null,
    camera: PRODUCT_ARRIVAL_CAMERA,
  },
  {
    at: 0.115,
    focus: null,
    camera: PRODUCT_ARRIVAL_CAMERA,
  },
  {
    at: 0.205,
    focus: "overview",
    camera: PRODUCT_SCENES[0].camera,
  },
  {
    at: 0.335,
    focus: "sales",
    camera: PRODUCT_SCENES[1].camera,
  },
  {
    at: 0.465,
    focus: "operations",
    camera: PRODUCT_SCENES[2].camera,
  },
  {
    at: 0.595,
    focus: "finance",
    camera: PRODUCT_SCENES[3].camera,
  },
  {
    at: 0.725,
    focus: "people",
    camera: PRODUCT_SCENES[4].camera,
  },
  {
    at: 0.855,
    focus: "intelligence",
    camera: PRODUCT_SCENES[5].camera,
  },
  {
    at: 0.955,
    focus: "unified",
    camera: PRODUCT_SCENES[6].camera,
  },
  {
    at: 1,
    focus: "unified",
    camera: PRODUCT_SCENES[6].camera,
  },
];

export type ProductTimelineState = {
  progress: number;
  fromFocus: ProductFocus | null;
  toFocus: ProductFocus | null;
  activeFocus: ProductFocus | null;
  activeIndex: number;
  camera: ProductCameraPose;
  segmentMix: number;
  worldReveal: number;
  networkReveal: number;
  panelVisibility: number;
  railVisibility: number;
  handoffOpacity: number;
  arrivalStrength: number;
};

export function getProductTimelineState(
  progress: number,
): ProductTimelineState {
  const p = clamp01(progress);

  let from = STOPS[0];
  let to = STOPS[1];

  for (
    let index = 0;
    index < STOPS.length - 1;
    index += 1
  ) {
    if (
      p >= STOPS[index].at &&
      p <= STOPS[index + 1].at
    ) {
      from = STOPS[index];
      to = STOPS[index + 1];
      break;
    }
  }

  const local = smootherstep(
    range01(
      p,
      from.at,
      to.at,
    ),
  );

  const activeFocus =
    p < PRODUCT_STORY_START
      ? null
      : local < 0.5
        ? from.focus
        : to.focus;

  const activeIndex =
    activeFocus
      ? PRODUCT_SCENES.findIndex(
          (scene) => scene.id === activeFocus,
        )
      : -1;

  const worldReveal = smootherstep(
    range01(
      p,
      PRODUCT_WORLD_REVEAL_START,
      PRODUCT_WORLD_REVEAL_END,
    ),
  );

  /*
   * As linhas do PRODUCT começam a aparecer antes do handoff sumir.
   * Como ambas usam a MESMA posição phase=0, o crossfade não dá salto.
   */
  const networkReveal = smootherstep(
    range01(
      p,
      0.050,
      0.135,
    ),
  );

  const handoffOpacity =
    1 -
    smootherstep(
      range01(
        p,
        0.070,
        0.145,
      ),
    );

  const panelVisibility = smootherstep(
    range01(
      p,
      0.185,
      0.235,
    ),
  );

  const railVisibility = smootherstep(
    range01(
      p,
      0.20,
      0.25,
    ),
  );

  const arrivalStrength =
    1 -
    smootherstep(
      range01(
        p,
        0.11,
        0.205,
      ),
    );

  return {
    progress: p,
    fromFocus: from.focus,
    toFocus: to.focus,
    activeFocus,
    activeIndex,
    camera: {
      centerX: mix(
        from.camera.centerX,
        to.camera.centerX,
        local,
      ),
      centerY: mix(
        from.camera.centerY,
        to.camera.centerY,
        local,
      ),
      zoom: mix(
        from.camera.zoom,
        to.camera.zoom,
        local,
      ),
    },
    segmentMix: local,
    worldReveal,
    networkReveal,
    panelVisibility,
    railVisibility,
    handoffOpacity,
    arrivalStrength,
  };
}

export function focusStrength(
  focus: ProductFocus | null,
  sector: ProductFocus | "campus",
) {
  if (!focus) {
    return sector === "campus"
      ? 0.66
      : 0.56;
  }

  if (focus === "overview") {
    return sector === "campus"
      ? 0.64
      : 0.74;
  }

  if (focus === "unified") {
    return sector === "campus"
      ? 0.72
      : 0.9;
  }

  if (focus === "people") {
    return sector === "people"
      ? 1
      : sector === "campus"
        ? 0.50
        : 0.28;
  }

  if (focus === "intelligence") {
    return sector === "intelligence"
      ? 1
      : sector === "campus"
        ? 0.48
        : 0.34;
  }

  if (sector === focus) {
    return 1;
  }

  return sector === "campus"
    ? 0.46
    : 0.22;
}

export function interpolatedFocusStrength(
  from: ProductFocus | null,
  to: ProductFocus | null,
  sector: ProductFocus | "campus",
  amount: number,
) {
  return mix(
    focusStrength(from, sector),
    focusStrength(to, sector),
    amount,
  );
}

export function range01(
  value: number,
  start: number,
  end: number,
) {
  if (value <= start) return 0;
  if (value >= end) return 1;

  return (
    value - start
  ) / (
    end - start
  );
}

export function smootherstep(
  value: number,
) {
  const t = clamp01(value);

  return (
    t *
    t *
    t *
    (
      t *
      (
        t * 6 -
        15
      ) +
      10
    )
  );
}

export function mix(
  start: number,
  end: number,
  amount: number,
) {
  return (
    start +
    (
      end - start
    ) *
    amount
  );
}

export function clamp01(
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
