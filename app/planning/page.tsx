import { PlanningGate } from "@/app/components/planning/PlanningGate";
import { planningGateCopy } from "@/lib/planning/gate";
import { seo } from "@/lib/seo";

const copy = planningGateCopy("en");

export const metadata = {
  ...seo({
    title: "Planning",
    description: copy.metaDescription,
    path: "/planning",
  }),
  robots: { index: false, follow: false },
};

export default function PlanningPage() {
  return <PlanningGate locale="en" />;
}
