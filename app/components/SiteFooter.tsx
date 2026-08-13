import { links } from "@/lib/site";

export function SiteFooter() {
  return (
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
            <a href={links.jubitSignup} className="btn btn-primary">
              Create an account
            </a>
            <a href={links.dseekHome} className="btn btn-ghost">
              Open dseek
            </a>
            <a href={links.jubitLogin} className="btn btn-ghost">
              Sign in
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
          <a href={links.emailPrimary} className="text-muted hover:text-fg">
            yok@dseek.ai
          </a>
          <a href={links.emailGmail} className="text-muted hover:text-fg">
            yying2010@gmail.com
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
