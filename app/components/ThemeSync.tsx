"use client";

import { useEffect } from "react";
import { applyAtmosphere, readStoredAtmosphere } from "@/lib/atmosphere";
import { applyTheme, readStoredTheme } from "@/lib/theme";

export function ThemeSync() {
  useEffect(() => {
    applyTheme(readStoredTheme());
    applyAtmosphere(readStoredAtmosphere());
  }, []);

  return null;
}
