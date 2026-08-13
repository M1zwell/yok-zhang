"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { PostMeta } from "@/lib/post-meta";
import { links, liveProducts, nav, tools } from "@/lib/site";

type Item = {
  id: string;
  label: string;
  hint: string;
  href: string;
  external?: boolean;
  group: string;
};

export function CommandPalette({ posts }: { posts: PostMeta[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items = useMemo<Item[]>(() => {
    const pages: Item[] = nav.map((n) => ({
      id: `page-${n.href}`,
      label: n.label,
      hint: n.href,
      href: n.href,
      group: "Garden",
    }));
    const postItems: Item[] = posts.map((p) => ({
      id: `post-${p.slug}`,
      label: p.title,
      hint: `${p.category} · /writing/${p.slug}`,
      href: `/writing/${p.slug}`,
      group: "Writing",
    }));
    const toolItems: Item[] = tools.map((t) => ({
      id: `tool-${t.id}`,
      label: t.title,
      hint: t.path,
      href: t.href,
      external: true,
      group: "Tools",
    }));
    const productItems: Item[] = liveProducts.map((p) => ({
      id: `prod-${p.path}`,
      label: p.title,
      hint: p.path,
      href: p.href,
      external: true,
      group: "Products",
    }));
    const actions: Item[] = [
      {
        id: "register",
        label: "Register",
        hint: "jubit.ai/signup",
        href: links.jubitSignup,
        external: true,
        group: "Actions",
      },
      {
        id: "signin",
        label: "Sign in",
        hint: "jubit.ai/login",
        href: links.jubitLogin,
        external: true,
        group: "Actions",
      },
      {
        id: "dseek",
        label: "Open dseek",
        hint: "dseek.ai",
        href: links.dseekHome,
        external: true,
        group: "Actions",
      },
      {
        id: "research",
        label: "Research desk",
        hint: "/writing?tag=Research",
        href: "/writing?tag=Research",
        group: "Writing",
      },
      {
        id: "gghere",
        label: "Open gghere",
        hint: "gghere.com",
        href: links.gghere,
        external: true,
        group: "Worlds",
      },
      {
        id: "gghere-worlds",
        label: "gghere /worlds",
        hint: "gghere.com/worlds",
        href: links.gghereWorlds,
        external: true,
        group: "Worlds",
      },
    ];
    return [...pages, ...postItems, ...toolItems, ...productItems, ...actions];
  }, [posts]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return items;
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(query) ||
        item.hint.toLowerCase().includes(query) ||
        item.group.toLowerCase().includes(query),
    );
  }, [items, q]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    const onCustom = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("yok:palette", onCustom);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("yok:palette", onCustom);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    setQ("");
    setActive(0);
    const t = window.setTimeout(() => inputRef.current?.focus(), 20);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [q]);

  const go = (item: Item) => {
    setOpen(false);
    if (item.external) {
      window.open(item.href, "_blank", "noopener,noreferrer");
      return;
    }
    router.push(item.href);
  };

  if (!open) return null;

  const groups = [...new Set(filtered.map((i) => i.group))];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-bg/70 px-4 pt-[12vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="palette-enter w-full max-w-xl overflow-hidden rounded-2xl border border-hair bg-surface shadow-[0_0_60px_rgba(20,184,166,0.12)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-hair px-4 py-3">
          <span className="font-mono text-[11px] text-accent">⌘K</span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((n) => Math.min(n + 1, filtered.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((n) => Math.max(n - 1, 0));
              } else if (e.key === "Enter" && filtered[active]) {
                e.preventDefault();
                go(filtered[active]);
              }
            }}
            placeholder="Jump to writing, tools, products…"
            className="w-full bg-transparent text-[15px] text-fg outline-none placeholder:text-muted"
          />
        </div>
        <div className="max-h-[min(56vh,420px)] overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <p className="px-4 py-6 text-sm text-muted">Nothing matches.</p>
          ) : (
            groups.map((group) => (
              <div key={group} className="mb-2">
                <p className="px-4 pb-1 font-ui text-[10px] font-semibold tracking-[0.16em] text-muted uppercase">
                  {group}
                </p>
                {filtered
                  .filter((i) => i.group === group)
                  .map((item) => {
                    const idx = filtered.indexOf(item);
                    const on = idx === active;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onMouseEnter={() => setActive(idx)}
                        onClick={() => go(item)}
                        className={
                          on
                            ? "flex w-full items-baseline justify-between gap-4 bg-accent/10 px-4 py-2 text-left"
                            : "flex w-full items-baseline justify-between gap-4 px-4 py-2 text-left hover:bg-elevated"
                        }
                      >
                        <span className="font-display text-[15px] text-fg">{item.label}</span>
                        <span className="truncate font-mono text-[10px] text-muted">{item.hint}</span>
                      </button>
                    );
                  })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
