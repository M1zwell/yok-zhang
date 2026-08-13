import { Suspense } from "react";
import { BlogIndex } from "@/app/components/BlogIndex";
import { LiveFrame } from "@/app/components/ToolStage";
import { getAllPosts, getAllTags } from "@/lib/posts";
import { seo } from "@/lib/seo";
import { research, writingTacitLine } from "@/lib/site";

export const metadata = seo({
  title: "Writing",
  description: "Notes, tags, and the live research desk — one stream.",
  path: "/writing",
});

export default function WritingPage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <main className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      <p className="kicker">Writing</p>
      <h1 className="mt-4 font-display text-[clamp(2.4rem,7vw,4.5rem)] leading-[0.95] tracking-tight">
        Writing
      </h1>
      <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted">{writingTacitLine}</p>
      <div className="mt-12">
        <Suspense fallback={<p className="text-sm text-muted">Loading notes…</p>}>
          <BlogIndex posts={posts} tags={tags}>
            <LiveFrame
              title={research.title}
              href={research.href}
              path={research.path}
              embeddable={research.embeddable}
              embedSrc={research.embedSrc}
            />
          </BlogIndex>
        </Suspense>
      </div>
    </main>
  );
}
