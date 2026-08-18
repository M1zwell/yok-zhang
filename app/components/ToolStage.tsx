"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { BrandMark, brandForGroup, type Brand } from "@/app/components/BrandMark";
import { TiltFrame } from "@/app/components/TiltFrame";
import type { Tool } from "@/lib/site";

type FrameProps = {
  title: string;
  href: string;
  path: string;
  note?: string;
  present?: string;
  embeddable?: boolean;
  embedSrc: string;
  heightClass?: string;
  brand?: Brand;
  eager?: boolean;
};

function OpenLive({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}

export function LiveFrame({
  title,
  href,
  path,
  note,
  present,
  embeddable = true,
  embedSrc,
  heightClass = "live-stage",
  brand = "ichina",
  eager = false,
}: FrameProps) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const showFrame = embeddable && !failed;

  return (
    <div className="live-chrome">
      <div className="live-chrome-bar">
        <span className="hidden gap-1 sm:flex" aria-hidden>
          <span className="size-2 rounded-full bg-tertiary" />
          <span className="size-2 rounded-full bg-spark/70" />
          <span className="size-2 rounded-full bg-accent" />
        </span>
        <BrandMark brand={brand} size={22} />
        <span className="min-w-0 flex-1 truncate font-display text-base text-fg">{title}</span>
        {present ? (
          <span className="present-chip hidden shrink-0 min-[400px]:inline-flex">
            <span className="hidden sm:inline">presenting </span>
            {present}
          </span>
        ) : null}
        <span className="hidden truncate font-mono text-[10px] text-muted xl:inline">{path}</span>
        <OpenLive href={href} className="open-live-chip shrink-0">
          Open {href.startsWith("/") ? "" : "live "}
          <span aria-hidden>{href.startsWith("/") ? "→" : "↗"}</span>
        </OpenLive>
      </div>
      <div className={`relative ${heightClass} bg-bg`}>
        {showFrame ? (
          <>
            {!loaded ? (
              <div className="shimmer absolute inset-0 bg-surface" aria-hidden />
            ) : null}
            <iframe
              src={embedSrc}
              title={present ? `${title} — ${present}` : title}
              className="absolute inset-0 h-full w-full border-0 bg-bg"
              loading={eager ? "eager" : "lazy"}
              allow="fullscreen; clipboard-read; clipboard-write"
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={() => setLoaded(true)}
              onError={() => setFailed(true)}
            />
            <OpenLive href={href} className="open-live-chip absolute right-3 bottom-3 z-10">
              Open {href.startsWith("/") ? "" : "live "}
              <span aria-hidden>{href.startsWith("/") ? "→" : "↗"}</span>
            </OpenLive>
          </>
        ) : (
          <div className="frame-fallback">
            <BrandMark brand={brand} size={48} className="logo-float mb-8 opacity-90" />
            <p className="font-display text-3xl tracking-tight text-fg sm:text-4xl">{title}</p>
            {present ? (
              <p className="present-chip mt-3">presenting {present}</p>
            ) : null}
            {note ? (
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">{note}</p>
            ) : (
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">
                This tool is live. Open it in its own tab.
              </p>
            )}
            <OpenLive href={href} className="btn btn-primary mt-8">
              Open {href.startsWith("/") ? "" : "live "}
              <span aria-hidden>{href.startsWith("/") ? "→" : "↗"}</span>
            </OpenLive>
          </div>
        )}
      </div>
    </div>
  );
}

export function ToolStage({ tools }: { tools: Tool[] }) {
  const defaultId = tools.some((t) => t.id === "terminal") ? "terminal" : tools[0]?.id;
  const [activeId, setActiveId] = useState(defaultId);
  const active = tools.find((t) => t.id === activeId) ?? tools[0];

  if (!active) return null;

  return (
    <div>
      <div role="tablist" aria-label="Live tools" className="scroll-x mb-4 flex flex-nowrap gap-2 pb-1">
        {tools.map((tool) => {
          const on = tool.id === active.id;
          return (
            <button
              key={tool.id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setActiveId(tool.id)}
              className={on ? "tool-tab is-on" : "tool-tab"}
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
          present={active.present}
          embeddable={active.embeddable}
          embedSrc={active.embedSrc}
          brand={brandForGroup(active.group)}
          eager
          heightClass="live-stage"
        />
      </TiltFrame>
    </div>
  );
}
