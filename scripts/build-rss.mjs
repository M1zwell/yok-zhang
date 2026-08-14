import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const matter = require("gray-matter");

const root = path.resolve(import.meta.dirname, "..");
const postsDir = path.join(root, "content/posts");
const outFile = path.join(root, "public/feed.xml");
const site = "https://ichina.co";

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function isoDate(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  const match = /^(\d{4}-\d{2}-\d{2})/.exec(String(value ?? ""));
  return match ? match[1] : "2026-01-01";
}

function rfc822(iso) {
  return new Date(`${isoDate(iso)}T00:00:00+08:00`).toUTCString();
}

const files = fs.existsSync(postsDir)
  ? fs.readdirSync(postsDir).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
  : [];

const posts = files
  .map((file) => {
    const raw = fs.readFileSync(path.join(postsDir, file), "utf8");
    const { data } = matter(raw);
    return {
      slug: file.replace(/\.mdx?$/, ""),
      title: String(data.title ?? file),
      date: isoDate(data.date),
      excerpt: String(data.excerpt ?? ""),
      category: String(data.category ?? "Building"),
    };
  })
  .sort((a, b) => b.date.localeCompare(a.date));

const research = [
  { id: "city-planets", label: "City-planets", url: "https://dseek.ai/terminal?tab=research" },
  { id: "walkable", label: "Walkable worlds", url: "https://dseek.ai/terminal?tab=research" },
  { id: "yok-iso", label: "Yok-Iso HK", url: "https://dseek.ai/hk" },
  { id: "terminal", label: "Scattered feeds", url: "https://dseek.ai/terminal?tab=research" },
  { id: "held-together", label: "Held together", url: "https://dseek.ai/terminal?tab=research" },
];

const items = [
  ...posts.map(
    (post) => `    <item>
      <title>${xmlEscape(post.title)}</title>
      <link>${site}/writing/${post.slug}</link>
      <guid isPermaLink="true">${site}/writing/${post.slug}</guid>
      <pubDate>${rfc822(post.date)}</pubDate>
      <description>${xmlEscape(post.excerpt)}</description>
      <category>${xmlEscape(post.category)}</category>
    </item>`,
  ),
  ...research.map(
    (theme) => `    <item>
      <title>${xmlEscape(`Research · ${theme.label}`)}</title>
      <link>${xmlEscape(theme.url)}</link>
      <guid isPermaLink="true">${xmlEscape(theme.url)}#${theme.id}</guid>
      <description>${xmlEscape(theme.label)}</description>
      <category>Research</category>
    </item>`,
  ),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Yok Zhang</title>
    <link>${site}</link>
    <description>Hong Kong. Builds AI. Walks the rest. Writing and research from the garden.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items.join("\n")}
  </channel>
</rss>
`;

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, xml);
console.log(`wrote ${path.relative(root, outFile)} (${posts.length} notes + ${research.length} research)`);
