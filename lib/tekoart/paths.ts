import { localizeHref, type Locale } from "@/lib/i18n";

export function tekoPath(suffix: string, locale: Locale): string {
  const next = !suffix || suffix === "/" ? "/tekoart" : `/tekoart${suffix.startsWith("/") ? suffix : `/${suffix}`}`;
  return localizeHref(next, locale);
}

export function rewriteTekoHtml(html: string, locale: Locale): string {
  const productBase = tekoPath("/products", locale);
  const collectionBase = tekoPath("/collections", locale);
  return html
    .replaceAll("https://tekoart.com/pages/faces", tekoPath("/faces", locale))
    .replaceAll("https://tekoart.com/pages/guide", tekoPath("/guide", locale))
    .replaceAll('href="/pages/faces"', `href="${tekoPath("/faces", locale)}"`)
    .replaceAll('href="/pages/guide"', `href="${tekoPath("/guide", locale)}"`)
    .replaceAll('href="/collections/pictorial-book-window"', `href="${tekoPath("/collections/pictorial-book-window", locale)}"`)
    .replaceAll("https://tekoart.com/collections/pictorial-book-window", tekoPath("/collections/pictorial-book-window", locale))
    .replaceAll("https://tekoart.com/products/", `${productBase}/`)
    .replaceAll('href="/products/', `href="${productBase}/`)
    .replaceAll("https://tekoart.com/collections/", `${collectionBase}/`)
    .replaceAll('href="/collections/', `href="${collectionBase}/`);
}
