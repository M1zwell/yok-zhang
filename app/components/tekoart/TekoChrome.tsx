"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { localeMeta, locales, localizeHref, type Locale } from "@/lib/i18n";
import { formatHkd, searchTekoProducts, tekoShop } from "@/lib/tekoart/catalog";
import { tekoCopy } from "@/lib/tekoart/copy";
import { tekoPath } from "@/lib/tekoart/paths";
import { CONTACT_PAGE, TEKOART_ORIGIN } from "@/lib/tekoart/shopify";
import type { TekoShopKind } from "@/lib/tekoart/types";
import { TekoProductCard } from "./TekoProductCard";
import { useTekoCart } from "./TekoCartProvider";

const navItems: { kind: TekoShopKind | "window" | "holders"; href: string; key: keyof ReturnType<typeof tekoCopy>["nav"] }[] = [
  { kind: "home", href: "/", key: "shop" },
  { kind: "window", href: "/collections/pictorial-book-window", key: "window" },
  { kind: "holders", href: "/collections/holders", key: "holders" },
  { kind: "faces", href: "/faces", key: "faces" },
  { kind: "guide", href: "/guide", key: "guide" },
  { kind: "collection", href: "/collections/all", key: "all" },
];

export function TekoChrome({
  locale,
  kind,
  handle,
  children,
}: {
  locale: Locale;
  kind: TekoShopKind;
  handle?: string;
  children: ReactNode;
}) {
  const copy = tekoCopy(locale);
  const cart = useTekoCart();
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const results = useMemo(() => searchTekoProducts(query), [query]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === "Escape") {
        setSearchOpen(false);
        setCartOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function navOn(item: (typeof navItems)[number]): boolean {
    if (item.kind === "home") return kind === "home";
    if (item.kind === "window") return handle === "pictorial-book-window";
    if (item.kind === "holders") return handle === "holders";
    if (item.kind === "collection") return kind === "collection" && handle === "all";
    return kind === item.kind;
  }

  return (
    <>
      <div className="teko-announce">{copy.announcement}</div>
      <header className="teko-header">
        <div className="teko-header-top">
          <Link href={tekoPath("/", locale)} className="teko-logo">
            <img src={tekoShop.mark} alt="" />
            <span>
              <strong>{copy.brand}</strong>
              <span>{copy.kicker}</span>
            </span>
          </Link>
          <form
            className="teko-search"
            onSubmit={(event) => {
              event.preventDefault();
              setSearchOpen(true);
            }}
          >
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => setSearchOpen(true)}
              placeholder={copy.searchPlaceholder}
              aria-label={copy.nav.search}
            />
            <button type="submit" aria-label={copy.nav.search}>
              ⌕
            </button>
          </form>
          <div className="teko-header-actions">
            <button type="button" className="teko-icon-btn" onClick={() => setSearchOpen(true)}>
              {copy.nav.search}
            </button>
            <button type="button" className="teko-icon-btn" onClick={() => setCartOpen(true)} aria-label={copy.nav.cart}>
              {copy.nav.cart}
              {cart.count > 0 ? <span className="teko-cart-count">{cart.count}</span> : null}
            </button>
            <a className="teko-icon-btn" href={TEKOART_ORIGIN} target="_blank" rel="noopener noreferrer">
              {copy.nav.liveShopify} ↗
            </a>
          </div>
        </div>
        <nav className="teko-nav" aria-label={copy.brand}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={tekoPath(item.href, locale)}
              className={navOn(item) ? "is-on" : undefined}
            >
              {copy.nav[item.key]}
            </Link>
          ))}
          <Link href={tekoPath("/cart", locale)} className={kind === "cart" ? "is-on" : undefined}>
            {copy.nav.cart}
          </Link>
        </nav>
      </header>
      <div className="teko-wrap">{children}</div>
      {cart.count > 0 ? (
        <div className="teko-sticky">
          <p>
            {copy.stickyCart} · {cart.count} · {formatHkd(cart.subtotal)}
          </p>
          <button type="button" className="teko-btn teko-btn-primary" onClick={() => void cart.checkout()} disabled={cart.checkingOut}>
            {copy.checkoutShopify}
          </button>
        </div>
      ) : null}
      <footer className="teko-footer">
        <div className="teko-wrap teko-footer-grid">
          <div>
            <h2>{copy.brand}</h2>
            <p>{copy.tagline}</p>
            <p className="teko-zh">{copy.taglineZh}</p>
            <p>{copy.footerNote}</p>
            <div className="teko-lang" aria-label={copy.language}>
              {locales.map((item) => (
                <Link key={item} href={tekoPath("/", item)} className={item === locale ? "is-on" : undefined}>
                  {localeMeta[item].short}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="teko-kicker">{copy.footerHours}</p>
            <p>{copy.footerHoursValue}</p>
          </div>
          <div>
            <p className="teko-kicker">{copy.footerLocation}</p>
            <p>{tekoShop.address}</p>
          </div>
          <div>
            <p className="teko-kicker">{copy.footerContact}</p>
            <ul>
              <li>
                <a href={CONTACT_PAGE} target="_blank" rel="noopener noreferrer">
                  {copy.liveOnShopify}
                </a>
              </li>
              <li>
                <Link href={tekoPath("/guide", locale)}>{copy.nav.guide}</Link>
              </li>
              <li>
                <Link href={localizeHref("/", locale)}>{copy.nav.garden}</Link>
              </li>
            </ul>
          </div>
        </div>
      </footer>
      <div className="teko-drawer-root" hidden={!cartOpen} role="dialog" aria-modal="true" aria-label={copy.nav.cart}>
        <button type="button" className="teko-scrim" aria-label="Close" onClick={() => setCartOpen(false)} />
        <aside className="teko-drawer">
          <h2>{copy.nav.cart}</h2>
          {cart.lines.length === 0 ? (
            <p className="teko-lead">{copy.emptyCartLead}</p>
          ) : (
            cart.lines.map((line) => (
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
                <button type="button" className="teko-icon-btn" onClick={() => cart.remove(line.variantId)}>
                  ×
                </button>
              </div>
            ))
          )}
          <p className="teko-price">
            {copy.subtotal}: {formatHkd(cart.subtotal)}
          </p>
          <p className="teko-muted">{copy.shippingNote}</p>
          <div className="teko-row">
            <Link className="teko-btn teko-btn-ghost" href={tekoPath("/cart", locale)} onClick={() => setCartOpen(false)}>
              {copy.viewCart}
            </Link>
            <button type="button" className="teko-btn teko-btn-primary" disabled={cart.lines.length === 0 || cart.checkingOut} onClick={() => void cart.checkout()}>
              {copy.checkoutShopify}
            </button>
          </div>
        </aside>
      </div>
      <div className="teko-drawer-root" hidden={!searchOpen} role="dialog" aria-modal="true" aria-label={copy.nav.search}>
        <button type="button" className="teko-scrim" aria-label="Close" onClick={() => setSearchOpen(false)} />
        <div className="teko-search-panel">
          <h2>{copy.nav.search}</h2>
          <form
            className="teko-search"
            style={{ display: "flex", margin: "12px 0 18px" }}
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={copy.searchPlaceholder}
            />
          </form>
          {query.trim() === "" ? (
            <p className="teko-lead">{copy.searchEmpty}</p>
          ) : results.length === 0 ? (
            <p className="teko-lead">{copy.noResults}</p>
          ) : (
            <div className="teko-grid" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
              {results.map((product) => (
                <TekoProductCard key={product.id} product={product} locale={locale} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
