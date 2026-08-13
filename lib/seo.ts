import type { Metadata } from "next";
import { deployHost } from "@/lib/site";

export const siteUrl = `https://${deployHost}`;
export const ogImagePath = "/og.png";

type SeoInput = {
  title: string;
  description: string;
  path?: string;
  type?: "website" | "article";
  publishedTime?: string;
};

export function seo({
  title,
  description,
  path = "/",
  type = "website",
  publishedTime,
}: SeoInput): Metadata {
  const url = `${siteUrl}${path}`;
  const image = `${siteUrl}${ogImagePath}`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "ichina.co",
      locale: "en",
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
