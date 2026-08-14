"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { applyTheme, type Theme } from "@/lib/theme";
import { stripLocale } from "@/lib/i18n";
import { t } from "@/lib/messages";

export function ThemeToggle() {
  const pathname = usePathname() || "/";
  const { locale } = stripLocale(pathname);
  const m = t(locale);
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(document.documentElement.classList.contains("light") ? "light" : "dark");
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    setTheme(next);
  };

  const isDark = theme === "dark";
  const glyph = isDark ? "Aa" : "雅";
  const mode = isDark ? m.theme.dark : m.theme.light;
  const title = `${glyph} — ${mode}`;

  return (
    <button
      type="button"
      onClick={toggle}
      title={title}
      aria-label={`${m.theme.label}: ${mode}`}
      aria-pressed={isDark}
      className="theme-toggle inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-hair text-[13px] font-semibold leading-none text-fg transition-colors hover:border-accent/40 hover:text-accent"
    >
      <span aria-hidden>{glyph}</span>
    </button>
  );
}
