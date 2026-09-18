import catalogJson from "./catalog.json";
import type { TekoCatalog, TekoCollection, TekoFaceId, TekoProduct } from "./types";

export const tekoCatalog = catalogJson as TekoCatalog;

export const tekoShop = tekoCatalog.shop;

const FACE_ORDER: TekoFaceId[] = ["juju", "qilin", "yutu"];

export function allTekoProducts(): TekoProduct[] {
  return tekoCatalog.products;
}

export function tekoProductByHandle(handle: string): TekoProduct | undefined {
  return tekoCatalog.products.find((product) => product.handle === handle);
}

export function tekoProductHandles(): string[] {
  return tekoCatalog.products.map((product) => product.handle);
}

export function tekoCollectionHandles(): string[] {
  return Object.keys(tekoCatalog.collectionProducts);
}

export function tekoCollectionByHandle(handle: string): TekoCollection | undefined {
  if (handle === "all") {
    return {
      id: 0,
      title: "All",
      handle: "all",
      productsCount: tekoCatalog.products.length,
      image: null,
      bodyHtml: null,
    };
  }
  const virtualTitles: Record<string, string> = {
    holders: "Card Holders",
    juju: "Juju",
    qilin: "Qilin",
    yutu: "Yutu",
  };
  const stored = tekoCatalog.collections.find((collection) => collection.handle === handle);
  if (stored) return stored;
  const handles = tekoCatalog.collectionProducts[handle];
  if (!handles) return undefined;
  return {
    id: 0,
    title: virtualTitles[handle] ?? handle,
    handle,
    productsCount: handles.length,
    image: null,
    bodyHtml: null,
  };
}

export function productsForCollection(handle: string): TekoProduct[] {
  const handles = tekoCatalog.collectionProducts[handle] ?? [];
  return handles
    .map((item) => tekoProductByHandle(item))
    .filter((product): product is TekoProduct => Boolean(product));
}

export function productImage(product: TekoProduct): string | null {
  return product.images[0]?.src ?? null;
}

export function productPrice(product: TekoProduct): string {
  return product.variants[0]?.price ?? "0.00";
}

export function productAvailable(product: TekoProduct): boolean {
  return product.variants.some((variant) => variant.available);
}

export function productTypeLabel(product: TekoProduct): string {
  if (product.productType) return product.productType;
  if (product.tags.includes("holder")) return "Card Holder";
  if (product.tags.includes("phone-case") || product.handle.includes("window")) return "Phone Case";
  return "TekO";
}

export function faceIdForProduct(product: TekoProduct): TekoFaceId | null {
  for (const face of FACE_ORDER) {
    if (product.handle.includes(face) || product.tags.includes(face)) return face;
  }
  return null;
}

export function searchTekoProducts(query: string): TekoProduct[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return tekoCatalog.products;
  return tekoCatalog.products.filter((product) => {
    const hay = [
      product.title,
      product.handle,
      product.productType,
      product.vendor,
      product.tags.join(" "),
      product.bodyHtml.replace(/<[^>]+>/g, " "),
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(needle);
  });
}

export function formatHkd(amount: string | number): string {
  const value = typeof amount === "number" ? amount : Number.parseFloat(amount);
  if (Number.isNaN(value)) return `HK$ ${amount}`;
  return `HK$ ${value.toFixed(value % 1 === 0 ? 0 : 2)}`;
}

export function lineTotal(price: string, quantity: number): number {
  return Number.parseFloat(price) * quantity;
}

export const tekoFaces: {
  id: TekoFaceId;
  handle: string;
  book: string;
  image: string;
}[] = [
  {
    id: "juju",
    handle: "juju-tcg-window-case",
    book: "Shop pig · not book #001",
    image: "https://cdn.shopify.com/s/files/1/0688/0342/8596/files/teko-tcg-case-juju.png?v=1787287835",
  },
  {
    id: "qilin",
    handle: "qilin-tcg-window-case",
    book: "Book #003",
    image: "https://cdn.shopify.com/s/files/1/0688/0342/8596/files/qilin-window-case.png?v=1787295326",
  },
  {
    id: "yutu",
    handle: "yutu-tcg-window-case",
    book: "Book #021 · rabbit-yutu",
    image: "https://cdn.shopify.com/s/files/1/0688/0342/8596/files/yutu-window-case.png?v=1787295326",
  },
];

export const tekoHubs = [
  {
    handle: "pictorial-book-window",
    image: "https://cdn.shopify.com/s/files/1/0688/0342/8596/files/teko-tcg-case-juju.png?v=1787287835",
  },
  {
    handle: "holders",
    image: "https://cdn.shopify.com/s/files/1/0688/0342/8596/files/juju-card-holder.png?v=1787295326",
  },
  {
    handle: "all",
    image: "https://cdn.shopify.com/s/files/1/0688/0342/8596/collections/Gemini_Generated_Image.jpg?v=1708416954",
  },
] as const;
