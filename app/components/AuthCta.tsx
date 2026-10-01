"use client";

import { usePathname } from "next/navigation";
import { useFamilySession } from "@/lib/family-session";
import { stripLocale } from "@/lib/i18n";
import { familySsoUrl, signOutFamilySession } from "@/lib/jubit-sso";
import { t } from "@/lib/messages";

/** Header auth — demoted. Sign in is a quiet text link; Register lives in footer/JoinFlow. */
export function AuthHeaderButtons() {
  const pathname = usePathname() || "/";
  const { locale } = stripLocale(pathname);
  const m = t(locale);
  const session = useFamilySession();
  const signInHref = familySsoUrl({ next: pathname });

  if (session) {
    return (
      <>
        <span
          className="hidden max-w-[10rem] truncate font-mono text-[11px] text-muted xl:inline"
          title={session.email || m.cta.signedIn}
        >
          {session.email || m.cta.signedIn}
        </span>
        <button type="button" className="btn btn-ghost hidden sm:inline-flex" onClick={() => void signOutFamilySession()}>
          {m.cta.signOut}
        </button>
      </>
    );
  }

  return (
    <a
      href={signInHref}
      className="hidden text-[12px] font-medium text-muted transition-colors hover:text-fg xl:inline"
    >
      {m.cta.signIn}
    </a>
  );
}

/** Mobile rail — quiet sign-in; Enter stays the primary action. */
export function AuthRailLink() {
  const pathname = usePathname() || "/";
  const { locale } = stripLocale(pathname);
  const m = t(locale);
  const session = useFamilySession();
  const signInHref = familySsoUrl({ next: pathname });

  if (session) {
    return (
      <button
        type="button"
        onClick={() => void signOutFamilySession()}
        className="shrink-0 text-[12px] font-medium text-muted lg:hidden"
      >
        {m.cta.signOut}
      </button>
    );
  }

  return (
    <a href={signInHref} className="shrink-0 text-[12px] font-medium text-muted hover:text-fg lg:hidden">
      {m.cta.signIn}
    </a>
  );
}

export function AuthRegisterLink({ className }: { className?: string }) {
  const pathname = usePathname() || "/";
  const { locale } = stripLocale(pathname);
  const m = t(locale);
  const session = useFamilySession();
  const registerHref = familySsoUrl({ next: pathname, mode: "register" });

  if (session) return null;

  return (
    <a href={registerHref} className={className}>
      {m.cta.register}
    </a>
  );
}
