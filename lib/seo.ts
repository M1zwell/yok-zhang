import type { Metadata } from "next";
import { defaultLocale, localeMeta, locales, localizeHref, type Locale } from "@/lib/i18n";
import { deployHost } from "@/lib/site";

export const siteUrl = `https://${deployHost}`;
export const ogImagePath = "/og.png";

type SeoInput = {
  title: string;
  description: string;
  path?: string;
  type?: "website" | "article";
  publishedTime?: string;
  locale?: Locale;
};

export function seo({
  title,
  description,
  path = "/",
  type = "website",
  publishedTime,
  locale = defaultLocale,
}: SeoInput): Metadata {
  const localizedPath = localizeHref(path, locale);
  const url = `${siteUrl}${localizedPath}`;
  const image = `${siteUrl}${ogImagePath}`;
  const languages: Record<string, string> = {};
  for (const loc of locales) {
    languages[localeMeta[loc].hreflang] = `${siteUrl}${localizeHref(path, loc)}`;
  }
  languages["x-default"] = `${siteUrl}${path === "/" ? "/" : path}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages,
      types: {
        "application/rss+xml": "https://ichina.co/feed.xml",
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "ichina.co",
      locale: localeMeta[locale].og,
      type,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: "Yok Zhang · m1zwell",
        },
      ],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
