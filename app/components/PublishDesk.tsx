"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { localizeHref, stripLocale } from "@/lib/i18n";
import { t } from "@/lib/messages";
import {
  channels,
  composeKit,
  hashtagsFor,
  publishChannels,
  type PublishPayload,
} from "@/lib/channels";
import { joinDestinations, liveProducts } from "@/lib/site";
import { pinnedThemes, type FeaturedTheme, type LocalStudioItem } from "@/lib/studio";

export type DeskSeed = {
  title: string;
  line: string;
  url: string;
  tags?: string[];
};

const pages = [
  { id: "home", path: "/", titleKey: "garden" as const },
  { id: "writing", path: "/writing", titleKey: "writing" as const },
  { id: "tools", path: "/tools", titleKey: "tools" as const },
  { id: "products", path: "/products", titleKey: "products" as const },
  { id: "share", path: "/share", titleKey: "share" as const },
];

export function PublishDesk({
  locale,
  seed,
  themes = pinnedThemes,
  localItem,
}: {
  locale?: Locale;
  seed?: DeskSeed;
  themes?: FeaturedTheme[];
  localItem?: LocalStudioItem | null;
}) {
  const pathname = usePathname() || "/";
  const { locale: pathLocale } = stripLocale(pathname);
  const loc = locale ?? pathLocale;
  const m = t(loc);
  const [origin, setOrigin] = useState("https://ichina.co");
  const [copied, setCopied] = useState<string | null>(null);
  const [canShare, setCanShare] = useState(false);
  const [pick, setPick] = useState<string>(seed ? "seed" : "current");

  useEffect(() => {
    setOrigin(window.location.origin);
    setCanShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  const options = useMemo(() => {
    const list: { id: string; label: string; payload: PublishPayload }[] = [];
    if (seed) {
      list.push({
        id: "seed",
        label: seed.title,
        payload: {
          title: seed.title,
          line: seed.line,
          url: seed.url,
          hashtags: hashtagsFor(seed.tags),
        },
      });
    }
    list.push({
      id: "current",
      label: m.share.currentPage,
      payload: {
        title: "Yok Zhang · m1zwell",
        line: m.heroLine,
        url: typeof window !== "undefined" ? window.location.href : `${origin}${pathname}`,
        hashtags: hashtagsFor(),
      },
    });
    for (const page of pages) {
      list.push({
        id: page.id,
        label: m.nav[page.titleKey],
        payload: {
          title: `Yok Zhang · ${m.nav[page.titleKey]}`,
          line: m.heroLine,
          url: `${origin}${localizeHref(page.path, loc)}`,
          hashtags: hashtagsFor(),
        },
      });
    }
    for (const product of liveProducts) {
      list.push({
        id: `prod-${product.path}`,
        label: product.title,
        payload: {
          title: product.title,
          line: product.note ?? m.heroLine,
          url: product.href,
          hashtags: hashtagsFor(["#gghere", product.group === "dseek" ? "#dseek" : ""].filter(Boolean)),
        },
      });
    }
    for (const dest of joinDestinations) {
      list.push({
        id: `join-${dest.id}`,
        label: dest.label,
        payload: {
          title: dest.shareTitle,
          line: dest.note,
          url: dest.href,
          hashtags: hashtagsFor(),
        },
      });
    }
    for (const theme of themes) {
      const zh = loc.startsWith("zh");
      list.push({
        id: `theme-${theme.id}`,
        label: zh ? theme.titleZh : theme.title,
        payload: {
          title: zh ? theme.titleZh : theme.title,
          line: theme.thesis,
          url: theme.url,
          hashtags: hashtagsFor(["#dseek"]),
        },
      });
    }
    if (localItem) {
      list.push({
        id: `local-${localItem.id}`,
        label: localItem.name,
        payload: {
          title: localItem.name,
          line: m.studio.localLine,
          url: localItem.local ? studioFallbackUrl(localItem) : localItem.url,
          hashtags: hashtagsFor(localItem.kind === "youtube" ? ["#youtube"] : []),
        },
      });
    }
    return list;
  }, [seed, m, origin, pathname, loc, themes, localItem]);

  const selected = options.find((o) => o.id === pick) ?? options[0];
  const payload = selected.payload;

  const copy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      /* ignore */
    }
  };

  const shareNative = async () => {
    try {
      await navigator.share({ title: payload.title, text: payload.line, url: payload.url });
    } catch {
      /* cancelled */
    }
  };

  return (
    <div className="publish-desk">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="kicker">{m.share.kicker}</p>
          <h2 className="mt-2 font-display text-3xl tracking-tight sm:text-4xl">{m.share.title}</h2>
        </div>
        {canShare ? (
          <button type="button" onClick={shareNative} className="btn btn-ghost">
            {m.share.native}
          </button>
        ) : null}
      </div>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">{m.share.lead}</p>
      <label className="mt-6 block text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
        {m.share.pickPage}
        <select
          value={selected.id}
          onChange={(e) => setPick(e.target.value)}
          className="mt-2 block w-full max-w-xl rounded-xl border border-hair bg-surface px-3 py-2 text-sm text-fg"
        >
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <dl className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-hair bg-surface p-4">
          <dt className="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">{m.share.titleLabel}</dt>
          <dd className="mt-2 font-display text-xl text-fg">{payload.title}</dd>
        </div>
        <div className="rounded-2xl border border-hair bg-surface p-4">
          <dt className="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">{m.share.lineLabel}</dt>
          <dd className="mt-2 text-sm leading-relaxed text-secondary">{payload.line}</dd>
        </div>
        <div className="rounded-2xl border border-hair bg-surface p-4">
          <dt className="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">{m.share.hashtagsLabel}</dt>
          <dd className="mt-2 font-mono text-[12px] text-accent">{payload.hashtags.join(" ")}</dd>
        </div>
        <div className="rounded-2xl border border-hair bg-surface p-4">
          <dt className="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">{m.share.urlLabel}</dt>
          <dd className="mt-2 break-all font-mono text-[12px] text-muted">{payload.url}</dd>
        </div>
      </dl>
      <ul className="mt-8 grid gap-3">
        {publishChannels.map((channel) => {
          const kit = (channel.compose ?? composeKit)(payload);
          const intent = channel.intent?.(payload.url, kit);
          const label = m.channels[channel.id];
          return (
            <li
              key={channel.id}
              className="flex flex-col gap-3 rounded-2xl border border-hair bg-deep/50 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="font-display text-xl text-fg">{label}</p>
                <p className="mt-1 whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-muted">
                  {kit}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                <button type="button" onClick={() => copy(channel.id, kit)} className="btn btn-primary">
                  {copied === channel.id ? m.cta.copied : m.cta.copyKit}
                </button>
                {intent ? (
                  <a href={intent} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                    {m.share.tweet}
                  </a>
                ) : (
                  <a href={channel.href} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                    {m.cta.openPlatform}
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-6 text-[12px] leading-relaxed text-muted">{m.share.note}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {channels.map((channel) => (
          <a
            key={channel.id}
            href={channel.href}
            target="_blank"
            rel="noopener noreferrer"
            className="tag-chip"
          >
            {m.channels[channel.id]}
          </a>
        ))}
      </div>
    </div>
  );
}

function studioFallbackUrl(item: LocalStudioItem): string {
  if (item.kind === "youtube") return item.url;
  return "https://www.jubit.ai/terminal";
}
