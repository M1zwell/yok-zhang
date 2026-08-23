"use client";

import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/messages";
import {
  courtesyName,
  hourglass,
  people,
  personName,
  zibeiIndex,
  zibeiLine,
} from "@/lib/hometown/tree";
import type { Person } from "@/lib/hometown/types";

function Node({
  person,
  locale,
  focus,
  onFocus,
}: {
  person: Person;
  locale: Locale;
  focus: boolean;
  onFocus: (id: string) => void;
}) {
  const m = t(locale);
  const aka = courtesyName(locale, person);
  const zi = zibeiLine(locale);
  const idx = zibeiIndex(person.zibei);
  const genLabel = m.hometown.gen.replace("{n}", String(person.generation));
  const ziChar = idx >= 0 ? zi[idx] : person.zibei;
  return (
    <button
      type="button"
      className={`ht-node${focus ? " is-focus" : ""}${person.living ? " is-living" : ""}`}
      onClick={() => onFocus(person.id)}
      aria-pressed={focus}
    >
      <span className="ht-gen">
        {genLabel}
        {ziChar ? ` · ${ziChar}` : ""}
      </span>
      <span className="ht-name">{personName(locale, person)}</span>
      {aka ? <span className="ht-aka">{aka}</span> : null}
      {person.unnamedGroup ? <span className="ht-aka">{m.hometown.unnamed}</span> : null}
    </button>
  );
}

function Row({
  people,
  locale,
  focusId,
  onFocus,
}: {
  people: Person[];
  locale: Locale;
  focusId: string;
  onFocus: (id: string) => void;
}) {
  if (!people.length) return null;
  return (
    <div className="ht-row">
      {people.map((p) => (
        <Node key={p.id} person={p} locale={locale} focus={p.id === focusId} onFocus={onFocus} />
      ))}
    </div>
  );
}

export function HourglassTree({
  locale,
  focusId,
  onFocus,
}: {
  locale: Locale;
  focusId: string;
  onFocus: (id: string) => void;
}) {
  const glass = hourglass(focusId);
  if (!glass) return null;
  const sameGen = [glass.focus, ...glass.siblings].sort((a, b) => {
    const order = (id: string) => people.findIndex((p) => p.id === id);
    return order(a.id) - order(b.id);
  });
  const focusRow: Person[] = [];
  for (const person of sameGen) {
    focusRow.push(person);
    if (person.id === glass.focus.id) focusRow.push(...glass.spouses);
  }
  return (
    <div className="ht-tree" role="tree">
      {glass.ancestors.map((row, i) => (
        <div key={`a-${i}`}>
          <Row people={row} locale={locale} focusId={focusId} onFocus={onFocus} />
          <div className="ht-stem" aria-hidden />
        </div>
      ))}
      {glass.parents.length ? (
        <>
          <Row people={glass.parents} locale={locale} focusId={focusId} onFocus={onFocus} />
          <div className="ht-stem" aria-hidden />
        </>
      ) : null}
      <Row people={focusRow} locale={locale} focusId={focusId} onFocus={onFocus} />
      {glass.children.length ? (
        <>
          <div className="ht-stem" aria-hidden />
          <Row people={glass.children} locale={locale} focusId={focusId} onFocus={onFocus} />
        </>
      ) : null}
    </div>
  );
}
