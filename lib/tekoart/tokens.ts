/**
 * TekO Art tokens — planet HUD system measured on jubuddy.com/planet.
 * Cream pills, ink borders, amber CTA on mint sky. Shop craft stays Beehive-grade.
 */
export const tekoDawnTokens = {
  colorBackground: "255, 248, 232",
  colorBackgroundHex: "#FFF8E8",
  gradientBackground: "#FFF8E8",
  colorForeground: "44, 39, 32",
  colorForegroundHex: "#2C2720",
  colorBackgroundContrast: "79, 179, 166",
  colorBackgroundContrastHex: "#4FB3A6",
  colorShadow: "44, 39, 32",
  colorShadowHex: "#2C2720",
  colorButton: "245, 166, 35",
  colorButtonHex: "#F5A623",
  colorButtonText: "44, 39, 32",
  colorButtonTextHex: "#2C2720",
  colorSecondaryButton: "255, 248, 232",
  colorSecondaryButtonText: "44, 39, 32",
  colorLink: "44, 39, 32",
  colorBadgeForeground: "44, 39, 32",
  colorBadgeBackground: "255, 244, 212",
  colorBadgeBorder: "44, 39, 32",
  fontHeadingFamily: '"DM Serif Display", serif',
  fontBodyFamily:
    'Inter, "SF Pro Text", system-ui, -apple-system, "Segoe UI", sans-serif',
  fontBodyWeight: "400",
  fontBodyWeightBold: "800",
  fontHeadingWeight: "400",
  pageWidth: "120rem",
  buttonsRadius: "999px",
  buttonsBorderWidth: "1px",
  inputsRadius: "999px",
  variantPillsRadius: "999px",
  mediaRadius: "18px",
  productCardCornerRadius: "18px",
  badgeCornerRadius: "999px",
  gridDesktopGap: "12px",
  gridMobileGap: "8px",
  /** Planet walk sheet extras (not Dawn scheme keys). */
  planetSkyHex: "#BFE3E0",
  planetPaperHotHex: "#FFF4D4",
  planetCardHex: "#FFFDF6",
  planetAmberLightHex: "#FFD34D",
  planetMutedHex: "#5F584B",
  planetWhisperHex: "#8A8172",
  planetTrackHex: "#D8CEB3",
  planetShadow: "0 8px 28px rgba(44, 39, 32, 0.2)",
} as const;

/** Old Beehive / Dawn locks — must not reappear as primary shop chrome. */
export const tekoForbiddenBeehiveSwatches = ["#1d1d1d", "#fef7ff", "#cd2e2e"] as const;

export const TEKO_BMC_URL = "https://buymeacoffee.com/tekoart" as const;
