"use client";

import { useEffect, useState } from "react";
import { joinDestinations, links, type JoinDestination } from "@/lib/site";
import { ShareActions } from "@/app/components/ShareActions";

export function EnterButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("yok:enter"))}
      className={className ?? "btn btn-ghost"}
    >
      Enter
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
      className="fixed inset-0 z-50 flex items-start justify-center bg-bg/75 px-4 pt-[8vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div className="palette-enter w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <JoinFlow onClose={() => setOpen(false)} />
      </div>
    </div>
  );
}

export function JoinFlow({ onClose }: { onClose?: () => void }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [pick, setPick] = useState<JoinDestination | null>(null);

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
          <p className="kicker">Enter</p>
          <h2 className="mt-2 font-display text-2xl tracking-tight sm:text-3xl">Pick a world</h2>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-[12px] text-muted hover:text-fg"
            aria-label="Close"
          >
            Close
          </button>
        ) : null}
      </div>
      <ol className="relative mt-6 flex items-center gap-2 text-[11px] font-semibold tracking-wide uppercase">
        {[
          { n: 1 as const, label: "Pick" },
          { n: 2 as const, label: "Confirm" },
          { n: 3 as const, label: "Go" },
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
            return (
              <li key={d.id}>
                <button
                  type="button"
                  onClick={() => choose(d)}
                  className={
                    on
                      ? "flex w-full items-baseline justify-between gap-3 rounded-xl border border-accent/50 bg-accent/10 px-3 py-3 text-left"
                      : "flex w-full items-baseline justify-between gap-3 rounded-xl border border-hair px-3 py-3 text-left transition-colors hover:border-accent/40"
                  }
                >
                  <span>
                    <span className="block font-display text-lg text-fg">{d.label}</span>
                    <span className="mt-1 block text-[12px] leading-relaxed text-muted">{d.note}</span>
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
          <p className="text-sm text-muted">You picked</p>
          <p className="mt-1 font-display text-3xl tracking-tight text-fg">{pick.label}</p>
          <p className="mt-2 font-mono text-[12px] text-accent">{pick.path}</p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-secondary">{pick.note}</p>
          <p className="mt-8 text-[12px] tracking-wide text-muted uppercase">A name I kept</p>
          <button type="button" onClick={mark} className="cta-pop group mt-3 w-full rounded-xl border border-hair bg-bg/70 px-4 py-5 text-left transition-colors hover:border-accent/50">
            <span className="block font-mono text-2xl text-accent transition-colors group-hover:text-accent-hover">
              m1zwell
            </span>
            <span className="mt-1 block text-[12px] text-muted">Leave this mark, then continue.</span>
          </button>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="mt-4 text-[12px] text-muted hover:text-fg"
          >
            ← Pick another
          </button>
        </div>
      ) : null}

      {step === 3 && pick ? (
        <div className="relative mt-6">
          <p className="text-sm text-muted">Ready</p>
          <p className="mt-1 font-display text-3xl tracking-tight text-fg">{pick.label}</p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-secondary">
            {pick.needsAccount
              ? "Continue to the real signup. Selection carries with you."
              : "No account. The world is already open."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={pick.href} target="_blank" rel="noopener noreferrer" className="btn btn-primary cta-pop">
              {pick.needsAccount ? "Continue to signup" : "Open gghere"} <span aria-hidden>↗</span>
            </a>
            <button type="button" onClick={() => setStep(2)} className="btn btn-ghost">
              Back
            </button>
          </div>
          <div className="mt-8 border-t border-hair pt-5">
            <p className="mb-3 text-[11px] font-semibold tracking-[0.16em] text-muted uppercase">
              Share this world
            </p>
            <ShareActions href={pick.href} title={pick.shareTitle} label="Share this world" />
          </div>
          {pick.id === "gghere" ? (
            <p className="mt-4 text-[12px] text-muted">
              Worlds live on{" "}
              <a href={links.gghere} className="text-accent hover:text-accent-hover">
                gghere.com
              </a>
              .
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
