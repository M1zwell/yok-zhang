import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  familySsoUrl,
  JUBIT_SSO_FUNCTION,
  JUBIT_SSO_URL,
  safeNextPath,
  ssoTokenFromSearch,
  TEKOART_ORIGIN,
  TEKOART_SSO_CALLBACK_PATH,
} from "../lib/tekoart/jubit-sso.ts";

function read(rel: string): string {
  return readFileSync(join(process.cwd(), rel), "utf8");
}

function testSafeNextPath() {
  assert.equal(safeNextPath(null), "/");
  assert.equal(safeNextPath("/collections/pictorial-book-window"), "/collections/pictorial-book-window");
  assert.equal(safeNextPath("https://tekoart.com/cart"), "/cart");
  assert.equal(safeNextPath("https://evil.example/phish"), "/");
  assert.equal(safeNextPath("//evil.example"), "/");
  assert.equal(safeNextPath("/auth/callback"), "/");
  assert.equal(safeNextPath("/auth/callback?sso_token=abc"), "/");
}

function testTokenParse() {
  assert.equal(ssoTokenFromSearch(new URLSearchParams("sso_token=abc")), "abc");
  assert.equal(ssoTokenFromSearch(new URLSearchParams("token=xyz")), "xyz");
  assert.equal(ssoTokenFromSearch(new URLSearchParams("next=/")), null);
}

function testSsoUrl() {
  const url = new URL(familySsoUrl({ next: "/cart", mode: "register" }));
  assert.equal(url.origin + url.pathname, JUBIT_SSO_URL);
  assert.equal(url.searchParams.get("redirect_uri"), `${TEKOART_ORIGIN}/cart`);
  assert.equal(url.searchParams.get("client_id"), "tekoart");
  assert.equal(url.searchParams.get("mode"), "register");
}

function testThemeFiles() {
  const required = [
    "shopify/tekoart/assets/jubit-sso-callback.js",
    "shopify/tekoart/snippets/jubit-auth-callback.liquid",
    "shopify/tekoart/sections/jubit-auth-callback.liquid",
    "shopify/tekoart/sections/main-404.liquid",
    "shopify/tekoart/templates/page.jubit-auth-callback.json",
    "shopify/tekoart/templates/404.json",
  ];
  for (const file of required) {
    assert.ok(existsSync(join(process.cwd(), file)), `missing ${file}`);
  }

  const js = read("shopify/tekoart/assets/jubit-sso-callback.js");
  assert.match(js, /validate_token/);
  assert.match(js, /sso_token/);
  assert.match(js, /tekoart\.family\.session/);
  assert.match(js, /auth-jubit-sso/);

  const fourOhFour = read("shopify/tekoart/sections/main-404.liquid");
  assert.match(fourOhFour, /\/auth\/callback/);
  assert.match(fourOhFour, /jubit-auth-callback/);

  const pageTpl = read("shopify/tekoart/templates/page.jubit-auth-callback.json");
  assert.match(pageTpl, /jubit-auth-callback/);

  assert.equal(TEKOART_SSO_CALLBACK_PATH, "/auth/callback");
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
  testTokenParse();
  testSsoUrl();
  testThemeFiles();
  await testHubContract();
  console.log("verify-tekoart-sso-callback: ok");
}

void main();
