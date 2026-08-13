import { HkDistrictJump } from "@/app/components/HkDistrictJump";
import { ToolStage } from "@/app/components/ToolStage";
import { UniverseLauncher } from "@/app/components/UniverseLauncher";
import { links, tools } from "@/lib/site";

export const metadata = {
  title: "Tools",
  description: "On-site tools and live embeds — universe launcher, HK district jump, working apps.",
};

export default function ToolsPage() {
  return (
    <main>
      <section className="mx-auto max-w-6xl px-5 pt-16 pb-10 sm:px-8 sm:pt-24">
        <p className="kicker">Workspace</p>
        <h1 className="mt-4 font-display text-[clamp(2.4rem,7vw,4.5rem)] leading-[0.95] tracking-tight">
          Tools
        </h1>
        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted">
          First-party jumpers on this domain, then live frames of the apps. Hosts that block{" "}
          <span className="font-mono text-[12px] text-secondary">frame-ancestors</span> keep chrome —
          open live. Register on{" "}
          <a href={links.jubitSignup} className="text-accent hover:text-accent-hover">
            Jubit
          </a>{" "}
          or open{" "}
          <a href={links.dseekHome} className="text-accent hover:text-accent-hover">
            dseek
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
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="kicker">Live frames</p>
              <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">In place</h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-muted">
              Working apps on this page. If a host refuses the frame, the chrome stays.
            </p>
          </div>
          <div className="mt-12">
            <ToolStage tools={tools} />
          </div>
        </div>
      </section>
    </main>
  );
}
