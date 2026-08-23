"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/messages";
import {
  checkinConfigured,
  listCheckins,
  submitCheckin,
  type CheckinRow,
} from "@/lib/hometown/checkin";
import {
  CLAIMABLE_IDS,
  MAP_PLACE_IDS,
  ancestorsOf,
  book,
  childrenOf,
  descendantsOf,
  displayName,
  generationLabel,
  givenLine,
  parentsOf,
  peopleAtPlace,
  person,
  placesById,
  siblingsOf,
  spousesOf,
  yearText,
} from "@/lib/hometown/tree";
import { pickText } from "@/lib/hometown/types";
import "./hometown.css";

function Chip({
  id,
  locale,
  on,
  onPick,
}: {
  id: string;
  locale: Locale;
  on?: boolean;
  onPick: (id: string) => void;
}) {
  const p = person(id);
  if (!p) return null;
  const gen = generationLabel(p.generation, locale);
  const years = yearText(p);
  return (
    <button
      type="button"
      className={`ht-chip${on ? " is-on" : ""}${p.placeholder ? " is-dim" : ""}`}
      onClick={() => !p.placeholder && onPick(id)}
      disabled={!!p.placeholder}
    >
      <span className="ht-chip-gen">{gen}</span>
      <span className="ht-chip-name">{displayName(p, locale)}</span>
      {givenLine(p, locale) !== pickText(p.style ?? p.name, locale) ? (
        <span className="ht-chip-meta">{givenLine(p, locale)}</span>
      ) : null}
      {years ? <span className="ht-chip-meta">{years}</span> : null}
    </button>
  );
}

function Row({
  ids,
  locale,
  focusId,
  onPick,
}: {
  ids: string[];
  locale: Locale;
  focusId: string;
  onPick: (id: string) => void;
}) {
  if (ids.length === 0) return null;
  return (
    <div className="ht-row">
      {ids.map((id) => (
        <Chip key={id} id={id} locale={locale} on={id === focusId} onPick={onPick} />
      ))}
    </div>
  );
}

function Spine() {
  return <div className="ht-spine" aria-hidden="true" />;
}

function project(lat: number, lng: number) {
  const x = ((lng - 99) / (18)) * 100;
  const y = ((24.6 - lat) / (12.2)) * 100;
  return {
    x: Math.min(96, Math.max(4, x)),
    y: Math.min(94, Math.max(6, y)),
  };
}

export function HometownView({ locale = "en" }: { locale?: Locale }) {
  const m = t(locale).hometown;
  const [focusId, setFocusId] = useState(book.meta.defaultFocusId);
  const [placeId, setPlaceId] = useState<string | null>(null);
  const [rows, setRows] = useState<CheckinRow[]>([]);
  const [sending, setSending] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [form, setForm] = useState({
    displayName: "",
    personId: book.meta.defaultFocusId,
    wechat: "",
    phone: "",
    email: "",
    website: "",
  });

  const focus = person(focusId) ?? person(book.meta.defaultFocusId)!;
  const { father, mother } = parentsOf(focus);
  const spouses = spousesOf(focus);
  const kids = childrenOf(focus);
  const sibs = siblingsOf(focus);
  const ancestors = ancestorsOf(focus, 4);
  const up = (father ? ancestors.filter((p) => p.id !== father.id) : ancestors).slice().reverse();
  const down = descendantsOf(focus, 4);
  const wired = checkinConfigured();
  const place = placeId ? placesById[placeId] : undefined;
  const atPlace = placeId ? peopleAtPlace(placeId) : [];
  const zi = book.meta.generationNames;
  const ziStart = book.meta.generationNameStart;
  const focusZi = focus.generation != null ? focus.generation - ziStart : -1;

  const loadBoard = useCallback(async () => {
    if (!wired) return;
    try {
      setRows(await listCheckins());
    } catch {
      /* board is optional */
    }
  }, [wired]);

  useEffect(() => {
    void loadBoard();
  }, [loadBoard]);

  const claimOptions = useMemo(
    () => CLAIMABLE_IDS.map((id) => person(id)).filter((p): p is NonNullable<typeof p> => Boolean(p)),
    [],
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!wired) {
      setFlash(m.checkinNotWired);
      return;
    }
    setSending(true);
    setFlash(null);
    try {
      await submitCheckin({
        personId: form.personId,
        displayName: form.displayName,
        wechat: form.wechat,
        phone: form.phone,
        email: form.email,
        photo,
        website: form.website,
        locale,
      });
      setFlash(m.checkinOk);
      setForm((f) => ({ ...f, wechat: "", phone: "", email: "", website: "" }));
      setPhoto(null);
      await loadBoard();
    } catch {
      setFlash(m.checkinFail);
    } finally {
      setSending(false);
    }
  }

  const parentIds = [father?.id, mother?.id].filter((id): id is string => Boolean(id));

  return (
    <article className="page-x hometown mx-auto max-w-3xl py-14 sm:py-24">
      <p className="kicker">{m.kicker}</p>
      <h1 className="mt-4 font-display text-[clamp(2.1rem,6vw,3.6rem)] leading-[0.95] tracking-tight">
        {m.title}
      </h1>
      <p className="ht-lead">{m.lead}</p>
      <p className="ht-muted">{pickText(book.meta.caution, locale)}</p>
      <p className="ht-muted">{pickText(book.meta.source, locale)}</p>

      <section className="card mt-8 p-5 sm:p-6">
        <p className="kicker">{m.lineage}</p>
        <p className="mt-2">{pickText(book.meta.lineage, locale)}</p>
        <p className="kicker mt-5">{m.ziBei}</p>
        <p className="ht-zi mt-2">
          {zi.map((ch, i) => (
            <span key={ch} className={i === focusZi ? "is-on" : undefined}>
              {ch}
            </span>
          ))}
        </p>
        <p className="ht-muted mt-2">
          {zi.map((ch, i) => (
            <span key={ch}>
              {i > 0 ? " · " : null}
              {ch}
              <sup>{ziStart + i}</sup>
            </span>
          ))}
        </p>
        <p className="kicker mt-5">{m.brothers}</p>
        <div className="ht-row mt-2" style={{ justifyContent: "flex-start" }}>
          {book.meta.brotherIds.map((id) => (
            <Chip key={id} id={id} locale={locale} on={id === focusId} onPick={setFocusId} />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <p className="kicker">{m.hourglassHint}</p>
        <div className="ht-hourglass mt-4">
          {up.length > 0 ? (
            <>
              <p className="ht-band">{m.ancestors}</p>
              {up.map((p) => (
                <div key={p.id}>
                  <Chip id={p.id} locale={locale} on={p.id === focusId} onPick={setFocusId} />
                  <Spine />
                </div>
              ))}
            </>
          ) : null}

          {parentIds.length > 0 ? (
            <>
              <Row ids={parentIds} locale={locale} focusId={focusId} onPick={setFocusId} />
              <Spine />
            </>
          ) : null}

          <p className="ht-band">{m.focus}</p>
          <Chip id={focus.id} locale={locale} on onPick={setFocusId} />

          {spouses.length > 0 ? (
            <>
              <Spine />
              <p className="ht-band">{m.spouses}</p>
              <Row
                ids={spouses.map((p) => p.id)}
                locale={locale}
                focusId={focusId}
                onPick={setFocusId}
              />
            </>
          ) : null}

          {sibs.length > 0 ? (
            <>
              <p className="ht-band">{m.siblings}</p>
              <Row
                ids={sibs.map((p) => p.id)}
                locale={locale}
                focusId={focusId}
                onPick={setFocusId}
              />
            </>
          ) : null}

          {kids.length > 0 ? (
            <>
              <Spine />
              <p className="ht-band">{m.children}</p>
              <Row
                ids={kids.map((p) => p.id)}
                locale={locale}
                focusId={focusId}
                onPick={setFocusId}
              />
            </>
          ) : null}

          {down.length > 1 ? (
            <>
              <p className="ht-band">{m.descendants}</p>
              {down.slice(1).map((row, i) => (
                <div key={`d-${i}`}>
                  <Spine />
                  <Row
                    ids={row.map((p) => p.id)}
                    locale={locale}
                    focusId={focusId}
                    onPick={setFocusId}
                  />
                </div>
              ))}
            </>
          ) : null}
        </div>

        {focus.notes ? <p className="ht-muted mt-4">{pickText(focus.notes, locale)}</p> : null}
        {focus.id === "yao-xiao-qiong" ? (
          <p className="ht-muted mt-3">{m.unnamedDaughtersNote}</p>
        ) : null}
      </section>

      <section className="card mt-10 p-5 sm:p-6">
        <p className="kicker">{m.unplaced}</p>
        <p className="mt-2">{m.unplacedNote}</p>
        <div className="ht-row mt-3" style={{ justifyContent: "flex-start" }}>
          <Chip id="jing-hui" locale={locale} onPick={() => undefined} />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl tracking-tight">{m.mapTitle}</h2>
        <p className="ht-muted mt-2">{m.mapLead}</p>
        <div className="ht-map mt-4">
          <svg viewBox="0 0 100 56" role="img" aria-label={m.mapTitle}>
            {MAP_PLACE_IDS.map((id) => {
              const pl = placesById[id];
              if (!pl) return null;
              const { x, y } = project(pl.lat, pl.lng);
              const label = pickText(pl.name, locale);
              return (
                <g
                  key={id}
                  className={`ht-pin${placeId === id ? " is-on" : ""}`}
                  onClick={() => setPlaceId(id === placeId ? null : id)}
                >
                  <circle cx={x} cy={y} r="1.35" />
                  <text x={x + 2.1} y={y + 1.1}>
                    {label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        {place ? (
          <div className="card mt-4 p-4">
            <p>
              <strong>{pickText(place.name, locale)}</strong>
            </p>
            {place.todayNote ? (
              <p className="ht-muted mt-1">
                {m.mapToday} · {pickText(place.todayNote, locale)}
              </p>
            ) : null}
            <div className="ht-row mt-3" style={{ justifyContent: "flex-start" }}>
              {atPlace.map((p) => (
                <Chip
                  key={p.id}
                  id={p.id}
                  locale={locale}
                  on={p.id === focusId}
                  onPick={setFocusId}
                />
              ))}
            </div>
          </div>
        ) : null}
      </section>

      <section className="mt-14">
        <h2 className="font-display text-2xl tracking-tight">{m.checkinTitle}</h2>
        <p className="ht-muted mt-2">{m.checkinLead}</p>
        <p className="ht-muted">{m.livingNote}</p>
        <form className="ht-form card mt-5 p-5 sm:p-6" onSubmit={onSubmit}>
          <label>
            <span className="ht-lab">{m.checkinName}</span>
            <input
              required
              name="displayName"
              autoComplete="name"
              value={form.displayName}
              onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
            />
          </label>
          <label>
            <span className="ht-lab">{m.checkinPerson}</span>
            <select
              name="personId"
              value={form.personId}
              onChange={(e) => setForm((f) => ({ ...f, personId: e.target.value }))}
            >
              {claimOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {generationLabel(p.generation, locale)} {displayName(p, locale)}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="ht-lab">{m.checkinWechat}</span>
            <input
              name="wechat"
              value={form.wechat}
              onChange={(e) => setForm((f) => ({ ...f, wechat: e.target.value }))}
            />
          </label>
          <label>
            <span className="ht-lab">{m.checkinPhone}</span>
            <input
              name="phone"
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            />
          </label>
          <label>
            <span className="ht-lab">{m.checkinEmail}</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </label>
          <label>
            <span className="ht-lab">{m.checkinPhoto}</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
            />
          </label>
          <div className="ht-hp" aria-hidden="true">
            <input
              tabIndex={-1}
              autoComplete="off"
              name="website"
              value={form.website}
              onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
            />
          </div>
          <button className="btn btn-primary" type="submit" disabled={sending}>
            {sending ? m.checkinSending : m.checkinSubmit}
          </button>
          {flash ? <p className="ht-muted mt-3">{flash}</p> : null}
          {!wired ? <p className="ht-muted mt-3">{m.checkinNotWired}</p> : null}
        </form>

        <h3 className="mt-10 font-display text-xl">{m.boardTitle}</h3>
        {rows.length === 0 ? (
          <p className="ht-muted mt-2">{m.boardEmpty}</p>
        ) : (
          <ul className="ht-board mt-4">
            {rows.map((row) => {
              const claimed = person(row.person_id);
              return (
                <li key={row.id} className="ht-board-item">
                  {row.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={row.photo_url} alt="" />
                  ) : (
                    <span className="ht-ph" />
                  )}
                  <div>
                    <strong>{row.display_name}</strong>
                    {claimed ? (
                      <span className="ht-muted">
                        {" "}
                        {m.claimedAs} {displayName(claimed, locale)}
                      </span>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </article>
  );
}
