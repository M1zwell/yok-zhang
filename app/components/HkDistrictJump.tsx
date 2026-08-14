"use client";

import { useMemo, useState } from "react";
import { districts, links } from "@/lib/site";

const regions = ["Hong Kong Island", "Kowloon", "New Territories", "Outlying"] as const;

export function HkDistrictJump() {
  const [q, setQ] = useState("");
  const [region, setRegion] = useState<string>("all");

  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    return districts.filter((d) => {
      const inRegion = region === "all" || d.region === region;
      return inRegion && (!query || d.name.toLowerCase().includes(query));
    });
  }, [q, region]);

  return (
    <div className="card relative overflow-hidden p-5 sm:p-6">
      <div className="pointer-events-none absolute -right-8 -top-10 size-40 rounded-full bg-accent/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-8 size-32 rounded-full bg-spark/10 blur-2xl" />
      <p className="kicker">Yok-Iso HK</p>
      <h2 className="mt-2 font-display text-2xl tracking-tight sm:text-3xl">District jump</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Stylized jump list into{" "}
        <a href={links.dseekHk} className="text-accent hover:text-accent-hover">
          dseek.ai/hk
        </a>
        . Names from the live map.
      </p>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Central, Mong Kok, Sha Tin…"
        className="relative mt-5 min-h-10 w-full rounded-xl border border-hair bg-bg px-3 py-2.5 text-sm text-fg outline-none placeholder:text-muted focus:border-accent/50"
        aria-label="Filter districts"
      />
      <div className="scroll-x relative mt-3 flex flex-nowrap gap-2 pb-1 md:flex-wrap">
        <button
          type="button"
          onClick={() => setRegion("all")}
          className={`tag-chip ${region === "all" ? "is-on" : ""}`}
        >
          All
        </button>
        {regions.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRegion(r)}
            className={`tag-chip ${region === r ? "is-on" : ""}`}
          >
            {r === "Hong Kong Island" ? "HK Island" : r}
          </button>
        ))}
      </div>
      <div className="relative mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {regions
          .filter((r) => region === "all" || region === r)
          .map((r) => {
            const items = list.filter((d) => d.region === r);
            if (items.length === 0) return null;
            return (
              <div key={r} className="rounded-xl border border-hair bg-bg/60 p-3">
                <p className="mb-2 text-[10px] font-semibold tracking-[0.16em] text-spark-purple uppercase">
                  {r}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {items.map((d) => (
                    <a
                      key={d.name}
                      href={d.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-10 items-center rounded-lg border border-hair px-2.5 py-1.5 text-[12px] text-secondary transition-colors hover:border-accent/50 hover:text-accent"
                    >
                      {d.name}
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
      </div>
      <a
        href={links.dseekHk}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-ghost relative mt-5"
      >
        Open full map ↗
      </a>
    </div>
  );
}
