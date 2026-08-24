import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AuthCallback } from "@/app/components/AuthCallback";
import { isPrefixedLocale } from "@/lib/i18n";
import { t } from "@/lib/messages";
import { seo } from "@/lib/seo";

type Params = { locale: string };

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!isPrefixedLocale(locale)) return {};
  const m = t(locale);
  return {
    ...seo({
      title: m.auth.title,
      description: m.auth.signingInHint,
      path: "/auth/callback",
      locale,
    }),
    robots: { index: false, follow: false },
  };
}

export default async function LocaleAuthCallback({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!isPrefixedLocale(locale)) notFound();
  const m = t(locale);
  return (
    <Suspense
      fallback={
        <main className="page-x mx-auto max-w-lg py-24">
          <p className="text-sm text-muted">{m.auth.signingIn}</p>
        </main>
      }
    >
      <AuthCallback />
    </Suspense>
  );
}
