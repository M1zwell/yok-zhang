import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LiveFrame } from "@/app/components/ToolStage";
import { formatDate, getAllPosts, getPost } from "@/lib/posts";
import { research } from "@/lib/site";

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
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <main className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
      <p className="kicker">
        <Link href="/blog" className="hover:text-accent-hover">
          Blog
        </Link>
        <span className="mx-2 text-muted">/</span>
        {post.category}
      </p>
      <h1 className="mt-4 font-display text-[clamp(2.1rem,6vw,3.6rem)] leading-[1.02] tracking-tight">
        {post.title}
      </h1>
      <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-muted">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span aria-hidden>·</span>
        <span>Yok Zhang</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {post.tags.map((tag) => (
          <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`} className="tag-chip">
            {tag}
          </Link>
        ))}
      </div>
      <article className="prose-garden mt-12" dangerouslySetInnerHTML={{ __html: post.html }} />
      {(post.embedResearch || post.category === "Research") && (
        <div className="mt-14">
          <p className="kicker mb-4">Live desk</p>
          <LiveFrame
            title={research.title}
            href={research.href}
            path={research.path}
            embeddable={research.embeddable}
            embedSrc={research.embedSrc}
          />
        </div>
      )}
      <p className="mt-16 border-t border-hair pt-8">
        <Link href="/blog" className="text-sm font-semibold text-accent hover:text-accent-hover">
          ← All posts
        </Link>
      </p>
    </main>
  );
}
