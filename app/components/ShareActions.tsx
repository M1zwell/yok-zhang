"use client";

import { useEffect, useState } from "react";
import { defaultLocale, type Locale } from "@/lib/i18n";
import { t } from "@/lib/messages";
import { links } from "@/lib/site";

export function ShareActions({
  path,
  title,
  href,
  label,
  locale = defaultLocale,
}: {
  path?: string;
  title: string;
  href?: string;
  label?: string;
  locale?: Locale;
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

  const linkedin = `${links.linkedinShare}${encodeURIComponent(url)}`;

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
      <a href={linkedin} target="_blank" rel="noopener noreferrer" className="tag-chip">
        LinkedIn
      </a>
      <a href={links.github} target="_blank" rel="noopener noreferrer" className="tag-chip">
        GitHub
      </a>
    </div>
  );
}
