"use client";

import { useEffect, useRef } from "react";
import {
  atmosphereCanvas,
  defaultAtmosphere,
  isAtmosphere,
  type AtmosphereId,
} from "@/lib/atmosphere";

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

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
};

function readAtmosphere(): AtmosphereId {
  const raw = document.documentElement.dataset.atmosphere;
  return isAtmosphere(raw) ? raw : defaultAtmosphere;
}

export function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fineMq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const narrowMq = window.matchMedia("(max-width: 767px)");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    let running = true;
    let reduce = reduceMq.matches;
    let finePointer = fineMq.matches;
    let mobile = narrowMq.matches;
    let pointerX = 0.72;
    let pointerY = 0.46;
    let targetX = 0.72;
    let targetY = 0.46;
    let woke = false;

    let tint = atmosphereCanvas[readAtmosphere()];

    const planets: Body[] = [];
    const dust: Dust[] = [];
    const sparks: Spark[] = [];

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      planets.length = 0;
      dust.length = 0;
      sparks.length = 0;
      const cx = w * 0.72;
      const cy = h * 0.46;
      const { teal, magenta, purple, pink } = tint;
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
          speed: 0.0015,
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
          speed: 0.0022,
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
          speed: 0.0012,
          angle: 5.1,
          color: teal,
          ring: false,
          moons: [],
        },
        {
          x: cx + 90,
          y: cy + 70,
          r: 4,
          orbit: 198,
          speed: 0.0007,
          angle: 0.6,
          color: pink,
          ring: false,
          moons: [],
        },
      );
      const dustCount = mobile ? 90 : 230;
      for (let i = 0; i < dustCount; i++) {
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

    const drawPlanet = (p: Body, t: number, ox: number, oy: number) => {
      let x = p.x;
      let y = p.y;
      if (p.orbit > 0) {
        x = ox + Math.cos(p.angle + t * p.speed * 60) * p.orbit;
        y = oy + Math.sin(p.angle + t * p.speed * 60) * p.orbit * 0.55;
      } else {
        x = ox;
        y = oy;
      }
      const { teal, magenta } = tint;
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
      if (finePointer && !reduce && !mobile) {
        pointerX += (targetX - pointerX) * 0.045;
        pointerY += (targetY - pointerY) * 0.045;
      }
      const ox = w * pointerX;
      const oy = h * pointerY;
      const { teal, magenta, purple, hazeDeep } = tint;

      const haze = ctx.createRadialGradient(ox, oy, 16, ox, oy, Math.max(w, h) * 0.62);
      haze.addColorStop(0, hazeDeep);
      haze.addColorStop(0.26, `${magenta}1c`);
      haze.addColorStop(0.48, `${teal}21`);
      haze.addColorStop(0.7, `${purple}12`);
      haze.addColorStop(1, "rgba(10,10,10,0)");
      ctx.fillStyle = haze;
      ctx.fillRect(0, 0, w, h);
      const haze2 = ctx.createRadialGradient(w * 0.18, h * 0.78, 8, w * 0.18, h * 0.78, Math.max(w, h) * 0.38);
      haze2.addColorStop(0, `${magenta}14`);
      haze2.addColorStop(0.45, `${purple}0d`);
      haze2.addColorStop(1, "rgba(10,10,10,0)");
      ctx.fillStyle = haze2;
      ctx.fillRect(0, 0, w, h);

      for (const d of dust) {
        if (finePointer && !reduce && !mobile && woke) {
          const dx = ox - d.x;
          const dy = oy - d.y;
          const dist = Math.hypot(dx, dy) || 1;
          d.vx += (dx / dist) * 0.004;
          d.vy += (dy / dist) * 0.003;
          d.vx *= 0.985;
          d.vy *= 0.985;
        }
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

      if (!mobile && !reduce && Math.random() < 0.016 && sparks.length < 4) {
        sparks.push({
          x: Math.random() * w * 0.6,
          y: Math.random() * h * 0.4,
          vx: 2.4 + Math.random() * 1.8,
          vy: 0.9 + Math.random() * 0.8,
          life: 1,
        });
      }
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life -= 0.018;
        ctx.strokeStyle = s.life > 0.5 ? magenta : teal;
        ctx.globalAlpha = Math.max(s.life, 0);
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * 6, s.y - s.vy * 6);
        ctx.stroke();
        ctx.globalAlpha = 1;
        if (s.life <= 0 || s.x > w || s.y > h) sparks.splice(i, 1);
      }
      for (const p of planets) drawPlanet(p, t / 1000, ox, oy);
    };

    const loop = (now: number) => {
      if (running) draw(now);
      raf = requestAnimationFrame(loop);
    };

    const syncRunning = () => {
      running = document.visibilityState === "visible" && !reduce;
    };

    const onPointer = (e: PointerEvent) => {
      if (!finePointer || reduce || mobile) return;
      targetX = Math.min(0.92, Math.max(0.35, e.clientX / Math.max(w, 1)));
      targetY = Math.min(0.72, Math.max(0.22, e.clientY / Math.max(h, 1)));
      if (!woke) {
        woke = true;
        document.documentElement.dataset.fieldAwake = "1";
      }
    };

    const onMq = () => {
      reduce = reduceMq.matches;
      finePointer = fineMq.matches;
      mobile = narrowMq.matches;
      syncRunning();
      resize();
      seed();
      if (reduce || mobile) {
        pointerX = 0.72;
        pointerY = 0.46;
        targetX = 0.72;
        targetY = 0.46;
        document.documentElement.dataset.fieldAwake = "";
        woke = false;
      }
      if (reduce) draw(0);
    };

    const onAtmosphere = () => {
      tint = atmosphereCanvas[readAtmosphere()];
      seed();
      if (reduce) draw(0);
    };

    resize();
    seed();
    syncRunning();
    if (reduce) {
      draw(0);
    } else {
      raf = requestAnimationFrame(loop);
    }

    const onResize = () => {
      resize();
      seed();
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", syncRunning);
    reduceMq.addEventListener("change", onMq);
    fineMq.addEventListener("change", onMq);
    narrowMq.addEventListener("change", onMq);
    window.addEventListener("yok:atmosphere", onAtmosphere);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", syncRunning);
      reduceMq.removeEventListener("change", onMq);
      fineMq.removeEventListener("change", onMq);
      narrowMq.removeEventListener("change", onMq);
      window.removeEventListener("yok:atmosphere", onAtmosphere);
      document.documentElement.dataset.fieldAwake = "";
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="site-atmosphere pointer-events-none fixed inset-0 z-0 h-full w-full"
      aria-hidden
    />
  );
}
