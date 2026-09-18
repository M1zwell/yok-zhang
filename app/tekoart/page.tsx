import { TekoHome } from "@/app/components/tekoart/TekoHome";
import { TekoShell } from "@/app/components/tekoart/TekoShell";
import { tekoCopy } from "@/lib/tekoart/copy";
import { seo } from "@/lib/seo";

const copy = tekoCopy("en");

export const metadata = seo({
  title: `${copy.brand} · ${copy.tagline}`,
  description: copy.lead,
  path: "/tekoart",
});

export default function TekoartPage() {
  return (
    <TekoShell locale="en" kind="home">
      <TekoHome locale="en" />
    </TekoShell>
  );
}
