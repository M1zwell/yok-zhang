export const TEKOART_ORIGIN = "https://tekoart.com";
export const TEKOART_SHOP = "8bf8e1-b2.myshopify.com";
export const TEKOART_SHOP_ID = 68803428596;
export const TEKOART_CURRENCY = "HKD";

/**
 * Public Storefront API token published in tekoart.com HTML (`shopify-features`).
 * Same class of token Dawn already ships to every browser.
 */
export const TEKOART_STOREFRONT_TOKEN = "6be0287145bf74f7a9bba4bcaeff214a";
export const TEKOART_STOREFRONT_URL = `${TEKOART_ORIGIN}/api/2024-10/graphql.json`;

export const TEKOART_MARK = "https://tekoart.com/cdn/shop/files/teko-mark.png";
export const TEKOART_CART_STORAGE = "tekoart-cart-v1";

export const PICTORIAL_BOOK = "https://jubuddy.com/pictorial-book";
export const JUB_CREATE = "https://jubuddy.com/jub?screen=create";
export const POETRY_PAGE = `${TEKOART_ORIGIN}/pages/poetry`;
export const CONTACT_PAGE = `${TEKOART_ORIGIN}/pages/contact`;

export function shopifyCartPermalink(lines: { variantId: number; quantity: number }[]): string {
  const path = lines
    .filter((line) => line.quantity > 0)
    .map((line) => `${line.variantId}:${line.quantity}`)
    .join(",");
  return path ? `${TEKOART_ORIGIN}/cart/${path}` : `${TEKOART_ORIGIN}/cart`;
}

export function shopifyProductUrl(handle: string): string {
  return `${TEKOART_ORIGIN}/products/${handle}`;
}

export function variantGid(variantId: number): string {
  return `gid://shopify/ProductVariant/${variantId}`;
}

export type StorefrontCheckoutResult =
  | { ok: true; checkoutUrl: string }
  | { ok: false; reason: "empty" | "network" | "api" };

export async function createStorefrontCheckout(
  lines: { variantId: number; quantity: number }[],
): Promise<StorefrontCheckoutResult> {
  const usable = lines.filter((line) => line.quantity > 0);
  if (usable.length === 0) return { ok: false, reason: "empty" };

  const query = `mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart { checkoutUrl }
      userErrors { message }
    }
  }`;

  try {
    const response = await fetch(TEKOART_STOREFRONT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": TEKOART_STOREFRONT_TOKEN,
      },
      body: JSON.stringify({
        query,
        variables: {
          input: {
            lines: usable.map((line) => ({
              merchandiseId: variantGid(line.variantId),
              quantity: line.quantity,
            })),
          },
        },
      }),
    });
    if (!response.ok) return { ok: false, reason: "network" };
    const json = (await response.json()) as {
      data?: { cartCreate?: { cart?: { checkoutUrl?: string } | null; userErrors?: { message: string }[] } };
    };
    const checkoutUrl = json.data?.cartCreate?.cart?.checkoutUrl;
    if (!checkoutUrl) return { ok: false, reason: "api" };
    return { ok: true, checkoutUrl };
  } catch {
    return { ok: false, reason: "network" };
  }
}
