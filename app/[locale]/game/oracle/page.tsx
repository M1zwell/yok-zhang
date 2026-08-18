import { OracleGame } from "@/app/components/game/OracleGame";
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
    title: `${m.game.oracle.title} · ${m.game.title}`,
    description: m.game.oracle.lead,
    path: "/game/oracle",
    locale,
  });
}

export default async function LocaleOracle({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!isPrefixedLocale(locale)) notFound();
  return <OracleGame locale={locale} />;
}
