"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  isPrefixedLocale,
  localeCookie,
  localeMeta,
  localizeHref,
  stripLocale,
  type Locale,
} from "@/lib/i18n";

function readCookie(): Locale | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)locale=([^;]+)/);
  if (!match) return null;
  const value = decodeURIComponent(match[1]);
  return value === "en" || isPrefixedLocale(value) ? (value as Locale) : null;
}

export function writeLocaleCookie(locale: Locale) {
  document.cookie = `${localeCookie}=${encodeURIComponent(locale)}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

export function LocaleSync() {
  const pathname = usePathname() || "/";
  const router = useRouter();

  useEffect(() => {
    const { locale, path } = stripLocale(pathname);
    document.documentElement.lang = localeMeta[locale].html;

    if (locale !== "en") {
      writeLocaleCookie(locale);
      return;
    }

    const cookie = readCookie();
    if (cookie && cookie !== "en") {
      const search = window.location.search;
      router.replace(`${localizeHref(path, cookie)}${search}`);
      return;
    }

    writeLocaleCookie("en");
  }, [pathname, router]);

  return null;
}
