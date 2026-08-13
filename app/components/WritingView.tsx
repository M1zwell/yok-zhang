import { Suspense } from "react";
import { BlogIndex } from "@/app/components/BlogIndex";
import { LiveFrame } from "@/app/components/ToolStage";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/messages";
import { getAllPosts, getAllTags } from "@/lib/posts";
import { researchThemes } from "@/lib/research";
import { research } from "@/lib/site";

export function WritingView({ locale = "en" }: { locale?: Locale }) {
  const posts = getAllPosts();
  const tags = getAllTags();
  const m = t(locale);

  return (
    <main className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      <p className="kicker">{m.kicker.writing}</p>
      <h1 className="mt-4 font-display text-[clamp(2.4rem,7vw,4.5rem)] leading-[0.95] tracking-tight">
        {m.writingPage.title}
      </h1>
      <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted">{m.writingTacitLine}</p>
      <div className="mt-12">
        <Suspense fallback={<p className="text-sm text-muted">{m.writingPage.loading}</p>}>
          <BlogIndex posts={posts} tags={tags} themes={researchThemes}>
            <LiveFrame
              title={research.title}
              href={research.href}
              path={research.path}
              embeddable={research.embeddable}
              embedSrc={research.embedSrc}
              brand="dseek"
            />
          </BlogIndex>
        </Suspense>
      </div>
    </main>
  );
}
