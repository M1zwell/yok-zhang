export const CATEGORIES = ["Building", "Hong Kong", "Life", "Research"] as const;
export type Category = (typeof CATEGORIES)[number];

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  category: Category;
  tags: string[];
  excerpt: string;
  embedResearch?: boolean;
};

export type Post = PostMeta & { html: string };

export function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00+08:00`);
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
