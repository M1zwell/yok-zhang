import { BrandMark } from "@/app/components/BrandMark";
import { CityPlanetFlagship } from "@/app/components/CityPlanetFlagship";
import { PretextLines } from "@/app/components/PretextLines";
import { ProductStage } from "@/app/components/ProductStage";
import { ShareActions } from "@/app/components/ShareActions";
import type { Locale } from "@/lib/i18n";
import { localizeHref } from "@/lib/i18n";
import { t } from "@/lib/messages";
import { productGroups } from "@/lib/site";
import Link from "next/link";

const groupLabel: Record<string, keyof ReturnType<typeof t>["productsPage"]> = {
  worlds: "groupWorlds",
  games: "groupGames",
  jubit: "groupJubit",
  dseek: "groupDseek",
  other: "groupOther",
};

export function ProductsView({ locale = "en" }: { locale?: Locale }) {
  const m = t(locale);

  return (
    <main>
      <section className="page-x mx-auto max-w-6xl pt-14 pb-12 sm:pt-24">
        <p className="kicker">{m.productsPage.kicker}</p>
        <h1 className="mt-4 font-display text-[clamp(2.4rem,7vw,4.5rem)] leading-[0.95] tracking-tight">
          {m.productsPage.title}
        </h1>
        <PretextLines
          text={m.productsPage.lead}
          locale={locale}
          className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted"
        />
      </section>
      <section className="page-x mx-auto max-w-6xl pb-12">
        <CityPlanetFlagship locale={locale} />
      </section>
      <section className="page-x mx-auto max-w-6xl py-16 sm:py-20">
        <ProductStage locale={locale} />
      </section>
      <section className="page-x mx-auto max-w-6xl pb-16 sm:pb-20">
        <div className="space-y-16">
          {productGroups.map((group) => {
            const key = groupLabel[group.id];
            const label = key ? m.productsPage[key] : group.label;
            const worlds = group.id === "worlds";
            return (
              <div key={group.id} className={worlds ? "rounded-[20px] border border-accent/25 bg-deep/60 p-5 sm:p-8" : ""}>
                <h2 className="flex items-center gap-2.5 text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">
                  {group.id === "dseek" ? <BrandMark brand="dseek" size={28} /> : null}
                  {label}
                </h2>
                <ul className="mt-4">
                  {group.items.map((item) => {
                    const internal = item.href.startsWith("/");
                    const itemHref = internal ? localizeHref(item.href, locale) : item.href;
                    const shareHref = internal ? `https://ichina.co${item.href}` : item.href;
                    const titleClass = worlds
                      ? "font-display text-[1.9rem] leading-none tracking-tight text-fg transition-colors group-hover:text-accent sm:text-4xl"
                      : "font-display text-[1.65rem] leading-none tracking-tight text-fg transition-colors group-hover:text-accent sm:text-3xl";
                    const titleInner = (
                      <>
                        <span className={titleClass}>{item.title}</span>
                        <span className={item.live ? "live-badge" : "text-[10px] font-semibold tracking-wide text-muted uppercase"}>
                          {item.live ? m.productsPage.live : m.productsPage.source}
                        </span>
                      </>
                    );
                    return (
                    <li key={item.href} className="border-t border-hair last:border-b">
                      <div className="grid grid-cols-1 items-baseline gap-2 py-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-8">
                        <div className="flex min-w-0 items-start gap-3">
                          {group.id === "dseek" ? <BrandMark brand="dseek" size={32} className="mt-0.5" /> : null}
                          <div className="min-w-0">
                          {internal ? (
                            <Link href={itemHref} className="group flex flex-wrap items-baseline gap-x-3 gap-y-1">
                              {titleInner}
                            </Link>
                          ) : (
                            <a
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group flex flex-wrap items-baseline gap-x-3 gap-y-1"
                            >
                              {titleInner}
                            </a>
                          )}
                          {item.note ? (
                            <PretextLines
                              text={item.note}
                              locale={locale}
                              tight
                              className="mt-2 max-w-xl text-sm leading-relaxed text-muted"
                            />
                          ) : null}
                          <div className="mt-3">
                            <ShareActions href={shareHref} title={item.title} locale={locale} />
                          </div>
                          </div>
                        </div>
                        {internal ? (
                          <Link href={itemHref} className="flex items-center gap-2 font-mono text-[11px] text-accent">
                            <span className="truncate">{item.path}</span>
                            <span aria-hidden>→</span>
                          </Link>
                        ) : (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 font-mono text-[11px] text-accent"
                          >
                            <span className="truncate">{item.path}</span>
                            <span aria-hidden>↗</span>
                          </a>
                        )}
                      </div>
                    </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
