"use client";

import Link from "next/link";
import { localizeHref, type Locale } from "@/lib/i18n";
import { t } from "@/lib/messages";
import { links } from "@/lib/site";
import "./game-hub.css";

const cards = [
  { href: "/game/waiting", titleKey: "cardWaiting", noteKey: "cardWaitingNote" },
  { href: "/game/oracle", titleKey: "cardOracle", noteKey: "cardOracleNote" },
  { href: "/game/post", titleKey: "cardPost", noteKey: "cardPostNote" },
  { href: "/game/life", titleKey: "cardLife", noteKey: "cardLifeNote" },
  { href: "/game/doodle", titleKey: "cardDoodle", noteKey: "cardDoodleNote" },
] as const;

export function GameHub({ locale = "en" }: { locale?: Locale }) {
  const m = t(locale);
  const href = (p: string) => localizeHref(p, locale);

  return (
    <main>
      <section className="page-x mx-auto max-w-6xl pt-14 pb-10 sm:pt-24">
        <p className="kicker">{m.game.kicker}</p>
        <h1 className="mt-4 font-display text-[clamp(2.6rem,8vw,5rem)] leading-[0.92] tracking-tight">
          {m.game.title}
        </h1>
        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted">{m.game.subtitle}</p>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">{m.game.disclaimer}</p>
        <div className="mt-8 flex flex-wrap gap-2">
          <a href={links.gghereHk} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            {m.game.walkBelt} <span aria-hidden>↗</span>
          </a>
          <a href={links.jubuddyHome} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
            {m.game.jubuddy}
          </a>
          <a href={links.jubitHome} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
            {m.game.jubit}
            <span className="text-muted"> · {m.game.jubitNote}</span>
          </a>
        </div>
      </section>
      <section className="page-x mx-auto max-w-6xl pb-20">
        <div className="grid gap-4 md:grid-cols-2">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={href(card.href)}
              className="nz-card group rounded-[20px] p-5 transition-colors sm:p-6"
            >
              <p className="kicker">{m.game.play}</p>
              <h2 className="mt-3 font-display text-3xl tracking-tight transition-colors group-hover:text-accent">
                {m.game[card.titleKey]}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">{m.game[card.noteKey]}</p>
              <p className="mt-6 text-sm text-accent">
                {m.game.play} <span aria-hidden>→</span>
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
