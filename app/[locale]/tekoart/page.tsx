import { TekoHome } from "@/app/components/tekoart/TekoHome";
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
    title: `${copy.brand} · ${copy.tagline}`,
    description: copy.lead,
    path: "/tekoart",
    locale,
  });
}

export default async function LocaleTekoartPage({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!isPrefixedLocale(locale)) notFound();
  return (
    <TekoShell locale={locale} kind="home">
      <TekoHome locale={locale} />
    </TekoShell>
  );
}
