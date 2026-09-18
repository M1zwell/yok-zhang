"use client";

import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { formatHkd } from "@/lib/tekoart/catalog";
import { tekoCopy } from "@/lib/tekoart/copy";
import { tekoPath } from "@/lib/tekoart/paths";
import { useTekoCart } from "./TekoCartProvider";

export function TekoCartPage({ locale }: { locale: Locale }) {
  const copy = tekoCopy(locale);
  const cart = useTekoCart();

  return (
    <main>
      <section className="teko-section">
        <p className="teko-kicker">{copy.nav.cart}</p>
        <h2>{copy.nav.cart}</h2>
        {cart.lines.length === 0 ? (
          <div className="teko-empty">
            <p className="teko-lead">{copy.emptyCart}</p>
            <p className="teko-lead">{copy.emptyCartLead}</p>
            <Link className="teko-btn teko-btn-primary" href={tekoPath("/", locale)}>
              {copy.continueShopping}
            </Link>
          </div>
        ) : (
          <>
            {cart.lines.map((line) => (
              <div className="teko-line" key={line.variantId}>
                {line.image ? <img src={line.image} alt="" /> : <span />}
                <div>
                  <Link href={tekoPath(`/products/${line.handle}`, locale)}>{line.title}</Link>
                  <p className="teko-muted">
                    {line.variantTitle || copy.brandShort} · {formatHkd(line.price)}
                  </p>
                  <div className="teko-qty">
                    <button type="button" onClick={() => cart.setQty(line.variantId, line.quantity - 1)}>
                      −
                    </button>
                    <input readOnly value={line.quantity} aria-label={copy.quantity} />
                    <button type="button" onClick={() => cart.setQty(line.variantId, line.quantity + 1)}>
                      +
                    </button>
                  </div>
                </div>
                <p className="teko-price">{formatHkd(Number.parseFloat(line.price) * line.quantity)}</p>
              </div>
            ))}
            <p className="teko-price">
              {copy.subtotal}: {formatHkd(cart.subtotal)}
            </p>
            <p className="teko-muted">{copy.shippingNote}</p>
            <div className="teko-row">
              <Link className="teko-btn teko-btn-ghost" href={tekoPath("/collections/all", locale)}>
                {copy.continueShopping}
              </Link>
              <button type="button" className="teko-btn teko-btn-primary" disabled={cart.checkingOut} onClick={() => void cart.checkout()}>
                {copy.checkoutShopify}
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
