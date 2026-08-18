"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { GameShell } from "@/app/components/game/GameShell";
import { castOracle } from "@/lib/game/loom";
import { localizeHref, type Locale } from "@/lib/i18n";
import { t } from "@/lib/messages";
import { links } from "@/lib/site";

export function OracleGame({ locale = "en" }: { locale?: Locale }) {
  const m = t(locale);
  const [lines, setLines] = useState<string[]>([]);
  const [glitch, setGlitch] = useState(false);
  const lastShake = useRef(0);
  const href = (p: string) => localizeHref(p, locale);

  const cast = useCallback(() => {
    setGlitch(true);
    window.setTimeout(() => {
      setLines([...castOracle(locale)]);
      setGlitch(false);
    }, 280);
  }, [locale]);

  useEffect(() => {
    const onMotion = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity;
      if (!acc) return;
      const mag = Math.hypot(acc.x ?? 0, acc.y ?? 0, acc.z ?? 0);
      const now = Date.now();
      if (mag > 22 && now - lastShake.current > 900) {
        lastShake.current = now;
        cast();
      }
    };
    window.addEventListener("devicemotion", onMotion);
    return () => window.removeEventListener("devicemotion", onMotion);
  }, [cast]);

  return (
    <GameShell locale={locale} kicker={m.game.oracle.kicker} title={m.game.oracle.title} lead={m.game.oracle.lead}>
      <div
        className="rounded-[20px] border border-hair bg-deep/60 p-5 sm:p-8"
        style={glitch ? { filter: "hue-rotate(80deg) contrast(1.3)", transform: "translateX(2px)" } : undefined}
      >
        <button type="button" onClick={cast} className="btn btn-primary min-h-12 px-6 text-base">
          {m.game.oracle.cast}
        </button>
        <p className="mt-3 text-xs text-muted">{m.game.oracle.shakeHint}</p>
        <div className="mt-8 min-h-[8.5rem] space-y-3">
          {lines.length === 0 ? (
            <p className="text-sm text-muted">{m.game.oracle.empty}</p>
          ) : (
            lines.map((line, i) => (
              <p key={`${i}-${line}`} className="font-display text-xl leading-snug text-fg sm:text-2xl">
                {line}
              </p>
            ))
          )}
        </div>
        <p className="mt-8 text-xs leading-relaxed text-muted">{m.game.oracle.disclaimer}</p>
      </div>
      <div className="mt-8 flex flex-wrap gap-2">
        <a href={links.jubuddyHome} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
          {m.game.oracle.ctaJubuddy}
        </a>
        <a href={links.jubitHome} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
          {m.game.oracle.ctaJubit}
        </a>
        <Link href={href("/game/post")} className="btn btn-primary">
          {m.game.oracle.ctaPost}
        </Link>
      </div>
    </GameShell>
  );
}
