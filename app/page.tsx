import { LiveFrame, ToolStage } from "@/app/components/ToolStage";
import { productGroups, research, tools } from "@/lib/site";

const nav = [
  { href: "#tools", label: "Tools" },
  { href: "#research", label: "Research" },
  { href: "#products", label: "Products" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

const JUBIT_SIGNUP = "https://www.jubit.ai/signup";
const JUBIT_LOGIN = "https://www.jubit.ai/login";
const DSEEK_HOME = "https://dseek.ai";
const DSEEK_SIGNUP = "https://dseek.ai/signup";
const DSEEK_LOGIN = "https://dseek.ai/login";
const JUBIT_HOME = "https://jubit.ai";
const JUBUDDY_SIGNUP = "https://jubuddy.com/signup";

export default function HomePage() {
  return (
    <>
      <a
        href="#tools"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-accent focus:px-3 focus:py-2 focus:text-bg"
      >
        Skip to tools
      </a>

      <header className="sticky top-0 z-40 border-b border-hair bg-bg/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3 sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <a href="#top" className="shrink-0">
              <img
                src="/yok-mark.png"
                alt=""
                width={36}
                height={24}
                className="h-7 w-auto"
              />
            </a>
            <div className="min-w-0 leading-tight">
              <a
                href="#top"
                className="block truncate text-[12px] font-semibold tracking-wide text-fg"
              >
                Yok Zhang
                <span className="mx-2 text-accent" aria-hidden>
                  ·
                </span>
                <span className="text-muted">
                  <span className="mr-1.5 text-[13px] font-medium text-accent">
                    香港
                  </span>
                  Hong Kong
                </span>
              </a>
              <a
                href="https://github.com/M1zwell"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-0.5 inline-block font-mono text-[12px] text-accent transition-colors hover:text-accent-hover"
              >
                m1zwell
              </a>
            </div>
          </div>
          <nav
            aria-label="Primary"
            className="hidden items-center gap-4 xl:flex"
          >
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[12px] font-medium text-muted transition-colors hover:text-fg"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            <a href={JUBIT_LOGIN} className="btn btn-ghost hidden sm:inline-flex">
              Sign in
            </a>
            <a href={JUBIT_SIGNUP} className="btn btn-primary">
              Register
            </a>
          </div>
        </div>
        <nav
          aria-label="Sections"
          className="flex gap-4 overflow-x-auto border-t border-hair px-5 py-2 xl:hidden"
        >
          <a href={JUBIT_LOGIN} className="shrink-0 text-[12px] font-medium text-accent sm:hidden">
            Sign in
          </a>
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="shrink-0 text-[12px] font-medium text-muted hover:text-fg"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <main id="top">
        <section className="relative mx-auto max-w-6xl px-5 pt-16 pb-16 sm:px-8 sm:pt-24 sm:pb-20">
          <p className="text-[12px] font-semibold tracking-[0.18em] text-accent uppercase">
            Hong Kong
          </p>
          <h1 className="mt-5 font-display text-[clamp(3rem,11vw,6.5rem)] leading-[0.92] tracking-tight text-fg">
            Yok Zhang
          </h1>
          <p className="mt-4">
            <a
              href="https://github.com/M1zwell"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[clamp(1.25rem,3.5vw,2rem)] text-accent transition-colors hover:text-accent-hover"
            >
              m1zwell
            </a>
          </p>
          <p className="mt-8 max-w-xl font-display text-[clamp(1.25rem,2.8vw,1.85rem)] leading-snug text-secondary">
            Hong Kong. Builds AI. Lives the rest.
          </p>
          <div className="mt-12 flex flex-wrap items-center gap-3">
            <a href={JUBIT_SIGNUP} className="btn btn-primary">
              Create an account
            </a>
            <a href={DSEEK_HOME} className="btn btn-ghost">
              Open dseek
            </a>
            <a
              href={JUBIT_HOME}
              className="text-sm font-medium text-accent hover:text-accent-hover"
            >
              Enter Jubit
            </a>
          </div>
          <p className="mt-4 text-sm text-muted">
            Use the tools. Follow{" "}
            <a
              href="https://github.com/M1zwell"
              className="font-mono text-accent hover:text-accent-hover"
            >
              m1zwell
            </a>
            . Also{" "}
            <a href={DSEEK_SIGNUP} className="text-accent hover:text-accent-hover">
              dseek signup
            </a>
            {" · "}
            <a href={DSEEK_LOGIN} className="text-accent hover:text-accent-hover">
              dseek login
            </a>
            {" · "}
            <a href={JUBUDDY_SIGNUP} className="text-accent hover:text-accent-hover">
              jubuddy signup
            </a>
            .
          </p>
        </section>

        <section className="border-y border-hair bg-deep">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div>
              <p className="font-display text-xl text-fg">Come in.</p>
              <p className="mt-1 text-sm text-muted">
                Register on Jubit, open dseek, or sign in if you already have a
                seat.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={JUBIT_SIGNUP} className="btn btn-primary">
                Register
              </a>
              <a href={JUBIT_LOGIN} className="btn btn-ghost">
                Sign in
              </a>
              <a href={DSEEK_HOME} className="btn btn-ghost">
                Open dseek
              </a>
            </div>
          </div>
        </section>

        <section id="tools" className="scroll-mt-24">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.18em] text-accent uppercase">
                  Tools
                </p>
                <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">
                  Live, in place
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-muted">
                Working apps on this page. If a host refuses the frame, the
                chrome stays — open live.
              </p>
            </div>
            <div className="mt-12">
              <ToolStage tools={tools} />
            </div>
          </div>
        </section>

        <section id="research" className="scroll-mt-24 border-t border-hair">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.18em] text-accent uppercase">
                  Writing
                </p>
                <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">
                  Research
                </h2>
              </div>
              <a
                href={research.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-accent hover:text-accent-hover"
              >
                Open research tab
              </a>
            </div>
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-muted">
              Writing lives in the dseek terminal research tab. No posts are
              listed here until titles are sourced from that surface.
            </p>
            <div className="mt-12">
              <LiveFrame
                title={research.title}
                href={research.href}
                path={research.path}
                embeddable={research.embeddable}
                embedSrc={research.embedSrc}
                heightClass="h-[min(78vh,720px)]"
              />
            </div>
          </div>
        </section>

        <section id="products" className="scroll-mt-24 border-t border-hair">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.18em] text-accent uppercase">
                  Index
                </p>
                <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">
                  Live products
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-muted">
                Directory of what runs. Tools above; source and the rest here.
              </p>
            </div>

            <div className="mt-16 space-y-16">
              {productGroups.map((group) => (
                <div key={group.id}>
                  <h3 className="text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">
                    {group.label}
                  </h3>
                  <ul className="mt-4">
                    {group.items.map((item) => (
                      <li
                        key={item.href}
                        className="border-t border-hair last:border-b"
                      >
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group grid grid-cols-1 items-baseline gap-2 py-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-8"
                        >
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                              <span className="font-display text-[1.65rem] leading-none tracking-tight text-fg transition-colors group-hover:text-accent sm:text-3xl">
                                {item.title}
                              </span>
                              <span
                                className={
                                  item.live
                                    ? "text-[10px] font-semibold tracking-wide text-accent uppercase"
                                    : "text-[10px] font-semibold tracking-wide text-muted uppercase"
                                }
                              >
                                {item.live ? "Live" : "Source"}
                              </span>
                            </div>
                            {item.note ? (
                              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
                                {item.note}
                              </p>
                            ) : null}
                          </div>
                          <span className="flex items-center gap-2 font-mono text-[11px] text-accent">
                            <span className="truncate">{item.path}</span>
                            <span aria-hidden>↗</span>
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="scroll-mt-24 border-t border-hair">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
            <p className="text-[11px] font-semibold tracking-[0.18em] text-accent uppercase">
              About
            </p>
            <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">
              Code and the rest
            </h2>
            <div className="mt-12 max-w-2xl space-y-6 text-[17px] leading-[1.7] text-secondary">
              <p>
                Yok Zhang works from Hong Kong. He builds AI — coding products
                that actually run. A trader&apos;s character: attention, risk,
                a bias toward what ships. The public handle is{" "}
                <a
                  href="https://github.com/M1zwell"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-accent hover:text-accent-hover"
                >
                  m1zwell
                </a>
                , a game id he kept as identity.
              </p>
              <p>
                He is a father. Football and philosophy sit in the same life;
                they are not the work. The work is to ship.
              </p>
            </div>
          </div>
        </section>

        <section id="contact" className="scroll-mt-24 border-t border-hair">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
            <p className="text-[11px] font-semibold tracking-[0.18em] text-accent uppercase">
              Contact
            </p>
            <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">
              Write to Yok
            </h2>
            <ul className="mt-12 max-w-2xl">
              <li className="border-t border-hair">
                <a
                  href="mailto:yok@dseek.ai"
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
                  href="mailto:yying2010@gmail.com"
                  className="group flex flex-col gap-1 py-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                >
                  <span className="font-display text-xl break-all transition-colors group-hover:text-accent sm:text-2xl">
                    yying2010@gmail.com
                  </span>
                  <span className="text-[11px] font-semibold tracking-wide text-muted uppercase">
                    Gmail
                  </span>
                </a>
              </li>
              <li className="border-t border-hair">
                <a
                  href="https://linkedin.com/in/yok-zhang-8793a611"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col gap-1 py-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                >
                  <span className="font-display text-2xl transition-colors group-hover:text-accent sm:text-3xl">
                    LinkedIn
                  </span>
                  <span className="font-mono text-[11px] text-accent">
                    yok-zhang-8793a611 ↗
                  </span>
                </a>
              </li>
              <li className="border-t border-b border-hair">
                <a
                  href="https://github.com/M1zwell"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col gap-1 py-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                >
                  <span className="font-mono text-2xl text-accent transition-colors group-hover:text-accent-hover sm:text-3xl">
                    m1zwell
                  </span>
                  <span className="font-mono text-[11px] text-accent">
                    github.com/M1zwell ↗
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="border-t border-hair bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="font-display text-lg text-fg">Create an account</p>
              <p className="mt-1 text-sm text-muted">
                Start on Jubit, or open dseek. Follow m1zwell.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={JUBIT_SIGNUP} className="btn btn-primary">
                Create an account
              </a>
              <a href={DSEEK_HOME} className="btn btn-ghost">
                Open dseek
              </a>
              <a href={JUBIT_LOGIN} className="btn btn-ghost">
                Sign in
              </a>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-hair pt-6 text-sm">
            <p className="text-muted">© 2026 Yok Zhang</p>
            <a
              href="https://github.com/M1zwell"
              className="font-mono text-accent hover:text-accent-hover"
            >
              m1zwell
            </a>
            <a
              href="https://linkedin.com/in/yok-zhang-8793a611"
              className="text-muted hover:text-fg"
            >
              LinkedIn
            </a>
            <a href="mailto:yok@dseek.ai" className="text-muted hover:text-fg">
              yok@dseek.ai
            </a>
            <a
              href="mailto:yying2010@gmail.com"
              className="text-muted hover:text-fg"
            >
              yying2010@gmail.com
            </a>
            <a href={DSEEK_SIGNUP} className="text-muted hover:text-fg">
              dseek signup
            </a>
            <a href={JUBUDDY_SIGNUP} className="text-muted hover:text-fg">
              jubuddy signup
            </a>
            <span className="text-muted">
              <span className="mr-1 text-accent">香港</span>
              Hong Kong
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
