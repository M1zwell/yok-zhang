import { LifeGame } from "@/app/components/game/LifeGame";
import { isPrefixedLocale } from "@/lib/i18n";
import { t } from "@/lib/messages";
import { seo } from "@/lib/seo";
import { notFound } from "next/navigation";

type Params = { locale: string };

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!isPrefixedLocale(locale)) return {};
  const m = t(locale);
  return seo({
    title: `${m.game.life.title} · ${m.game.title}`,
    description: m.game.life.lead,
    path: "/game/life",
    locale,
  });
}

export default async function LocaleLife({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!isPrefixedLocale(locale)) notFound();
  return <LifeGame locale={locale} />;
}
