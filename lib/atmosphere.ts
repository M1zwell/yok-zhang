export type AtmosphereId = "harbour-night" | "peak-mist" | "neon-terminal" | "bone-day";

export const atmosphereStorageKey = "atmosphere";
export const defaultAtmosphere: AtmosphereId = "harbour-night";

export const atmosphereIds: AtmosphereId[] = [
  "harbour-night",
  "peak-mist",
  "neon-terminal",
  "bone-day",
];

/** theme-color per Yok-native field mood (not cankola palettes). */
export const atmosphereThemeColors: Record<AtmosphereId, string> = {
  "harbour-night": "#0A1F1D",
  "peak-mist": "#12181C",
  "neon-terminal": "#07060A",
  "bone-day": "#F3EFE6",
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
    hazeDeep: "rgba(11,36,34,0.62)",
  },
  "peak-mist": {
    teal: "#5EEAD4",
    magenta: "#A8B4C4",
    purple: "#7DD3FC",
    pink: "#94A3B8",
    hazeDeep: "rgba(18,24,28,0.7)",
  },
  "neon-terminal": {
    teal: "#2DD4BF",
    magenta: "#FF2D6A",
    purple: "#A78BFA",
    pink: "#F472B6",
    hazeDeep: "rgba(7,6,10,0.72)",
  },
  "bone-day": {
    teal: "#0F766E",
    magenta: "#DB2777",
    purple: "#7C6AE8",
    pink: "#BE185D",
    hazeDeep: "rgba(243,239,230,0.55)",
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
