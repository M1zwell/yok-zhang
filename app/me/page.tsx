import { MeView } from "@/app/components/me/MeView";
import { t } from "@/lib/messages";
import { seo } from "@/lib/seo";

const m = t("en");

export const metadata = seo({
  title: m.me.title,
  description: `${m.me.line1} ${m.me.line2}`,
  path: "/me",
});

export default function MePage() {
  return <MeView locale="en" />;
}
