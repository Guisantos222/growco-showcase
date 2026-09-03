"use client";

import {
  useEffect,
} from "react";

import {
  useExperienceRuntime,
} from "@/experience/hooks/useExperienceRuntime";

export function RuntimeBridge() {
  const runtime =
    useExperienceRuntime();

  useEffect(() => {
    if (!runtime.ready) {
      return;
    }

    const html =
      document.documentElement;

    html.dataset.motion =
      runtime.reducedMotion
        ? "reduced"
        : "full";

    html.dataset.webgl =
      runtime.webglSupported
        ? "supported"
        : "fallback";

    html.dataset.experienceQuality =
      runtime.quality;

    return () => {
      delete html.dataset.motion;
      delete html.dataset.webgl;
      delete html.dataset.experienceQuality;
    };
  }, [
    runtime.ready,
    runtime.reducedMotion,
    runtime.webglSupported,
    runtime.quality,
  ]);

  return null;
}