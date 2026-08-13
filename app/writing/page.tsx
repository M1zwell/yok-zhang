import { WritingView } from "@/app/components/WritingView";
import { seo } from "@/lib/seo";

export const metadata = seo({
  title: "Writing",
  description: "Notes, tags, and the live research desk — one stream.",
  path: "/writing",
});

export default function WritingPage() {
  return <WritingView locale="en" />;
}
