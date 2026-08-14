import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import {
  estimateReadingTime,
  extractToc,
  isCategory,
  isoDate,
  slugifyHeading,
  type Category,
  type Post,
  type PostMeta,
} from "@/lib/post-meta";

export type { Category, Post, PostMeta };
export { CATEGORIES, formatDate } from "@/lib/post-meta";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

marked.setOptions({ gfm: true, breaks: false });

function withHeadingIds(html: string): string {
  return html.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_all, depth: string, inner: string) => {
    const id = slugifyHeading(inner.replace(/<[^>]+>/g, "")) || "section";
    return `<h${depth} id="${id}">${inner}</h${depth}>`;
  });
}

function readFile(file: string): Post {
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
  const { data, content } = matter(raw);
  const slug = file.replace(/\.mdx?$/, "");
  const category = isCategory(data.category) ? data.category : "Building";
  const excerpt = String(data.excerpt ?? "");
  const html = withHeadingIds(marked.parse(content, { async: false }) as string);
  const readingTime = estimateReadingTime(`${String(data.title ?? slug)}\n${excerpt}\n${content}`);
  const toc = extractToc(content);
  return {
    slug,
    title: String(data.title ?? slug),
    date: isoDate(data.date),
    category,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    excerpt,
    summary: excerpt,
    path: `writing/${slug}`,
    readingTime,
    toc,
    embedResearch: Boolean(data.embedResearch),
    source: data.source ? String(data.source) : undefined,
    sourceUrl: data.sourceUrl ? String(data.sourceUrl) : undefined,
    html,
  };
}

function allFiles(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"));
}

export function getAllPosts(): PostMeta[] {
  return allFiles()
    .map((file) => {
      const post = readFile(file);
      const { html: _html, ...meta } = post;
      return meta;
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): Post | null {
  const match = allFiles().find((file) => file.replace(/\.mdx?$/, "") === slug);
  if (!match) return null;
  return readFile(match);
}

export function getPostsByCategory(): Record<Category, PostMeta[]> {
  const grouped = {
    Building: [],
    "Hong Kong": [],
    Life: [],
    Research: [],
  } as Record<Category, PostMeta[]>;
  for (const post of getAllPosts()) {
    grouped[post.category].push(post);
  }
  return grouped;
}

export function getAllTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of getAllPosts()) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
    counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}
