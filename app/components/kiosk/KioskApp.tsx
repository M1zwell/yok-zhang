"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { copy } from "@/lib/kiosk/copy";
import { formatHkd, KioskRuntime } from "@/lib/kiosk/engine";
import { terminals } from "@/lib/kiosk/terminals";
import type { KioskLang, RoomType, Step } from "@/lib/kiosk/types";
import { exhaustive } from "@/lib/kiosk/types";
import "./kiosk.css";

function useRuntime(runtime: KioskRuntime) {
  return useSyncExternalStore(
    (onStoreChange) => runtime.subscribe(onStoreChange),
    () => runtime.getState(),
    () => runtime.getState(),
  );
}

const KEYS = "1234567890ABCDEFGHJKLMNPQRSTUVWXYZ".split("");

function healthDot(value: string): "ok" | "off" | "bad" {
  if (value === "online") return "ok";
  if (value === "empty" || value === "jammed") return "bad";
  return "off";
}

export function KioskApp({ initialLang = "zh-Hant" }: { initialLang?: KioskLang }) {
  const runtimeRef = useRef<KioskRuntime | null>(null);
  if (!runtimeRef.current) {
    runtimeRef.current = new KioskRuntime({ persist: false, lang: initialLang });
  }
  const runtime = runtimeRef.current;
  const state = useRuntime(runtime);
  const t = copy(state.lang);
  const [operator, setOperator] = useState(false);
  const idle = useRef<number | null>(null);

  useEffect(() => {
    if (state.step === "welcome") return;
    if (idle.current) window.clearTimeout(idle.current);
    idle.current = window.setTimeout(() => runtime.home(), 45000);
    return () => {
      if (idle.current) window.clearTimeout(idle.current);
    };
  }, [runtime, state.step, state.query]);

  const roomTypes = useMemo(() => {
    const seen = new Set<RoomType>();
    for (const room of state.terminal.roomMatrix) seen.add(room.roomType);
    return [...seen];
  }, [state.terminal]);

  const err = state.error;
  const errText = err ? (state.lang === "zh-Hant" ? err.messageZh : err.messageEn) : "";

  return (
    <div className="kiosk-root" data-testid="kiosk-root">
      <div className="kiosk-shell">
        <header className="kiosk-top">
          <div className="kiosk-brand">
            {t.brand}
            <span>
              {state.terminal.terminalId} · {state.terminal.location}
            </span>
          </div>
          <div className="kiosk-lang" role="group" aria-label="Language">
            <button
              type="button"
              className={state.lang === "zh-Hant" ? "is-on" : ""}
              onClick={() => runtime.setLang("zh-Hant")}
            >
              {t.langZh}
            </button>
            <button type="button" className={state.lang === "en" ? "is-on" : ""} onClick={() => runtime.setLang("en")}>
              {t.langEn}
            </button>
          </div>
        </header>

        <main className="kiosk-stage">
          {errText && state.step !== "welcome" ? (
            <div className="kiosk-error" data-testid="kiosk-error" role="alert">
              {errText}
            </div>
          ) : null}
          {renderStep(state.step, { runtime, t, state, roomTypes })}
        </main>

        <footer className="kiosk-foot">
          <div className="kiosk-health" data-testid="kiosk-health">
            <span>
              <i className={`kiosk-dot ${healthDot(state.health.online ? "online" : "offline")}`} />
              {state.health.online ? t.online : t.offline}
            </span>
            <span>
              <i className={`kiosk-dot ${healthDot(state.health.dispenser)}`} />
              K750-B <b>{state.health.dispenser}</b> · {state.health.cardStock}
            </span>
            <span>
              <i className={`kiosk-dot ${healthDot(state.health.lockEncoder)}`} />
              ProUSB <b>{state.health.lockEncoder}</b>
            </span>
            <span>
              <i className={`kiosk-dot ${healthDot(state.health.pos)}`} />
              QFPay <b>{state.health.pos}</b>
            </span>
            <span>
              <i className={`kiosk-dot ${healthDot(state.health.pms)}`} />
              Cloudbeds <b>{state.health.pms}</b>
            </span>
          </div>
          <button type="button" className="kiosk-btn ghost" onClick={() => setOperator((v) => !v)}>
            {t.demo}
          </button>
          {operator ? <OperatorPanel runtime={runtime} /> : null}
        </footer>
      </div>
    </div>
  );
}

function renderStep(
  step: Step,
  ctx: {
    runtime: KioskRuntime;
    t: ReturnType<typeof copy>;
    state: ReturnType<KioskRuntime["getState"]>;
    roomTypes: RoomType[];
  },
) {
  switch (step) {
    case "welcome":
      return <Welcome {...ctx} />;
    case "identify":
      return <Identify {...ctx} />;
    case "checkoutIdentify":
      return <Identify checkout {...ctx} />;
    case "camera":
      return <Camera {...ctx} />;
    case "payment":
      return <Payment {...ctx} />;
    case "processing":
      return (
        <section className="kiosk-success">
          <p className="kiosk-lead">{ctx.t.processingTitle}</p>
          <p>{ctx.t.processingHint}</p>
        </section>
      );
    case "success":
      return <Success {...ctx} />;
    case "checkoutConfirm":
      return <CheckoutConfirm {...ctx} />;
    case "blocked":
    case "error":
      return <Hold {...ctx} />;
    default:
      return exhaustive(step, "kiosk-step");
  }
}

function Welcome({
  runtime,
  t,
}: {
  runtime: KioskRuntime;
  t: ReturnType<typeof copy>;
}) {
  return (
    <section>
      <p className="kiosk-lead">{t.welcomeLead}</p>
      <div className="kiosk-grid two">
        <button type="button" className="kiosk-btn hero primary" data-testid="kiosk-checkin" onClick={() => runtime.startReservationCheckin()}>
          {t.checkin}
          <small>Reservation / 預訂編號</small>
        </button>
        <button type="button" className="kiosk-btn hero" data-testid="kiosk-checkout" onClick={() => runtime.startCheckout()}>
          {t.checkout}
          <small>Return key / 回收房卡</small>
        </button>
        <button type="button" className="kiosk-btn hero" data-testid="kiosk-walkin" onClick={() => runtime.startWalkIn()}>
          {t.walkin}
          <small>No booking / 無預訂</small>
        </button>
      </div>
    </section>
  );
}

function Identify({
  runtime,
  t,
  state,
  roomTypes,
  checkout,
}: {
  runtime: KioskRuntime;
  t: ReturnType<typeof copy>;
  state: ReturnType<KioskRuntime["getState"]>;
  roomTypes: RoomType[];
  checkout?: boolean;
}) {
  const walkIn = state.intent === "walk-in";
  return (
    <section>
      <p className="kiosk-lead">{checkout ? t.checkoutTitle : walkIn ? t.vacantTypes : t.identifyTitle}</p>
      <p>{checkout ? t.checkoutHint : walkIn ? t.vacantTypes : t.identifyHint}</p>
      {walkIn ? (
        <div className="kiosk-demos">
          {roomTypes.map((type) => (
            <button
              key={type}
              type="button"
              className={`kiosk-chip ${state.query === type ? "is-on" : ""}`}
              onClick={() => runtime.setQuery(type)}
            >
              {type}
            </button>
          ))}
        </div>
      ) : (
        <>
          <input
            className="kiosk-input"
            value={state.query}
            readOnly
            aria-label={t.identifyHint}
            data-testid="kiosk-query"
          />
          <div className={`kiosk-keys ${checkout ? "nums" : ""}`}>
            {(checkout ? KEYS.slice(0, 10).concat(["-"]) : KEYS).map((key) => (
              <button key={key} type="button" className="kiosk-key" onClick={() => runtime.setQuery(state.query + key)}>
                {key}
              </button>
            ))}
            <button type="button" className="kiosk-key" onClick={() => runtime.setQuery(state.query.slice(0, -1))}>
              ⌫
            </button>
          </div>
          <div className="kiosk-demos">
            {state.demoBookings.map((row) => (
              <button
                key={row.bookingRef}
                type="button"
                className="kiosk-chip"
                data-testid={`demo-${row.bookingRef}`}
                onClick={() => runtime.setQuery(row.bookingRef)}
              >
                {row.bookingRef} · {row.guestName} · {row.paymentStatus}
              </button>
            ))}
          </div>
        </>
      )}
      <div className="kiosk-grid two">
        <button type="button" className="kiosk-btn primary" data-testid="kiosk-lookup" onClick={() => runtime.lookup()}>
          {t.confirmLookup}
        </button>
        <button type="button" className="kiosk-btn ghost" onClick={() => runtime.home()}>
          {t.home}
        </button>
      </div>
    </section>
  );
}

function Camera({
  runtime,
  t,
}: {
  runtime: KioskRuntime;
  t: ReturnType<typeof copy>;
}) {
  return (
    <section>
      <p className="kiosk-lead">{t.cameraTitle}</p>
      <p>{t.cameraHint}</p>
      <div className="kiosk-scan" data-testid="kiosk-scan" />
      <div className="kiosk-grid two">
        <button type="button" className="kiosk-btn primary" data-testid="kiosk-hkid" onClick={() => runtime.captureIdentity("hkid")}>
          {t.scanHkid}
        </button>
        <button type="button" className="kiosk-btn" data-testid="kiosk-passport" onClick={() => runtime.captureIdentity("passport")}>
          {t.scanPassport}
        </button>
        <button type="button" className="kiosk-btn ghost" onClick={() => runtime.home()}>
          {t.home}
        </button>
      </div>
    </section>
  );
}

function Payment({
  runtime,
  t,
  state,
}: {
  runtime: KioskRuntime;
  t: ReturnType<typeof copy>;
  state: ReturnType<KioskRuntime["getState"]>;
}) {
  const bill = state.bill;
  return (
    <section>
      <p className="kiosk-lead">{t.paymentTitle}</p>
      {bill ? (
        <div className="kiosk-bill" data-testid="kiosk-bill">
          <p>
            {t.roomLabel} {bill.roomNumber} · {bill.roomType}
          </p>
          <p>
            {bill.nights} {t.nights}
          </p>
          <strong>{formatHkd(bill.dueHkdCents || bill.amountHkdCents)}</strong>
          <p>{bill.alreadyPaid ? t.skipPrepaid : t.tapPos}</p>
        </div>
      ) : null}
      <div className="kiosk-grid two">
        <button type="button" className="kiosk-btn primary" data-testid="kiosk-pay" onClick={() => runtime.confirmStay()}>
          {bill?.alreadyPaid ? t.skipPrepaid : t.tapPos}
        </button>
        <button type="button" className="kiosk-btn ghost" onClick={() => runtime.home()}>
          {t.home}
        </button>
      </div>
    </section>
  );
}

function Success({
  runtime,
  t,
  state,
}: {
  runtime: KioskRuntime;
  t: ReturnType<typeof copy>;
  state: ReturnType<KioskRuntime["getState"]>;
}) {
  const checkout = state.intent === "checkout";
  return (
    <section className="kiosk-success" data-testid="kiosk-success">
      <div className="mark" aria-hidden>
        ✓
      </div>
      <p className="kiosk-lead">{checkout ? t.folioClear : t.successTitle}</p>
      <p className="kiosk-room">{state.lastCard?.roomNumber ?? state.reservation?.roomNumber}</p>
      <p>
        {t.lockLabel} {state.lastCard?.lockCode ?? state.reservation?.lockCode}
      </p>
      <p>{checkout ? t.checkoutConfirm : t.takeCard}</p>
      <button type="button" className="kiosk-btn primary" data-testid="kiosk-home" onClick={() => runtime.home()}>
        {t.home}
      </button>
    </section>
  );
}

function CheckoutConfirm({
  runtime,
  t,
  state,
}: {
  runtime: KioskRuntime;
  t: ReturnType<typeof copy>;
  state: ReturnType<KioskRuntime["getState"]>;
}) {
  return (
    <section>
      <p className="kiosk-lead">{t.checkoutTitle}</p>
      <div className="kiosk-bill">
        <p>
          {t.roomLabel} {state.reservation?.roomNumber}
        </p>
        <strong>{formatHkd(state.bill?.dueHkdCents ?? 0)}</strong>
        <p>{(state.bill?.dueHkdCents ?? 0) === 0 ? t.folioClear : t.tapPos}</p>
      </div>
      <div className="kiosk-grid two">
        <button type="button" className="kiosk-btn primary" data-testid="kiosk-checkout-go" onClick={() => runtime.confirmCheckout()}>
          {t.checkoutConfirm}
        </button>
        <button type="button" className="kiosk-btn ghost" onClick={() => runtime.home()}>
          {t.home}
        </button>
      </div>
    </section>
  );
}

function Hold({
  runtime,
  t,
  state,
}: {
  runtime: KioskRuntime;
  t: ReturnType<typeof copy>;
  state: ReturnType<KioskRuntime["getState"]>;
}) {
  const message = state.error ? (state.lang === "zh-Hant" ? state.error.messageZh : state.error.messageEn) : t.blockedTitle;
  return (
    <section className="kiosk-success" data-testid="kiosk-hold">
      <p className="kiosk-lead">{t.blockedTitle}</p>
      <p>{message}</p>
      <button type="button" className="kiosk-btn primary" onClick={() => runtime.home()}>
        {t.home}
      </button>
    </section>
  );
}

function OperatorPanel({ runtime }: { runtime: KioskRuntime }) {
  const state = useRuntime(runtime);
  const t = copy(state.lang);
  return (
    <div className="kiosk-op" data-testid="kiosk-operator">
      <h3>{t.demo}</h3>
      <p>{t.demoHint}</p>
      <div className="kiosk-op-row">
        <select
          aria-label="terminal"
          value={state.terminal.terminalId}
          onChange={(event) => runtime.setTerminal(event.target.value)}
        >
          {terminals.map((term) => (
            <option key={term.terminalId} value={term.terminalId}>
              {term.terminalId} · {term.roomCount} · {term.location}
            </option>
          ))}
        </select>
        <button type="button" className="kiosk-btn" data-testid="kiosk-toggle-net" onClick={() => runtime.setFaults({ online: !state.faults.online })}>
          {state.faults.online ? t.online : t.offline}
        </button>
        <button type="button" className="kiosk-btn" onClick={() => runtime.setFaults({ dispenserJamNext: true })}>
          Jam next
        </button>
        <button type="button" className="kiosk-btn" onClick={() => runtime.setFaults({ encodeFailNext: true })}>
          Encode fail
        </button>
        <button type="button" className="kiosk-btn" onClick={() => runtime.setFaults({ lockOffline: !state.faults.lockOffline })}>
          Lock DLL
        </button>
        <button type="button" className="kiosk-btn" onClick={() => runtime.setFaults({ dispenserEmpty: !state.faults.dispenserEmpty })}>
          Hopper
        </button>
        <button
          type="button"
          className="kiosk-btn"
          onClick={() =>
            runtime.setFaults({
              cloudConflictRooms: state.faults.cloudConflictRooms.includes("802") ? [] : ["802"],
            })
          }
        >
          Conflict 802
        </button>
        <button type="button" className="kiosk-btn" data-testid="kiosk-sync" onClick={() => runtime.syncOffline()}>
          Sync
        </button>
      </div>
      <pre className="kiosk-logs">
        {state.logs.map((log) => `${log.eventType} ${log.bookingRef} ${log.details}`).join("\n") || "—"}
      </pre>
    </div>
  );
}
