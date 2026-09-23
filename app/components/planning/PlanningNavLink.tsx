"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isPlanningOwner } from "@/lib/planning/gate";
import { useFamilySession } from "@/lib/family-session";
import type { Locale } from "@/lib/i18n";
import { localizeHref } from "@/lib/i18n";
import { t } from "@/lib/messages";

export function PlanningNavLink({
  locale,
  variant = "header",
}: {
  locale: Locale;
  variant?: "header" | "rail" | "footer" | "home";
}) {
  const session = useFamilySession();
  const pathname = usePathname() || "/";
  if (!isPlanningOwner(session?.email)) return null;

  const m = t(locale);
  const href = localizeHref("/planning", locale);
  const on = pathname === href || pathname.endsWith("/planning");

  if (variant === "home") {
    return (
      <Link href={href} className="btn btn-ghost">
        {m.nav.planning}
      </Link>
    );
  }

  if (variant === "footer") {
    return (
      <Link href={href} className="text-accent hover:text-accent-hover">
        {m.nav.planning}
      </Link>
    );
  }

  if (variant === "rail") {
    return (
      <Link href={href} className="shrink-0 text-[12px] font-medium text-muted hover:text-fg">
        {m.nav.planning}
      </Link>
    );
  }

  return (
    <Link href={href} className={on ? "nav-link is-on" : "nav-link"}>
      {m.nav.planning}
    </Link>
  );
}
