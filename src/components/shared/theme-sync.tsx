"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

export function ThemeSync({ theme }: { theme: "LIGHT" | "DARK" | "SYSTEM" }) {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme(theme.toLowerCase());
    // Intentionally only on mount — after that, the topbar's theme toggle
    // (which writes straight to next-themes/localStorage) should win
    // without this effect fighting it on every subsequent render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
