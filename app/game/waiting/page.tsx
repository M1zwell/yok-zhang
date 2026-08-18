import { WaitingGame } from "@/app/components/game/WaitingGame";
import { t } from "@/lib/messages";
import { seo } from "@/lib/seo";

const m = t("en");

export const metadata = seo({
  title: `${m.game.waiting.title} · ${m.game.title}`,
  description: m.game.waiting.lead,
  path: "/game/waiting",
});

export default function WaitingPage() {
  return <WaitingGame locale="en" />;
}
