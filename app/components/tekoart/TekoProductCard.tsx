"use client";

import Link from "next/link";
import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { formatHkd, productAvailable, productImage, productPrice, productTypeLabel } from "@/lib/tekoart/catalog";
import { tekoCopy } from "@/lib/tekoart/copy";
import { tekoPath } from "@/lib/tekoart/paths";
import type { TekoProduct } from "@/lib/tekoart/types";
import { useTekoCart } from "./TekoCartProvider";

export function TekoProductCard({
  product,
  locale,
}: {
  product: TekoProduct;
  locale: Locale;
}) {
  const copy = tekoCopy(locale);
  const cart = useTekoCart();
  const available = productAvailable(product);
  const image = productImage(product);
  const variants = product.variants;
  const needsModel = variants.length > 1;
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState(variants.find((variant) => variant.available)?.id ?? variants[0]?.id);

  function add() {
    const variant = variants.find((item) => item.id === picked) ?? variants[0];
    if (!variant || !variant.available) return;
    cart.add(product, variant, 1);
    setOpen(false);
  }

  return (
    <article className="teko-card">
      <Link href={tekoPath(`/products/${product.handle}`, locale)} className="teko-card-media">
        {image ? <img src={image} alt={product.title} /> : null}
        <span className={available ? "teko-badge" : "teko-badge is-out"}>
          {available ? copy.inStock : copy.soldOut}
        </span>
      </Link>
      <div className="teko-card-body">
        <p className="teko-muted">{productTypeLabel(product)}</p>
        <h3>
          <Link href={tekoPath(`/products/${product.handle}`, locale)}>{product.title}</Link>
        </h3>
        <p className="teko-price">
          {needsModel ? `${copy.from} ` : null}
          {formatHkd(productPrice(product))}
        </p>
        {open && needsModel ? (
          <div className="teko-pills" role="listbox" aria-label={copy.chooseModel}>
            {variants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                className={picked === variant.id ? "teko-pill is-on" : "teko-pill"}
                disabled={!variant.available}
                onClick={() => setPicked(variant.id)}
              >
                {variant.title}
              </button>
            ))}
          </div>
        ) : null}
        <button
          type="button"
          className="teko-btn teko-btn-primary"
          disabled={!available}
          onClick={() => {
            if (needsModel && !open) {
              setOpen(true);
              return;
            }
            add();
          }}
        >
          {!available ? copy.soldOut : needsModel && !open ? copy.chooseModel : copy.addToCart}
        </button>
      </div>
    </article>
  );
}
