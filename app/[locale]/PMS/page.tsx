import { KioskSim } from "@/app/components/kiosk/KioskSim";
import { isPrefixedLocale, type Locale } from "@/lib/i18n";
import { seo } from "@/lib/seo";
import { notFound } from "next/navigation";

type Params = { locale: string };

function kioskLang(locale: Locale): "zh-Hant" | "en" {
  if (locale === "zh-Hant" || locale === "zh-Hans") return "zh-Hant";
  return "en";
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!isPrefixedLocale(locale)) return {};
  return seo({
    title: "Hostel PMS",
    description:
      "Night-shift hostel kiosk sim — Cloudbeds, QFPay, ProUSB. The interlocks are the game.",
    path: "/PMS",
    locale,
  });
}

export default async function LocalePms({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!isPrefixedLocale(locale)) notFound();
  return <KioskSim initialLang={kioskLang(locale)} />;
}
