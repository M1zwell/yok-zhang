"use client";

import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { productsForCollection, tekoFaces } from "@/lib/tekoart/catalog";
import { tekoCopy } from "@/lib/tekoart/copy";
import { tekoPath } from "@/lib/tekoart/paths";
import { JUB_CREATE, PICTORIAL_BOOK, POETRY_PAGE } from "@/lib/tekoart/shopify";
import { TekoProductCard } from "./TekoProductCard";

export function TekoFaces({ locale }: { locale: Locale }) {
  const copy = tekoCopy(locale);

  return (
    <main>
      <section className="teko-section">
        <p className="teko-kicker">{copy.facesKicker}</p>
        <h2>{copy.facesTitle}</h2>
        <p className="teko-lead">{copy.facesLead}</p>
        <div className="teko-row">
          <a className="teko-btn teko-btn-ghost" href={PICTORIAL_BOOK} target="_blank" rel="noopener noreferrer">
            {copy.book} ↗
          </a>
          <a className="teko-btn teko-btn-ghost" href={POETRY_PAGE} target="_blank" rel="noopener noreferrer">
            {copy.poetry} ↗
          </a>
          <a className="teko-btn teko-btn-ghost" href={JUB_CREATE} target="_blank" rel="noopener noreferrer">
            {copy.create} ↗
          </a>
        </div>
      </section>
      <div className="teko-hex-row">
        {tekoFaces.map((face) => (
          <Link key={face.id} href={tekoPath(`/collections/${face.id}`, locale)} className="teko-hex">
            <img src={face.image} alt={copy.faces[face.id].name} />
            <span className="teko-hex-label">
              <strong>{copy.faces[face.id].name}</strong>
              <span>{copy.faces[face.id].book}</span>
            </span>
          </Link>
        ))}
      </div>
      {tekoFaces.map((face) => (
        <section className="teko-section" key={face.id}>
          <p className="teko-kicker">{copy.faces[face.id].book}</p>
          <h2>{copy.faces[face.id].name}</h2>
          <p className="teko-lead">{copy.faces[face.id].blurb}</p>
          <div className="teko-grid">
            {productsForCollection(face.id).map((product) => (
              <TekoProductCard key={product.id} product={product} locale={locale} />
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
