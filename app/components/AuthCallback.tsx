"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { localeFromCookie, type Locale } from "@/lib/i18n";
import {
  exchangeSsoToken,
  familySsoUrl,
  safeNextPath,
  ssoTokenFromSearch,
  writeFamilySession,
} from "@/lib/jubit-sso";
import { t } from "@/lib/messages";

type Status = "working" | "ok" | "missing" | "failed";

const exchanges = new Map<string, ReturnType<typeof exchangeSsoToken>>();

function assertNever(value: never): never {
  throw new Error(`unhandled auth status: ${String(value)}`);
}

function exchangeOnce(token: string) {
  const existing = exchanges.get(token);
  if (existing) return existing;
  const pending = exchangeSsoToken(token);
  exchanges.set(token, pending);
  void pending.then((result) => {
    if (!result.ok) exchanges.delete(token);
  });
  return pending;
}

export function AuthCallback() {
  const search = useSearchParams();
  const [locale, setLocale] = useState<Locale>("en");
  const [status, setStatus] = useState<Status>("working");
  const token = ssoTokenFromSearch(search);
  const next = safeNextPath(search.get("next"));
  const m = t(locale);

  useEffect(() => {
    setLocale(localeFromCookie(document.cookie) ?? "en");
  }, []);

  useEffect(() => {
    if (!token) {
      setStatus("missing");
      return;
    }

    let cancelled = false;
    void (async () => {
      const result = await exchangeOnce(token);
      if (cancelled) return;
      if (!result.ok) {
        setStatus("failed");
        return;
      }
      writeFamilySession(result.session);
      setStatus("ok");
      window.setTimeout(() => {
        window.location.replace(next);
      }, 600);
    })();

    return () => {
      cancelled = true;
    };
  }, [next, token]);

  const signInHref = familySsoUrl({ next: "/" });

  let body: ReactNode;
  switch (status) {
    case "working":
      body = (
        <div className="mt-6">
          <p className="text-sm text-secondary">{m.auth.signingIn}</p>
          <p className="mt-2 text-[13px] leading-relaxed text-muted">{m.auth.signingInHint}</p>
        </div>
      );
      break;
    case "ok":
      body = (
        <div className="mt-6">
          <p className="text-sm text-secondary">{m.auth.success}</p>
          <p className="mt-2 text-[13px] leading-relaxed text-muted">{m.auth.successHint}</p>
        </div>
      );
      break;
    case "missing":
    case "failed":
      body = (
        <div className="mt-6">
          <p className="text-sm text-secondary">{m.auth.failed}</p>
          <p className="mt-2 text-[13px] leading-relaxed text-muted">
            {status === "missing" ? m.auth.missingToken : m.auth.exchangeFailed}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={signInHref} className="btn btn-primary">
              {m.auth.tryAgain}
            </a>
            <Link href="/" className="btn btn-ghost">
              {m.auth.goHome}
            </Link>
          </div>
        </div>
      );
      break;
    default:
      assertNever(status);
  }

  return (
    <main className="page-x mx-auto flex min-h-[70vh] max-w-lg items-center py-16">
      <div className="card w-full p-6 sm:p-8">
        <p className="kicker">{m.auth.kicker}</p>
        <h1 className="mt-2 font-display text-2xl tracking-tight text-fg">{m.auth.title}</h1>
        {body}
      </div>
    </main>
  );
}
