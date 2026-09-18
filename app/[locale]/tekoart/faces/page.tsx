import { TekoFaces } from "@/app/components/tekoart/TekoFaces";
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
    title: `${copy.facesTitle} · ${copy.brand}`,
    description: copy.facesLead,
    path: "/tekoart/faces",
    locale,
  });
}

export default async function LocaleTekoFacesPage({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!isPrefixedLocale(locale)) notFound();
  return (
    <TekoShell locale={locale} kind="faces">
      <TekoFaces locale={locale} />
    </TekoShell>
  );
}
