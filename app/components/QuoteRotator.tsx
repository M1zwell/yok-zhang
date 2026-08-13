"use client";

import { useEffect, useState } from "react";
import { quotes } from "@/lib/site";

export function QuoteRotator() {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % quotes.length), 7000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <blockquote className="max-w-2xl font-display text-[clamp(1.15rem,2.4vw,1.65rem)] leading-snug text-secondary">
      <span className="text-spark-purple" aria-hidden>
        “
      </span>
      {quotes[i]}
      <span className="text-spark-purple" aria-hidden>
        ”
      </span>
    </blockquote>
  );
}
