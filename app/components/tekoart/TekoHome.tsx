"use client";

import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import {
  allTekoProducts,
  productImage,
  tekoCatalog,
  tekoFaces,
  tekoHubs,
  tekoProductByHandle,
} from "@/lib/tekoart/catalog";
import { tekoCopy } from "@/lib/tekoart/copy";
import { tekoPath } from "@/lib/tekoart/paths";
import { TekoProductCard } from "./TekoProductCard";

export function TekoHome({ locale }: { locale: Locale }) {
  const copy = tekoCopy(locale);
  const products = allTekoProducts();
  const featured = tekoProductByHandle("juju-tcg-window-case") ?? products[0];
  const heroImage = featured ? productImage(featured) : null;

  return (
    <main>
      <section className="teko-hero">
        <div>
          <p className="teko-kicker">{copy.kicker}</p>
          <h1>{copy.tagline}</h1>
          <p className="teko-lead">{copy.lead}</p>
          <p className="teko-zh">{copy.taglineZh}</p>
          <div className="teko-hero-actions">
            <Link className="teko-btn teko-btn-primary" href={tekoPath("/collections/pictorial-book-window", locale)}>
              {copy.heroCta}
            </Link>
            <Link className="teko-btn teko-btn-ghost" href={tekoPath("/faces", locale)}>
              {copy.heroSecondary}
            </Link>
          </div>
        </div>
        <div className="teko-hero-stage">
          {heroImage ? <img src={heroImage} alt={featured?.title ?? copy.brand} /> : null}
          <p className="teko-hero-badge">{copy.windowSize}</p>
        </div>
      </section>

      <section className="teko-section">
        <p className="teko-kicker">{copy.facesKicker}</p>
        <h2>{copy.facesTitle}</h2>
        <p className="teko-lead">{copy.facesLead}</p>
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
      </section>

      <section className="teko-section">
        <p className="teko-kicker">{copy.hubsKicker}</p>
        <h2>{copy.hubsTitle}</h2>
        <div className="teko-grid" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
          {tekoHubs.map((hub) => (
            <Link key={hub.handle} href={tekoPath(`/collections/${hub.handle}`, locale)} className="teko-card">
              <span className="teko-card-media">
                <img src={hub.image} alt="" />
              </span>
              <span className="teko-card-body">
                <h3>
                  {hub.handle === "all"
                    ? copy.nav.all
                    : hub.handle === "holders"
                      ? copy.nav.holders
                      : copy.nav.window}
                </h3>
                <p className="teko-muted">{copy.collectionLead[hub.handle]}</p>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="teko-section">
        <p className="teko-kicker">{copy.gridKicker}</p>
        <h2>{copy.gridTitle}</h2>
        <div className="teko-grid">
          {products.map((product) => (
            <TekoProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      </section>

      <section className="teko-section">
        <p className="teko-kicker">{copy.howKicker}</p>
        <h2>{copy.howTitle}</h2>
        <div className="teko-how">
          {tekoCatalog.guideVideos.map((video, index) => (
            <article key={video.src}>
              <video autoPlay muted loop playsInline poster={video.poster} src={video.src} />
              <h3>{String(index + 1).padStart(2, "0")}</h3>
              <p>{copy.howSteps[index] ?? video.caption}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="teko-section">
        <p className="teko-kicker">{copy.shipKicker}</p>
        <h2>{copy.shipTitle}</h2>
        <p className="teko-lead">{copy.shipLead}</p>
        <div className="teko-trust">
          {copy.shipPoints.map((point) => (
            <article key={point}>
              <h3>{point}</h3>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
