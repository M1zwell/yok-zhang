import { TekoCartPage } from "@/app/components/tekoart/TekoCartPage";
import { TekoShell } from "@/app/components/tekoart/TekoShell";
import { tekoCopy } from "@/lib/tekoart/copy";
import { seo } from "@/lib/seo";

const copy = tekoCopy("en");

export const metadata = seo({
  title: `${copy.nav.cart} · ${copy.brand}`,
  description: copy.emptyCartLead,
  path: "/tekoart/cart",
});

export default function TekoCartRoute() {
  return (
    <TekoShell locale="en" kind="cart">
      <TekoCartPage locale="en" />
    </TekoShell>
  );
}
