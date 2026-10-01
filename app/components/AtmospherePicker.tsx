"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  applyAtmosphere,
  atmosphereIds,
  defaultAtmosphere,
  readStoredAtmosphere,
  type AtmosphereId,
} from "@/lib/atmosphere";
import { stripLocale } from "@/lib/i18n";
import { t } from "@/lib/messages";

const labels: Record<AtmosphereId, keyof ReturnType<typeof t>["atmosphere"]> = {
  "harbour-night": "harbourNight",
  "peak-mist": "peakMist",
  "neon-terminal": "neonTerminal",
  "bone-day": "boneDay",
};

export function AtmospherePicker() {
  const pathname = usePathname() || "/";
  const { locale } = stripLocale(pathname);
  const m = t(locale);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<AtmosphereId>(defaultAtmosphere);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    setCurrent(readStoredAtmosphere());
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
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

  const pick = (id: AtmosphereId) => {
    applyAtmosphere(id);
    setCurrent(id);
    setOpen(false);
    window.dispatchEvent(new Event("yok:atmosphere"));
  };

  return (
    <div ref={rootRef} className="atmosphere-picker relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title={`${m.atmosphere.label}: ${m.atmosphere[labels[current]]}`}
        aria-label={`${m.atmosphere.label}: ${m.atmosphere[labels[current]]}`}
        aria-expanded={open}
        aria-controls={listId}
        className="theme-toggle inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-hair text-[13px] font-semibold leading-none text-fg transition-colors hover:border-accent/40 hover:text-accent"
      >
        <span aria-hidden>◎</span>
      </button>
      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label={m.atmosphere.label}
          className="atmosphere-menu absolute right-0 top-[calc(100%+0.4rem)] z-50 min-w-[11.5rem] overflow-hidden rounded-xl border border-hair bg-elevated/95 py-1 shadow-lg backdrop-blur-md"
        >
          {atmosphereIds.map((id) => {
            const on = id === current;
            return (
              <li key={id} role="option" aria-selected={on}>
                <button
                  type="button"
                  onClick={() => pick(id)}
                  className={
                    on
                      ? "flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] font-medium text-accent"
                      : "flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] font-medium text-secondary hover:bg-tertiary/60 hover:text-fg"
                  }
                >
                  <span className={`atmosphere-swatch atmosphere-swatch-${id}`} aria-hidden />
                  {m.atmosphere[labels[id]]}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
