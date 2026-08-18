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
      <section className="nz-page">
        <Link href={localizeHref("/game", locale)} className="nz-back">
          {m.game.hubBack}
        </Link>
        {kicker ? <p className="nz-kicker" style={{ marginTop: 22 }}>{kicker}</p> : null}
        <h1 className="nz-title">{title}</h1>
        {lead ? <p className="nz-lead">{lead}</p> : null}
        <div style={{ marginTop: 40 }}>{children}</div>
        <p className="nz-caption">{m.game.disclaimer}</p>
      </section>
    </main>
  );
}
