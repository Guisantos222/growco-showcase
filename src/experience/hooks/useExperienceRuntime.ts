"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  detectWebGLSupport,
  getSuggestedExperienceQuality,
  type ExperienceQuality,
} from "@/experience/runtime/experienceRuntime";

type RuntimeState = {
  ready: boolean;
  webglSupported: boolean;
  reducedMotion: boolean;
  quality: ExperienceQuality;
};

const initialState: RuntimeState = {
  ready: false,
  webglSupported: false,
  reducedMotion: false,
  quality: "medium",
};

export function useExperienceRuntime() {
  const [
    runtime,
    setRuntime,
  ] = useState<RuntimeState>(
    initialState,
  );

  useEffect(() => {
    const reducedMotionQuery =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      );

    const webglSupported =
      detectWebGLSupport();

    function updateRuntime() {
      setRuntime({
        ready: true,

        webglSupported,

        reducedMotion:
          reducedMotionQuery.matches,

        quality:
          getSuggestedExperienceQuality(),
      });
    }

    updateRuntime();

    reducedMotionQuery.addEventListener(
      "change",
      updateRuntime,
    );

    window.addEventListener(
      "resize",
      updateRuntime,
    );

    return () => {
      reducedMotionQuery.removeEventListener(
        "change",
        updateRuntime,
      );

      window.removeEventListener(
        "resize",
        updateRuntime,
      );
    };
  }, []);

  return runtime;
}