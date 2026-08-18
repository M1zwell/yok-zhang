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
      <section className="nz-page nz-hub">
        <p className="nz-kicker">{m.game.kicker}</p>
        <h1 className="nz-title">{m.game.title}</h1>
        <div className="nz-clip nz-clip-kline" aria-hidden>
          <svg viewBox="0 0 640 54" fill="none">
            <path
              d="M0 32 L48 30 L72 18 L96 40 L128 22 L160 28 L188 8 L220 36 L252 20 L284 44 L320 16 L356 34 L390 12 L428 38 L464 24 L500 42 L536 14 L580 30 L640 22"
              stroke="#292321"
              strokeWidth="1.6"
            />
            <path d="M188 8 L188 36" stroke="#E6534F" strokeWidth="2.2" />
            <path d="M320 16 L320 44" stroke="#5E9766" strokeWidth="2.2" />
            <rect x="180" y="14" width="16" height="16" fill="#E6534F" />
            <rect x="312" y="20" width="16" height="18" fill="#5E9766" />
            <path d="M500 22 L500 48" stroke="#E6534F" strokeWidth="1.8" />
            <rect x="494" y="28" width="12" height="12" fill="#E6534F" />
          </svg>
        </div>
        <p className="nz-lead">{m.game.subtitle}</p>
        <p className="nz-caption">{m.game.disclaimer}</p>
        <div className="nz-row">
          <a href={links.gghereHk} target="_blank" rel="noopener noreferrer" className="nz-btn-primary">
            {m.game.walkBelt} <span aria-hidden>↗</span>
          </a>
          <a href={links.jubuddyHome} target="_blank" rel="noopener noreferrer" className="nz-btn-ghost">
            {m.game.jubuddy}
          </a>
          <a href={links.jubitHome} target="_blank" rel="noopener noreferrer" className="nz-btn-ghost">
            {m.game.jubit}
            <span className="nz-mono"> · {m.game.jubitNote}</span>
          </a>
        </div>
        <div className="nz-grid">
          {cards.map((card) => (
            <Link key={card.href} href={href(card.href)} className="nz-card">
              <p className="nz-kicker is-mud">{m.game.play}</p>
              <h2>{m.game[card.titleKey]}</h2>
              <p className="nz-note">{m.game[card.noteKey]}</p>
              <p className="nz-play">
                {m.game.play} <span aria-hidden>→</span>
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
