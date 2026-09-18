import { notFound } from "next/navigation";
import { TekoProductView } from "@/app/components/tekoart/TekoProductView";
import { TekoShell } from "@/app/components/tekoart/TekoShell";
import { tekoProductByHandle, tekoProductHandles } from "@/lib/tekoart/catalog";
import { tekoCopy } from "@/lib/tekoart/copy";
import { seo } from "@/lib/seo";

type Params = { handle: string };

export function generateStaticParams() {
  return tekoProductHandles().map((handle) => ({ handle }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { handle } = await params;
  const product = tekoProductByHandle(handle);
  const copy = tekoCopy("en");
  return seo({
    title: product ? `${product.title} · ${copy.brand}` : copy.brand,
    description: product?.bodyHtml.replace(/<[^>]+>/g, " ").slice(0, 160) ?? copy.lead,
    path: `/tekoart/products/${handle}`,
  });
}

export default async function TekoProductPage({ params }: { params: Promise<Params> }) {
  const { handle } = await params;
  const product = tekoProductByHandle(handle);
  if (!product) notFound();
  return (
    <TekoShell locale="en" kind="product">
      <TekoProductView product={product} locale="en" />
    </TekoShell>
  );
}
