"use client";

import { useEffect, useRef } from "react";

type Body = {
  x: number;
  y: number;
  r: number;
  orbit: number;
  speed: number;
  angle: number;
  color: string;
  ring: boolean;
  moons: { dist: number; size: number; angle: number; speed: number; color: string }[];
};

type Dust = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
  color: string;
};

export function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    let running = true;

    const teal = "#14B8A6";
    const magenta = "#FF4778";
    const purple = "#8B7CFF";
    const pink = "#EC4899";

    const planets: Body[] = [];
    const dust: Dust[] = [];

    const resize = () => {
      const parent = canvas.parentElement;
      w = parent?.clientWidth ?? window.innerWidth;
      h = parent?.clientHeight ?? 520;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      planets.length = 0;
      dust.length = 0;
      const cx = w * 0.72;
      const cy = h * 0.46;
      const palette = [teal, magenta, purple, pink];
      planets.push(
        {
          x: cx,
          y: cy,
          r: 18,
          orbit: 0,
          speed: 0,
          angle: 0,
          color: teal,
          ring: true,
          moons: [
            { dist: 32, size: 3.2, angle: 0.4, speed: 0.004, color: magenta },
            { dist: 46, size: 2.1, angle: 2.1, speed: 0.0026, color: purple },
          ],
        },
        {
          x: cx - 160,
          y: cy + 40,
          r: 9,
          orbit: 118,
          speed: 0.0011,
          angle: 1.2,
          color: magenta,
          ring: false,
          moons: [{ dist: 16, size: 1.8, angle: 0, speed: 0.008, color: teal }],
        },
        {
          x: cx + 40,
          y: cy - 90,
          r: 7,
          orbit: 86,
          speed: 0.0017,
          angle: 3.4,
          color: purple,
          ring: true,
          moons: [],
        },
        {
          x: cx - 40,
          y: cy + 110,
          r: 5,
          orbit: 154,
          speed: 0.0008,
          angle: 5.1,
          color: teal,
          ring: false,
          moons: [],
        },
      );
      for (let i = 0; i < 70; i++) {
        dust.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.08,
          r: Math.random() * 1.4 + 0.3,
          a: Math.random() * 0.45 + 0.08,
          color: palette[i % palette.length],
        });
      }
    };

    const drawPlanet = (p: Body, t: number) => {
      let x = p.x;
      let y = p.y;
      if (p.orbit > 0) {
        const ox = w * 0.72;
        const oy = h * 0.46;
        x = ox + Math.cos(p.angle + t * p.speed * 60) * p.orbit;
        y = oy + Math.sin(p.angle + t * p.speed * 60) * p.orbit * 0.55;
      }
      ctx.beginPath();
      ctx.arc(x, y, p.r + 10, 0, Math.PI * 2);
      ctx.fillStyle = p.color === teal ? "rgba(20,184,166,0.08)" : "rgba(255,71,120,0.07)";
      ctx.fill();
      if (p.ring) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(-0.4);
        ctx.scale(1, 0.38);
        ctx.beginPath();
        ctx.arc(0, 0, p.r + 8, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(199,162,91,0.35)";
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore();
      }
      const g = ctx.createRadialGradient(x - p.r * 0.3, y - p.r * 0.3, 1, x, y, p.r);
      g.addColorStop(0, "#FAFAFA");
      g.addColorStop(0.35, p.color);
      g.addColorStop(1, "#0B2422");
      ctx.beginPath();
      ctx.arc(x, y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      for (const m of p.moons) {
        const mx = x + Math.cos(m.angle + t * m.speed * 60) * m.dist;
        const my = y + Math.sin(m.angle + t * m.speed * 60) * m.dist * 0.6;
        ctx.beginPath();
        ctx.arc(mx, my, m.size, 0, Math.PI * 2);
        ctx.fillStyle = m.color;
        ctx.globalAlpha = 0.9;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const haze = ctx.createRadialGradient(w * 0.7, h * 0.45, 20, w * 0.7, h * 0.45, Math.max(w, h) * 0.55);
      haze.addColorStop(0, "rgba(11,36,34,0.45)");
      haze.addColorStop(0.45, "rgba(20,184,166,0.05)");
      haze.addColorStop(1, "rgba(10,10,10,0)");
      ctx.fillStyle = haze;
      ctx.fillRect(0, 0, w, h);

      for (const d of dust) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0) d.x = w;
        if (d.x > w) d.x = 0;
        if (d.y < 0) d.y = h;
        if (d.y > h) d.y = 0;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.globalAlpha = d.a;
        ctx.fillStyle = d.color;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      for (const p of planets) drawPlanet(p, t / 1000);
    };

    const loop = (now: number) => {
      if (running) draw(now);
      raf = requestAnimationFrame(loop);
    };

    const onVis = () => {
      running = document.visibilityState === "visible" && !reduce;
    };

    resize();
    seed();
    if (reduce) {
      draw(0);
    } else {
      raf = requestAnimationFrame(loop);
    }
    window.addEventListener("resize", () => {
      resize();
      seed();
    });
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
}
