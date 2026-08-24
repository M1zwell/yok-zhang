"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { stripLocale } from "@/lib/i18n";
import {
  FAMILY_SESSION_EVENT,
  familySsoUrl,
  readFamilySession,
  signOutFamilySession,
  type FamilySession,
} from "@/lib/jubit-sso";
import { t } from "@/lib/messages";

function useFamilySession(): FamilySession | null {
  const [session, setSession] = useState<FamilySession | null>(null);

  useEffect(() => {
    const sync = () => setSession(readFamilySession());
    sync();
    window.addEventListener(FAMILY_SESSION_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(FAMILY_SESSION_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return session;
}

export function AuthHeaderButtons() {
  const pathname = usePathname() || "/";
  const { locale } = stripLocale(pathname);
  const m = t(locale);
  const session = useFamilySession();
  const signInHref = familySsoUrl({ next: pathname });
  const registerHref = familySsoUrl({ next: pathname, mode: "register" });

  if (session) {
    return (
      <>
        <span
          className="hidden max-w-[10rem] truncate font-mono text-[11px] text-muted lg:inline"
          title={session.email || m.cta.signedIn}
        >
          {session.email || m.cta.signedIn}
        </span>
        <button type="button" className="btn btn-ghost" onClick={() => void signOutFamilySession()}>
          {m.cta.signOut}
        </button>
      </>
    );
  }

  return (
    <>
      <a href={signInHref} className="btn btn-ghost hidden lg:inline-flex">
        {m.cta.signIn}
      </a>
      <a href={registerHref} className="btn btn-primary cta-pop">
        {m.cta.register}
      </a>
    </>
  );
}

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
        className="shrink-0 text-[12px] font-medium text-accent lg:hidden"
      >
        {m.cta.signOut}
      </button>
    );
  }

  return (
    <a href={signInHref} className="shrink-0 text-[12px] font-medium text-accent lg:hidden">
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
