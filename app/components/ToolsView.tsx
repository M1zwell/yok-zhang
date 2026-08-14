import { HkDistrictJump } from "@/app/components/HkDistrictJump";
import { StudioShelf } from "@/app/components/StudioShelf";
import { ToolStage } from "@/app/components/ToolStage";
import { UniverseLauncher } from "@/app/components/UniverseLauncher";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/messages";
import { links, tools } from "@/lib/site";

export function ToolsView({ locale = "en" }: { locale?: Locale }) {
  const m = t(locale);
  return (
    <main>
      <section className="mx-auto max-w-6xl px-5 pt-16 pb-10 sm:px-8 sm:pt-24">
        <p className="kicker">{m.toolsPage.kicker}</p>
        <h1 className="mt-4 font-display text-[clamp(2.4rem,7vw,4.5rem)] leading-[0.95] tracking-tight">
          {m.toolsPage.title}
        </h1>
        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted">
          {m.toolsPage.lead} Register on{" "}
          <a href={links.jubitSignup} className="text-accent hover:text-accent-hover">
            Jubit
          </a>{" "}
          or open{" "}
          <a href={links.dseekHome} className="text-accent hover:text-accent-hover">
            dseek
          </a>
          . Research lives on the{" "}
          <a href={links.dseekResearch} className="text-accent hover:text-accent-hover">
            terminal tab
          </a>
          — example{" "}
          <a href={links.dseekResearchSymbol} className="font-mono text-accent hover:text-accent-hover">
            00700
          </a>
          .
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-5 pb-16 sm:px-8 lg:grid-cols-2">
        <UniverseLauncher />
        <HkDistrictJump />
      </section>

      <section className="border-t border-hair">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <StudioShelf locale={locale} embed />
        </div>
      </section>

      <section className="border-t border-hair">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="kicker">{m.kicker.liveFrames}</p>
              <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">{m.toolsPage.inPlace}</h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-muted">{m.toolsPage.inPlaceLead}</p>
          </div>
          <div className="mt-12">
            <ToolStage tools={tools} />
          </div>
        </div>
      </section>
    </main>
  );
}
