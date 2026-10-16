import { readFileSync } from "node:fs";

const tokens = readFileSync("app/styles/gghere-tokens.css", "utf8");
const garden = readFileSync("app/globals.css", "utf8");
const layout = readFileSync("app/layout.tsx", "utf8");
const darkDoc = readFileSync("docs/design-tokens/dark.md", "utf8");
const lightDoc = readFileSync("docs/design-tokens/light.md", "utf8");
const typeDoc = readFileSync("docs/design-tokens/typography.md", "utf8");
const planetDoc = readFileSync("docs/design-tokens/planet-paper.md", "utf8");

function need(label: string, hay: string, needle: string) {
  if (!hay.includes(needle)) {
    throw new Error(`${label} missing ${needle}`);
  }
}

const darkBlock = tokens.slice(tokens.indexOf("html.dark {"), tokens.indexOf("html.light {"));
const lightBlock = tokens.slice(tokens.indexOf("html.light {"));

need("dark", darkBlock, "--bg: #0e0b12");
need("dark", darkBlock, "--ink: #faf3ef");
need("dark", darkBlock, "--accent-primary: var(--raw-teal-500)");
need("dark", darkBlock, "--card: #1a1620");
need("light", lightBlock, "--bg: #f6f1e8");
need("light", lightBlock, "--ink: #1f1a17");
need("light", lightBlock, "--accent-primary: var(--raw-sakura-deep)");
need("light", lightBlock, "--planet-paper: #fff8e8");
need("light", lightBlock, "--planet-cta-fill: #f5a623");
need("raw", tokens, "--raw-rice-paper: #f6f1e8");
need("raw", tokens, "--raw-sakura-deep: #c77891");
need("raw", tokens, "--font-serif:");
need("motion", tokens, "--r-lg: 18px");
need("motion", tokens, "--motion-ease: cubic-bezier(0.2, 0.8, 0.2, 1)");

need("garden day", garden, "--color-bg: #fff8e8");
need("garden sky", garden, "#bfe3e0");
need("garden amber", garden, "--color-accent: #f5a623");
need("garden ink", garden, "--color-fg: #2c2720");
need("garden pill", garden, "border-radius: 999px");
need("garden display", garden, "var(--font-inter)");
need("garden mono", garden, "var(--font-jetbrains)");
need("wordmark", garden, ".font-wordmark");
need("yok cjk", garden, ".font-yok-cjk");

need("layout jakarta", layout, "Plus_Jakarta_Sans");
need("layout mono", layout, "JetBrains_Mono");
need("layout serif", layout, "Noto+Serif+SC");
if (layout.includes("Space_Grotesk")) throw new Error("Space Grotesk still imported");

need("doc dark", darkDoc, "#0E0B12");
need("doc dark accent", darkDoc, "#14b8a6");
need("doc light", lightDoc, "#F6F1E8");
need("doc light accent", lightDoc, "#C77891");
need("doc type", typeDoc, "Plus Jakarta Sans");
need("doc type serif", typeDoc, "Noto Serif SC");
need("doc planet", planetDoc, "#fff8e8");
need("doc planet amber", planetDoc, "#f5a623");

console.log("gghere tokens packed; garden paints planet paper, amber pills, ink");
