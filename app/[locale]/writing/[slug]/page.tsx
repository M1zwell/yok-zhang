import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostView } from "@/app/components/PostView";
import { isPrefixedLocale, prefixedLocales } from "@/lib/i18n";
import { getAllPosts, getPost } from "@/lib/posts";
import { seo } from "@/lib/seo";

type Params = { locale: string; slug: string };

export function generateStaticParams() {
  const posts = getAllPosts();
  return prefixedLocales.flatMap((locale) => posts.map((post) => ({ locale, slug: post.slug })));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPost(slug);
  if (!post || !isPrefixedLocale(locale)) return { title: "Note" };
  return seo({
    title: post.title,
    description: post.excerpt,
    path: `/writing/${post.slug}`,
    type: "article",
    publishedTime: post.date,
    locale,
  });
}

export default async function LocalePost({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  if (!isPrefixedLocale(locale)) notFound();
  return <PostView slug={slug} locale={locale} />;
}
