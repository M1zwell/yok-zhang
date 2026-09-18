import { TekoGuide } from "@/app/components/tekoart/TekoGuide";
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
    title: `${copy.howTitle} · ${copy.brand}`,
    description: copy.guideLead,
    path: "/tekoart/guide",
    locale,
  });
}

export default async function LocaleTekoGuidePage({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!isPrefixedLocale(locale)) notFound();
  return (
    <TekoShell locale={locale} kind="guide">
      <TekoGuide locale={locale} />
    </TekoShell>
  );
}
