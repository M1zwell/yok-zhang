/**
 * Studio desk + NotebookLM-class sources.
 * Live studio: jubit.ai/terminal (right sidebar). Do not invent private APIs.
 * Featured themes: dseek.ai/research/featured.json (CORS-open, real feed).
 */

export const studioDesk = {
  href: "https://www.jubit.ai/terminal",
  path: "jubit.ai/terminal",
  embedSrc: "https://www.jubit.ai/terminal",
  /** Try the frame; LiveFrame falls back if the host blocks it. */
  embeddable: true,
  feed: "https://dseek.ai/research/featured.json",
} as const;

export type FeaturedTheme = {
  id: string;
  title: string;
  titleZh: string;
  thesis: string;
  asOf: string;
  url: string;
  sourceUrl: string;
  jsonUrl: string;
  claimCount?: number;
  correctionCount?: number;
};

export type FeaturedFeed = {
  product: string;
  generatedAt: string;
  themes: FeaturedTheme[];
};

/** Pinned from the live feed (generatedAt 2026-08-13). Used if fetch fails. */
export const pinnedThemes: FeaturedTheme[] = [
  {
    id: "theme-semis-2029-pivot",
    title: "Semiconductor hegemony 2029: ASML, TSMC and the Terafab pivot",
    titleZh: "半导体霸权 2029：ASML、台积电与 Terafab 拐点",
    thesis:
      "Three dated protections — memory price floors, TSMC's Low-NA runway, and ASML's uncontested light source — all approach expiry around 2029, the same year the Terafab/xLight challenger stack targets maturity. Until then incumbents keep pricing power; the trade is watching whether the challengers' milestones hold, because each one is dated and checkable while the narrative is neither.",
    asOf: "2026-08-11",
    url: "https://dseek.ai/terminal?tab=research&view=themes&theme=theme-semis-2029-pivot",
    sourceUrl: "https://dseek.ai/research/notes/theme-semis-2029-pivot.md",
    jsonUrl: "https://dseek.ai/research/notes/theme-semis-2029-pivot.json",
    claimCount: 18,
    correctionCount: 1,
  },
  {
    id: "ai-software-chain",
    title: "AI software chain — modality economics",
    titleZh: "AI 软件链：模态经济学",
    thesis:
      "The pricing unit decides fate (seat loses, usage gains, outcome wins), modality decides unit economics (text deflation does not rescue per-second video), and in generative modalities legal usability now outprices quality.",
    asOf: "2026-07-30",
    url: "https://dseek.ai/terminal?tab=research&view=themes&theme=ai-software-chain",
    sourceUrl: "https://dseek.ai/research/notes/ai-software-chain.md",
    jsonUrl: "https://dseek.ai/research/notes/ai-software-chain.json",
    claimCount: 21,
    correctionCount: 7,
  },
  {
    id: "theme-ai-hardware-chain",
    title: "AI hardware chain: the constraint migrates, and the money follows",
    titleZh: "AI 硬件全链：约束迁移，钱跟着约束走",
    thesis:
      "Excess profit in the AI hardware chain always piles up on whichever pipe is narrowest right now — and that pipe moves every 6 to 12 months, which in 2026 puts it at grid power rather than anything made of silicon.",
    asOf: "2026-07",
    url: "https://dseek.ai/terminal?tab=research&view=themes&theme=theme-ai-hardware-chain",
    sourceUrl: "https://dseek.ai/research/notes/theme-ai-hardware-chain.md",
    jsonUrl: "https://dseek.ai/research/notes/theme-ai-hardware-chain.json",
    claimCount: 20,
    correctionCount: 0,
  },
  {
    id: "hk-luxury-mpv",
    title: "HK luxury MPV — the moat moved",
    titleZh: "香港豪华 MPV：护城河已迁移",
    thesis:
      "The Alphard’s moat was Hong Kong’s tax-and-scarcity structure, not the vehicle — and the binding constraint has migrated from acquisition tax to charging capacity and residual-value discovery.",
    asOf: "2026-07-30",
    url: "https://dseek.ai/terminal?tab=research&view=themes&theme=hk-luxury-mpv",
    sourceUrl: "https://dseek.ai/research/notes/hk-luxury-mpv.md",
    jsonUrl: "https://dseek.ai/research/notes/hk-luxury-mpv.json",
    claimCount: 12,
    correctionCount: 4,
  },
];

export type StudioKindId =
  | "ppt"
  | "pdf"
  | "mp4"
  | "youtube"
  | "video-overview"
  | "slide-deck"
  | "infographic"
  | "audio";

export type StudioKind = {
  id: StudioKindId;
  ext?: string[];
  notebooklm: boolean;
};

export const studioKinds: StudioKind[] = [
  { id: "ppt", ext: [".ppt", ".pptx"], notebooklm: false },
  { id: "pdf", ext: [".pdf"], notebooklm: false },
  { id: "mp4", ext: [".mp4"], notebooklm: false },
  { id: "youtube", notebooklm: false },
  { id: "video-overview", notebooklm: true },
  { id: "slide-deck", notebooklm: true },
  { id: "infographic", notebooklm: true },
  { id: "audio", notebooklm: true },
];

export function youtubeId(value: string): string | null {
  try {
    const url = new URL(value.trim());
    const host = url.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id || null;
    }
    if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
      if (url.pathname.startsWith("/embed/")) return url.pathname.split("/")[2] || null;
      if (url.pathname.startsWith("/shorts/")) return url.pathname.split("/")[2] || null;
      return url.searchParams.get("v");
    }
  } catch {
    return null;
  }
  return null;
}

export function youtubeEmbed(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`;
}

export type LocalStudioItem = {
  id: string;
  kind: "ppt" | "pdf" | "mp4" | "youtube";
  name: string;
  url: string;
  local: boolean;
};

export function kindFromName(name: string): LocalStudioItem["kind"] | null {
  const lower = name.toLowerCase();
  if (lower.endsWith(".ppt") || lower.endsWith(".pptx")) return "ppt";
  if (lower.endsWith(".pdf")) return "pdf";
  if (lower.endsWith(".mp4")) return "mp4";
  return null;
}
