"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoMark } from "@/app/components/LogoMark";
import { links, nav } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="glass-header sticky top-0 z-40 border-b border-hair">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3 sm:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/" className="shrink-0" aria-label="Yok Zhang garden home">
            <LogoMark size={34} />
          </Link>
          <div className="min-w-0 leading-tight">
            <Link href="/" className="block truncate text-[12px] font-semibold tracking-wide text-fg">
              Yok Zhang
              <span className="mx-2 text-accent" aria-hidden>
                ·
              </span>
              <span className="text-muted">
                <span className="mr-1.5 text-[13px] font-medium text-accent">香港</span>
                Hong Kong
              </span>
            </Link>
            <a
              href={links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-0.5 inline-block font-mono text-[12px] text-accent transition-colors hover:text-accent-hover"
            >
              m1zwell
            </a>
          </div>
        </div>
        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {nav.map((item) => {
            const on =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  on
                    ? "rounded-lg px-3 py-1.5 text-[12px] font-semibold text-accent"
                    : "rounded-lg px-3 py-1.5 text-[12px] font-medium text-muted transition-colors hover:text-fg"
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("yok:palette"))}
            className="hidden items-center gap-2 rounded-lg border border-hair px-2.5 py-1.5 font-mono text-[11px] text-muted transition-colors hover:border-accent/40 hover:text-fg lg:inline-flex"
            aria-label="Open command palette"
          >
            <span>Search</span>
            <kbd className="rounded bg-tertiary px-1.5 py-0.5 text-[10px] text-secondary">⌘K</kbd>
          </button>
          <a href={links.jubitLogin} className="btn btn-ghost hidden sm:inline-flex">
            Sign in
          </a>
          <a href={links.jubitSignup} className="btn btn-primary">
            Register
          </a>
        </div>
      </div>
      <nav
        aria-label="Sections"
        className="flex gap-4 overflow-x-auto border-t border-hair px-5 py-2 md:hidden"
      >
        <a href={links.jubitLogin} className="shrink-0 text-[12px] font-medium text-accent sm:hidden">
          Sign in
        </a>
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="shrink-0 text-[12px] font-medium text-muted hover:text-fg"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
