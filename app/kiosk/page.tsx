import { Suspense } from "react";
import { Redirect } from "@/app/components/Redirect";
import { seo } from "@/lib/seo";

export const metadata = seo({
  title: "Hostel PMS",
  description: "Self-service hostel check-in moved to /PMS.",
  path: "/PMS",
});

export default function KioskRedirectPage() {
  return (
    <Suspense fallback={<p className="px-5 py-24 text-sm text-muted">Continue to PMS…</p>}>
      <Redirect to="/PMS" kicker="PMS" keepQuery />
    </Suspense>
  );
}
