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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {toys.map((toy) => (
          <a
            key={toy.tool}
            href={funAiUrl({ tool: toy.tool, locale })}
            className="group flex min-h-[16rem] flex-col rounded-[20px] border border-hair bg-deep/60 p-5 transition-colors hover:border-accent/40 sm:p-6"
          >
            <p className="kicker">{life[toy.kicker]}</p>
            <h2 className="mt-3 font-display text-3xl tracking-tight transition-colors group-hover:text-accent">
              {life[toy.title]} <span aria-hidden>↗</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{life[toy.lead]}</p>
            {toy.chips ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {toy.chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-hair px-3 py-1 text-xs leading-6 text-fg"
                  >
                    {life[chip]}
                  </span>
                ))}
              </div>
            ) : null}
            <p className="mt-4 text-xs leading-relaxed text-muted">{life.disclaimer}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted">{life.quota}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted">{life.camera}</p>
            <p className="mt-auto pt-6 text-sm text-accent">
              {life.play}
            </p>
          </a>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap gap-2">
        <Link href={href("/game/waiting")} className="btn btn-ghost min-h-11">
          {life.ctaWaiting}
        </Link>
        <Link href={href("/game/oracle")} className="btn btn-ghost min-h-11">
          {life.ctaOracle}
        </Link>
        <Link href={href("/game/post")} className="btn btn-primary min-h-11">
          {life.ctaPost}
        </Link>
      </div>
    </GameShell>
  );
}
