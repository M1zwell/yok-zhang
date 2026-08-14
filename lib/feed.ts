import { getAllPosts } from "@/lib/posts";
import { researchThemes } from "@/lib/research";
import { canonicalHost } from "@/lib/site";

export { feedPath, feedUrl } from "@/lib/feed-meta";

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function rfc822(iso: string): string {
  const date = new Date(`${iso}T00:00:00+08:00`);
  return date.toUTCString();
}

export function buildFeedXml(): string {
  const posts = getAllPosts();
  const items: string[] = [];

  for (const post of posts) {
    const link = `https://${canonicalHost}/writing/${post.slug}`;
    items.push(`    <item>
      <title>${xmlEscape(post.title)}</title>
      <link>${xmlEscape(link)}</link>
      <guid isPermaLink="true">${xmlEscape(link)}</guid>
      <pubDate>${rfc822(post.date)}</pubDate>
      <description>${xmlEscape(post.summary || post.excerpt)}</description>
      <category>${xmlEscape(post.category)}</category>
    </item>`);
  }

  for (const theme of researchThemes) {
    items.push(`    <item>
      <title>${xmlEscape(`Research · ${theme.label}`)}</title>
      <link>${xmlEscape(theme.dseekUrl)}</link>
      <guid isPermaLink="true">${xmlEscape(theme.dseekUrl)}#${xmlEscape(theme.id)}</guid>
      <description>${xmlEscape(theme.label)}</description>
      <category>Research</category>
    </item>`);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Yok Zhang</title>
    <link>https://${canonicalHost}</link>
    <description>Hong Kong. Builds AI. Walks the rest. Writing and research from the garden.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items.join("\n")}
  </channel>
</rss>
`;
}
