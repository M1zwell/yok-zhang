import type { Metadata } from "next";
import { PostView } from "@/app/components/PostView";
import { getAllPosts, getPost } from "@/lib/posts";
import { seo } from "@/lib/seo";

type Params = { slug: string };

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Note" };
  return seo({
    title: post.title,
    description: post.excerpt,
    path: `/writing/${post.slug}`,
    type: "article",
    publishedTime: post.date,
  });
}

export default async function PostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  return <PostView slug={slug} locale="en" />;
}
