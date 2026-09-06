import { Suspense } from "react";
import { Redirect } from "@/app/components/Redirect";
import { isPrefixedLocale, localizeHref } from "@/lib/i18n";
import { seo } from "@/lib/seo";
import { notFound } from "next/navigation";

type Params = { locale: string };

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!isPrefixedLocale(locale)) return {};
  return seo({
    title: "Hostel PMS",
    description: "Self-service hostel check-in moved to /PMS.",
    path: "/PMS",
    locale,
  });
}

export default async function LocaleKioskRedirect({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!isPrefixedLocale(locale)) notFound();
  return (
    <Suspense fallback={<p className="px-5 py-24 text-sm text-muted">Continue to PMS…</p>}>
      <Redirect to={localizeHref("/PMS", locale)} kicker="PMS" keepQuery />
    </Suspense>
  );
}
