"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { searchTekoProducts } from "@/lib/tekoart/catalog";
import { tekoCopy } from "@/lib/tekoart/copy";
import { TekoProductCard } from "./TekoProductCard";

export function TekoSearchPage({ locale, initialQuery = "" }: { locale: Locale; initialQuery?: string }) {
  const copy = tekoCopy(locale);
  const [query, setQuery] = useState(initialQuery);
  const results = useMemo(() => searchTekoProducts(query), [query]);

  return (
    <main>
      <section className="teko-section">
        <p className="teko-kicker">{copy.nav.search}</p>
        <h2>{copy.searchResults}</h2>
        <form
          className="teko-search"
          style={{ display: "flex", maxWidth: 640, margin: "12px 0 24px" }}
          onSubmit={(event) => event.preventDefault()}
        >
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.searchPlaceholder} />
        </form>
        {query.trim() === "" ? (
          <p className="teko-lead">{copy.searchEmpty}</p>
        ) : results.length === 0 ? (
          <p className="teko-lead">{copy.noResults}</p>
        ) : (
          <div className="teko-grid">
            {results.map((product) => (
              <TekoProductCard key={product.id} product={product} locale={locale} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
