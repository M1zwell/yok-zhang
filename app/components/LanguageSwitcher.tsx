"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { localeMeta, locales, localizeHref, stripLocale, writeLocaleCookie, type Locale } from "@/lib/i18n";
import { t } from "@/lib/messages";

export function LanguageSwitcher() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const { locale, path } = stripLocale(pathname);
  const m = t(locale);
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const go = (next: Locale) => {
    writeLocaleCookie(next);
    document.documentElement.lang = localeMeta[next].html;
    const search = typeof window !== "undefined" ? window.location.search : "";
    router.push(`${localizeHref(path, next)}${search}`);
    setOpen(false);
  };

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 rounded-lg border border-hair px-2 py-1.5 text-[11px] font-semibold tracking-wide text-muted transition-colors hover:border-accent/40 hover:text-fg"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={m.language.label}
      >
        <span className="font-mono text-accent">{localeMeta[locale].short}</span>
        <span className="hidden sm:inline">{localeMeta[locale].native}</span>
      </button>
      {open ? (
        <ul
          role="listbox"
          className="absolute right-0 z-50 mt-1 min-w-[10.5rem] overflow-hidden rounded-xl border border-hair bg-surface py-1 shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
        >
          {locales.map((loc) => {
            const on = loc === locale;
            return (
              <li key={loc} role="option" aria-selected={on}>
                <button
                  type="button"
                  onClick={() => go(loc)}
                  className={
                    on
                      ? "flex w-full items-center justify-between gap-3 bg-accent/10 px-3 py-2 text-left text-[12px] text-accent"
                      : "flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-[12px] text-secondary hover:bg-elevated hover:text-fg"
                  }
                >
                  <span>{m.language[loc]}</span>
                  <span className="font-mono text-[10px] text-muted">{localeMeta[loc].short}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
