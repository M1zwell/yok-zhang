import { Suspense } from "react";
import { Redirect } from "@/app/components/Redirect";
import { isPrefixedLocale, localizeHref } from "@/lib/i18n";
import { t } from "@/lib/messages";
import { seo } from "@/lib/seo";
import { notFound } from "next/navigation";

type Params = { locale: string };

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!isPrefixedLocale(locale)) return {};
  const m = t(locale);
  return seo({
    title: m.nav.writing,
    description: m.writingTacitLine,
    path: "/writing",
    locale,
  });
}

export default async function LocaleBlogRedirect({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!isPrefixedLocale(locale)) notFound();
  return (
    <Suspense fallback={<p className="px-5 py-24 text-sm text-muted">Continue to Writing…</p>}>
      <Redirect to={localizeHref("/writing", locale)} keepQuery />
    </Suspense>
  );
}
