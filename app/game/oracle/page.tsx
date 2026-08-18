import { OracleGame } from "@/app/components/game/OracleGame";
import { t } from "@/lib/messages";
import { seo } from "@/lib/seo";

const m = t("en");

export const metadata = seo({
  title: `${m.game.oracle.title} · ${m.game.title}`,
  description: m.game.oracle.lead,
  path: "/game/oracle",
});

export default function OraclePage() {
  return <OracleGame locale="en" />;
}
