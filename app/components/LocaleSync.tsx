"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { detectPreferredLocale } from "@/lib/locale-detect";
import {
  localeFromCookie,
  localeMeta,
  localizeHref,
  stripLocale,
  writeLocaleCookie,
} from "@/lib/i18n";

export { writeLocaleCookie };

export function LocaleSync() {
  const pathname = usePathname() || "/";
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    const { locale, path } = stripLocale(pathname);
    document.documentElement.lang = localeMeta[locale].html;

    if (locale !== "en") {
      writeLocaleCookie(locale);
      return;
    }

    const cookie = localeFromCookie(document.cookie);
    if (cookie) {
      if (cookie !== "en") {
        const href = `${localizeHref(path, cookie)}${window.location.search}`;
        if (href !== pathname + window.location.search) {
          router.replace(href);
        }
      }
      return;
    }

    (async () => {
      const detected = await detectPreferredLocale();
      if (cancelled) return;
      if (localeFromCookie(document.cookie)) return;
      writeLocaleCookie(detected);
      document.documentElement.lang = localeMeta[detected].html;
      if (detected === "en") return;
      const href = `${localizeHref(path, detected)}${window.location.search}`;
      if (href !== pathname + window.location.search) {
        router.replace(href);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  return null;
}
