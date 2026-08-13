import { liveProducts } from "@/lib/site";

export function ProductMarquee() {
  const row = [...liveProducts, ...liveProducts];
  return (
    <div className="relative overflow-hidden border-y border-hair bg-deep/80">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-bg to-transparent" />
      <div className="marquee-track gap-10 py-3 pr-10">
        {row.map((item, i) => (
          <a
            key={`${item.path}-${i}`}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex shrink-0 items-center gap-3 font-mono text-[12px] text-accent hover:text-accent-hover"
          >
            <span className="size-1.5 rounded-full bg-spark shadow-[0_0_8px_#FF4778]" aria-hidden />
            <span>{item.path}</span>
            <span className="text-[10px] tracking-wide text-muted uppercase">live</span>
          </a>
        ))}
      </div>
    </div>
  );
}
