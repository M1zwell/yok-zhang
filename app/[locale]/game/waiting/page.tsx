import { WaitingGame } from "@/app/components/game/WaitingGame";
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
    title: `${m.game.waiting.title} · ${m.game.title}`,
    description: m.game.waiting.lead,
    path: "/game/waiting",
    locale,
  });
}

export default async function LocaleWaiting({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!isPrefixedLocale(locale)) notFound();
  return <WaitingGame locale={locale} />;
}
