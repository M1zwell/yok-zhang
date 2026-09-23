import { PlanningDesk } from "@/app/components/planning/PlanningDesk";
import { planningCopy } from "@/lib/planning/copy";
import { seo } from "@/lib/seo";

const copy = planningCopy("en");

export const metadata = seo({
  title: copy.metaTitle,
  description: copy.metaDescription,
  path: "/planning",
});

export default function PlanningPage() {
  return <PlanningDesk locale="en" />;
}
