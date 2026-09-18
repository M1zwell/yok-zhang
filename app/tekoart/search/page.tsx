import { TekoSearchPage } from "@/app/components/tekoart/TekoSearchPage";
import { TekoShell } from "@/app/components/tekoart/TekoShell";
import { tekoCopy } from "@/lib/tekoart/copy";
import { seo } from "@/lib/seo";

const copy = tekoCopy("en");

export const metadata = seo({
  title: `${copy.nav.search} · ${copy.brand}`,
  description: copy.searchPlaceholder,
  path: "/tekoart/search",
});

export default function TekoSearchRoute() {
  return (
    <TekoShell locale="en" kind="search">
      <TekoSearchPage locale="en" />
    </TekoShell>
  );
}
