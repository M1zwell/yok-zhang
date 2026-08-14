"use client";

import { useEffect, useRef } from "react";

export function CursorGlow() {
  const coreRef = useRef<HTMLDivElement>(null);
  const bloomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const core = coreRef.current;
    const bloom = bloomRef.current;
    if (!core || !bloom) return;

    const fineMq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const hide = () => {
      core.style.display = "none";
      bloom.style.display = "none";
      document.body.classList.remove("has-cursor-glow");
    };

    if (!fineMq.matches || reduceMq.matches) {
      hide();
      return;
    }

    core.style.display = "";
    bloom.style.display = "";
    document.body.classList.add("has-cursor-glow");

    let cx = window.innerWidth / 2;
    let cy = window.innerHeight / 2;
    let bx = cx;
    let by = cy;
    let tx = cx;
    let ty = cy;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const tick = () => {
      cx += (tx - cx) * 0.35;
      cy += (ty - cy) * 0.35;
      bx += (tx - bx) * 0.12;
      by += (ty - by) * 0.12;
      core.style.transform = `translate(${cx}px, ${cy}px)`;
      bloom.style.transform = `translate(${bx}px, ${by}px)`;
      raf = requestAnimationFrame(tick);
    };

    const onVis = () => {
      const visible = document.visibilityState === "visible";
      core.style.opacity = visible ? "1" : "0";
      bloom.style.opacity = visible ? "1" : "0";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVis);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
      document.body.classList.remove("has-cursor-glow");
    };
  }, []);

  return (
    <>
      <div ref={bloomRef} className="cursor-glow cursor-glow-bloom hidden md:block" aria-hidden />
      <div ref={coreRef} className="cursor-glow cursor-glow-core hidden md:block" aria-hidden />
    </>
  );
}
