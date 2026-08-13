import { links } from "@/lib/site";
import { ShareActions } from "@/app/components/ShareActions";

export function WorldsCard() {
  return (
    <article className="worlds-card relative overflow-hidden rounded-[20px] border border-hair bg-deep p-6 shadow-[0_0_48px_rgba(20,184,166,0.12)] sm:p-8">
      <div className="pointer-events-none absolute inset-0 opacity-80" aria-hidden>
        <div className="worlds-haze" />
      </div>
      <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
        <div>
          <p className="kicker">Worlds</p>
          <h2 className="mt-3 font-display text-[clamp(2rem,5vw,3.4rem)] leading-[0.95] tracking-tight">
            Tiny planets you can walk
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-secondary">
            Worlds live on{" "}
            <a href={links.gghere} className="text-accent hover:text-accent-hover">
              gghere.com
            </a>
            . No account. Open the tab. A peer world — this garden did not edit it.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href={links.gghere} target="_blank" rel="noopener noreferrer" className="btn btn-primary cta-pop">
              Open gghere.com ↗
            </a>
            <a
              href={links.gghereWorlds}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              gghere.com/worlds ↗
            </a>
          </div>
          <div className="mt-6">
            <ShareActions href={links.gghere} title="Worlds live on gghere.com" />
          </div>
        </div>
        <a
          href={links.gghere}
          target="_blank"
          rel="noopener noreferrer"
          className="worlds-planet mx-auto block"
          aria-label="Open gghere.com"
        >
          <span className="worlds-ring orbit-ring" />
          <span className="worlds-globe logo-float" />
          <span className="worlds-spark orbit-spark" />
        </a>
      </div>
    </article>
  );
}
