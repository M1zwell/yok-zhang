import { ToolsView } from "@/app/components/ToolsView";
import { seo } from "@/lib/seo";

export const metadata = seo({
  title: "Tools",
  description: "On-site tools and live embeds — universe launcher, HK district jump, working apps.",
  path: "/tools",
});

export default function ToolsPage() {
  return <ToolsView locale="en" />;
}
