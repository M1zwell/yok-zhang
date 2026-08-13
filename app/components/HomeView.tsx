import Link from "next/link";
import { CityPlanetFlagship } from "@/app/components/CityPlanetFlagship";
import { HeroCanvas } from "@/app/components/HeroCanvas";
import { JoinFlow } from "@/app/components/JoinFlow";
import { PostCard } from "@/app/components/PostCard";
import { ProductMarquee } from "@/app/components/ProductMarquee";
import { ProductStage } from "@/app/components/ProductStage";
import { QuoteRotator } from "@/app/components/QuoteRotator";
import { Reveal } from "@/app/components/Reveal";
import type { Locale } from "@/lib/i18n";
import { localizeHref } from "@/lib/i18n";
import { t } from "@/lib/messages";
import { getAllPosts } from "@/lib/posts";
import { links, liveProducts } from "@/lib/site";

export function HomeView({ locale = "en" }: { locale?: Locale }) {
  const posts = getAllPosts().slice(0, 3);
  const m = t(locale);
  const href = (path: string) => localizeHref(path, locale);

  return (
    <main>
      <section className="relative overflow-hidden">
        <HeroCanvas />
        <div className="relative mx-auto max-w-6xl px-5 pt-16 pb-16 sm:px-8 sm:pt-24 sm:pb-20">
          <div className="hero-enter">
            <p className="kicker">{m.kicker.garden}</p>
            <h1 className="mt-5 font-display text-[clamp(3rem,11vw,6.5rem)] leading-[0.92] tracking-tight text-fg">
              Yok Zhang
            </h1>
            <p className="mt-4">
              <a
                href={links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[clamp(1.25rem,3.5vw,2rem)] text-accent transition-colors hover:text-accent-hover"
              >
                m1zwell
              </a>
            </p>
            <p className="mt-8 max-w-xl font-display text-[clamp(1.25rem,2.8vw,1.85rem)] leading-snug text-secondary">
              {m.heroLine}
            </p>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted">{m.tacitLine}</p>
            <div className="mt-12 flex flex-wrap items-center gap-3">
              <Link href={href("/writing")} className="btn btn-primary cta-pop">
                {m.cta.startReading}
              </Link>
              <a href={links.gghereWorlds} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                {m.cta.walkACity}
              </a>
              <Link href={href("/products")} className="btn btn-ghost">
                {m.cta.viewProjects}
              </Link>
              <Link href={href("/tools")} className="text-sm font-medium text-accent hover:text-accent-hover">
                {m.cta.openTools}
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted">
              {m.home.useTheTools}{" "}
              <a href={links.github} className="font-mono text-accent hover:text-accent-hover">
                m1zwell
              </a>
              . {m.home.worldsLiveOn}{" "}
              <a href={links.gghereWorlds} className="text-accent hover:text-accent-hover">
                gghere.com/worlds
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-hair">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Reveal>
            <CityPlanetFlagship locale={locale} />
          </Reveal>
        </div>
      </section>

      <ProductMarquee />

      <section className="border-b border-hair">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
          <Reveal>
            <QuoteRotator />
          </Reveal>
        </div>
      </section>

      <section className="border-b border-hair">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="kicker">{m.kicker.products}</p>
                <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">{m.home.seeThemRun}</h2>
              </div>
              <Link href={href("/products")} className="text-sm font-semibold text-accent hover:text-accent-hover">
                {m.cta.allProducts}
              </Link>
            </div>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted">{m.home.framedPreviews}</p>
            <div className="mt-10">
              <ProductStage locale={locale} />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-hair">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="kicker">{m.kicker.writing}</p>
                <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">{m.home.whatCanBeTold}</h2>
              </div>
              <Link href={href("/writing")} className="text-sm font-semibold text-accent hover:text-accent-hover">
                {m.cta.allWriting}
              </Link>
            </div>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted">{m.tacitLine}</p>
            <div className="mt-10 grid gap-4">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} locale={locale} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-hair bg-deep">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 sm:grid-cols-3 sm:px-8">
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.16em] text-muted uppercase">{m.home.notes}</p>
            <p className="mt-2 font-display text-4xl text-fg">{getAllPosts().length}</p>
            <p className="mt-1 text-sm text-muted">{m.home.inGarden}</p>
          </Reveal>
          <Reveal delay={80}>
            <p className="font-mono text-[11px] tracking-[0.16em] text-muted uppercase">{m.home.liveSurfaces}</p>
            <p className="mt-2 font-display text-4xl text-fg">{liveProducts.length}</p>
            <p className="mt-1 text-sm text-muted">{m.home.productsThatRun}</p>
          </Reveal>
          <Reveal delay={160}>
            <p className="font-mono text-[11px] tracking-[0.16em] text-muted uppercase">{m.home.city}</p>
            <p className="mt-2 font-display text-4xl text-fg">香港</p>
            <p className="mt-1 text-sm text-muted">{m.home.hongKong}</p>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-hair">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Reveal>
            <p className="kicker">{m.kicker.enter}</p>
            <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">{m.home.joinAWorld}</h2>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted">{m.home.joinLead}</p>
            <div className="mt-10 max-w-lg">
              <JoinFlow />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-hair">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Reveal>
            <p className="kicker">{m.kicker.about}</p>
            <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">{m.home.codeAndTheRest}</h2>
            <div className="mt-10 max-w-2xl space-y-6 text-[17px] leading-[1.7] text-secondary">
              <p>
                {m.home.aboutP1a}{" "}
                <a
                  href={links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-accent hover:text-accent-hover"
                >
                  m1zwell
                </a>
                {m.home.aboutP1b}
              </p>
              <p>{m.home.aboutP2}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Reveal>
            <p className="kicker">{m.kicker.write}</p>
            <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">{m.home.noList}</h2>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted">{m.home.notesLiveHere}</p>
            <ul className="mt-10 max-w-2xl">
              <li className="border-t border-hair">
                <a
                  href={links.emailPrimary}
                  className="group flex flex-col gap-1 py-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                >
                  <span className="font-display text-2xl transition-colors group-hover:text-accent sm:text-3xl">
                    yok@dseek.ai
                  </span>
                  <span className="text-[11px] font-semibold tracking-wide text-accent uppercase">
                    {m.home.primary}
                  </span>
                </a>
              </li>
              <li className="border-t border-hair">
                <a
                  href={links.emailGmail}
                  className="group flex flex-col gap-1 py-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                >
                  <span className="font-display text-xl break-all transition-colors group-hover:text-accent sm:text-2xl">
                    yying2010@gmail.com
                  </span>
                  <span className="text-[11px] font-semibold tracking-wide text-muted uppercase">{m.home.gmail}</span>
                </a>
              </li>
              <li className="border-t border-hair">
                <a
                  href={links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col gap-1 py-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                >
                  <span className="font-display text-2xl transition-colors group-hover:text-accent sm:text-3xl">
                    LinkedIn
                  </span>
                  <span className="font-mono text-[11px] text-accent">yok-zhang-8793a611 ↗</span>
                </a>
              </li>
              <li className="border-t border-b border-hair">
                <a
                  href={links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col gap-1 py-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                >
                  <span className="font-mono text-2xl text-accent transition-colors group-hover:text-accent-hover sm:text-3xl">
                    m1zwell
                  </span>
                  <span className="font-mono text-[11px] text-accent">github.com/M1zwell ↗</span>
                </a>
              </li>
            </ul>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
