import { notFound } from "next/navigation";
import { isPrefixedLocale, localeMeta, prefixedLocales, type Locale } from "@/lib/i18n";
import { t } from "@/lib/messages";
import { seo } from "@/lib/seo";

export function generateStaticParams() {
  return prefixedLocales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isPrefixedLocale(locale)) return {};
  const m = t(locale);
  return {
    ...seo({
      title: "Yok Zhang",
      description: `${m.heroLine} m1zwell.`,
      path: "/",
      locale,
    }),
    title: {
      default: "Yok Zhang",
      template: "%s · Yok Zhang",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isPrefixedLocale(locale)) notFound();
  const htmlLang = localeMeta[locale as Locale].html;
  return (
    <div lang={htmlLang} data-locale={locale}>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang=${JSON.stringify(htmlLang)};`,
        }}
      />
      {children}
    </div>
  );
}
