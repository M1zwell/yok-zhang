import { Suspense } from "react";
import { BlogIndex } from "@/app/components/BlogIndex";
import { LiveFrame } from "@/app/components/ToolStage";
import { getAllPosts, getAllTags } from "@/lib/posts";
import { research } from "@/lib/site";

export const metadata = {
  title: "Blog",
  description: "All posts from Yok Zhang's digital garden.",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <main className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      <p className="kicker">Garden</p>
      <h1 className="mt-4 font-display text-[clamp(2.4rem,7vw,4.5rem)] leading-[0.95] tracking-tight">
        All Posts
      </h1>
      <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted">
        Building, Hong Kong, Life, Research. Filter by tag. Research also lives live in the dseek
        terminal.
      </p>
      <div className="mt-12">
        <Suspense fallback={<p className="text-sm text-muted">Loading notes…</p>}>
          <BlogIndex posts={posts} tags={tags} />
        </Suspense>
      </div>
      <section className="mt-20">
        <p className="kicker">Research desk</p>
        <h2 className="mt-3 font-display text-3xl tracking-tight">Live writing surface</h2>
        <p className="mt-3 max-w-xl text-sm text-muted">
          The research tab is the desk. Local notes above are what left it.
        </p>
        <div className="mt-8">
          <LiveFrame
            title={research.title}
            href={research.href}
            path={research.path}
            embeddable={research.embeddable}
            embedSrc={research.embedSrc}
          />
        </div>
      </section>
    </main>
  );
}
