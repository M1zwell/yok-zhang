"use client";

import { useState } from "react";
import { BrandMark, brandForGroup, type Brand } from "@/app/components/BrandMark";
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

export function LiveFrame({
  title,
  href,
  path,
  note,
  present,
  embeddable = true,
  embedSrc,
  heightClass = "h-[min(72vh,640px)]",
  brand = "ichina",
  eager = false,
}: FrameProps) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const showFrame = embeddable && !failed;

  return (
    <div className="overflow-hidden rounded-[16px] border border-hair bg-surface shadow-[0_0_40px_rgba(20,184,166,0.06)]">
      <div className="flex items-center gap-3 border-b border-hair bg-elevated px-3 py-2.5 sm:px-4">
        <span className="hidden gap-1 sm:flex" aria-hidden>
          <span className="size-2 rounded-full bg-tertiary" />
          <span className="size-2 rounded-full bg-spark/70" />
          <span className="size-2 rounded-full bg-accent" />
        </span>
        <BrandMark brand={brand} size={22} />
        <span className="min-w-0 flex-1 truncate font-display text-base text-fg">{title}</span>
        {present ? (
          <span className="shrink-0 rounded-full border border-accent/35 bg-accent/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-accent">
            presenting {present}
          </span>
        ) : null}
        <span className="hidden truncate font-mono text-[10px] text-muted lg:inline">{path}</span>
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
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute right-3 bottom-3 z-10 rounded-full border border-hair/80 bg-bg/65 px-2.5 py-1 text-[10px] font-semibold text-muted backdrop-blur-sm transition-colors hover:border-accent/40 hover:text-accent"
            >
              Open live <span aria-hidden>↗</span>
            </a>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-start justify-end bg-[radial-gradient(ellipse_at_top,_rgba(20,184,166,0.12),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(255,71,120,0.1),_transparent_50%)] px-6 py-8 sm:px-10 sm:py-10">
            <BrandMark brand={brand} size={48} className="logo-float mb-8 opacity-90" />
            <p className="font-display text-3xl tracking-tight text-fg sm:text-4xl">{title}</p>
            {present ? (
              <p className="mt-2 text-[11px] font-semibold tracking-wide text-accent">presenting {present}</p>
            ) : null}
            {note ? (
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">{note}</p>
            ) : (
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">
                This tool is live. Open it in its own tab.
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

function FrameCard({ tool, featured }: { tool: Tool; featured?: boolean }) {
  return (
    <LiveFrame
      title={tool.title}
      href={tool.href}
      path={tool.path}
      note={tool.note}
      present={tool.present}
      embeddable={tool.embeddable}
      embedSrc={tool.embedSrc}
      brand={brandForGroup(tool.group)}
      eager={featured}
      heightClass={featured ? "h-[min(72vh,720px)]" : "h-[min(56vh,520px)]"}
    />
  );
}

export function ToolStage({ tools }: { tools: Tool[] }) {
  const featured = tools.filter((t) => t.id === "terminal" || t.id === "research");
  const rest = tools.filter((t) => t.id !== "terminal" && t.id !== "research");

  if (tools.length === 0) return null;

  return (
    <div className="space-y-6">
      {featured.length > 0 ? (
        <div className={featured.length > 1 ? "grid gap-6 lg:grid-cols-2" : "grid gap-6"}>
          {featured.map((tool) => (
            <FrameCard key={tool.id} tool={tool} featured />
          ))}
        </div>
      ) : null}
      {rest.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {rest.map((tool) => (
            <FrameCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
