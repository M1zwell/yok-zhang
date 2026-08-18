"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { GameShell } from "@/app/components/game/GameShell";
import { castOracle } from "@/lib/game/loom";
import { localizeHref, type Locale } from "@/lib/i18n";
import { t } from "@/lib/messages";
import { funAiUrl } from "@/lib/game/life";
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
      setLines([...castOracle(locale)].map((line) => line.trim()).filter(Boolean));
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
        className="nz-card"
        style={glitch ? { transform: "translateX(2px) rotate(-1deg)" } : undefined}
      >
        <div className="nz-clip nz-clip-receipt" aria-hidden />
        <span className="nz-stamp">手搓</span>
        <button type="button" onClick={cast} className="nz-btn-primary" style={{ marginTop: 16 }}>
          {m.game.oracle.cast}
        </button>
        <p className="nz-note">{m.game.oracle.shakeHint}</p>
        <div style={{ marginTop: 28, minHeight: "8.5rem" }}>
          {lines.length === 0 ? (
            <p className="nz-note">{m.game.oracle.empty}</p>
          ) : (
            lines.map((line, i) => (
              <p
                key={`${i}-${line}`}
                className="nz-lead"
                style={{ fontFamily: "var(--nz-font-display), serif", fontSize: "1.35rem", marginTop: i ? 12 : 0 }}
              >
                {line}
              </p>
            ))
          )}
        </div>
        <p className="nz-caption">{m.game.oracle.disclaimer}</p>
        {lines.length > 0 ? (
          <div style={{ marginTop: 22 }}>
            <p className="nz-note">{m.game.oracle.faceCousin}</p>
            <div className="nz-row">
              <a href={funAiUrl({ tool: "face-reading", locale })} className="nz-btn-primary">
                {m.game.oracle.ctaFace} <span aria-hidden>↗</span>
              </a>
              <Link href={href("/game/life")} className="nz-btn-ghost">
                {m.game.oracle.ctaLife}
              </Link>
            </div>
          </div>
        ) : null}
      </div>
      <div className="nz-row">
        <a href={links.jubuddyHome} target="_blank" rel="noopener noreferrer" className="nz-btn-ghost">
          {m.game.oracle.ctaJubuddy}
        </a>
        <a href={links.jubitHome} target="_blank" rel="noopener noreferrer" className="nz-btn-ghost">
          {m.game.oracle.ctaJubit}
        </a>
        <Link href={href("/game/post")} className="nz-btn-primary">
          {m.game.oracle.ctaPost}
        </Link>
      </div>
    </GameShell>
  );
}
