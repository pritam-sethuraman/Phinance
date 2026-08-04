"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      const media = window.matchMedia(QUERY);

      media.addEventListener("change", onStoreChange);

      return () => {
        media.removeEventListener("change", onStoreChange);
      };
    },
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
