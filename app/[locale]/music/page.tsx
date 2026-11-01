import { MusicView } from "@/app/components/music/MusicView";
import { isPrefixedLocale } from "@/lib/i18n";
import { seo } from "@/lib/seo";
import { notFound } from "next/navigation";

type Params = { locale: string };

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!isPrefixedLocale(locale)) return {};
  return seo({
    title: "AI Music Play",
    description: "A listening room for 200 original synthetic instrumentals. Hong Kong, China and Japan playlists, with MIDI downloads.",
    path: "/music",
    locale,
  });
}

export default async function LocaleMusic({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!isPrefixedLocale(locale)) notFound();
  return <MusicView locale={locale} />;
}
