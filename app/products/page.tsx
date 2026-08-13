import { ProductMarquee } from "@/app/components/ProductMarquee";
import { productGroups } from "@/lib/site";

export const metadata = {
  title: "Products",
  description: "Live product directory — Jubit, dseek, gghere, and the rest that actually runs.",
};

export default function ProductsPage() {
  return (
    <main>
      <section className="mx-auto max-w-6xl px-5 pt-16 pb-12 sm:px-8 sm:pt-24">
        <p className="kicker">Index</p>
        <h1 className="mt-4 font-display text-[clamp(2.4rem,7vw,4.5rem)] leading-[0.95] tracking-tight">
          Live products
        </h1>
        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted">
          Directory of what runs. Tools are a workspace; this is the shelf.
        </p>
      </section>
      <ProductMarquee />
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="space-y-16">
          {productGroups.map((group) => (
            <div key={group.id}>
              <h2 className="text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">
                {group.label}
              </h2>
              <ul className="mt-4">
                {group.items.map((item) => (
                  <li key={item.href} className="border-t border-hair last:border-b">
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
                          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">{item.note}</p>
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
      </section>
    </main>
  );
}
