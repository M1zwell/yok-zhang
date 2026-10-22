/** TekO Art spoke — Jubit family SSO contract (mirrors shopify/tekoart/assets/jubit-sso-callback.js). */

export const TEKOART_ORIGIN = "https://tekoart.com";
export const TEKOART_WWW_ORIGIN = "https://www.tekoart.com";
export const TEKOART_CLIENT_ID = "tekoart";
export const TEKOART_SSO_CALLBACK_PATH = "/auth/callback";
export const TEKOART_SESSION_KEY = "tekoart.family.session";
export const JUBIT_SSO_URL = "https://www.jubit.ai/auth/sso";
export const JUBIT_SUPABASE_URL = "https://uqtkxmlpoenphznnapsv.supabase.co";
export const JUBIT_SSO_FUNCTION = `${JUBIT_SUPABASE_URL}/functions/v1/auth-jubit-sso`;

const AUTH_PREFIXES = ["/auth/", "/sso", "/account/login", "/account/register"];
const ALLOWED_ORIGINS = new Set([TEKOART_ORIGIN, TEKOART_WWW_ORIGIN]);

export function safeNextPath(raw: string | null | undefined): string {
  if (!raw) return "/";
  let value = raw.trim();
  if (!value) return "/";

  try {
    if (/^https?:\/\//i.test(value)) {
      const url = new URL(value);
      if (!ALLOWED_ORIGINS.has(url.origin)) return "/";
      value = `${url.pathname}${url.search}${url.hash}`;
    }
  } catch {
    return "/";
  }

  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return "/";
  }

  const pathOnly = value.split(/[?#]/)[0] ?? "/";
  if (
    AUTH_PREFIXES.some(
      (prefix) => pathOnly === prefix.replace(/\/$/, "") || pathOnly.startsWith(prefix),
    )
  ) {
    return "/";
  }

  return value;
}

export function ssoTokenFromSearch(search: URLSearchParams): string | null {
  const token =
    search.get("sso_token")?.trim() ||
    search.get("token")?.trim() ||
    search.get("exchange_token")?.trim() ||
    "";
  return token || null;
}

export function familySsoUrl(options: { next?: string; mode?: "register" } = {}): string {
  const next = safeNextPath(options.next);
  const params = new URLSearchParams({
    redirect_uri: `${TEKOART_ORIGIN}${next === "/" ? "/" : next}`,
    client_id: TEKOART_CLIENT_ID,
  });
  if (options.mode === "register") params.set("mode", "register");
  return `${JUBIT_SSO_URL}?${params.toString()}`;
}
