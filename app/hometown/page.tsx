import { HometownView } from "@/app/components/hometown/HometownView";
import { t } from "@/lib/messages";
import { seo } from "@/lib/seo";

const m = t("en");

export const metadata = seo({
  title: m.hometown.title,
  description: m.hometown.lead,
  path: "/hometown",
});

export default function HometownPage() {
  return <HometownView locale="en" />;
}
