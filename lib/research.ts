import { links } from "@/lib/site";

export type ResearchTheme = {
  id: string;
  label: string;
  tag: string;
  dseekUrl: string;
  gghereUrl?: string;
};

/**
 * Garden pins of real public themes. Source of truth for live writing:
 * https://dseek.ai/terminal?tab=research
 * Do not invent dseek article titles here.
 */
export const researchThemes: ResearchTheme[] = [
  {
    id: "city-planets",
    label: "City-planets",
    tag: "city-planets",
    dseekUrl: links.dseekResearch,
    gghereUrl: links.gghereHk,
  },
  {
    id: "walkable",
    label: "Walkable worlds",
    tag: "walkable",
    dseekUrl: links.dseekResearch,
    gghereUrl: links.gghereHk,
  },
  {
    id: "yok-iso",
    label: "Yok-Iso HK",
    tag: "yok-iso",
    dseekUrl: links.dseekHk,
  },
  {
    id: "terminal",
    label: "Scattered feeds",
    tag: "terminal",
    dseekUrl: links.dseekResearch,
  },
  {
    id: "held-together",
    label: "Held together",
    tag: "seekable",
    dseekUrl: links.dseekResearch,
  },
];

export const dseekDesk = {
  research: links.dseekResearch,
  terminalResearch: links.dseekResearch,
  symbol: links.dseekResearchSymbol,
} as const;
