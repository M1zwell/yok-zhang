import { DoodleGame } from "@/app/components/game/DoodleGame";
import { t } from "@/lib/messages";
import { seo } from "@/lib/seo";

const m = t("en");

export const metadata = seo({
  title: `${m.game.doodle.title} · ${m.game.title}`,
  description: m.game.doodle.lead,
  path: "/game/doodle",
});

export default function DoodlePage() {
  return <DoodleGame locale="en" />;
}
