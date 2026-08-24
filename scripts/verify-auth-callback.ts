import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  familySsoUrl,
  ICHINA_ORIGIN,
  JUBIT_SSO_FUNCTION,
  JUBIT_SSO_URL,
  safeNextPath,
  ssoTokenFromSearch,
} from "../lib/jubit-sso.ts";

function testSafeNextPath() {
  assert.equal(safeNextPath(null), "/");
  assert.equal(safeNextPath(""), "/");
  assert.equal(safeNextPath("/writing"), "/writing");
  assert.equal(safeNextPath("/zh-Hans/hometown?x=1"), "/zh-Hans/hometown?x=1");
  assert.equal(safeNextPath("https://ichina.co/tools"), "/tools");
  assert.equal(safeNextPath("https://evil.example/phish"), "/");
  assert.equal(safeNextPath("//evil.example"), "/");
  assert.equal(safeNextPath("/auth/callback"), "/");
  assert.equal(safeNextPath("/auth/callback?sso_token=abc"), "/");
  assert.equal(safeNextPath("https://www.ichina.co/share"), "/share");
}

function testSsoUrl() {
  const url = new URL(familySsoUrl({ next: "/writing", mode: "register" }));
  assert.equal(url.origin + url.pathname, JUBIT_SSO_URL);
  assert.equal(url.searchParams.get("redirect_uri"), `${ICHINA_ORIGIN}/writing`);
  assert.equal(url.searchParams.get("client_id"), "ichina");
  assert.equal(url.searchParams.get("mode"), "register");
  const home = new URL(familySsoUrl({ next: "/auth/callback" }));
  assert.equal(home.searchParams.get("redirect_uri"), `${ICHINA_ORIGIN}/`);
}

function testTokenParse() {
  assert.equal(ssoTokenFromSearch(new URLSearchParams("sso_token=abc")), "abc");
  assert.equal(ssoTokenFromSearch(new URLSearchParams("token=xyz")), "xyz");
  assert.equal(ssoTokenFromSearch(new URLSearchParams("next=/")), null);
}

function testBuiltPage() {
  const out = join(process.cwd(), "out");
  const candidates = [
    join(out, "auth/callback.html"),
    join(out, "auth/callback/index.html"),
  ];
  const page = candidates.find((file) => existsSync(file));
  assert.ok(page, "static export must include /auth/callback");
  const html = readFileSync(page, "utf8");
  assert.match(html, /Signing you in|Family sign-in|auth\/callback/i);
}

async function testHubContract() {
  const response = await fetch(JUBIT_SSO_FUNCTION, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "validate_token", exchange_token: "dummy" }),
  });
  assert.notEqual(response.status, 404);
  const text = await response.text();
  assert.match(text, /token|error|Invalid/i);
}

async function main() {
  testSafeNextPath();
  testSsoUrl();
  testTokenParse();
  if (existsSync(join(process.cwd(), "out"))) testBuiltPage();
  await testHubContract();
  console.log("verify-auth-callback: ok");
}

void main();
