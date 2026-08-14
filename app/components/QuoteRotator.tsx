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
    <blockquote className="quiet-quote max-w-2xl font-display text-[15px] leading-snug text-secondary sm:text-[16px]">
      {quotes[i]}
    </blockquote>
  );
}
