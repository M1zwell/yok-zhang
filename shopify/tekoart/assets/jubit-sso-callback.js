/**
 * Jubit family SSO return for tekoart.com (Shopify).
 * Contract matches dseek/jubuddy/ichina:
 *   GET /auth/callback?sso_token=<one-time>&next=<same-origin path>
 *   POST auth-jubit-sso { action: "validate_token", exchange_token }
 * Plays safe: same-origin next only; never open-redirect; redeem once.
 */
(() => {
  const JUBIT_SUPABASE_URL = "https://uqtkxmlpoenphznnapsv.supabase.co";
  const JUBIT_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxdGt4bWxwb2VucGh6bm5hcHN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNDI2NDAsImV4cCI6MjA2MzcxODY0MH0.mbSC35GWqU_EvMwZ2s0icEu4mRh4O3fcd_Xg5BGOY00";
  const JUBIT_SSO_FUNCTION = `${JUBIT_SUPABASE_URL}/functions/v1/auth-jubit-sso`;
  const JUBIT_SSO_URL = "https://www.jubit.ai/auth/sso";
  const SESSION_KEY = "tekoart.family.session";
  const AUTH_PREFIXES = ["/auth/", "/sso", "/account/login", "/account/register"];
  const ALLOWED_ORIGINS = new Set([
    "https://tekoart.com",
    "https://www.tekoart.com",
  ]);

  const redeemed = new Set();

  function setStatus(root, status, message) {
    if (!root) return;
    root.dataset.status = status;
    const msg = root.querySelector("[data-jubit-sso-message]");
    if (msg) msg.textContent = message;
    root.querySelectorAll("[data-jubit-sso-panel]").forEach((panel) => {
      panel.hidden = panel.getAttribute("data-jubit-sso-panel") !== status;
    });
  }

  function safeNextPath(raw) {
    if (!raw) return "/";
    let value = String(raw).trim();
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

    const pathOnly = value.split(/[?#]/)[0] || "/";
    if (
      AUTH_PREFIXES.some(
        (prefix) => pathOnly === prefix.replace(/\/$/, "") || pathOnly.startsWith(prefix)
      )
    ) {
      return "/";
    }

    return value;
  }

  function ssoTokenFromSearch(search) {
    const token =
      search.get("sso_token")?.trim() ||
      search.get("token")?.trim() ||
      search.get("exchange_token")?.trim() ||
      "";
    return token || null;
  }

  function decodeJwtPayload(token) {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    try {
      const json = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  function writeSession(session) {
    try {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      window.dispatchEvent(new Event("tekoart:family-session"));
    } catch {
      // Private mode / blocked storage — still redirect; session may not persist.
    }
  }

  function familySsoUrl() {
    const params = new URLSearchParams({
      redirect_uri: `${window.location.origin}/`,
      client_id: "tekoart",
    });
    return `${JUBIT_SSO_URL}?${params.toString()}`;
  }

  async function exchangeSsoToken(exchangeToken) {
    let response;
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

    let payload = {};
    try {
      payload = await response.json();
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

    const jwt = decodeJwtPayload(accessToken);
    const expiresAt =
      payload.session?.expires_at ??
      (typeof payload.session?.expires_in === "number"
        ? Math.floor(Date.now() / 1000) + payload.session.expires_in
        : undefined) ??
      jwt?.exp ??
      Math.floor(Date.now() / 1000) + 3600;

    return {
      ok: true,
      session: {
        accessToken,
        refreshToken,
        email: payload.session?.user?.email || payload.user?.email || jwt?.email || "",
        userId: payload.session?.user?.id || payload.user?.id || jwt?.sub || "",
        expiresAt,
      },
    };
  }

  async function run(root) {
    const search = new URLSearchParams(window.location.search);
    const token = ssoTokenFromSearch(search);
    const next = safeNextPath(search.get("next"));

    const retry = root.querySelector("[data-jubit-sso-retry]");
    if (retry) retry.setAttribute("href", familySsoUrl());

    if (!token) {
      setStatus(root, "missing", "No sign-in token. Start again from TekO Art.");
      return;
    }

    if (redeemed.has(token)) return;
    redeemed.add(token);

    setStatus(root, "working", "Validating your secure login…");

    const result = await exchangeSsoToken(token);
    if (!result.ok) {
      redeemed.delete(token);
      setStatus(root, "failed", result.error || "Token exchange failed.");
      return;
    }

    writeSession(result.session);
    setStatus(root, "ok", "Signed in. Taking you back…");
    window.setTimeout(() => {
      window.location.replace(next);
    }, 400);
  }

  function boot() {
    const roots = document.querySelectorAll("[data-jubit-sso-root]");
    if (!roots.length) return;
    roots.forEach((root) => {
      void run(root);
    });
  }

  // Expose tiny helpers for theme/header CTAs and tests.
  window.TekoartJubitSso = {
    safeNextPath,
    ssoTokenFromSearch,
    familySsoUrl,
    SESSION_KEY,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
