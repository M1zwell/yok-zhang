export type AtmosphereId = "harbour-night" | "peak-mist" | "neon-terminal" | "bone-day";

export const atmosphereStorageKey = "atmosphere";
export const defaultAtmosphere: AtmosphereId = "harbour-night";

export const atmosphereIds: AtmosphereId[] = [
  "harbour-night",
  "peak-mist",
  "neon-terminal",
  "bone-day",
];

/** theme-color per field mood, on the worlds token sheet. */
export const atmosphereThemeColors: Record<AtmosphereId, string> = {
  "harbour-night": "#0E0B12",
  "peak-mist": "#0F1422",
  "neon-terminal": "#1A0E1A",
  "bone-day": "#F6F1E8",
};

/** Canvas tint hints read by HeroCanvas. */
export const atmosphereCanvas: Record<
  AtmosphereId,
  { teal: string; magenta: string; purple: string; pink: string; hazeDeep: string }
> = {
  "harbour-night": {
    teal: "#14B8A6",
    magenta: "#FF4778",
    purple: "#8B7CFF",
    pink: "#EC4899",
    hazeDeep: "rgba(14,11,18,0.62)",
  },
  "peak-mist": {
    teal: "#5BE7D8",
    magenta: "#A8B8A3",
    purple: "#7DD3FC",
    pink: "#A0C0E0",
    hazeDeep: "rgba(15,20,34,0.7)",
  },
  "neon-terminal": {
    teal: "#FF4778",
    magenta: "#E040A0",
    purple: "#A060E0",
    pink: "#FF6B9A",
    hazeDeep: "rgba(26,14,26,0.72)",
  },
  "bone-day": {
    teal: "#3C7A6C",
    magenta: "#C77891",
    purple: "#8B7CFF",
    pink: "#E8B0C0",
    hazeDeep: "rgba(246,241,232,0.55)",
  },
};

export function isAtmosphere(value: string | null | undefined): value is AtmosphereId {
  return (
    value === "harbour-night" ||
    value === "peak-mist" ||
    value === "neon-terminal" ||
    value === "bone-day"
  );
}

export function readStoredAtmosphere(): AtmosphereId {
  try {
    const stored = localStorage.getItem(atmosphereStorageKey);
    return isAtmosphere(stored) ? stored : defaultAtmosphere;
  } catch {
    return defaultAtmosphere;
  }
}

export function applyAtmosphere(id: AtmosphereId) {
  const root = document.documentElement;
  root.dataset.atmosphere = id;
  try {
    localStorage.setItem(atmosphereStorageKey, id);
  } catch {
    /* private mode */
  }
  document.cookie = `atmosphere=${id}; Path=/; Max-Age=31536000; SameSite=Lax`;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", atmosphereThemeColors[id]);
}
