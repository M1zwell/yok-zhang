import { Suspense } from "react";
import { Redirect } from "@/app/components/Redirect";
import { isPrefixedLocale, localizeHref, prefixedLocales } from "@/lib/i18n";
import { getAllPosts, getPost } from "@/lib/posts";
import { seo } from "@/lib/seo";
import { notFound } from "next/navigation";

type Params = { locale: string; slug: string };

export function generateStaticParams() {
  const posts = getAllPosts();
  return prefixedLocales.flatMap((locale) => posts.map((post) => ({ locale, slug: post.slug })));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  const post = getPost(slug);
  if (!post || !isPrefixedLocale(locale)) return { title: "Writing" };
  return seo({
    title: post.title,
    description: post.excerpt,
    path: `/writing/${post.slug}`,
    type: "article",
    publishedTime: post.date,
    locale,
  });
}

export default async function LocaleBlogSlugRedirect({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  if (!isPrefixedLocale(locale)) notFound();
  return (
    <Suspense fallback={<p className="px-5 py-24 text-sm text-muted">Continue to Writing…</p>}>
      <Redirect to={localizeHref("/writing", locale)} slug={slug} />
    </Suspense>
  );
}
