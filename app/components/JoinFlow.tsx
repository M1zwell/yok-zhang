"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/app/components/BrandMark";
import { ShareActions } from "@/app/components/ShareActions";
import { stripLocale } from "@/lib/i18n";
import { t } from "@/lib/messages";
import { joinDestinations, links, type JoinDestination } from "@/lib/site";

export function EnterButton({ className }: { className?: string }) {
  const pathname = usePathname() || "/";
  const { locale } = stripLocale(pathname);
  const m = t(locale);
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("yok:enter"))}
      className={className ?? "btn btn-ghost"}
    >
      {m.cta.enter}
    </button>
  );
}

export function JoinModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("yok:enter", onOpen);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("yok:enter", onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="join-scrim fixed inset-0 z-50 flex items-start justify-center bg-bg/75 px-4 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div className="palette-enter w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <JoinFlow onClose={() => setOpen(false)} />
      </div>
    </div>
  );
}

export function JoinFlow({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname() || "/";
  const { locale } = stripLocale(pathname);
  const m = t(locale);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [pick, setPick] = useState<JoinDestination | null>(joinDestinations[0] ?? null);

  const destCopy = (id: string) => {
    const key = id as keyof typeof m.join.dest;
    return m.join.dest[key] ?? { label: id, note: "" };
  };

  const choose = (d: JoinDestination) => {
    setPick(d);
    setStep(2);
  };

  const mark = () => {
    if (!pick) return;
    setStep(3);
  };

  return (
    <div className="card relative overflow-hidden p-5 sm:p-6">
      <div className="pointer-events-none absolute -right-10 -top-12 size-36 rounded-full bg-accent/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-14 -left-10 size-32 rounded-full bg-spark/10 blur-2xl" />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="kicker">{m.kicker.enter}</p>
          <h2 className="mt-2 font-display text-2xl tracking-tight sm:text-3xl">{m.join.pickAWorld}</h2>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-10 items-center rounded-lg px-2 text-[12px] text-muted hover:text-fg"
            aria-label={m.join.close}
          >
            {m.join.close}
          </button>
        ) : null}
      </div>
      <ol className="relative mt-6 flex items-center gap-2 text-[11px] font-semibold tracking-wide uppercase">
        {[
          { n: 1 as const, label: m.join.pick },
          { n: 2 as const, label: m.join.confirm },
          { n: 3 as const, label: m.join.go },
        ].map((s, i) => {
          const on = step === s.n;
          const done = step > s.n;
          return (
            <li key={s.n} className="flex min-w-0 flex-1 items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (s.n === 1) setStep(1);
                  if (s.n === 2 && pick) setStep(2);
                }}
                className={
                  on
                    ? "flex items-center gap-2 text-accent"
                    : done
                      ? "flex items-center gap-2 text-secondary"
                      : "flex items-center gap-2 text-muted"
                }
              >
                <span
                  className={
                    on || done
                      ? "grid size-6 place-items-center rounded-full bg-accent/15 font-mono text-[11px] text-accent"
                      : "grid size-6 place-items-center rounded-full border border-hair font-mono text-[11px]"
                  }
                >
                  {s.n}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </button>
              {i < 2 ? <span className="h-px flex-1 bg-hair" aria-hidden /> : null}
            </li>
          );
        })}
      </ol>

      {step === 1 ? (
        <ul className="relative mt-6 grid gap-2">
          {joinDestinations.map((d) => {
            const on = pick?.id === d.id;
            const copy = destCopy(d.id);
            return (
              <li key={d.id}>
                <button
                  type="button"
                  onClick={() => choose(d)}
                  className={
                    on
                      ? "flex min-h-12 w-full flex-col gap-1 rounded-xl border border-accent/50 bg-accent/10 px-3 py-3 text-left sm:flex-row sm:items-baseline sm:justify-between sm:gap-3"
                      : "flex min-h-12 w-full flex-col gap-1 rounded-xl border border-hair px-3 py-3 text-left transition-colors hover:border-accent/40 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3"
                  }
                >
                  <span>
                    <span className="block font-display text-lg text-fg">{copy.label}</span>
                    <span className="mt-1 block text-[12px] leading-relaxed text-muted">{copy.note}</span>
                  </span>
                  <span className="shrink-0 font-mono text-[11px] text-accent">{d.path}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}

      {step === 2 && pick ? (
        <div className="relative mt-6">
          <p className="text-sm text-muted">{m.join.youPicked}</p>
          <p className="mt-1 font-display text-3xl tracking-tight text-fg">{destCopy(pick.id).label}</p>
          <p className="mt-2 font-mono text-[12px] text-accent">{pick.path}</p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-secondary">{destCopy(pick.id).note}</p>
          <p className="mt-8 text-[12px] tracking-wide text-muted uppercase">{m.join.aNameIKept}</p>
          <button type="button" onClick={mark} className="cta-pop group mt-3 w-full rounded-xl border border-hair bg-bg/70 px-4 py-5 text-left transition-colors hover:border-accent/50">
            <BrandMark brand="m1zwell" size={40} className="mb-3" />
            <span className="block font-mono text-2xl text-accent transition-colors group-hover:text-accent-hover">
              m1zwell
            </span>
            <span className="mt-1 block text-[12px] text-muted">{m.join.leaveMark}</span>
          </button>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="mt-4 text-[12px] text-muted hover:text-fg"
          >
            {m.join.pickAnother}
          </button>
        </div>
      ) : null}

      {step === 3 && pick ? (
        <div className="relative mt-6">
          <p className="text-sm text-muted">{m.join.ready}</p>
          <p className="mt-1 font-display text-3xl tracking-tight text-fg">{destCopy(pick.id).label}</p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-secondary">
            {pick.needsAccount ? m.join.needsAccount : m.join.noAccount}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={pick.href} target="_blank" rel="noopener noreferrer" className="btn btn-primary cta-pop">
              {pick.needsAccount ? m.join.continueSignup : `${m.join.openWorld} ${pick.path}`} <span aria-hidden>↗</span>
            </a>
            <button type="button" onClick={() => setStep(2)} className="btn btn-ghost">
              {m.join.back}
            </button>
          </div>
          <div className="mt-8 border-t border-hair pt-5">
            <p className="mb-3 text-[11px] font-semibold tracking-[0.16em] text-muted uppercase">
              {m.join.shareThisWorld}
            </p>
            <ShareActions href={pick.href} title={pick.shareTitle} label={m.join.shareThisWorld} locale={locale} />
          </div>
          {pick.id === "gghere" || pick.id === "planet" ? (
            <p className="mt-4 text-[12px] text-muted">
              {m.join.worldsLiveOn}{" "}
              <a href={links.gghereHk} className="text-accent hover:text-accent-hover">
                gghere.com/hk
              </a>
              {" · "}
              <a href={links.gghereWorlds} className="text-accent hover:text-accent-hover">
                gghere.com/worlds
              </a>
              {" · "}
              <a href={links.jubuddyPlanet} className="text-accent hover:text-accent-hover">
                jubuddy.com/planet
              </a>
              .
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
