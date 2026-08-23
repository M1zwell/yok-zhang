"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/messages";
import {
  book,
  brotherIds,
  centerId,
  getPerson,
  personName,
  textFor,
  unplacedPeople,
  zibeiIndex,
  zibeiLine,
} from "@/lib/hometown/tree";
import { CheckinBoard } from "./CheckinBoard";
import { HourglassTree } from "./HourglassTree";
import { PersonCard } from "./PersonCard";
import { PlaceMap } from "./PlaceMap";
import "./hometown.css";

export function HometownView({ locale }: { locale: Locale }) {
  const m = t(locale);
  const [focusId, setFocusId] = useState(centerId);
  const focus = getPerson(focusId);
  const zi = zibeiLine(locale);
  const on = zibeiIndex(focus?.zibei);
  const brothers = useMemo(
    () => brotherIds.map((id) => getPerson(id)).filter((p): p is NonNullable<typeof p> => Boolean(p)),
    [],
  );

  return (
    <main className="ht-page page-x mx-auto max-w-6xl">
      <header className="ht-hero">
        <p className="kicker">{m.hometown.kicker}</p>
        <h1>{m.hometown.title}</h1>
        <p className="ht-lead">{m.hometown.lead}</p>
        <p className="ht-fang">{textFor(locale, book.meta.fang)}</p>
        <p className="ht-source">{textFor(locale, book.meta.source)}</p>
        <div className="ht-zibei" aria-label={m.hometown.zibei}>
          {zi.map((ch, i) => (
            <span key={ch} className={i === on ? "is-on" : undefined}>
              {ch}
            </span>
          ))}
        </div>
        <div className="ht-jumps">
          {brothers.map((p) => (
            <button
              key={p.id}
              type="button"
              className={p.id === focusId ? "is-on" : undefined}
              onClick={() => setFocusId(p.id)}
            >
              {personName(locale, p)}
            </button>
          ))}
        </div>
      </header>

      <div className="ht-layout">
        <section className="ht-panel">
          <h2>{m.hometown.treeTitle}</h2>
          <HourglassTree locale={locale} focusId={focusId} onFocus={setFocusId} />
        </section>
        <aside className="ht-panel">
          <PersonCard locale={locale} id={focusId} />
        </aside>
      </div>

      <div className="ht-layout">
        <section className="ht-panel">
          <PlaceMap locale={locale} onPerson={setFocusId} />
        </section>
        <section className="ht-panel">
          <CheckinBoard locale={locale} focusId={focusId} />
        </section>
      </div>

      <p className="ht-note">
        {unplacedPeople.map((p) => textFor(locale, p.notes ?? { hans: personName(locale, p), hant: p.name.hant })).join(" ")}{" "}
        {m.hometown.liushaNote}
      </p>
    </main>
  );
}
