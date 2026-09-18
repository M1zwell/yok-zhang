import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { shopifyCartPermalink, TEKOART_ORIGIN, variantGid } from "../lib/tekoart/shopify.ts";
import { tekoDawnTokens, tekoForbiddenBeehiveSwatches } from "../lib/tekoart/tokens.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function read(path: string) {
  return readFileSync(join(root, path), "utf8");
}

function testTokensLocked() {
  assert.equal(tekoDawnTokens.colorBackgroundHex, "#D8CBB3");
  assert.equal(tekoDawnTokens.colorForegroundHex, "#292321");
  assert.equal(tekoDawnTokens.colorButtonHex, "#D9899D");
  assert.equal(tekoDawnTokens.colorBackgroundContrastHex, "#AD915F");
  assert.equal(tekoDawnTokens.buttonsRadius, "0px");
  assert.equal(tekoDawnTokens.variantPillsRadius, "40px");
  const css = read("app/components/tekoart/tekoart.css");
  assert.match(css, /--color-background:\s*216,\s*203,\s*179/);
  assert.match(css, /--color-button:\s*217,\s*137,\s*157/);
  assert.match(css, /--font-heading-family:\s*"DM Serif Display"/);
  assert.match(css, /--font-body-family:\s*"SF Mono"/);
  for (const swatch of tekoForbiddenBeehiveSwatches) {
    assert.doesNotMatch(css, new RegExp(swatch, "i"));
  }
  const schema = read("shopify/tekoart/config/settings_schema.json");
  assert.match(schema, /#D8CBB3/);
  assert.match(schema, /#D9899D/);
  assert.match(schema, /#AD915F/);
}

function testCatalog() {
  const catalog = JSON.parse(read("lib/tekoart/catalog.json")) as {
    products: { handle: string }[];
    collectionProducts: Record<string, string[]>;
  };
  assert.equal(catalog.products.length, 4);
  const handles = catalog.products.map((product) => product.handle).sort();
  assert.deepEqual(handles, [
    "juju-card-holder",
    "juju-tcg-window-case",
    "qilin-tcg-window-case",
    "yutu-tcg-window-case",
  ]);
  assert.ok(catalog.collectionProducts["pictorial-book-window"]?.includes("qilin-tcg-window-case"));
}

function testCart() {
  const cartSrc = read("lib/tekoart/cart.ts");
  assert.match(cartSrc, /case "hydrate"/);
  assert.match(cartSrc, /const _never: never = action/);
  const url = shopifyCartPermalink([{ variantId: 1, quantity: 2 }]);
  assert.equal(url, `${TEKOART_ORIGIN}/cart/1:2`);
  assert.equal(variantGid(1), "gid://shopify/ProductVariant/1");
}

function testCopyAndRoutes() {
  const en = read("lib/messages/en.ts");
  const zh = read("lib/messages/zh-Hant.ts");
  const copy = read("lib/tekoart/copy.ts");
  const paths = read("lib/tekoart/paths.ts");
  assert.match(en, /groupShop: "TekO Art"/);
  assert.match(zh, /groupShop: "TekO Art"/);
  assert.match(copy, /A case you dress/);
  assert.match(copy, /殼只是畫框/);
  assert.match(paths, /\/tekoart/);
  const site = read("lib/site.ts");
  assert.match(site, /href: "\/tekoart"/);
}

function testFiles() {
  const files = [
    "app/tekoart/page.tsx",
    "app/tekoart/products/[handle]/page.tsx",
    "app/tekoart/collections/[handle]/page.tsx",
    "app/tekoart/cart/page.tsx",
    "app/tekoart/faces/page.tsx",
    "app/tekoart/guide/page.tsx",
    "shopify/tekoart/layout/theme.liquid",
    "shopify/tekoart/assets/teko-storefront.css",
    "lib/tekoart/catalog.json",
  ];
  for (const file of files) {
    assert.ok(existsSync(join(root, file)), file);
  }
}

function testBuiltPage() {
  const out = join(process.cwd(), "out");
  if (!existsSync(out)) return;
  const candidates = [join(out, "tekoart.html"), join(out, "tekoart/index.html")];
  const page = candidates.find((file) => existsSync(file));
  assert.ok(page, "static export must include /tekoart");
  const html = readFileSync(page, "utf8");
  assert.match(html, /teko-root/);
  assert.match(html, /A case you dress/);
  const cssDir = join(out, "_next/static/css");
  assert.ok(existsSync(cssDir), "exported CSS");
  const css = readdirSync(cssDir)
    .filter((file) => file.endsWith(".css"))
    .map((file) => readFileSync(join(cssDir, file), "utf8"))
    .join("\n");
  assert.match(css, /216,\s*203,\s*179/);
  assert.match(css, /217,\s*137,\s*157/);
}

function main() {
  testTokensLocked();
  testCatalog();
  testCart();
  testCopyAndRoutes();
  testFiles();
  testBuiltPage();
  console.log("verify-tekoart: ok");
}

main();
