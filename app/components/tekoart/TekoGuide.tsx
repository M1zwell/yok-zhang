"use client";

import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { tekoCatalog } from "@/lib/tekoart/catalog";
import { tekoCopy } from "@/lib/tekoart/copy";
import { tekoPath } from "@/lib/tekoart/paths";

export function TekoGuide({ locale }: { locale: Locale }) {
  const copy = tekoCopy(locale);

  return (
    <main>
      <section className="teko-section">
        <p className="teko-kicker">{copy.howKicker}</p>
        <h2>{copy.howTitle}</h2>
        <p className="teko-lead">{copy.guideLead}</p>
      </section>
      <section className="teko-section">
        <div className="teko-how">
          {tekoCatalog.guideVideos.map((video, index) => (
            <article key={video.src}>
              <video autoPlay muted loop playsInline poster={video.poster} src={video.src} />
              <h3>{copy.howSteps[index] ?? video.caption}</h3>
              <p>
                <Link href={tekoPath("/collections/pictorial-book-window", locale)}>{copy.heroCta}</Link>
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
