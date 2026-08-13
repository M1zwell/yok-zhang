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
    reduceRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const reset = () => {
    const el = ref.current;
    if (el) el.style.transform = "perspective(1100px) rotateX(0deg) rotateY(0deg)";
  };

  return (
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
        el.style.transform = `perspective(1100px) rotateY(${px * 7}deg) rotateX(${-py * 6}deg)`;
      }}
      onMouseLeave={reset}
    >
      {children}
    </div>
  );
}
