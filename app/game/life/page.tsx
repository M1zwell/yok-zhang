import { LifeGame } from "@/app/components/game/LifeGame";
import { t } from "@/lib/messages";
import { seo } from "@/lib/seo";

const m = t("en");

export const metadata = seo({
  title: `${m.game.life.title} · ${m.game.title}`,
  description: m.game.life.lead,
  path: "/game/life",
});

export default function LifePage() {
  return <LifeGame locale="en" />;
}
