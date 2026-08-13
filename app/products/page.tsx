import { ProductsView } from "@/app/components/ProductsView";
import { seo } from "@/lib/seo";

export const metadata = seo({
  title: "Products",
  description: "Live product directory — city-planet first, then Jubit, dseek, and the rest that actually runs.",
  path: "/products",
});

export default function ProductsPage() {
  return <ProductsView locale="en" />;
}
