"use client";

import { useEffect, useState } from "react";
import { PretextLines } from "@/app/components/PretextLines";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/messages";
import { links } from "@/lib/site";

const HOLD_MS = 7200;

const reels = [
  { id: "worlds" as const, href: links.gghereWorlds, path: "gghere.com/worlds", tone: "worlds" },
  { id: "planet" as const, href: links.jubuddyPlanet, path: "jubuddy.com/planet", tone: "planet" },
  { id: "dseek" as const, href: links.dseekHome, path: "dseek.ai", tone: "dseek" },
  { id: "jubit" as const, href: links.jubitHome, path: "jubit.ai", tone: "jubit" },
];

export function ProductIntro({
  locale = "en",
  lead = false,
}: {
  locale?: Locale;
  lead?: boolean;
}) {
  const m = t(locale);
  const [index, setIndex] = useState(0);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduce) return;
    const timer = window.setInterval(() => {
      setIndex((n) => (n + 1) % reels.length);
    }, HOLD_MS);
    return () => window.clearInterval(timer);
  }, [reduce]);

  const active = reels[index] ?? reels[0];
  const copy = {
    worlds: { title: m.intro.worldsTitle, line: m.intro.worldsLine, lower: m.intro.worldsLower },
    planet: { title: m.intro.planetTitle, line: m.intro.planetLine, lower: m.intro.planetLower },
    dseek: { title: m.intro.dseekTitle, line: m.intro.dseekLine, lower: m.intro.dseekLower },
    jubit: { title: m.intro.jubitTitle, line: m.intro.jubitLine, lower: m.intro.jubitLower },
  }[active.id];

  return (
    <section className={lead ? "intro-wrap is-lead" : "intro-wrap"} aria-label={m.intro.kicker}>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="kicker">{m.intro.kicker}</p>
          <h2 className="mt-2 font-display text-2xl tracking-tight sm:text-3xl">{m.intro.title}</h2>
        </div>
        <p className="max-w-sm text-[12px] leading-relaxed text-muted">{m.intro.note}</p>
      </div>
      <div className={`intro-reel intro-tone-${active.tone}`} data-product={active.id}>
        <div className="intro-stage" aria-hidden>
          <div key={active.id} className={reduce ? "intro-ken is-still" : "intro-ken"} />
          <div className="intro-scan" />
          <div className="intro-grain" />
        </div>
        <div className="intro-lower">
          <p className="font-mono text-[10px] tracking-[0.18em] text-accent uppercase">{active.path}</p>
          <PretextLines
            key={`${active.id}-title-${locale}`}
            text={copy.title}
            as="h3"
            locale={locale}
            className="mt-2 font-display text-[clamp(1.6rem,4vw,2.6rem)] leading-[0.95] tracking-tight text-fg"
          />
          <PretextLines
            key={`${active.id}-line-${locale}`}
            text={copy.line}
            locale={locale}
            className="mt-3 max-w-xl text-sm leading-relaxed text-secondary"
          />
          <PretextLines
            key={`${active.id}-lower-${locale}`}
            text={copy.lower}
            locale={locale}
            className="mt-2 max-w-lg text-[12px] leading-relaxed text-muted"
          />
          <a
            href={active.href}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary mt-5"
          >
            {m.cta.openLive} <span aria-hidden>↗</span>
          </a>
        </div>
        <div className="intro-progress" aria-hidden>
          <span
            key={active.id}
            className={reduce ? "intro-bar is-still" : "intro-bar"}
            style={{ animationDuration: `${HOLD_MS}ms` }}
          />
        </div>
      </div>
      <div role="tablist" aria-label={m.intro.title} className="mt-4 flex flex-wrap gap-2">
        {reels.map((reel, i) => {
          const on = i === index;
          const label = {
            worlds: m.intro.worldsTitle,
            planet: m.intro.planetTitle,
            dseek: m.intro.dseekTitle,
            jubit: m.intro.jubitTitle,
          }[reel.id];
          return (
            <button
              key={reel.id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setIndex(i)}
              className={on ? "tag-chip is-on" : "tag-chip"}
            >
              {label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
