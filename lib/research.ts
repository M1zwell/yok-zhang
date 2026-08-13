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
 * https://dseek.ai/research (and the terminal research tab).
 * Do not invent dseek article titles here.
 */
export const researchThemes: ResearchTheme[] = [
  {
    id: "city-planets",
    label: "City-planets",
    tag: "city-planets",
    dseekUrl: links.dseekResearchPage,
    gghereUrl: links.gghereWorlds,
  },
  {
    id: "walkable",
    label: "Walkable worlds",
    tag: "walkable",
    dseekUrl: links.dseekResearchPage,
    gghereUrl: links.gghereWorlds,
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
    dseekUrl: links.dseekResearchPage,
  },
];

export const dseekDesk = {
  research: links.dseekResearchPage,
  terminalResearch: links.dseekResearch,
} as const;
