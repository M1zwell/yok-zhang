import { TekoCartPage } from "@/app/components/tekoart/TekoCartPage";
import { TekoShell } from "@/app/components/tekoart/TekoShell";
import { isPrefixedLocale } from "@/lib/i18n";
import { tekoCopy } from "@/lib/tekoart/copy";
import { seo } from "@/lib/seo";
import { notFound } from "next/navigation";

type Params = { locale: string };

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!isPrefixedLocale(locale)) return {};
  const copy = tekoCopy(locale);
  return seo({
    title: `${copy.nav.cart} · ${copy.brand}`,
    description: copy.emptyCartLead,
    path: "/tekoart/cart",
    locale,
  });
}

export default async function LocaleTekoCartPage({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!isPrefixedLocale(locale)) notFound();
  return (
    <TekoShell locale={locale} kind="cart">
      <TekoCartPage locale={locale} />
    </TekoShell>
  );
}
