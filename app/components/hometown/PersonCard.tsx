"use client";

import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/messages";
import {
  courtesyName,
  getPerson,
  getPlace,
  pairText,
  personName,
  textFor,
  zibeiIndex,
  zibeiLine,
} from "@/lib/hometown/tree";

export function PersonCard({ locale, id }: { locale: Locale; id: string }) {
  const m = t(locale);
  const person = getPerson(id);
  if (!person) return null;
  const zi = zibeiLine(locale);
  const idx = zibeiIndex(person.zibei);
  const places = (person.placeIds ?? [])
    .map((pid) => getPlace(pid))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const death = pairText(locale, person.deathNote);
  const origin = pairText(locale, person.origin);
  const married = pairText(locale, person.marriedOut);
  const notes = person.notes ? textFor(locale, person.notes) : undefined;
  const memory = person.living
    ? null
    : person.memory?.story
      ? textFor(locale, person.memory.story)
      : m.hometown.noMemory;

  return (
    <article className="ht-card">
      <p className="kicker">{m.hometown.cardKicker}</p>
      <h2>
        {personName(locale, person)}
        {courtesyName(locale, person) ? (
          <span className="ht-quiet"> · {courtesyName(locale, person)}</span>
        ) : null}
      </h2>
      <p className="ht-quiet">
        {m.hometown.gen.replace("{n}", String(person.generation))}
        {idx >= 0 ? ` · ${m.hometown.zibei} ${zi[idx]}` : ""}
        {person.living ? ` · ${m.hometown.living}` : ""}
      </p>
      <dl>
        {person.birth ? (
          <div>
            <dt>{m.hometown.born}</dt>
            <dd>{person.birth}</dd>
          </div>
        ) : null}
        {death ? (
          <div>
            <dt>{m.hometown.died}</dt>
            <dd>{death}</dd>
          </div>
        ) : null}
        {origin ? (
          <div>
            <dt>{m.hometown.from}</dt>
            <dd>{origin}</dd>
          </div>
        ) : null}
        {married ? (
          <div>
            <dt>{m.hometown.married}</dt>
            <dd>{married}</dd>
          </div>
        ) : null}
        {places.length ? (
          <div>
            <dt>{m.hometown.places}</dt>
            <dd>{places.map((p) => textFor(locale, p.name)).join(" · ")}</dd>
          </div>
        ) : null}
        {notes ? (
          <div>
            <dt>{m.hometown.note}</dt>
            <dd>{notes}</dd>
          </div>
        ) : null}
        <div>
          <dt>{m.hometown.memory}</dt>
          <dd>{person.living ? m.hometown.livingPrivate : memory}</dd>
        </div>
      </dl>
    </article>
  );
}
