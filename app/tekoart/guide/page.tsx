import { TekoGuide } from "@/app/components/tekoart/TekoGuide";
import { TekoShell } from "@/app/components/tekoart/TekoShell";
import { tekoCopy } from "@/lib/tekoart/copy";
import { seo } from "@/lib/seo";

const copy = tekoCopy("en");

export const metadata = seo({
  title: `${copy.howTitle} · ${copy.brand}`,
  description: copy.guideLead,
  path: "/tekoart/guide",
});

export default function TekoGuideRoute() {
  return (
    <TekoShell locale="en" kind="guide">
      <TekoGuide locale="en" />
    </TekoShell>
  );
}
