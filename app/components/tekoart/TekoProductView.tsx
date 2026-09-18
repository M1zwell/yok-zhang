"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";
import {
  allTekoProducts,
  faceIdForProduct,
  formatHkd,
  productAvailable,
  productImage,
  productTypeLabel,
} from "@/lib/tekoart/catalog";
import { tekoCopy } from "@/lib/tekoart/copy";
import { rewriteTekoHtml, tekoPath } from "@/lib/tekoart/paths";
import { PICTORIAL_BOOK, shopifyProductUrl } from "@/lib/tekoart/shopify";
import type { TekoProduct } from "@/lib/tekoart/types";
import { TekoProductCard } from "./TekoProductCard";
import { useTekoCart } from "./TekoCartProvider";

export function TekoProductView({ product, locale }: { product: TekoProduct; locale: Locale }) {
  const copy = tekoCopy(locale);
  const cart = useTekoCart();
  const variants = product.variants;
  const [variantId, setVariantId] = useState(variants.find((variant) => variant.available)?.id ?? variants[0]?.id);
  const [qty, setQty] = useState(1);
  const variant = variants.find((item) => item.id === variantId) ?? variants[0];
  const available = Boolean(variant?.available) && productAvailable(product);
  const image = productImage(product);
  const face = faceIdForProduct(product);
  const html = useMemo(() => rewriteTekoHtml(product.bodyHtml, locale), [locale, product.bodyHtml]);
  const related = allTekoProducts().filter((item) => item.handle !== product.handle).slice(0, 3);
  const needsModel = variants.length > 1;

  return (
    <main>
      <section className="teko-product">
        <div className="teko-gallery">{image ? <img src={image} alt={product.title} /> : null}</div>
        <div className="teko-product-copy">
          <p className="teko-kicker">{productTypeLabel(product)}</p>
          <h1>{product.title}</h1>
          <p className="teko-price">{formatHkd(variant?.price ?? "0")}</p>
          <p className="teko-muted">{available ? copy.inStock : copy.soldOut}</p>
          {face ? (
            <p className="teko-lead">
              {copy.faces[face].name} · {copy.faces[face].book}
            </p>
          ) : null}
          {needsModel ? (
            <div>
              <p className="teko-kicker">{copy.chooseModel}</p>
              <div className="teko-pills">
                {variants.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={item.id === variantId ? "teko-pill is-on" : "teko-pill"}
                    disabled={!item.available}
                    onClick={() => setVariantId(item.id)}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          <p className="teko-kicker">{copy.quantity}</p>
          <div className="teko-qty">
            <button type="button" onClick={() => setQty((value) => Math.max(1, value - 1))}>
              −
            </button>
            <input
              value={qty}
              onChange={(event) => setQty(Math.max(1, Number.parseInt(event.target.value, 10) || 1))}
              inputMode="numeric"
              aria-label={copy.quantity}
            />
            <button type="button" onClick={() => setQty((value) => Math.min(99, value + 1))}>
              +
            </button>
          </div>
          <div className="teko-row">
            <button
              type="button"
              className="teko-btn teko-btn-primary"
              disabled={!available || !variant}
              onClick={() => {
                if (!variant) return;
                cart.add(product, variant, qty);
              }}
            >
              {available ? copy.addToCart : copy.soldOut}
            </button>
            <a className="teko-btn teko-btn-ghost" href={shopifyProductUrl(product.handle)} target="_blank" rel="noopener noreferrer">
              {copy.liveOnShopify} ↗
            </a>
          </div>
          <p className="teko-muted">
            {copy.madeInHk} · {copy.windowSize} · {copy.notIp}
          </p>
          <div className="teko-html" dangerouslySetInnerHTML={{ __html: html }} />
          <p>
            <a href={PICTORIAL_BOOK} target="_blank" rel="noopener noreferrer">
              {copy.book} ↗
            </a>
          </p>
        </div>
      </section>
      <section className="teko-section">
        <p className="teko-kicker">{copy.related}</p>
        <h2>{copy.related}</h2>
        <div className="teko-grid">
          {related.map((item) => (
            <TekoProductCard key={item.id} product={item} locale={locale} />
          ))}
        </div>
        <p className="teko-row">
          <Link className="teko-btn teko-btn-ghost" href={tekoPath("/collections/all", locale)}>
            {copy.nav.all}
          </Link>
        </p>
      </section>
    </main>
  );
}
