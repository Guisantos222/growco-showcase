"use client";

import {
  createContext,
  useContext,
} from "react";

import type Lenis from "lenis";

export type SmoothScrollContextValue = {
  lenis: Lenis | null;
  ready: boolean;
};

export const SmoothScrollContext =
  createContext<
    SmoothScrollContextValue | null
  >(null);

export function useSmoothScroll() {
  const context =
    useContext(
      SmoothScrollContext,
    );

  if (!context) {
    throw new Error(
      "useSmoothScroll must be used inside SmoothScrollProvider.",
    );
  }

  return context;
}