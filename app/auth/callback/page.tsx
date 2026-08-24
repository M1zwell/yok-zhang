import { Suspense } from "react";
import { AuthCallback } from "@/app/components/AuthCallback";
import { seo } from "@/lib/seo";

export const metadata = {
  ...seo({
    title: "Sign in",
    description: "Finish family sign-in from the Jubit hub and return to the garden.",
    path: "/auth/callback",
  }),
  robots: { index: false, follow: false },
};

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="page-x mx-auto max-w-lg py-24">
          <p className="text-sm text-muted">Signing you in…</p>
        </main>
      }
    >
      <AuthCallback />
    </Suspense>
  );
}
