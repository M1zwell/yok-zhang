export type Theme = "light" | "dark";

export const themeStorageKey = "theme";
export const defaultTheme: Theme = "dark";
export const themeColors: Record<Theme, string> = {
  dark: "#0B2422",
  light: "#FAF5F7",
};

export function isTheme(value: string | null | undefined): value is Theme {
  return value === "light" || value === "dark";
}

export function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(themeStorageKey);
    return stored === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
  root.style.colorScheme = theme;
  try {
    localStorage.setItem(themeStorageKey, theme);
  } catch {
    /* private mode */
  }
  document.cookie = `theme=${theme}; Path=/; Max-Age=31536000; SameSite=Lax`;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", themeColors[theme]);
}
