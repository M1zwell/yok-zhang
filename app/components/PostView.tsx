import Link from "next/link";
import { notFound } from "next/navigation";
import { ShareActions } from "@/app/components/ShareActions";
import { LiveFrame } from "@/app/components/ToolStage";
import type { Locale } from "@/lib/i18n";
import { localizeHref } from "@/lib/i18n";
import { t } from "@/lib/messages";
import { formatDate, getPost } from "@/lib/posts";
import { research } from "@/lib/site";

export function PostView({ slug, locale = "en" }: { slug: string; locale?: Locale }) {
  const post = getPost(slug);
  if (!post) notFound();
  const m = t(locale);
  const writingIndex = localizeHref("/writing", locale);
  const tagHref = (tag: string) => localizeHref(`/writing?tag=${encodeURIComponent(tag)}`, locale);
  const sharePath = localizeHref(`/writing/${post.slug}`, locale);

  return (
    <main className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
      <p className="kicker">
        <Link href={writingIndex} className="hover:text-accent-hover">
          {m.nav.writing}
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
        {post.source ? (
          <>
            <span aria-hidden>·</span>
            {post.sourceUrl ? (
              <a href={post.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent-hover">
                {post.source}
              </a>
            ) : (
              <span>{post.source}</span>
            )}
          </>
        ) : null}
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {post.tags.map((tag) => (
          <Link key={tag} href={tagHref(tag)} className="tag-chip">
            {tag}
          </Link>
        ))}
      </div>
      <div className="mt-6">
        <ShareActions path={sharePath} title={post.title} locale={locale} />
      </div>
      <article className="prose-garden mt-12" dangerouslySetInnerHTML={{ __html: post.html }} />
      {(post.embedResearch || post.category === "Research") && (
        <div className="mt-14">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="tag-chip is-on">{m.kicker.research}</span>
            <span className="text-[12px] text-muted">{m.writingPage.liveDesk}</span>
          </div>
          <LiveFrame
            title={research.title}
            href={research.href}
            path={research.path}
            present={research.present}
            embeddable={research.embeddable}
            embedSrc={research.embedSrc}
            brand="dseek"
          />
        </div>
      )}
      <p className="mt-16 border-t border-hair pt-8">
        <Link href={writingIndex} className="text-sm font-semibold text-accent hover:text-accent-hover">
          {m.writingPage.backToWriting}
        </Link>
      </p>
    </main>
  );
}
