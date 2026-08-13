import Link from "next/link";
import { HeroCanvas } from "@/app/components/HeroCanvas";
import { JoinFlow } from "@/app/components/JoinFlow";
import { PostCard } from "@/app/components/PostCard";
import { ProductMarquee } from "@/app/components/ProductMarquee";
import { ProductStage } from "@/app/components/ProductStage";
import { QuoteRotator } from "@/app/components/QuoteRotator";
import { Reveal } from "@/app/components/Reveal";
import { getAllPosts } from "@/lib/posts";
import { heroLine, links, liveProducts, tacitLine } from "@/lib/site";

export default function HomePage() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <main>
      <section className="relative overflow-hidden">
        <HeroCanvas />
        <div className="relative mx-auto max-w-6xl px-5 pt-16 pb-16 sm:px-8 sm:pt-24 sm:pb-20">
          <div className="hero-enter">
            <p className="kicker">Digital garden · 香港</p>
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
              {heroLine}
            </p>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted">{tacitLine}</p>
            <div className="mt-12 flex flex-wrap items-center gap-3">
              <Link href="/writing" className="btn btn-primary cta-pop">
                Start Reading
              </Link>
              <Link href="/products" className="btn btn-ghost">
                View Projects
              </Link>
              <Link href="/tools" className="text-sm font-medium text-accent hover:text-accent-hover">
                Open tools
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted">
              Use the tools. Follow{" "}
              <a href={links.github} className="font-mono text-accent hover:text-accent-hover">
                m1zwell
              </a>
              . Worlds live on{" "}
              <a href={links.gghere} className="text-accent hover:text-accent-hover">
                gghere.com
              </a>
              .
            </p>
          </div>
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
                <p className="kicker">Products</p>
                <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">See them run</h2>
              </div>
              <Link href="/products" className="text-sm font-semibold text-accent hover:text-accent-hover">
                All products →
              </Link>
            </div>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted">
              Framed previews of the surfaces that actually run. If a host refuses the iframe, the chrome stays.
            </p>
            <div className="mt-10">
              <ProductStage />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-hair">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="kicker">Writing</p>
                <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">What can be told</h2>
              </div>
              <Link href="/writing" className="text-sm font-semibold text-accent hover:text-accent-hover">
                All writing →
              </Link>
            </div>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted">{tacitLine}</p>
            <div className="mt-10 grid gap-4">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-hair bg-deep">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 sm:grid-cols-3 sm:px-8">
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.16em] text-muted uppercase">Notes</p>
            <p className="mt-2 font-display text-4xl text-fg">{getAllPosts().length}</p>
            <p className="mt-1 text-sm text-muted">in this garden</p>
          </Reveal>
          <Reveal delay={80}>
            <p className="font-mono text-[11px] tracking-[0.16em] text-muted uppercase">Live surfaces</p>
            <p className="mt-2 font-display text-4xl text-fg">{liveProducts.length}</p>
            <p className="mt-1 text-sm text-muted">products that run</p>
          </Reveal>
          <Reveal delay={160}>
            <p className="font-mono text-[11px] tracking-[0.16em] text-muted uppercase">City</p>
            <p className="mt-2 font-display text-4xl text-fg">香港</p>
            <p className="mt-1 text-sm text-muted">Hong Kong</p>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-hair">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Reveal>
            <p className="kicker">Enter</p>
            <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">Join a world</h2>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted">
              Pick a destination. Confirm. Continue to the real signup — or open gghere with no account.
            </p>
            <div className="mt-10 max-w-lg">
              <JoinFlow />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-hair">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Reveal>
            <p className="kicker">About</p>
            <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">Code and the rest</h2>
            <div className="mt-10 max-w-2xl space-y-6 text-[17px] leading-[1.7] text-secondary">
              <p>
                Yok Zhang works from Hong Kong. He builds AI — coding products that actually run. A
                trader&apos;s character: attention, risk, a bias toward what ships. The public handle is{" "}
                <a
                  href={links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-accent hover:text-accent-hover"
                >
                  m1zwell
                </a>
                , a game id he kept as identity.
              </p>
              <p>
                He is a father. Football and philosophy sit in the same life; they are not the work. The
                work is to ship.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Reveal>
            <p className="kicker">Write</p>
            <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">No list to join</h2>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted">
              Notes live here. Follow m1zwell, or write Yok.
            </p>
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
                    Primary
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
                  <span className="text-[11px] font-semibold tracking-wide text-muted uppercase">Gmail</span>
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
