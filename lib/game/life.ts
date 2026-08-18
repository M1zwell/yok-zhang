import type { Locale } from "@/lib/i18n";

export const FUN_AI_TOOLS = ["lie-detector", "face-reading", "compare"] as const;
export type FunAiTool = (typeof FUN_AI_TOOLS)[number];

export function funAiLang(locale: Locale): "en" | "tc" {
  return locale === "zh-Hans" || locale === "zh-Hant" ? "tc" : "en";
}

/** Official dseek Fun AI deep link. Do not iframe camera tools. */
export function funAiUrl({ tool, locale }: { tool: FunAiTool; locale: Locale }): string {
  const url = new URL("https://dseek.ai/data/life");
  url.searchParams.set("mode", "fun");
  url.searchParams.set("tool", tool);
  url.searchParams.set("from", "planet");
  url.searchParams.set("landmark", "ichina-game");
  url.searchParams.set("lang", funAiLang(locale));
  return url.toString();
}
