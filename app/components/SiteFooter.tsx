import { EnterButton } from "@/app/components/JoinFlow";
import { links } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-hair bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-display text-lg text-fg">Worlds live on gghere.com</p>
            <p className="mt-1 max-w-md text-sm text-muted">
              A peer world. Pick a destination, confirm, then go — or open the tab with no account.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <EnterButton className="btn btn-primary cta-pop" />
            <a href={links.gghere} className="btn btn-ghost">
              Open gghere ↗
            </a>
            <a href={links.dseekHome} className="btn btn-ghost">
              Open dseek
            </a>
            <a href={links.jubitSignup} className="btn btn-ghost">
              Register
            </a>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-hair pt-6 text-sm">
          <p className="text-muted">© 2026 Yok Zhang</p>
          <a href={links.github} className="font-mono text-accent hover:text-accent-hover">
            m1zwell
          </a>
          <a href={links.linkedin} className="text-muted hover:text-fg">
            LinkedIn
          </a>
          <a href={links.github} className="text-muted hover:text-fg">
            GitHub
          </a>
          <a href={links.emailPrimary} className="text-muted hover:text-fg">
            yok@dseek.ai
          </a>
          <a href={links.emailGmail} className="text-muted hover:text-fg">
            yying2010@gmail.com
          </a>
          <a href={links.gghere} className="text-muted hover:text-fg">
            gghere.com
          </a>
          <a href={links.gghereWorlds} className="text-muted hover:text-fg">
            /worlds
          </a>
          <a href={links.dseekSignup} className="text-muted hover:text-fg">
            dseek signup
          </a>
          <a href={links.jubuddySignup} className="text-muted hover:text-fg">
            jubuddy signup
          </a>
          <span className="text-muted">
            <span className="mr-1 text-accent">香港</span>
            Hong Kong
          </span>
        </div>
      </div>
    </footer>
  );
}
