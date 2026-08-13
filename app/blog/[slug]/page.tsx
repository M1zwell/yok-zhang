import { Suspense } from "react";
import { Redirect } from "@/app/components/Redirect";
import { getAllPosts, getPost } from "@/lib/posts";
import { seo } from "@/lib/seo";

type Params = { slug: string };

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Writing" };
  return seo({
    title: post.title,
    description: post.excerpt,
    path: `/writing/${post.slug}`,
    type: "article",
    publishedTime: post.date,
  });
}

export default async function BlogSlugRedirect({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  return (
    <Suspense fallback={<p className="px-5 py-24 text-sm text-muted">Continue to Writing…</p>}>
      <Redirect to="/writing" slug={slug} />
    </Suspense>
  );
}
