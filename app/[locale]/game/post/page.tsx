import { PostOfficeGame } from "@/app/components/game/PostOfficeGame";
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
    title: `${m.game.post.title} · ${m.game.title}`,
    description: m.game.post.lead,
    path: "/game/post",
    locale,
  });
}

export default async function LocalePost({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!isPrefixedLocale(locale)) notFound();
  return <PostOfficeGame locale={locale} />;
}
