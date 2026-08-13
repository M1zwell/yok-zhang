import { Suspense } from "react";
import { Redirect } from "@/app/components/Redirect";
import { seo } from "@/lib/seo";

export const metadata = seo({
  title: "Writing",
  description: "Notes, tags, and the live research desk — one stream.",
  path: "/writing",
});

export default function BlogRedirectPage() {
  return (
    <Suspense fallback={<p className="px-5 py-24 text-sm text-muted">Continue to Writing…</p>}>
      <Redirect to="/writing" keepQuery />
    </Suspense>
  );
}
