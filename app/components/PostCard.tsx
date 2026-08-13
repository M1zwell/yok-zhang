import Link from "next/link";
import type { PostMeta } from "@/lib/post-meta";
import { formatDate } from "@/lib/post-meta";
import { ShareActions } from "@/app/components/ShareActions";

export function PostCard({ post, featured = false }: { post: PostMeta; featured?: boolean }) {
  return (
    <article className={`card group p-5 sm:p-6 ${featured ? "sm:p-8" : ""}`}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
        <span className="font-semibold tracking-wide text-accent uppercase">{post.category}</span>
        <time className="font-mono text-muted" dateTime={post.date}>
          {formatDate(post.date)}
        </time>
      </div>
      <h3 className={`mt-3 font-display tracking-tight text-fg group-hover:text-accent ${featured ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"}`}>
        <Link href={`/writing/${post.slug}`}>{post.title}</Link>
      </h3>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{post.excerpt}</p>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <Link key={tag} href={`/writing?tag=${encodeURIComponent(tag)}`} className="tag-chip">
              {tag}
            </Link>
          ))}
        </div>
        <Link
          href={`/writing/${post.slug}`}
          className="text-[12px] font-semibold text-accent hover:text-accent-hover"
        >
          Read more →
        </Link>
      </div>
      <div className="mt-4">
        <ShareActions path={`/writing/${post.slug}`} title={post.title} />
      </div>
    </article>
  );
}
