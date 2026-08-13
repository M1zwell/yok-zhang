"use client";

import { useMemo, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PostCard } from "@/app/components/PostCard";
import type { PostMeta } from "@/lib/post-meta";

export function BlogIndex({
  posts,
  tags,
  children,
}: {
  posts: PostMeta[];
  tags: { tag: string; count: number }[];
  children?: ReactNode;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const active = searchParams.get("tag") ?? "all";
  const researchOn = active.toLowerCase() === "research";

  const filtered = useMemo(() => {
    if (active === "all") return posts;
    const needle = active.toLowerCase();
    return posts.filter(
      (p) =>
        p.category.toLowerCase() === needle ||
        p.tags.some((t) => t.toLowerCase() === needle),
    );
  }, [posts, active]);

  const setTag = (tag: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tag === "all") params.delete("tag");
    else params.set("tag", tag);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const slot = children ? (
    <div className={researchOn ? "mt-8" : "mt-12"}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="tag-chip is-on">Research</span>
        <span className="text-[12px] text-muted">a source in this stream · live desk</span>
      </div>
      {children}
    </div>
  ) : null;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setTag("all")}
          className={`tag-chip ${active === "all" ? "is-on" : ""}`}
        >
          All ({posts.length})
        </button>
        {tags.map((t) => (
          <button
            key={t.tag}
            type="button"
            onClick={() => setTag(t.tag)}
            className={`tag-chip ${active.toLowerCase() === t.tag.toLowerCase() ? "is-on" : ""}`}
          >
            {t.tag} ({t.count})
          </button>
        ))}
      </div>
      {researchOn ? slot : null}
      <div className="mt-10 grid gap-4">
        {filtered.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
        {filtered.length === 0 ? (
          <p className="text-sm text-muted">No notes in this tag yet.</p>
        ) : null}
      </div>
      {!researchOn ? slot : null}
    </div>
  );
}
