import { t } from "@/lib/messages";
import { cityHref, links, worldCities } from "@/lib/site";
import type { Locale } from "@/lib/i18n";

export function CityPlanetFlagship({ locale = "en" }: { locale?: Locale }) {
  const m = t(locale);

  return (
    <article className="flagship-card relative overflow-hidden rounded-[24px] border border-accent/30 bg-deep p-6 shadow-[0_0_64px_rgba(20,184,166,0.16),0_0_80px_rgba(255,71,120,0.08)] sm:p-10">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="worlds-haze" />
      </div>
      <div className="relative">
        <p className="kicker">{m.flagship.kicker}</p>
        <h2 className="mt-3 font-display text-[clamp(2.1rem,6vw,3.8rem)] leading-[0.95] tracking-tight">
          {m.flagship.title}
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-secondary sm:text-[15px]">
          {m.flagship.lead}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={links.gghereHk}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary cta-pop"
          >
            {m.flagship.walkWorlds} <span aria-hidden>↗</span>
          </a>
          <a
            href={links.jubuddyPlanet}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            {m.flagship.openPlanet} <span aria-hidden>↗</span>
          </a>
        </div>
        <ul className="mt-8 flex flex-wrap gap-2">
          {[
            m.flagship.statCities,
            m.flagship.statPlanets,
            m.flagship.statBuildings,
            m.flagship.statAccount,
          ].map((stat) => (
            <li
              key={stat}
              className="rounded-full border border-accent/35 bg-accent/10 px-3 py-1 font-mono text-[11px] tracking-wide text-accent"
            >
              {stat}
            </li>
          ))}
        </ul>
        <p className="mt-8 text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">
          {m.flagship.constellation}
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {worldCities.map((city) => (
            <li key={city.slug}>
              <a
                href={cityHref(city.slug)}
                target="_blank"
                rel="noopener noreferrer"
                className="city-chip"
              >
                {city.name}
              </a>
            </li>
          ))}
        </ul>
        <div className="pointer-events-none absolute -right-6 -top-8 hidden lg:block" aria-hidden>
          <span className="worlds-planet mx-auto block scale-90">
            <span className="worlds-ring orbit-ring" />
            <span className="worlds-globe logo-float" />
            <span className="worlds-spark orbit-spark" />
          </span>
        </div>
      </div>
    </article>
  );
}
