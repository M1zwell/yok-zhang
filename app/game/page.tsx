import { GameHub } from "@/app/components/game/GameHub";
import { t } from "@/lib/messages";
import { seo } from "@/lib/seo";

const m = t("en");

export const metadata = seo({
  title: m.game.title,
  description: m.game.subtitle,
  path: "/game",
});

export default function GamePage() {
  return <GameHub locale="en" />;
}
