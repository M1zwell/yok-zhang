import { TekoFaces } from "@/app/components/tekoart/TekoFaces";
import { TekoShell } from "@/app/components/tekoart/TekoShell";
import { tekoCopy } from "@/lib/tekoart/copy";
import { seo } from "@/lib/seo";

const copy = tekoCopy("en");

export const metadata = seo({
  title: `${copy.facesTitle} · ${copy.brand}`,
  description: copy.facesLead,
  path: "/tekoart/faces",
});

export default function TekoFacesRoute() {
  return (
    <TekoShell locale="en" kind="faces">
      <TekoFaces locale="en" />
    </TekoShell>
  );
}
