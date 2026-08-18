import { PostOfficeGame } from "@/app/components/game/PostOfficeGame";
import { t } from "@/lib/messages";
import { seo } from "@/lib/seo";

const m = t("en");

export const metadata = seo({
  title: `${m.game.post.title} · ${m.game.title}`,
  description: m.game.post.lead,
  path: "/game/post",
});

export default function PostOfficePage() {
  return <PostOfficeGame locale="en" />;
}
