import { PublishDesk } from "@/app/components/PublishDesk";
import { StudioShelf } from "@/app/components/StudioShelf";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/messages";

export function ShareView({ locale = "en" }: { locale?: Locale }) {
  const m = t(locale);
  return (
    <main>
      <section className="mx-auto max-w-6xl px-5 pt-16 pb-10 sm:px-8 sm:pt-24">
        <p className="kicker">{m.share.kicker}</p>
        <h1 className="mt-4 font-display text-[clamp(2.4rem,7vw,4.5rem)] leading-[0.95] tracking-tight">
          {m.share.title}
        </h1>
        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted">{m.share.lead}</p>
      </section>
      <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
        <PublishDesk locale={locale} />
      </section>
      <section className="border-t border-hair">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <StudioShelf locale={locale} compact />
        </div>
      </section>
    </main>
  );
}
