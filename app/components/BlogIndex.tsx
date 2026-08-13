"use client";

import { useMemo, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PostCard } from "@/app/components/PostCard";
import { stripLocale } from "@/lib/i18n";
import { t } from "@/lib/messages";
import type { PostMeta } from "@/lib/post-meta";
import type { ResearchTheme } from "@/lib/research";

export function BlogIndex({
  posts,
  tags,
  themes = [],
  children,
}: {
  posts: PostMeta[];
  tags: { tag: string; count: number }[];
  themes?: ResearchTheme[];
  children?: ReactNode;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname() || "/";
  const { locale } = stripLocale(pathname);
  const m = t(locale);
  const active = searchParams.get("tag") ?? "all";
  const researchOn = active.toLowerCase() === "research";
  const themeOn = themes.find((th) => th.tag.toLowerCase() === active.toLowerCase());

  const filtered = useMemo(() => {
    if (active === "all") return posts;
    const needle = active.toLowerCase();
    return posts.filter(
      (p) =>
        p.category.toLowerCase() === needle ||
        p.tags.some((tg) => tg.toLowerCase() === needle),
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
    <div className={researchOn || themeOn ? "mt-8" : "mt-12"}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="tag-chip is-on">{m.kicker.research}</span>
        <span className="text-[12px] text-muted">{m.writingPage.researchSource}</span>
      </div>
      {children}
    </div>
  ) : null;

  return (
    <div>
      {themes.length > 0 ? (
        <div className="mb-8">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-muted uppercase">
            {m.writingPage.themes}
          </p>
          <p className="mt-2 max-w-xl text-[12px] leading-relaxed text-muted">{m.writingPage.deskHint}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {themes.map((theme) => {
              const on = active.toLowerCase() === theme.tag.toLowerCase();
              return (
                <span key={theme.id} className="inline-flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setTag(theme.tag)}
                    className={`tag-chip ${on ? "is-on" : ""}`}
                  >
                    {theme.label}
                  </button>
                  <a
                    href={theme.dseekUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full px-1.5 font-mono text-[10px] text-accent hover:text-accent-hover"
                    title="dseek"
                  >
                    dseek ↗
                  </a>
                  {theme.gghereUrl ? (
                    <a
                      href={theme.gghereUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full px-1.5 font-mono text-[10px] text-accent hover:text-accent-hover"
                      title="gghere"
                    >
                      worlds ↗
                    </a>
                  ) : null}
                </span>
              );
            })}
          </div>
        </div>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setTag("all")}
          className={`tag-chip ${active === "all" ? "is-on" : ""}`}
        >
          {m.writingPage.all} ({posts.length})
        </button>
        {tags.map((item) => (
          <button
            key={item.tag}
            type="button"
            onClick={() => setTag(item.tag)}
            className={`tag-chip ${active.toLowerCase() === item.tag.toLowerCase() ? "is-on" : ""}`}
          >
            {item.tag} ({item.count})
          </button>
        ))}
      </div>
      {researchOn || themeOn ? slot : null}
      <div className="mt-10 grid gap-4">
        {filtered.map((post) => (
          <PostCard key={post.slug} post={post} locale={locale} />
        ))}
        {filtered.length === 0 ? (
          <p className="text-sm text-muted">{m.writingPage.noNotes}</p>
        ) : null}
      </div>
      {!(researchOn || themeOn) ? slot : null}
    </div>
  );
}
