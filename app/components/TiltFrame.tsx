"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function TiltFrame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceRef = useRef(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)");
    const sync = () => {
      reduceRef.current = motion.matches || coarse.matches || window.innerWidth < 768;
    };
    sync();
    motion.addEventListener("change", sync);
    coarse.addEventListener("change", sync);
    window.addEventListener("resize", sync);
    return () => {
      motion.removeEventListener("change", sync);
      coarse.removeEventListener("change", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  const reset = () => {
    const el = ref.current;
    if (el) el.style.transform = "perspective(1100px) rotateX(0deg) rotateY(0deg)";
  };

  return (
    <div className="tilt-stage">
      <div
        ref={ref}
        className={`tilt-frame ${className}`}
        onMouseMove={(e) => {
          if (reduceRef.current) return;
          const el = ref.current;
          if (!el) return;
          const box = el.getBoundingClientRect();
          const px = (e.clientX - box.left) / box.width - 0.5;
          const py = (e.clientY - box.top) / box.height - 0.5;
          el.style.transform = `perspective(1100px) rotateY(${px * 5}deg) rotateX(${-py * 4}deg)`;
        }}
        onMouseLeave={reset}
      >
        {children}
      </div>
    </div>
  );
}
