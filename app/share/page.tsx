import { ShareView } from "@/app/components/ShareView";
import { seo } from "@/lib/seo";

export const metadata = seo({
  title: "Share",
  description: "Omni-channel publish desk — copy kits for YouTube, TikTok, 小红书, and X. No invented handles.",
  path: "/share",
});

export default function SharePage() {
  return <ShareView locale="en" />;
}
