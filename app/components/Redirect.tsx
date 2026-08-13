"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export function Redirect({
  to,
  keepQuery,
  slug,
}: {
  to: string;
  keepQuery?: boolean;
  slug?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const qs = keepQuery ? searchParams.toString() : "";
  const href = slug ? `${to}/${slug}` : qs ? `${to}?${qs}` : to;

  useEffect(() => {
    router.replace(href);
  }, [href, router]);

  return (
    <main className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
      <p className="kicker">Writing</p>
      <p className="mt-4 text-sm text-muted">
        This page moved.{" "}
        <Link href={href} className="text-accent hover:text-accent-hover">
          Continue →
        </Link>
      </p>
    </main>
  );
}
