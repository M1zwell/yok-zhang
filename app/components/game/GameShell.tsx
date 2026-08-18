"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { localizeHref, type Locale } from "@/lib/i18n";
import { t } from "@/lib/messages";

export function GameShell({
  locale,
  kicker,
  title,
  lead,
  children,
}: {
  locale: Locale;
  kicker?: string;
  title: string;
  lead?: string;
  children: ReactNode;
}) {
  const m = t(locale);
  return (
    <main>
      <section className="page-x mx-auto max-w-6xl pt-14 pb-16 sm:pt-20">
        <Link
          href={localizeHref("/game", locale)}
          className="text-sm text-muted transition-colors hover:text-accent"
        >
          {m.game.hubBack}
        </Link>
        {kicker ? <p className="kicker mt-5">{kicker}</p> : null}
        <h1 className="mt-4 font-display text-[clamp(2.2rem,6vw,4rem)] leading-[0.95] tracking-tight">
          {title}
        </h1>
        {lead ? <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted">{lead}</p> : null}
        <div className="mt-10">{children}</div>
        <p className="mt-12 max-w-xl text-xs leading-relaxed text-muted">{m.game.disclaimer}</p>
      </section>
    </main>
  );
}
