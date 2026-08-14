import { links } from "@/lib/site";

export type PublishPayload = {
  title: string;
  line: string;
  url: string;
  hashtags: string[];
};

export type ChannelId = "github" | "youtube" | "tiktok" | "xiaohongshu" | "x";

export type Channel = {
  id: ChannelId;
  label: string;
  href: string;
  kind: "profile" | "publish";
  compose?: (payload: PublishPayload) => string;
  intent?: (url: string, text: string) => string;
};

export const defaultHashtags = ["#m1zwell", "#ichina", "#gghere"] as const;

export function hashtagsFor(extra: string[] = []): string[] {
  return [...new Set([...defaultHashtags, ...extra])];
}

export function composeKit(payload: PublishPayload): string {
  return [payload.title, payload.line, payload.hashtags.join(" "), payload.url].filter(Boolean).join("\n");
}

export const channels: Channel[] = [
  {
    id: "github",
    label: "GitHub",
    href: links.github,
    kind: "profile",
  },
  {
    id: "youtube",
    label: "YouTube",
    href: "https://www.youtube.com",
    kind: "publish",
    compose: (p) => `${p.title}\n\n${p.line}\n\n${p.hashtags.join(" ")}\n${p.url}`,
  },
  {
    id: "tiktok",
    label: "TikTok",
    href: "https://www.tiktok.com",
    kind: "publish",
    compose: (p) => `${p.title}\n${p.line}\n${p.hashtags.join(" ")}\n${p.url}`,
  },
  {
    id: "xiaohongshu",
    label: "小红书",
    href: "https://www.xiaohongshu.com",
    kind: "publish",
    compose: (p) => `${p.title}\n${p.line}\n${p.hashtags.join(" ")}\n${p.url}`,
  },
  {
    id: "x",
    label: "X",
    href: "https://x.com",
    kind: "publish",
    compose: (p) => `${p.title} — ${p.line} ${p.hashtags.join(" ")}`,
    intent: (url, text) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
  },
];

export const publishChannels = channels.filter((c) => c.kind === "publish");
export const profileChannels = channels.filter((c) => c.kind === "profile");

export const emails = [
  { id: "primary", label: "yok@dseek.ai", href: links.emailPrimary },
  { id: "gmail", label: "yying2010@gmail.com", href: links.emailGmail },
] as const;
