"use client";

import { useCallback, useEffect, useRef, useState, type TouchEvent } from "react";
import Link from "next/link";
import { GameShell } from "@/app/components/game/GameShell";
import { localizeHref, type Locale } from "@/lib/i18n";
import { t } from "@/lib/messages";
import { funAiUrl } from "@/lib/game/life";
import { links } from "@/lib/site";

type Candle = { o: number; c: number; h: number; l: number };

function twitch(prev: Candle[]): Candle[] {
  const last = prev[prev.length - 1]?.c ?? 50;
  const drift = (Math.random() - 0.48) * 8;
  const o = last;
  const c = Math.max(8, Math.min(92, last + drift));
  const h = Math.max(o, c) + Math.random() * 4;
  const l = Math.min(o, c) - Math.random() * 4;
  const next = [...prev, { o, c, h, l }];
  return next.slice(-48);
}

export function WaitingGame({ locale = "en" }: { locale?: Locale }) {
  const m = t(locale);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const candlesRef = useRef<Candle[]>([{ o: 50, c: 52, h: 56, l: 47 }]);
  const rafRef = useRef(0);
  const lastRef = useRef(0);
  const pullStart = useRef<number | null>(null);
  const [pulls, setPulls] = useState(0);
  const [pullDy, setPullDy] = useState(0);
  const revealed = pulls >= 4;
  const href = (p: string) => localizeHref(p, locale);

  const refresh = useCallback(() => {
    candlesRef.current = twitch(candlesRef.current);
    setPulls((n) => n + 1);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "r" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const tag = (e.target as HTMLElement | null)?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        e.preventDefault();
        refresh();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [refresh]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = (ts: number) => {
      rafRef.current = requestAnimationFrame(draw);
      if (document.hidden) return;
      if (ts - lastRef.current < 1000 / 24) return;
      lastRef.current = ts;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#161616";
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(138,132,120,0.18)";
      ctx.lineWidth = 1;
      for (let y = 16; y < h; y += 22) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      const bars = candlesRef.current;
      const gap = w / Math.max(bars.length, 12);
      bars.forEach((bar, i) => {
        const x = 8 + i * gap;
        const yO = h - (bar.o / 100) * (h - 16);
        const yC = h - (bar.c / 100) * (h - 16);
        const yH = h - (bar.h / 100) * (h - 16);
        const yL = h - (bar.l / 100) * (h - 16);
        const up = bar.c >= bar.o;
        ctx.strokeStyle = up ? "#14b8a6" : "#8a8478";
        ctx.fillStyle = up ? "rgba(20,184,166,0.35)" : "rgba(138,132,120,0.28)";
        ctx.beginPath();
        ctx.moveTo(x + 4, yH);
        ctx.lineTo(x + 4, yL);
        ctx.stroke();
        const top = Math.min(yO, yC);
        const bh = Math.max(2, Math.abs(yC - yO));
        ctx.fillRect(x, top, 8, bh);
      });
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const onTouchStart = (e: TouchEvent) => {
    pullStart.current = e.touches[0]?.clientY ?? null;
  };
  const onTouchMove = (e: TouchEvent) => {
    if (pullStart.current == null) return;
    const dy = (e.touches[0]?.clientY ?? 0) - pullStart.current;
    if (dy > 0) setPullDy(Math.min(dy, 96));
  };
  const onTouchEnd = () => {
    if (pullDy > 56) refresh();
    setPullDy(0);
    pullStart.current = null;
  };

  return (
    <GameShell locale={locale} kicker={m.game.waiting.kicker} title={m.game.waiting.title} lead={m.game.waiting.lead}>
      <div
        className="overflow-hidden rounded-[20px] border border-hair bg-[#121212]"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{ transform: pullDy ? `translateY(${pullDy * 0.25}px)` : undefined }}
      >
        <div className="relative px-5 pt-8 pb-4 sm:px-8">
          <svg viewBox="0 0 220 160" className="mx-auto h-40 w-full max-w-sm text-[#5c5850]" aria-hidden>
            <rect x="0" y="120" width="220" height="40" fill="#1a1a1a" />
            <path d="M108 128 L112 48 L116 128 Z" fill="#3a3834" />
            <path d="M112 72 L78 96" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M112 64 L148 88" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M112 90 L92 118" stroke="currentColor" strokeWidth="1.6" fill="none" />
            <path d="M112 84 L136 114" stroke="currentColor" strokeWidth="1.6" fill="none" />
            <circle cx="112" cy="46" r="3" fill="#4a4740" />
          </svg>
          <canvas ref={canvasRef} className="mt-2 h-36 w-full" />
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button type="button" onClick={refresh} className="btn btn-primary min-h-11 px-5">
              {m.game.waiting.refresh}
            </button>
            <span className="font-mono text-[11px] text-muted">
              {pulls} {m.game.waiting.pulls}
            </span>
          </div>
          <p className="mt-3 text-xs text-muted">{m.game.waiting.hint}</p>
          {revealed ? (
            <>
              <p className="mt-6 font-display text-xl leading-snug text-fg sm:text-2xl">{m.game.waiting.beckett}</p>
              <p className="mt-4 text-sm leading-relaxed text-muted">{m.game.waiting.stillNobody}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a href={funAiUrl({ tool: "face-reading", locale })} className="btn btn-primary min-h-11 px-5">
                  {m.game.waiting.ctaFace} <span aria-hidden>↗</span>
                </a>
                <Link href={href("/game/life")} className="btn btn-ghost min-h-11 px-5">
                  {m.game.waiting.ctaLife}
                </Link>
              </div>
            </>
          ) : null}
        </div>
      </div>
      <div className="mt-8 flex flex-wrap gap-2">
        <Link href={href("/game/oracle")} className="btn btn-primary">
          {m.game.waiting.ctaOracle}
        </Link>
        <Link href={href("/game/post")} className="btn btn-ghost">
          {m.game.waiting.ctaPost}
        </Link>
        <a href={links.gghereHk} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
          {m.game.walkBelt} <span aria-hidden>↗</span>
        </a>
      </div>
    </GameShell>
  );
}
