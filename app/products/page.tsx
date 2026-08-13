import { ProductMarquee } from "@/app/components/ProductMarquee";
import { ProductStage } from "@/app/components/ProductStage";
import { ShareActions } from "@/app/components/ShareActions";
import { seo } from "@/lib/seo";
import { productGroups } from "@/lib/site";

export const metadata = seo({
  title: "Products",
  description: "Live product directory — Jubit, dseek, gghere, and the rest that actually runs.",
  path: "/products",
});

export default function ProductsPage() {
  return (
    <main>
      <section className="mx-auto max-w-6xl px-5 pt-16 pb-12 sm:px-8 sm:pt-24">
        <p className="kicker">Index</p>
        <h1 className="mt-4 font-display text-[clamp(2.4rem,7vw,4.5rem)] leading-[0.95] tracking-tight">
          Live products
        </h1>
        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted">
          See them. Tools are a workspace; this is the shelf — framed, live, shareable.
        </p>
      </section>
      <ProductMarquee />
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <ProductStage />
      </section>
      <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8 sm:pb-20">
        <div className="space-y-16">
          {productGroups.map((group) => (
            <div key={group.id}>
              <h2 className="text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">
                {group.label}
              </h2>
              <ul className="mt-4">
                {group.items.map((item) => (
                  <li key={item.href} className="border-t border-hair last:border-b">
                    <div className="grid grid-cols-1 items-baseline gap-2 py-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-8">
                      <div className="min-w-0">
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex flex-wrap items-baseline gap-x-3 gap-y-1"
                        >
                          <span className="font-display text-[1.65rem] leading-none tracking-tight text-fg transition-colors group-hover:text-accent sm:text-3xl">
                            {item.title}
                          </span>
                          <span className={item.live ? "live-badge" : "text-[10px] font-semibold tracking-wide text-muted uppercase"}>
                            {item.live ? "live" : "Source"}
                          </span>
                        </a>
                        {item.note ? (
                          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">{item.note}</p>
                        ) : null}
                        <div className="mt-3">
                          <ShareActions href={item.href} title={item.title} />
                        </div>
                      </div>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 font-mono text-[11px] text-accent"
                      >
                        <span className="truncate">{item.path}</span>
                        <span aria-hidden>↗</span>
                      </a>
                    </div>
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
