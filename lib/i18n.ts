export const locales = ["en", "zh-Hans", "zh-Hant", "ja", "ko", "th", "nl"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const prefixedLocales = locales.filter((l): l is Exclude<Locale, "en"> => l !== "en");

export const localeCookie = "locale";

export const localeMeta: Record<
  Locale,
  { html: string; og: string; hreflang: string; native: string; short: string }
> = {
  en: { html: "en", og: "en_US", hreflang: "en", native: "English", short: "EN" },
  "zh-Hans": { html: "zh-Hans", og: "zh_CN", hreflang: "zh-Hans", native: "简体中文", short: "简" },
  "zh-Hant": { html: "zh-Hant", og: "zh_TW", hreflang: "zh-Hant", native: "繁體中文", short: "繁" },
  ja: { html: "ja", og: "ja_JP", hreflang: "ja", native: "日本語", short: "JA" },
  ko: { html: "ko", og: "ko_KR", hreflang: "ko", native: "한국어", short: "KO" },
  th: { html: "th", og: "th_TH", hreflang: "th", native: "ไทย", short: "TH" },
  nl: { html: "nl", og: "nl_NL", hreflang: "nl", native: "Nederlands", short: "NL" },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function isPrefixedLocale(value: string): value is Exclude<Locale, "en"> {
  return isLocale(value) && value !== "en";
}

export function localizeHref(href: string, locale: Locale): string {
  if (!href || href.startsWith("http") || href.startsWith("mailto") || href.startsWith("#")) {
    return href;
  }
  const [pathPart, query = ""] = href.split("?");
  const hashIndex = (query || pathPart).indexOf("#");
  let path = pathPart || "/";
  let qs = query;
  let hash = "";
  if (path.includes("#")) {
    const [p, h] = path.split("#");
    path = p;
    hash = h ? `#${h}` : "";
  }
  if (qs.includes("#")) {
    const [q, h] = qs.split("#");
    qs = q;
    hash = h ? `#${h}` : "";
  }
  const suffix = `${qs ? `?${qs}` : ""}${hash}`;
  if (locale === "en") return `${path}${suffix}` || "/";
  if (path === "/") return `/${locale}${suffix}`;
  return `/${locale}${path}${suffix}`;
}

export function stripLocale(pathname: string): { locale: Locale; path: string } {
  const parts = pathname.split("/").filter(Boolean);
  const head = parts[0];
  if (head && isPrefixedLocale(head)) {
    const rest = parts.slice(1).join("/");
    return { locale: head, path: rest ? `/${rest}` : "/" };
  }
  return { locale: "en", path: pathname || "/" };
}

export function localeFromCookie(cookieHeader: string | null | undefined): Locale | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/(?:^|;\s*)locale=([^;]+)/);
  if (!match) return null;
  const value = decodeURIComponent(match[1]);
  return isLocale(value) ? value : null;
}

export function writeLocaleCookie(locale: Locale) {
  if (typeof document === "undefined") return;
  document.cookie = `${localeCookie}=${encodeURIComponent(locale)}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

