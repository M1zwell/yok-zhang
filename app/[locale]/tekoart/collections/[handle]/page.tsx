import { notFound } from "next/navigation";
import { TekoCollectionView } from "@/app/components/tekoart/TekoCollectionView";
import { TekoShell } from "@/app/components/tekoart/TekoShell";
import { isPrefixedLocale, prefixedLocales } from "@/lib/i18n";
import { tekoCollectionByHandle, tekoCollectionHandles } from "@/lib/tekoart/catalog";
import { tekoCopy } from "@/lib/tekoart/copy";
import { seo } from "@/lib/seo";

type Params = { locale: string; handle: string };

export function generateStaticParams() {
  return prefixedLocales.flatMap((locale) => tekoCollectionHandles().map((handle) => ({ locale, handle })));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { locale, handle } = await params;
  if (!isPrefixedLocale(locale)) return {};
  const copy = tekoCopy(locale);
  const collection = tekoCollectionByHandle(handle);
  return seo({
    title: `${collection?.title ?? handle} · ${copy.brand}`,
    description: copy.collectionLead[handle] ?? copy.lead,
    path: `/tekoart/collections/${handle}`,
    locale,
  });
}

export default async function LocaleTekoCollectionPage({ params }: { params: Promise<Params> }) {
  const { locale, handle } = await params;
  if (!isPrefixedLocale(locale) || !tekoCollectionByHandle(handle)) notFound();
  return (
    <TekoShell locale={locale} kind="collection" handle={handle}>
      <TekoCollectionView handle={handle} locale={locale} />
    </TekoShell>
  );
}
