"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/messages";
import { claimablePeople, personName } from "@/lib/hometown/tree";
import { hometownWired, listCheckins, submitCheckin, type PublicCheckin } from "@/lib/hometown/supabase";

export function CheckinBoard({
  locale,
  focusId,
}: {
  locale: Locale;
  focusId: string;
}) {
  const m = t(locale);
  const wired = hometownWired();
  const people = useMemo(() => claimablePeople(), []);
  const [rows, setRows] = useState<PublicCheckin[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [personId, setPersonId] = useState(focusId);

  useEffect(() => {
    setPersonId(focusId);
  }, [focusId]);

  useEffect(() => {
    let on = true;
    const load = () => {
      void listCheckins().then((data) => {
        if (on) setRows(data);
      });
    };
    load();
    const id = window.setInterval(load, 20000);
    return () => {
      on = false;
      window.clearInterval(id);
    };
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    const photo = data.get("photo");
    const result = await submitCheckin({
      personId: String(data.get("personId") || ""),
      displayName: String(data.get("displayName") || ""),
      wechat: String(data.get("wechat") || ""),
      phone: String(data.get("phone") || ""),
      email: String(data.get("email") || ""),
      photo: photo instanceof File ? photo : null,
      locale,
      honeypot: String(data.get("company") || ""),
    });
    setStatus(result.ok ? "ok" : "err");
    if (result.ok) {
      form.reset();
      setPersonId(focusId);
      setRows(await listCheckins());
    }
  }

  return (
    <div>
      <h2>{m.hometown.checkinTitle}</h2>
      <p className="ht-quiet" style={{ marginTop: 8 }}>
        {m.hometown.checkinLead}
      </p>
      {!wired ? <p className="ht-quiet">{m.hometown.unwired}</p> : null}
      <form className="ht-form" onSubmit={onSubmit}>
        <label className="ht-hp" aria-hidden="true">
          company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
        <label>
          {m.hometown.claim}
          <select name="personId" value={personId} onChange={(e) => setPersonId(e.target.value)} required>
            {people.map((p) => (
              <option key={p.id} value={p.id}>
                {personName(locale, p)}
              </option>
            ))}
          </select>
        </label>
        <label>
          {m.hometown.yourName}
          <input name="displayName" required maxLength={80} autoComplete="name" />
        </label>
        <label>
          {m.hometown.wechat}
          <input name="wechat" maxLength={80} />
        </label>
        <label>
          {m.hometown.phone}
          <input name="phone" maxLength={40} autoComplete="tel" />
        </label>
        <label>
          {m.hometown.email}
          <input name="email" type="email" maxLength={120} autoComplete="email" />
        </label>
        <label>
          {m.hometown.photo}
          <input name="photo" type="file" accept="image/*" />
        </label>
        <button className="btn btn-primary" type="submit" disabled={status === "sending" || !wired}>
          {status === "sending" ? m.hometown.sending : m.hometown.submit}
        </button>
        {status === "ok" ? <p className="ht-quiet">{m.hometown.thanks}</p> : null}
        {status === "err" ? <p className="ht-quiet">{m.hometown.error}</p> : null}
      </form>
      <h3 className="ht-quiet" style={{ marginTop: "1.4rem" }}>
        {m.hometown.boardTitle}
      </h3>
      <div className="ht-board">
        {rows.length === 0 ? <p className="ht-quiet">{m.hometown.emptyBoard}</p> : null}
        {rows.map((row) => {
          const claimed = people.find((p) => p.id === row.person_id);
          return (
            <div className="ht-check" key={row.id}>
              {row.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={row.photo_url} alt="" />
              ) : (
                <div className="ht-avatar" />
              )}
              <div>
                <p>
                  {row.display_name}
                  {claimed ? ` · ${personName(locale, claimed)}` : ""}
                </p>
                <time dateTime={row.created_at}>{row.created_at.slice(0, 10)}</time>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
