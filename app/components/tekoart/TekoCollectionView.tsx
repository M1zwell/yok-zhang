"use client";

import type { Locale } from "@/lib/i18n";
import { productsForCollection, tekoCollectionByHandle } from "@/lib/tekoart/catalog";
import { tekoCopy } from "@/lib/tekoart/copy";
import { TekoProductCard } from "./TekoProductCard";

export function TekoCollectionView({ handle, locale }: { handle: string; locale: Locale }) {
  const copy = tekoCopy(locale);
  const collection = tekoCollectionByHandle(handle);
  const products = productsForCollection(handle);
  const title =
    handle === "all"
      ? copy.nav.all
      : handle === "holders"
        ? copy.nav.holders
        : handle === "pictorial-book-window"
          ? copy.nav.window
          : handle === "juju" || handle === "qilin" || handle === "yutu"
            ? copy.faces[handle].name
            : (collection?.title ?? handle);

  return (
    <main>
      <section className="teko-section">
        <p className="teko-kicker">{copy.hubsKicker}</p>
        <h1
          style={{
            fontFamily: "var(--font-heading-family)",
            fontSize: "clamp(2.2rem, 6vw, 4rem)",
            color: "rgb(var(--color-foreground))",
            lineHeight: 0.95,
          }}
        >
          {title}
        </h1>
        <p className="teko-lead">{copy.collectionLead[handle] ?? copy.lead}</p>
      </section>
      <section className="teko-section">
        {products.length === 0 ? (
          <p className="teko-lead">{copy.noResults}</p>
        ) : (
          <div className="teko-grid">
            {products.map((product) => (
              <TekoProductCard key={product.id} product={product} locale={locale} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
