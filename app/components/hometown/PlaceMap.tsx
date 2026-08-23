"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/messages";
import { peopleAtPlace, personName, places, textFor } from "@/lib/hometown/tree";
import type { Place } from "@/lib/hometown/types";

function project(place: Place): { x: number; y: number } {
  const minLng = 116.14;
  const maxLng = 116.19;
  const minLat = 23.265;
  const maxLat = 23.35;
  const x = 24 + ((place.lng - minLng) / (maxLng - minLng)) * 272;
  const y = 24 + ((maxLat - place.lat) / (maxLat - minLat)) * 232;
  return { x, y };
}

export function PlaceMap({
  locale,
  onPerson,
}: {
  locale: Locale;
  onPerson: (id: string) => void;
}) {
  const m = t(locale);
  const [active, setActive] = useState("xiulong");
  const home = places.filter((p) => p.cluster === "puning");
  const away = places.filter((p) => p.cluster === "away");
  const current = places.find((p) => p.id === active) ?? home[0];
  const here = useMemo(() => (current ? peopleAtPlace(current.id) : []), [current]);

  return (
    <div>
      <h2>{m.hometown.mapTitle}</h2>
      <p className="ht-quiet" style={{ marginTop: 8 }}>
        {m.hometown.mapLead}
      </p>
      <div className="ht-map">
        <svg viewBox="0 0 320 280" role="img" aria-label={m.hometown.mapTitle}>
          <rect x="1" y="1" width="318" height="278" rx="16" fill="transparent" stroke="currentColor" opacity="0.12" />
          {home.map((place) => {
            const { x, y } = project(place);
            const on = place.id === active;
            return (
              <g
                key={place.id}
                className={`ht-pin${place.kind === "admin" ? " is-admin" : ""}${on ? " is-on" : ""}`}
                transform={`translate(${x} ${y})`}
                onClick={() => setActive(place.id)}
              >
                <circle r={on ? 7 : 5} />
                <text x="10" y="4" fontSize="10" fill="currentColor">
                  {textFor(locale, place.name)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="ht-away">
        {away.map((place) => (
          <button
            key={place.id}
            type="button"
            className={`ht-chip${place.id === active ? " is-on" : ""}`}
            onClick={() => setActive(place.id)}
          >
            {textFor(locale, place.name)}
          </button>
        ))}
      </div>
      {current ? (
        <div style={{ marginTop: "0.9rem" }}>
          <p className="ht-quiet">{textFor(locale, current.region)}</p>
          <ul style={{ marginTop: 8, display: "grid", gap: 6 }}>
            {here.map((person) => (
              <li key={person.id}>
                <button type="button" className="ht-chip" onClick={() => onPerson(person.id)}>
                  {personName(locale, person)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
