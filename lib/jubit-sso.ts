/** Public Jubit hub (same project dseek uses). The anon key is a browser key. */
export const JUBIT_SSO_URL = "https://www.jubit.ai/auth/sso";
export const JUBIT_SUPABASE_URL = "https://uqtkxmlpoenphznnapsv.supabase.co";
export const JUBIT_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxdGt4bWxwb2VucGh6bm5hcHN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNDI2NDAsImV4cCI6MjA2MzcxODY0MH0.mbSC35GWqU_EvMwZ2s0icEu4mRh4O3fcd_Xg5BGOY00";
export const JUBIT_SSO_FUNCTION = `${JUBIT_SUPABASE_URL}/functions/v1/auth-jubit-sso`;

export const ICHINA_ORIGIN = "https://ichina.co";
export const FAMILY_SESSION_KEY = "ichina.family.session";
export const FAMILY_SESSION_EVENT = "ichina:family-session";
export const FAMILY_CLIENT_ID = "ichina";

const AUTH_PREFIXES = ["/auth/", "/sso"];

export type FamilySession = {
  accessToken: string;
  refreshToken: string;
  email: string;
  userId: string;
  expiresAt: number;
};

type ValidatePayload = {
  success?: boolean;
  error?: string;
  needs_reauth?: boolean;
  session?: {
    access_token?: string;
    refresh_token?: string;
    expires_at?: number;
    expires_in?: number;
    user?: { id?: string; email?: string };
  };
  user?: { id?: string; email?: string };
};

type JwtPayload = {
  email?: string;
  sub?: string;
  exp?: number;
};

export function safeNextPath(raw: string | null | undefined): string {
  if (!raw) return "/";
  let value = raw.trim();
  if (!value) return "/";

  try {
    if (/^https?:\/\//i.test(value)) {
      const url = new URL(value);
      if (url.origin !== ICHINA_ORIGIN && url.origin !== "https://www.ichina.co") {
        return "/";
      }
      value = `${url.pathname}${url.search}${url.hash}`;
    }
  } catch {
    return "/";
  }

  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return "/";
  }

  const pathOnly = value.split(/[?#]/)[0] ?? "/";
  if (AUTH_PREFIXES.some((prefix) => pathOnly === prefix.replace(/\/$/, "") || pathOnly.startsWith(prefix))) {
    return "/";
  }

  return value;
}

export function familySsoUrl(options: { next?: string; mode?: "register" } = {}): string {
  const next = safeNextPath(options.next);
  const params = new URLSearchParams({
    redirect_uri: `${ICHINA_ORIGIN}${next}`,
    client_id: FAMILY_CLIENT_ID,
  });
  if (options.mode === "register") params.set("mode", "register");
  return `${JUBIT_SSO_URL}?${params.toString()}`;
}

export function ssoTokenFromSearch(search: URLSearchParams): string | null {
  const token =
    search.get("sso_token")?.trim() ||
    search.get("token")?.trim() ||
    search.get("exchange_token")?.trim() ||
    "";
  return token || null;
}

export function decodeJwtPayload(token: string): JwtPayload | null {
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const json = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

export function readFamilySession(): FamilySession | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(FAMILY_SESSION_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as FamilySession;
    if (!parsed.accessToken || !parsed.refreshToken) return null;
    if (typeof parsed.expiresAt === "number" && parsed.expiresAt * 1000 < Date.now() - 30_000) {
      window.localStorage.removeItem(FAMILY_SESSION_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function writeFamilySession(session: FamilySession): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(FAMILY_SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event(FAMILY_SESSION_EVENT));
}

export function clearFamilySession(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(FAMILY_SESSION_KEY);
  window.dispatchEvent(new Event(FAMILY_SESSION_EVENT));
}

export function sessionFromTokens(accessToken: string, refreshToken: string, extra?: {
  email?: string;
  userId?: string;
  expiresAt?: number;
  expiresIn?: number;
}): FamilySession {
  const jwt = decodeJwtPayload(accessToken);
  const expiresAt =
    extra?.expiresAt ??
    (typeof extra?.expiresIn === "number" ? Math.floor(Date.now() / 1000) + extra.expiresIn : undefined) ??
    jwt?.exp ??
    Math.floor(Date.now() / 1000) + 3600;
  return {
    accessToken,
    refreshToken,
    email: extra?.email || jwt?.email || "",
    userId: extra?.userId || jwt?.sub || "",
    expiresAt,
  };
}

export async function exchangeSsoToken(exchangeToken: string): Promise<
  { ok: true; session: FamilySession } | { ok: false; error: string }
> {
  let response: Response;
  try {
    response = await fetch(JUBIT_SSO_FUNCTION, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: JUBIT_ANON_KEY,
        Authorization: `Bearer ${JUBIT_ANON_KEY}`,
      },
      body: JSON.stringify({ action: "validate_token", exchange_token: exchangeToken }),
    });
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "network" };
  }

  let payload: ValidatePayload = {};
  try {
    payload = (await response.json()) as ValidatePayload;
  } catch {
    return { ok: false, error: "invalid-json" };
  }

  if (!response.ok || payload.success === false || payload.needs_reauth) {
    return { ok: false, error: payload.error || `http-${response.status}` };
  }

  const accessToken = payload.session?.access_token;
  const refreshToken = payload.session?.refresh_token;
  if (!accessToken || !refreshToken) {
    return { ok: false, error: payload.error || "missing-session" };
  }

  return {
    ok: true,
    session: sessionFromTokens(accessToken, refreshToken, {
      email: payload.session?.user?.email || payload.user?.email,
      userId: payload.session?.user?.id || payload.user?.id,
      expiresAt: payload.session?.expires_at,
      expiresIn: payload.session?.expires_in,
    }),
  };
}

export async function signOutFamilySession(): Promise<void> {
  const session = readFamilySession();
  clearFamilySession();
  if (!session) return;
  try {
    await fetch(`${JUBIT_SUPABASE_URL}/auth/v1/logout`, {
      method: "POST",
      headers: {
        apikey: JUBIT_ANON_KEY,
        Authorization: `Bearer ${session.accessToken}`,
      },
    });
  } catch {
    // Local sign-out is enough if the hub is unreachable.
  }
}
