import { isLocale, type Locale } from "@/lib/i18n";

const IP_TIMEOUT_MS = 2000;

const countryLocale: Record<string, Locale> = {
  CN: "zh-Hans",
  TW: "zh-Hant",
  HK: "zh-Hant",
  MO: "zh-Hant",
  JP: "ja",
  KR: "ko",
  TH: "th",
  NL: "nl",
  BE: "nl",
};

export function localeFromCountry(country: string | null | undefined): Locale | null {
  if (!country) return null;
  return countryLocale[country.toUpperCase()] ?? null;
}

function mapBrowserTag(tag: string): Locale | "zh-ambiguous" | null {
  const raw = tag.trim().replace(/_/g, "-");
  if (!raw) return null;
  const parts = raw.split("-");
  const lang = (parts[0] || "").toLowerCase();
  const region = (parts[1] || "").toLowerCase();

  if (lang === "zh") {
    if (region === "hans" || region === "cn" || region === "sg") return "zh-Hans";
    if (region === "hant" || region === "tw" || region === "hk" || region === "mo") return "zh-Hant";
    return "zh-ambiguous";
  }
  if (lang === "ja") return "ja";
  if (lang === "ko") return "ko";
  if (lang === "th") return "th";
  if (lang === "nl") return "nl";
  if (lang === "en") return "en";
  return null;
}

export function localesFromBrowser(): { match: Locale | null; zhAmbiguous: boolean } {
  if (typeof navigator === "undefined") return { match: null, zhAmbiguous: false };
  const tags =
    navigator.languages?.length > 0
      ? navigator.languages
      : navigator.language
        ? [navigator.language]
        : [];
  let zhAmbiguous = false;
  for (const tag of tags) {
    const mapped = mapBrowserTag(tag);
    if (mapped === "zh-ambiguous") {
      zhAmbiguous = true;
      continue;
    }
    if (mapped && isLocale(mapped)) return { match: mapped, zhAmbiguous };
  }
  return { match: null, zhAmbiguous };
}

async function fetchText(url: string, ms: number): Promise<string | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function lookupCountryFromIp(): Promise<string | null> {
  const trace = await fetchText("https://www.cloudflare.com/cdn-cgi/trace", IP_TIMEOUT_MS);
  if (trace) {
    const loc = trace.match(/(?:^|\n)loc=([A-Z]{2})(?:\n|$)/);
    if (loc && loc[1] !== "XX" && loc[1] !== "T1") return loc[1];
  }

  const who = await fetchText("https://ipwho.is/", IP_TIMEOUT_MS);
  if (who) {
    try {
      const json = JSON.parse(who) as { success?: boolean; country_code?: string };
      const code = json.country_code?.toUpperCase();
      if (code && /^[A-Z]{2}$/.test(code)) return code;
    } catch {
      /* ignore malformed geo payload */
    }
  }
  return null;
}

export async function detectPreferredLocale(): Promise<Locale> {
  const { match, zhAmbiguous } = localesFromBrowser();

  if (zhAmbiguous && (!match || match === "en")) {
    const fromIp = localeFromCountry(await lookupCountryFromIp());
    if (fromIp === "zh-Hans" || fromIp === "zh-Hant") return fromIp;
    if (match) return match;
    return fromIp ?? "en";
  }

  if (match) return match;

  return localeFromCountry(await lookupCountryFromIp()) ?? "en";
}
