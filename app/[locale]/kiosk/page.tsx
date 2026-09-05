import { KioskApp } from "@/app/components/kiosk/KioskApp";
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
    title: "Hostel kiosk",
    description: "Self-service hostel check-in — Cloudbeds, QFPay, ProUSB, and card dispenser, simulated on this garden.",
    path: "/kiosk",
    locale,
  });
}

export default async function LocaleKiosk({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!isPrefixedLocale(locale)) notFound();
  return <KioskApp initialLang={kioskLang(locale)} />;
}
