"use client";

import { useEffect, useMemo, useState } from "react";
import { LiveFrame } from "@/app/components/ToolStage";
import { TiltFrame } from "@/app/components/TiltFrame";
import { PublishDesk, type DeskSeed } from "@/app/components/PublishDesk";
import { PretextLines } from "@/app/components/PretextLines";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/messages";
import {
  kindFromName,
  pinnedThemes,
  studioDesk,
  studioKinds,
  youtubeEmbed,
  youtubeId,
  type FeaturedTheme,
  type LocalStudioItem,
} from "@/lib/studio";

export function StudioShelf({
  locale = "en",
  embed = false,
  compact = false,
}: {
  locale?: Locale;
  embed?: boolean;
  compact?: boolean;
}) {
  const m = t(locale);
  const zh = locale.startsWith("zh");
  const [themes, setThemes] = useState<FeaturedTheme[]>(pinnedThemes);
  const [items, setItems] = useState<LocalStudioItem[]>([]);
  const [youtube, setYoutube] = useState("");
  const [seed, setSeed] = useState<DeskSeed | undefined>();
  const [localItem, setLocalItem] = useState<LocalStudioItem | null>(null);
  const [deskOpen, setDeskOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(studioDesk.feed)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { themes?: FeaturedTheme[] } | null) => {
        if (cancelled || !data?.themes?.length) return;
        const next = data.themes.filter((theme) => theme.id && theme.url && theme.title);
        if (next.length) setThemes(next);
      })
      .catch(() => {
        /* keep pinned */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const next: LocalStudioItem[] = [];
    for (const file of Array.from(files)) {
      const kind = kindFromName(file.name);
      if (!kind) continue;
      next.push({
        id: `${file.name}-${file.size}-${file.lastModified}`,
        kind,
        name: file.name,
        url: URL.createObjectURL(file),
        local: true,
      });
    }
    if (next.length) setItems((prev) => [...next, ...prev].slice(0, 12));
  };

  const addYoutube = () => {
    const id = youtubeId(youtube);
    if (!id) return;
    const url = youtube.trim();
    const item: LocalStudioItem = {
      id: `yt-${id}`,
      kind: "youtube",
      name: url,
      url,
      local: false,
    };
    setItems((prev) => [item, ...prev.filter((i) => i.id !== item.id)].slice(0, 12));
    setYoutube("");
  };

  const pack = (next: DeskSeed, item?: LocalStudioItem) => {
    setSeed(next);
    setLocalItem(item ?? null);
    setDeskOpen(true);
  };

  const ytPreview = useMemo(() => {
    const first = items.find((i) => i.kind === "youtube");
    const id = first ? youtubeId(first.url) : null;
    return id ? youtubeEmbed(id) : null;
  }, [items]);

  return (
    <section id="studio" className="studio-shelf">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="kicker">{m.studio.kicker}</p>
          <h2 className="mt-3 font-display text-3xl tracking-tight sm:text-5xl">{m.studio.title}</h2>
        </div>
        <a
          href={studioDesk.href}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          {m.cta.openStudio} <span aria-hidden>↗</span>
        </a>
      </div>
      <PretextLines
        text={m.studio.lead}
        locale={locale}
        className="mt-5 max-w-2xl text-sm leading-relaxed text-muted"
      />
      {embed ? (
        <div className="mt-8">
          <TiltFrame>
            <LiveFrame
              title={m.studio.deskTitle}
              href={studioDesk.href}
              path={studioDesk.path}
              note={m.studio.embedNote}
              embeddable={studioDesk.embeddable}
              embedSrc={studioDesk.embedSrc}
              heightClass="live-stage"
            />
          </TiltFrame>
        </div>
      ) : null}

      <ul className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
        {studioKinds.map((kind) => (
          <li key={kind.id} className="rounded-2xl border border-hair bg-surface p-4">
            <p className="font-mono text-[10px] tracking-[0.16em] text-accent uppercase">
              {kind.notebooklm ? m.studio.notebooklm : m.studio.output}
            </p>
            <h3 className="mt-2 font-display text-xl text-fg">{m.studio.kinds[kind.id]}</h3>
            <p className="mt-2 text-[12px] leading-relaxed text-muted">{m.studio.kindLead}</p>
            <a
              href={studioDesk.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex text-[12px] font-semibold text-accent hover:text-accent-hover"
            >
              {m.cta.openStudio} ↗
            </a>
          </li>
        ))}
      </ul>

      {!compact ? (
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-hair bg-deep/40 p-5">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-muted uppercase">{m.studio.dropTitle}</p>
            <p className="mt-2 text-sm text-muted">{m.studio.dropLead}</p>
            <label className="mt-4 flex cursor-pointer flex-col items-start gap-2 rounded-xl border border-dashed border-accent/40 bg-bg/40 px-4 py-6">
              <span className="text-sm text-secondary">{m.studio.dropHint}</span>
              <input
                type="file"
                accept=".ppt,.pptx,.pdf,.mp4,application/pdf,video/mp4,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                multiple
                className="text-xs text-muted"
                onChange={(e) => addFiles(e.target.files)}
              />
            </label>
            <div className="mt-4 flex gap-2">
              <input
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                placeholder={m.studio.youtubePlaceholder}
                className="min-w-0 flex-1 rounded-xl border border-hair bg-surface px-3 py-2 text-sm text-fg"
              />
              <button type="button" onClick={addYoutube} className="btn btn-ghost">
                {m.studio.addYoutube}
              </button>
            </div>
            {ytPreview ? (
              <div className="mt-4 overflow-hidden rounded-xl border border-hair">
                <iframe
                  src={ytPreview}
                  title="YouTube"
                  className="aspect-video w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : null}
            <ul className="mt-4 space-y-2">
              {items.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-hair px-3 py-2">
                  <span className="min-w-0 truncate text-sm text-secondary">
                    <span className="mr-2 font-mono text-[10px] text-accent uppercase">{item.kind}</span>
                    {item.name}
                  </span>
                  <button
                    type="button"
                    className="text-[11px] font-semibold text-accent"
                    onClick={() =>
                      pack(
                        {
                          title: item.name,
                          line: m.studio.localLine,
                          url: item.local ? studioDesk.href : item.url,
                          tags: item.kind === "youtube" ? ["#youtube"] : [],
                        },
                        item,
                      )
                    }
                  >
                    {m.cta.pack}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-semibold tracking-[0.16em] text-muted uppercase">{m.studio.sourcesTitle}</p>
            <p className="mt-2 text-sm text-muted">{m.studio.sourcesLead}</p>
            <ul className="mt-4 space-y-3">
              {themes.map((theme) => {
                const title = zh ? theme.titleZh : theme.title;
                return (
                  <li key={theme.id} className="rounded-2xl border border-hair bg-surface p-4">
                    <p className="font-display text-lg leading-snug text-fg">{title}</p>
                    <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-muted">{theme.thesis}</p>
                    <div className="mt-3 flex flex-wrap gap-3 text-[12px]">
                      <a href={theme.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent-hover">
                        dseek ↗
                      </a>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      ) : (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {themes.slice(0, 2).map((theme) => {
            const title = zh ? theme.titleZh : theme.title;
            return (
              <li key={theme.id} className="rounded-2xl border border-hair bg-surface p-4">
                <p className="font-display text-lg text-fg">{title}</p>
                <a href={theme.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex text-[12px] text-accent">
                  dseek ↗
                </a>
              </li>
            );
          })}
        </ul>
      )}

      {deskOpen ? (
        <div className="mt-12 border-t border-hair pt-10">
          <PublishDesk locale={locale} seed={seed} themes={themes} localItem={localItem} />
        </div>
      ) : null}
    </section>
  );
}
