export const CATEGORIES = ["Building", "Hong Kong", "Life", "Research"] as const;
export type Category = (typeof CATEGORIES)[number];

export type ReadingTime = {
  text: string;
  minutes: number;
  time: number;
  words: number;
};

export type TocItem = {
  value: string;
  depth: number;
  id: string;
};

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  category: Category;
  tags: string[];
  excerpt: string;
  summary: string;
  path: string;
  readingTime: ReadingTime;
  toc: TocItem[];
  embedResearch?: boolean;
  source?: string;
  sourceUrl?: string;
};

export type Post = PostMeta & { html: string };

export function isoDate(value: unknown): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  const match = /^(\d{4}-\d{2}-\d{2})/.exec(String(value ?? ""));
  return match ? match[1] : "2026-01-01";
}

export function formatDate(iso: string): string {
  const date = new Date(`${isoDate(iso)}T00:00:00+08:00`);
  return date.toLocaleDateString("en-HK", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Hong_Kong",
  });
}

export function isCategory(value: unknown): value is Category {
  return CATEGORIES.includes(value as Category);
}

export function slugifyHeading(value: string): string {
  return value
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[\u200b\u200c\u200d]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Mixed CJK + Latin estimate, ~400 units / minute. */
export function estimateReadingTime(text: string): ReadingTime {
  const cjk = (text.match(/[\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]/g) || []).length;
  const words = (text.replace(/[\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]/g, " ").match(/[A-Za-z0-9]+/g) || []).length;
  const units = Math.max(1, cjk + words);
  const minutes = Math.max(1, Math.round(units / 400));
  return {
    text: `${minutes} min read`,
    minutes,
    time: minutes * 60_000,
    words: units,
  };
}

export function extractToc(markdown: string): TocItem[] {
  const toc: TocItem[] = [];
  const seen = new Map<string, number>();
  for (const line of markdown.split("\n")) {
    const match = /^(#{2,3})\s+(.+)$/.exec(line.trim());
    if (!match) continue;
    const value = match[2].replace(/[#*`\[\]]/g, "").trim();
    if (!value) continue;
    let id = slugifyHeading(value) || "section";
    const n = seen.get(id) ?? 0;
    seen.set(id, n + 1);
    if (n) id = `${id}-${n + 1}`;
    toc.push({ value, depth: match[1].length, id });
  }
  return toc;
}
