import { notFound } from "next/navigation";
import { TekoProductView } from "@/app/components/tekoart/TekoProductView";
import { TekoShell } from "@/app/components/tekoart/TekoShell";
import { isPrefixedLocale, prefixedLocales } from "@/lib/i18n";
import { tekoProductByHandle, tekoProductHandles } from "@/lib/tekoart/catalog";
import { tekoCopy } from "@/lib/tekoart/copy";
import { seo } from "@/lib/seo";

type Params = { locale: string; handle: string };

export function generateStaticParams() {
  return prefixedLocales.flatMap((locale) => tekoProductHandles().map((handle) => ({ locale, handle })));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { locale, handle } = await params;
  if (!isPrefixedLocale(locale)) return {};
  const product = tekoProductByHandle(handle);
  const copy = tekoCopy(locale);
  return seo({
    title: product ? `${product.title} · ${copy.brand}` : copy.brand,
    description: product?.bodyHtml.replace(/<[^>]+>/g, " ").slice(0, 160) ?? copy.lead,
    path: `/tekoart/products/${handle}`,
    locale,
  });
}

export default async function LocaleTekoProductPage({ params }: { params: Promise<Params> }) {
  const { locale, handle } = await params;
  if (!isPrefixedLocale(locale)) notFound();
  const product = tekoProductByHandle(handle);
  if (!product) notFound();
  return (
    <TekoShell locale={locale} kind="product">
      <TekoProductView product={product} locale={locale} />
    </TekoShell>
  );
}
