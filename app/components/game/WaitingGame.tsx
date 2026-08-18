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
  const pullDyRef = useRef(0);
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
      if (document.hidden) {
        rafRef.current = 0;
        return;
      }
      rafRef.current = requestAnimationFrame(draw);
      if (ts - lastRef.current < 1000 / 12) return;
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
      ctx.fillStyle = "#f0e6d4";
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(41,35,33,0.14)";
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
        ctx.strokeStyle = up ? "#5E9766" : "#E6534F";
        ctx.fillStyle = up ? "#5E9766" : "#E6534F";
        ctx.beginPath();
        ctx.moveTo(x + 4, yH);
        ctx.lineTo(x + 4, yL);
        ctx.stroke();
        const top = Math.min(yO, yC);
        const bh = Math.max(2, Math.abs(yC - yO));
        ctx.fillRect(x, top, 8, bh);
      });
    };
    const onVis = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
        return;
      }
      if (!rafRef.current) {
        lastRef.current = 0;
        rafRef.current = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const onTouchStart = (e: TouchEvent) => {
    pullStart.current = e.touches[0]?.clientY ?? null;
  };
  const onTouchMove = (e: TouchEvent) => {
    if (pullStart.current == null) return;
    const dy = (e.touches[0]?.clientY ?? 0) - pullStart.current;
    if (dy > 0) {
      const next = Math.min(dy, 96);
      pullDyRef.current = next;
      setPullDy(next);
    }
  };
  const onTouchEnd = () => {
    if (pullDyRef.current > 56) refresh();
    pullDyRef.current = 0;
    setPullDy(0);
    pullStart.current = null;
  };

  return (
    <GameShell locale={locale} kicker={m.game.waiting.kicker} title={m.game.waiting.title} lead={m.game.waiting.lead}>
      <div
        className="nz-card nz-wait"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{ transform: pullDy ? `translateY(${pullDy * 0.25}px) rotate(-1deg)` : undefined, overflow: "hidden" }}
      >
        <div className="nz-clip nz-clip-receipt" aria-hidden />
        <svg viewBox="0 0 220 160" style={{ display: "block", height: 160, width: "100%", maxWidth: 360, margin: "0 auto" }} aria-hidden>
          <rect x="0" y="120" width="220" height="40" fill="#a39a8e" />
          <path d="M108 128 L112 48 L116 128 Z" fill="#5c4f43" />
          <path d="M112 72 L78 96" stroke="#736A60" strokeWidth="2" fill="none" />
          <path d="M112 64 L148 88" stroke="#736A60" strokeWidth="2" fill="none" />
          <path d="M112 90 L92 118" stroke="#736A60" strokeWidth="1.6" fill="none" />
          <path d="M112 84 L136 114" stroke="#736A60" strokeWidth="1.6" fill="none" />
          <circle cx="112" cy="46" r="3" fill="#292321" />
        </svg>
        <canvas ref={canvasRef} style={{ marginTop: 8, height: 144, width: "calc(100% + 28px)", marginRight: -24 }} />
        <div className="nz-row" style={{ marginTop: 16 }}>
          <button type="button" onClick={refresh} className="nz-btn-primary">
            {m.game.waiting.refresh}
          </button>
          <span className="nz-mono">
            {pulls} {m.game.waiting.pulls}
          </span>
        </div>
        <p className="nz-note">{m.game.waiting.hint}</p>
        {revealed ? (
          <>
            <p className="nz-lead" style={{ fontFamily: "var(--nz-font-display), serif", fontSize: "1.35rem" }}>
              {m.game.waiting.beckett}
            </p>
            <p className="nz-note">{m.game.waiting.stillNobody}</p>
            <div className="nz-row">
              <a href={funAiUrl({ tool: "face-reading", locale })} className="nz-btn-primary">
                {m.game.waiting.ctaFace} <span aria-hidden>↗</span>
              </a>
              <Link href={href("/game/life")} className="nz-btn-ghost">
                {m.game.waiting.ctaLife}
              </Link>
            </div>
          </>
        ) : null}
      </div>
      <div className="nz-row">
        <Link href={href("/game/oracle")} className="nz-btn-primary">
          {m.game.waiting.ctaOracle}
        </Link>
        <Link href={href("/game/post")} className="nz-btn-ghost">
          {m.game.waiting.ctaPost}
        </Link>
        <a href={links.gghereHk} target="_blank" rel="noopener noreferrer" className="nz-btn-ghost">
          {m.game.walkBelt} <span aria-hidden>↗</span>
        </a>
      </div>
    </GameShell>
  );
}
