import { DoodleGame } from "@/app/components/game/DoodleGame";
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
    title: `${m.game.doodle.title} · ${m.game.title}`,
    description: m.game.doodle.lead,
    path: "/game/doodle",
    locale,
  });
}

export default async function LocaleDoodle({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!isPrefixedLocale(locale)) notFound();
  return <DoodleGame locale={locale} />;
}
