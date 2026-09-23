import { PlanningGate } from "@/app/components/planning/PlanningGate";
import { planningGateCopy } from "@/lib/planning/gate";
import { isPrefixedLocale } from "@/lib/i18n";
import { seo } from "@/lib/seo";
import { notFound } from "next/navigation";

type Params = { locale: string };

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!isPrefixedLocale(locale)) return {};
  const copy = planningGateCopy(locale);
  return {
    ...seo({
      title: copy.title,
      description: copy.metaDescription,
      path: "/planning",
      locale,
    }),
    robots: { index: false, follow: false },
  };
}

export default async function LocalePlanning({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!isPrefixedLocale(locale)) notFound();
  return <PlanningGate locale={locale} />;
}
