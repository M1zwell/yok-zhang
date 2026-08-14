"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { defaultLocale, localizeHref, type Locale } from "@/lib/i18n";
import { t } from "@/lib/messages";
import { channels, composeKit, hashtagsFor, publishChannels } from "@/lib/channels";

export function ShareActions({
  path,
  title,
  href,
  label,
  locale = defaultLocale,
  line,
}: {
  path?: string;
  title: string;
  href?: string;
  label?: string;
  locale?: Locale;
  line?: string;
}) {
  const m = t(locale);
  const shareLabel = label ?? m.cta.share;
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const [url, setUrl] = useState(href ?? "");

  useEffect(() => {
    const abs = href ?? (path ? `${window.location.origin}${path}` : window.location.href);
    setUrl(abs);
    setCanShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, [href, path]);

  const payload = {
    title,
    line: line ?? title,
    url,
    hashtags: hashtagsFor(),
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  const shareNative = async () => {
    try {
      await navigator.share({ title, url, text: title });
    } catch {
      /* cancelled */
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {canShare ? (
        <button type="button" onClick={shareNative} className="tag-chip">
          {shareLabel}
        </button>
      ) : null}
      <button type="button" onClick={copy} className="tag-chip">
        {copied ? m.cta.copied : m.cta.copyLink}
      </button>
      {publishChannels.map((channel) => {
        const kit = (channel.compose ?? composeKit)(payload);
        const intent = channel.intent?.(url, kit);
        return (
          <a
            key={channel.id}
            href={intent ?? channel.href}
            target="_blank"
            rel="noopener noreferrer"
            className="tag-chip"
          >
            {m.channels[channel.id]}
          </a>
        );
      })}
      <a href={channels[0].href} target="_blank" rel="noopener noreferrer" className="tag-chip">
        {m.channels.github}
      </a>
      <Link href={localizeHref("/share", locale)} className="tag-chip">
        {m.cta.openDesk}
      </Link>
    </div>
  );
}
