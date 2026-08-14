import { buildFeedXml } from "@/lib/feed";

export const dynamic = "force-static";

export function GET() {
  return new Response(buildFeedXml(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
