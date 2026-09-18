import { notFound } from "next/navigation";
import { TekoCollectionView } from "@/app/components/tekoart/TekoCollectionView";
import { TekoShell } from "@/app/components/tekoart/TekoShell";
import { tekoCollectionByHandle, tekoCollectionHandles } from "@/lib/tekoart/catalog";
import { tekoCopy } from "@/lib/tekoart/copy";
import { seo } from "@/lib/seo";

type Params = { handle: string };

export function generateStaticParams() {
  return tekoCollectionHandles().map((handle) => ({ handle }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { handle } = await params;
  const copy = tekoCopy("en");
  const collection = tekoCollectionByHandle(handle);
  return seo({
    title: `${collection?.title ?? handle} · ${copy.brand}`,
    description: copy.collectionLead[handle] ?? copy.lead,
    path: `/tekoart/collections/${handle}`,
  });
}

export default async function TekoCollectionPage({ params }: { params: Promise<Params> }) {
  const { handle } = await params;
  if (!tekoCollectionByHandle(handle)) notFound();
  return (
    <TekoShell locale="en" kind="collection" handle={handle}>
      <TekoCollectionView handle={handle} locale="en" />
    </TekoShell>
  );
}
