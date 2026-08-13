"use client";

import { useState } from "react";
import { TiltFrame } from "@/app/components/TiltFrame";
import type { Tool } from "@/lib/site";

type FrameProps = {
  title: string;
  href: string;
  path: string;
  note?: string;
  embeddable: boolean;
  embedSrc: string;
  heightClass?: string;
};

export function LiveFrame({
  title,
  href,
  path,
  note,
  embeddable,
  embedSrc,
  heightClass = "h-[min(72vh,640px)]",
}: FrameProps) {
  const [failed, setFailed] = useState(!embeddable);

  return (
    <div className="overflow-hidden rounded-[16px] border border-hair bg-surface shadow-[0_0_40px_rgba(20,184,166,0.06)]">
      <div className="flex items-center gap-3 border-b border-hair bg-elevated px-3 py-2.5 sm:px-4">
        <span className="hidden gap-1 sm:flex" aria-hidden>
          <span className="size-2 rounded-full bg-tertiary" />
          <span className="size-2 rounded-full bg-spark/70" />
          <span className="size-2 rounded-full bg-accent" />
        </span>
        <span className="min-w-0 flex-1 truncate font-display text-base text-fg">{title}</span>
        <span className="hidden truncate font-mono text-[10px] text-muted sm:inline">{path}</span>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-[11px] font-semibold text-accent transition-colors hover:text-accent-hover"
        >
          Open live
        </a>
      </div>
      <div className={`relative ${heightClass} bg-bg`}>
        {!failed ? (
          <iframe
            src={embedSrc}
            title={title}
            className="absolute inset-0 h-full w-full border-0 bg-bg"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-start justify-end bg-[radial-gradient(ellipse_at_top,_rgba(20,184,166,0.12),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(255,71,120,0.1),_transparent_50%)] px-6 py-8 sm:px-10 sm:py-10">
            <img src="/yok-mark.png" alt="" width={72} height={48} className="logo-float mb-8 h-10 w-auto opacity-90" />
            <p className="font-display text-3xl tracking-tight text-fg sm:text-4xl">{title}</p>
            {note ? (
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">{note}</p>
            ) : (
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">
                This tool is live. The host does not allow embedding here — chrome stays, open live.
              </p>
            )}
            <a href={href} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-8">
              Open live <span aria-hidden>↗</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export function ToolStage({ tools }: { tools: Tool[] }) {
  const [activeId, setActiveId] = useState(tools[0]?.id);
  const active = tools.find((t) => t.id === activeId) ?? tools[0];

  if (!active) return null;

  return (
    <div>
      <div role="tablist" aria-label="Live tools" className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {tools.map((tool) => {
          const on = tool.id === active.id;
          return (
            <button
              key={tool.id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setActiveId(tool.id)}
              className={
                on
                  ? "shrink-0 rounded-xl border border-accent/60 bg-accent/10 px-3 py-2 text-[11px] font-semibold tracking-wide text-accent shadow-[0_0_16px_rgba(20,184,166,0.15)]"
                  : "shrink-0 rounded-xl border border-hair px-3 py-2 text-[11px] font-medium tracking-wide text-muted transition-colors hover:border-accent/40 hover:text-fg"
              }
            >
              {tool.title}
            </button>
          );
        })}
      </div>
      <TiltFrame key={active.id}>
        <LiveFrame
          title={active.title}
          href={active.href}
          path={active.path}
          note={active.note}
          embeddable={active.embeddable}
          embedSrc={active.embedSrc}
        />
      </TiltFrame>
    </div>
  );
}
