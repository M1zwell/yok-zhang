import { ShareActions } from "@/app/components/ShareActions";
import { t } from "@/lib/messages";
import { links } from "@/lib/site";
import type { Locale } from "@/lib/i18n";

export function WorldsCard({ locale = "en" }: { locale?: Locale }) {
  const m = t(locale);

  return (
    <article className="worlds-card relative overflow-hidden rounded-[20px] border border-hair bg-deep p-6 shadow-[0_0_48px_rgba(20,184,166,0.12)] sm:p-8">
      <div className="pointer-events-none absolute inset-0 opacity-80" aria-hidden>
        <div className="worlds-haze" />
      </div>
      <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
        <div>
          <p className="kicker">{m.worldsCard.kicker}</p>
          <h2 className="mt-3 font-display text-[clamp(2rem,5vw,3.4rem)] leading-[0.95] tracking-tight">
            {m.worldsCard.title}
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-secondary">
            {m.worldsCard.lead}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={links.gghereWorlds}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary cta-pop"
            >
              {m.worldsCard.openWorlds}
            </a>
            <a
              href={links.jubuddyPlanet}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              {m.worldsCard.openPlanet}
            </a>
          </div>
          <div className="mt-6">
            <ShareActions
              href={links.gghereWorlds}
              title="Worlds live on gghere.com/worlds"
              locale={locale}
            />
          </div>
        </div>
        <a
          href={links.gghereWorlds}
          target="_blank"
          rel="noopener noreferrer"
          className="worlds-planet mx-auto block"
          aria-label={m.flagship.walkWorlds}
        >
          <span className="worlds-ring orbit-ring" />
          <span className="worlds-globe logo-float" />
          <span className="worlds-spark orbit-spark" />
        </a>
      </div>
    </article>
  );
}
