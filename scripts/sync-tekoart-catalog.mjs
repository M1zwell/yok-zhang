import { writeFileSync } from "node:fs";

const origin = "https://tekoart.com";

async function getJson(path) {
  const res = await fetch(`${origin}${path}`, { headers: { "User-Agent": "tekoart-sync" } });
  if (!res.ok) throw new Error(`${path} ${res.status}`);
  return res.json();
}

function slimProduct(product) {
  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    bodyHtml: product.body_html,
    vendor: product.vendor,
    productType: product.product_type || (product.handle.includes("window") ? "Phone Case" : ""),
    tags: product.tags,
    publishedAt: product.published_at,
    variants: product.variants.map((variant) => ({
      id: variant.id,
      title: variant.title,
      sku: variant.sku,
      available: variant.available,
      price: variant.price,
      compareAtPrice: variant.compare_at_price,
      option1: variant.option1,
      grams: variant.grams,
    })),
    options: product.options,
    images: product.images.map((image) => ({
      id: image.id,
      src: image.src,
      width: image.width,
      height: image.height,
      alt: image.alt,
      position: image.position,
    })),
  };
}

const products = (await getJson("/products.json?limit=250")).products.map(slimProduct);
const collections = (await getJson("/collections.json?limit=250")).collections.map((collection) => ({
  id: collection.id,
  title: collection.title,
  handle: collection.handle,
  productsCount: collection.products_count,
  image: collection.image,
  bodyHtml: collection.body_html || collection.description || null,
}));
const all = (await getJson("/collections/all/products.json?limit=250")).products.map((p) => p.handle);
const windowCases = (await getJson("/collections/pictorial-book-window/products.json?limit=250")).products.map(
  (p) => p.handle,
);

const catalog = {
  shop: {
    name: "Tek O Art",
    domain: "tekoart.com",
    myshopify: "8bf8e1-b2.myshopify.com",
    shopId: 68803428596,
    currency: "HKD",
    country: "HK",
    theme: { name: "Dawn", schemaVersion: "13.0.0", themeStoreId: 887 },
    mark: "https://tekoart.com/cdn/shop/files/teko-mark.png",
    address: "Rm12, 20/F, Ho King Comm CTR, 2-16 Fayuen St, Mong Kok, Hong Kong",
    origin,
  },
  products,
  collections,
  collectionProducts: {
    all,
    "pictorial-book-window": windowCases,
    holders: products.filter((p) => p.handle.includes("holder")).map((p) => p.handle),
    juju: products.filter((p) => p.handle.includes("juju")).map((p) => p.handle),
    qilin: products.filter((p) => p.handle.includes("qilin")).map((p) => p.handle),
    yutu: products.filter((p) => p.handle.includes("yutu")).map((p) => p.handle),
  },
  guideVideos: [
    {
      src: "https://cdn.shopify.com/videos/c/o/v/f811318284814e6fad559fdb24c1100a.mp4",
      poster:
        "https://cdn.shopify.com/s/files/1/0688/0342/8596/files/preview_images/f811318284814e6fad559fdb24c1100a.thumbnail.0000000000.jpg?v=1787300175",
      caption: "Change the card.",
    },
    {
      src: "https://cdn.shopify.com/videos/c/o/v/58e29cae474e48acb6539cdddd365207.mp4",
      poster:
        "https://cdn.shopify.com/s/files/1/0688/0342/8596/files/preview_images/58e29cae474e48acb6539cdddd365207.thumbnail.0000000000.jpg?v=1787300166",
      caption: "Put the case on the phone.",
    },
    {
      src: "https://cdn.shopify.com/videos/c/o/v/8edb5107233e463ca002e45650106d6d.mp4",
      poster:
        "https://cdn.shopify.com/s/files/1/0688/0342/8596/files/preview_images/8edb5107233e463ca002e45650106d6d.thumbnail.0000000000.jpg?v=1787300166",
      caption: "On the phone.",
    },
  ],
};

writeFileSync(new URL("../lib/tekoart/catalog.json", import.meta.url), `${JSON.stringify(catalog, null, 2)}\n`);
console.log(`synced ${products.length} products`);
