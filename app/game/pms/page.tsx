import { Suspense } from "react";
import { Redirect } from "@/app/components/Redirect";
import { seo } from "@/lib/seo";

export const metadata = seo({
  title: "Night shift",
  description: "Hostel kiosk night-shift sim. Continues at /PMS.",
  path: "/PMS",
});

export default function GamePmsRedirect() {
  return (
    <Suspense fallback={<p className="px-5 py-24 text-sm text-muted">Continue to PMS…</p>}>
      <Redirect to="/PMS" kicker="PMS" keepQuery />
    </Suspense>
  );
}
