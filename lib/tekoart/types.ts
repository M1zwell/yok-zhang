export type TekoVariant = {
  id: number;
  title: string;
  sku: string;
  available: boolean;
  price: string;
  compareAtPrice: string | null;
  option1: string;
  grams: number;
};

export type TekoImage = {
  id: number;
  src: string;
  width: number;
  height: number;
  alt: string | null;
  position: number;
};

export type TekoOption = {
  name: string;
  position: number;
  values: string[];
};

export type TekoProduct = {
  id: number;
  title: string;
  handle: string;
  bodyHtml: string;
  vendor: string;
  productType: string;
  tags: string[];
  publishedAt: string;
  variants: TekoVariant[];
  options: TekoOption[];
  images: TekoImage[];
};

export type TekoCollection = {
  id: number;
  title: string;
  handle: string;
  productsCount: number;
  image: { id: number; created_at?: string; src: string; alt: string | null } | null;
  bodyHtml: string | null;
};

export type TekoGuideVideo = {
  src: string;
  poster: string;
  caption: string;
};

export type TekoCatalog = {
  shop: {
    name: string;
    domain: string;
    myshopify: string;
    shopId: number;
    currency: string;
    country: string;
    theme: { name: string; schemaVersion: string; themeStoreId: number };
    mark: string;
    address: string;
    origin: string;
  };
  products: TekoProduct[];
  collections: TekoCollection[];
  collectionProducts: Record<string, string[]>;
  guideVideos: TekoGuideVideo[];
};

export type TekoCartLine = {
  variantId: number;
  productId: number;
  handle: string;
  title: string;
  variantTitle: string;
  sku: string;
  price: string;
  image: string | null;
  quantity: number;
};

export type TekoCartAction =
  | { type: "hydrate"; lines: TekoCartLine[] }
  | { type: "add"; line: TekoCartLine }
  | { type: "setQty"; variantId: number; quantity: number }
  | { type: "remove"; variantId: number }
  | { type: "clear" };

export type TekoShopKind = "home" | "product" | "collection" | "cart" | "faces" | "guide" | "search";

export type TekoFaceId = "juju" | "qilin" | "yutu";
