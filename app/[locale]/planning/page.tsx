import { PlanningDesk } from "@/app/components/planning/PlanningDesk";
import { planningCopy } from "@/lib/planning/copy";
import { isPrefixedLocale } from "@/lib/i18n";
import { seo } from "@/lib/seo";
import { notFound } from "next/navigation";

type Params = { locale: string };

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!isPrefixedLocale(locale)) return {};
  const copy = planningCopy(locale);
  return seo({
    title: copy.metaTitle,
    description: copy.metaDescription,
    path: "/planning",
    locale,
  });
}

export default async function LocalePlanning({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!isPrefixedLocale(locale)) notFound();
  return <PlanningDesk locale={locale} />;
}
