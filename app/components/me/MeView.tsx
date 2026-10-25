"use client";

import Image from "next/image";
import { Reveal } from "@/app/components/Reveal";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/messages";
import { liveProducts } from "@/lib/site";

/** Soft chips — only live:true products named in the persona brief. */
const CHIP_PATHS = new Set(["gghere.com", "jubuddy.com", "jubuddy.com/planet"]);

export function MeView({ locale = "en" }: { locale?: Locale }) {
  const m = t(locale).me;
  const chips = liveProducts.filter((p) => CHIP_PATHS.has(p.path));

  return (
    <main>
      <section className="page-x mx-auto max-w-5xl pt-14 pb-16 sm:pt-24 sm:pb-24">
        <Reveal>
          <div className="grid items-center gap-10 sm:grid-cols-[minmax(0,220px)_minmax(0,1fr)] sm:gap-14">
            <div className="relative mx-auto aspect-square w-[180px] shrink-0 overflow-hidden rounded-[28px] border border-hair bg-deep/40 sm:mx-0 sm:w-full">
              <Image
                src="/me/qwb-cute-toon-thumb-front.png"
                alt={m.heroAlt}
                fill
                priority
                sizes="220px"
                className="object-cover object-top"
              />
            </div>
            <div className="min-w-0">
              <p className="kicker">{m.kicker}</p>
              <h1 className="mt-4 font-display text-[clamp(2.2rem,6vw,3.75rem)] leading-[0.95] tracking-tight text-fg">
                {m.title}
              </h1>
              <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-fg">{m.line1}</p>
              <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted">{m.line2}</p>
            </div>
          </div>
        </Reveal>

        {chips.length > 0 ? (
          <Reveal delay={80}>
            <div className="mt-14 border-t border-hair pt-8">
              <p className="text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">
                {m.chipsLabel}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2.5">
                {chips.map((chip) => (
                  <li key={chip.href}>
                    <a
                      href={chip.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-hair bg-surface/60 px-3.5 py-1.5 font-mono text-[12px] text-secondary transition-colors hover:border-accent/40 hover:text-fg"
                    >
                      {chip.title}
                      <span aria-hidden className="text-accent">
                        ↗
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ) : null}
      </section>
    </main>
  );
}
