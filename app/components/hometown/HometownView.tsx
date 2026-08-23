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
import { placePhotos } from "@/lib/hometown/place-media";
import {
  CLAIMABLE_IDS,
  MAP_PLACE_IDS,
  ancestorCoupleRows,
  book,
  coupleUnits,
  descendantCoupleRows,
  displayName,
  genderWord,
  generationBlood,
  generationLabel,
  givenLine,
  peopleAtPlace,
  person,
  placesById,
  yearText,
  type CoupleUnit,
} from "@/lib/hometown/tree";
import { pickText, type Person } from "@/lib/hometown/types";
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
  const years = yearText(p);
  const sex = genderWord(p.gender, locale);
  const sexClass = p.gender === "male" ? " is-m" : p.gender === "female" ? " is-f" : "";
  return (
    <button
      type="button"
      className={`ht-chip${on ? " is-on" : ""}${p.placeholder ? " is-dim" : ""}${sexClass}`}
      onClick={() => !p.placeholder && onPick(id)}
      disabled={!!p.placeholder}
    >
      <span className="ht-chip-top">
        <span className="ht-chip-gen">{generationLabel(p.generation, locale)}</span>
        <span className="ht-sex" aria-label={sex}>
          {sex}
        </span>
      </span>
      <span className="ht-chip-name">{displayName(p, locale)}</span>
      {givenLine(p, locale) !== pickText(p.style ?? p.name, locale) ? (
        <span className="ht-chip-meta">{givenLine(p, locale)}</span>
      ) : null}
      {years ? <span className="ht-chip-meta">{years}</span> : null}
    </button>
  );
}

function Unit({
  unit,
  locale,
  focusId,
  onPick,
}: {
  unit: CoupleUnit;
  locale: Locale;
  focusId: string;
  onPick: (id: string) => void;
}) {
  const ids = [unit.blood.id, ...unit.spouses.map((s) => s.id)];
  const lit = ids.includes(focusId);
  return (
    <div className={`ht-unit${lit ? " is-lit" : ""}`}>
      <Chip id={unit.blood.id} locale={locale} on={unit.blood.id === focusId} onPick={onPick} />
      {unit.spouses.map((s) => (
        <span key={s.id} className="ht-pair">
          <span className="ht-eq" aria-hidden="true">
            ＝
          </span>
          <Chip id={s.id} locale={locale} on={s.id === focusId} onPick={onPick} />
        </span>
      ))}
    </div>
  );
}

function GenRow({
  units,
  label,
  locale,
  focusId,
  onPick,
  current,
}: {
  units: CoupleUnit[];
  label: string;
  locale: Locale;
  focusId: string;
  onPick: (id: string) => void;
  current?: boolean;
}) {
  if (units.length === 0) return null;
  return (
    <div className={`ht-gen${current ? " is-now" : ""}`}>
      <p className="ht-gen-lab">{label}</p>
      <div className="ht-gen-track">
        {units.map((unit) => (
          <Unit key={unit.blood.id} unit={unit} locale={locale} focusId={focusId} onPick={onPick} />
        ))}
      </div>
    </div>
  );
}

function project(lat: number, lng: number) {
  const x = ((lng - 99) / 18) * 100;
  const y = ((24.6 - lat) / 12.2) * 100;
  return {
    x: Math.min(96, Math.max(4, x)),
    y: Math.min(94, Math.max(6, y)),
  };
}

function photoCaption(id: PlacePhotoId, m: ReturnType<typeof t>["hometown"]): string {
  switch (id) {
    case "sidianjin":
      return m.photoSidianjin;
    case "houses":
      return m.photoHouses;
    case "citang":
      return m.photoCitang;
    case "plain":
      return m.photoPlain;
    case "college":
      return m.photoCollege;
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}

type PlanKind = "hall" | "room" | "court" | "arm" | "wall" | "front";

function PlanCell({
  x,
  y,
  w,
  h,
  label,
  kind,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  kind: PlanKind;
}) {
  return (
    <g>
      <rect className={`ht-plan-cell is-${kind}`} x={x} y={y} width={w} height={h} rx="1.4" />
      <text x={x + w / 2} y={y + h / 2 + 2.2} textAnchor="middle">
        {label}
      </text>
    </g>
  );
}

function HousePlans({ m }: { m: ReturnType<typeof t>["hometown"] }) {
  return (
    <div className="ht-plans" role="group" aria-label={`${m.planTiger} · ${m.planGold}`}>
      <figure className="ht-plan">
        <svg viewBox="0 0 100 88" role="img" aria-label={m.planTiger}>
          <PlanCell x={4} y={4} w={30} h={26} label={m.planRoom} kind="room" />
          <PlanCell x={35} y={4} w={30} h={26} label={m.planHall} kind="hall" />
          <PlanCell x={66} y={4} w={30} h={26} label={m.planRoom} kind="room" />
          <PlanCell x={4} y={32} w={30} h={22} label={m.planArm} kind="arm" />
          <PlanCell x={35} y={32} w={30} h={22} label={m.planCourt} kind="court" />
          <PlanCell x={66} y={32} w={30} h={22} label={m.planArm} kind="arm" />
          <PlanCell x={4} y={56} w={30} h={18} label={m.planWall} kind="wall" />
          <PlanCell x={35} y={56} w={30} h={18} label={m.planFront} kind="front" />
          <PlanCell x={66} y={56} w={30} h={18} label={m.planWall} kind="wall" />
        </svg>
        <figcaption>{m.planTiger}</figcaption>
      </figure>
      <figure className="ht-plan">
        <svg viewBox="0 0 100 88" role="img" aria-label={m.planGold}>
          <PlanCell x={4} y={4} w={30} h={26} label={m.planRoom} kind="room" />
          <PlanCell x={35} y={4} w={30} h={26} label={m.planHall} kind="hall" />
          <PlanCell x={66} y={4} w={30} h={26} label={m.planRoom} kind="room" />
          <PlanCell x={4} y={32} w={30} h={22} label={m.planArm} kind="arm" />
          <PlanCell x={35} y={32} w={30} h={22} label={m.planCourt} kind="court" />
          <PlanCell x={66} y={32} w={30} h={22} label={m.planArm} kind="arm" />
          <PlanCell x={4} y={56} w={30} h={26} label={m.planRoom} kind="room" />
          <PlanCell x={35} y={56} w={30} h={26} label={m.planFront} kind="front" />
          <PlanCell x={66} y={56} w={30} h={26} label={m.planRoom} kind="room" />
        </svg>
        <figcaption>{m.planGold}</figcaption>
      </figure>
    </div>
  );
}

type PlacePhotoId = (typeof placePhotos)[number]["id"];

export function HometownView({ locale = "en" }: { locale?: Locale }) {
  const m = t(locale).hometown;
  const [focusId, setFocusId] = useState(book.meta.defaultFocusId);
  const [placeId, setPlaceId] = useState<string | null>("xiulong");
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
  const thisBlood = generationBlood(focus);
  const thisGen = coupleUnits(thisBlood);
  const up = ancestorCoupleRows(focus, 4);
  const down = descendantCoupleRows(focus, 4);
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
    () => CLAIMABLE_IDS.map((id) => person(id)).filter((p): p is Person => Boolean(p)),
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

  const placeNames = focus.places
    .map((id) => placesById[id])
    .filter((pl): pl is NonNullable<typeof pl> => Boolean(pl));

  return (
    <article className="page-x hometown mx-auto max-w-5xl py-14 sm:py-24">
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
        <p className="ht-muted">{m.rowHint}</p>
        <div className="ht-tree mt-5">
          {up.map((unit) => (
            <div key={unit.blood.id}>
              <GenRow
                units={[unit]}
                label={generationLabel(unit.blood.generation, locale)}
                locale={locale}
                focusId={focusId}
                onPick={setFocusId}
              />
              <div className="ht-spine" aria-hidden="true" />
            </div>
          ))}

          <GenRow
            units={thisGen}
            label={`${m.thisGeneration} · ${generationLabel(focus.generation, locale)}`}
            locale={locale}
            focusId={focusId}
            onPick={setFocusId}
            current
          />

          {down.map((row, i) => (
            <div key={`d-${i}`}>
              <div className="ht-spine" aria-hidden="true" />
              <GenRow
                units={row}
                label={generationLabel(row[0]?.blood.generation ?? null, locale)}
                locale={locale}
                focusId={focusId}
                onPick={setFocusId}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="ht-sheet card mt-8 p-5 sm:p-6">
        <p className="kicker">{m.personSheet}</p>
        <h2 className="mt-2 font-display text-[1.7rem] leading-tight tracking-tight">
          {displayName(focus, locale)}
        </h2>
        <p className="ht-sheet-meta">
          <span>{generationLabel(focus.generation, locale)}</span>
          <span>{genderWord(focus.gender, locale)}</span>
          {yearText(focus) ? <span>{yearText(focus)}</span> : null}
        </p>
        {givenLine(focus, locale) !== displayName(focus, locale) ? (
          <p className="ht-muted">{givenLine(focus, locale)}</p>
        ) : null}
        {focus.deathNote ? (
          <p className="ht-muted">
            {m.death} · {pickText(focus.deathNote, locale)}
          </p>
        ) : null}
        {placeNames.length > 0 ? (
          <p className="ht-muted">
            {m.placesOnCard} · {placeNames.map((pl) => pickText(pl.name, locale)).join(" · ")}
          </p>
        ) : null}
        {focus.notes ? <p className="ht-muted">{pickText(focus.notes, locale)}</p> : null}
        {focus.id === "yao-xiao-qiong" ? <p className="ht-muted">{m.unnamedDaughtersNote}</p> : null}
      </section>

      <section className="card mt-10 p-5 sm:p-6">
        <p className="kicker">{m.unplaced}</p>
        <p className="mt-2">{m.unplacedNote}</p>
        <div className="ht-row mt-3" style={{ justifyContent: "flex-start" }}>
          <Chip id="jing-hui" locale={locale} onPick={() => undefined} />
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-2xl tracking-tight">{m.geoTitle}</h2>
        <p className="ht-muted mt-2">{m.geoLead}</p>
        <p className="ht-copy">{m.cultureP1}</p>
        <p className="ht-copy">{m.cultureP2}</p>
        <h3 className="mt-8 font-display text-xl tracking-tight">{m.historyTitle}</h3>
        <p className="ht-copy">{m.historyP1}</p>
        <p className="ht-copy">{m.historyP2}</p>

        <h3 className="mt-10 font-display text-xl tracking-tight">{m.folkTitle}</h3>
        <p className="ht-muted">{m.folkLead}</p>

        <article className="ht-folk-card ht-folk-wide mt-5">
          <h4>{m.folkHouseTitle}</h4>
          <p>{m.folkHouseP}</p>
          <HousePlans m={m} />
          <p className="ht-plan-note">{m.planNote}</p>
        </article>

        <div className="ht-folk mt-4">
          <article className="ht-folk-card">
            <h4>{m.folkHallTitle}</h4>
            <p>{m.folkHallP}</p>
          </article>
          <article className="ht-folk-card">
            <h4>{m.folkRiteTitle}</h4>
            <p>{m.folkRiteP}</p>
          </article>
          <article className="ht-folk-card">
            <h4>{m.folkMoonTitle}</h4>
            <p>{m.folkMoonP}</p>
          </article>
          <article className="ht-folk-card">
            <h4>{m.folkGardenTitle}</h4>
            <p>{m.folkGardenP}</p>
          </article>
          <article className="ht-folk-card">
            <h4>{m.folkFoodTitle}</h4>
            <p>{m.folkFoodP}</p>
          </article>
          <article className="ht-folk-card">
            <h4>{m.folkLangTitle}</h4>
            <p>{m.folkLangP}</p>
          </article>
        </div>

        <h3 className="mt-10 font-display text-xl tracking-tight">{m.photosTitle}</h3>
        <p className="ht-muted">{m.photosLead}</p>
        <div className="ht-photos mt-4">
          {placePhotos.map((ph) => (
            <figure key={ph.id} className="ht-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ph.src} alt={photoCaption(ph.id, m)} />
              <figcaption>
                <span>{photoCaption(ph.id, m)}</span>
                <a href={ph.href} target="_blank" rel="noopener noreferrer">
                  {m.photoCredit} · {ph.author} · {ph.license}
                </a>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="ht-muted">{m.photoNote}</p>

        <h3 className="mt-10 font-display text-xl tracking-tight">{m.mapTitle}</h3>
        <p className="ht-muted">{m.mapLead}</p>
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
