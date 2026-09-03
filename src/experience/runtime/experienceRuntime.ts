export type ExperienceQuality =
  | "high"
  | "medium"
  | "low";

export type ExperienceRuntimeSnapshot = {
  webglSupported: boolean;
  reducedMotion: boolean;
  quality: ExperienceQuality;
};

export function detectWebGLSupport() {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const canvas =
      document.createElement("canvas");

    const context =
      canvas.getContext("webgl2") ??
      canvas.getContext("webgl");

    return Boolean(context);
  } catch {
    return false;
  }
}

export function getSuggestedExperienceQuality():
  ExperienceQuality {
  if (
    typeof window === "undefined" ||
    typeof navigator === "undefined"
  ) {
    return "medium";
  }

  const cores =
    navigator.hardwareConcurrency ?? 8;

  const width =
    window.innerWidth;

  const dpr =
    window.devicePixelRatio ?? 1;

  /*
   * Mobile recebe uma composição
   * mais econômica por padrão.
   */
  if (
    width < 640 ||
    cores <= 4
  ) {
    return "low";
  }

  /*
   * Dispositivos intermediários ou
   * telas muito densas ficam em MEDIUM.
   */
  if (
    cores <= 8 ||
    dpr > 2
  ) {
    return "medium";
  }

  return "high";
}