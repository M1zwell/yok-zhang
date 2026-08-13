export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <span className="relative inline-flex items-center justify-center" style={{ width: size + 14, height: size + 10 }}>
      <span className="orbit-ring pointer-events-none absolute inset-0 rounded-full border border-accent/30" aria-hidden>
        <span className="orbit-spark absolute top-0 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-spark shadow-[0_0_8px_#FF4778]" />
        <span className="absolute right-0 bottom-1 size-1 -translate-y-1/2 rounded-full bg-spark-purple/80" />
      </span>
      <img
        src="/yok-mark.png"
        alt=""
        width={size}
        height={Math.round(size * 0.67)}
        className="logo-float relative z-10 h-auto w-auto"
        style={{ height: Math.round(size * 0.72), width: "auto" }}
      />
    </span>
  );
}
