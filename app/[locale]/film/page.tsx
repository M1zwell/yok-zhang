import { FilmReel } from "@/app/components/FilmReel";
import { isPrefixedLocale } from "@/lib/i18n";
import { t } from "@/lib/messages";
import { seo } from "@/lib/seo";
import { notFound } from "next/navigation";

type Params = { locale: string };

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!isPrefixedLocale(locale)) return {};
  const m = t(locale);
  return {
    ...seo({
      title: m.intro.title,
      description: m.intro.note,
      path: "/film",
      locale,
    }),
    robots: { index: false, follow: false },
  };
}

export default async function LocaleFilmPage({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!isPrefixedLocale(locale)) notFound();
  return <FilmReel locale={locale} />;
}
