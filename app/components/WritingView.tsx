import { Suspense } from "react";
import { BlogIndex } from "@/app/components/BlogIndex";
import { PretextLines } from "@/app/components/PretextLines";
import { StudioShelf } from "@/app/components/StudioShelf";
import { LiveFrame } from "@/app/components/ToolStage";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/messages";
import { getAllPosts, getAllTags } from "@/lib/posts";
import { researchThemes } from "@/lib/research";
import { links, research } from "@/lib/site";

export function WritingView({ locale = "en" }: { locale?: Locale }) {
  const posts = getAllPosts();
  const tags = getAllTags();
  const m = t(locale);

  return (
    <main className="page-x mx-auto max-w-6xl py-14 sm:py-24">
      <p className="kicker">{m.kicker.writing}</p>
      <h1 className="mt-4 font-display text-[clamp(2.4rem,7vw,4.5rem)] leading-[0.95] tracking-tight">
        {m.writingPage.title}
      </h1>
      <PretextLines
        text={m.writingTacitLine}
        locale={locale}
        className="mt-5 max-w-xl text-sm leading-relaxed text-muted"
      />
      <div className="mt-12">
        <StudioShelf locale={locale} />
      </div>
      <div className="mt-16">
        <p className="mb-6 text-sm text-muted">
          Example:{" "}
          <a
            href={links.dseekResearchSymbol}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-accent hover:text-accent-hover"
          >
            dseek.ai/terminal?tab=research&symbol=00700
          </a>
        </p>
        <Suspense fallback={<p className="text-sm text-muted">{m.writingPage.loading}</p>}>
          <BlogIndex posts={posts} tags={tags} themes={researchThemes}>
            <LiveFrame
              title={research.title}
              href={research.href}
              path={research.path}
              present={research.present}
              embeddable={research.embeddable}
              embedSrc={research.embedSrc}
              brand="dseek"
              eager
            />
          </BlogIndex>
        </Suspense>
      </div>
    </main>
  );
}
