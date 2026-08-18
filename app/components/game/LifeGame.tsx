"use client";

import Link from "next/link";
import { GameShell } from "@/app/components/game/GameShell";
import { funAiUrl, type FunAiTool } from "@/lib/game/life";
import { localizeHref, type Locale } from "@/lib/i18n";
import { t } from "@/lib/messages";

type LifeCopy = ReturnType<typeof t>["game"]["life"];

type Toy = {
  tool: FunAiTool;
  title: keyof LifeCopy;
  kicker: keyof LifeCopy;
  lead: keyof LifeCopy;
  chips?: (keyof LifeCopy)[];
};

const toys: Toy[] = [
  {
    tool: "lie-detector",
    title: "lieTitle",
    kicker: "lieKicker",
    lead: "lieLead",
    chips: ["lieChip1", "lieChip2", "lieChip3"],
  },
  {
    tool: "face-reading",
    title: "faceTitle",
    kicker: "faceKicker",
    lead: "faceLead",
  },
  {
    tool: "compare",
    title: "compareTitle",
    kicker: "compareKicker",
    lead: "compareLead",
  },
];

export function LifeGame({ locale = "en" }: { locale?: Locale }) {
  const m = t(locale);
  const life = m.game.life;
  const href = (path: string) => localizeHref(path, locale);

  return (
    <GameShell locale={locale} kicker={life.kicker} title={life.title} lead={life.lead}>
      <div className="nz-grid">
        {toys.map((toy) => (
          <a key={toy.tool} href={funAiUrl({ tool: toy.tool, locale })} className="nz-card">
            <p className="nz-kicker is-mud">{life[toy.kicker]}</p>
            <h2>
              {life[toy.title]} <span aria-hidden>↗</span>
            </h2>
            <p className="nz-note">{life[toy.lead]}</p>
            {toy.chips ? (
              <div style={{ marginTop: 14 }}>
                {toy.chips.map((chip) => (
                  <span key={chip} className="nz-chip">
                    {life[chip]}
                  </span>
                ))}
              </div>
            ) : null}
            <p className="nz-caption">{life.disclaimer}</p>
            <p className="nz-note">{life.quota}</p>
            <p className="nz-note">{life.camera}</p>
            <p className="nz-play">{life.play}</p>
          </a>
        ))}
      </div>
      <div className="nz-row">
        <Link href={href("/game/waiting")} className="nz-btn-ghost">
          {life.ctaWaiting}
        </Link>
        <Link href={href("/game/oracle")} className="nz-btn-ghost">
          {life.ctaOracle}
        </Link>
        <Link href={href("/game/post")} className="nz-btn-primary">
          {life.ctaPost}
        </Link>
      </div>
    </GameShell>
  );
}
