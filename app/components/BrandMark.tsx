export type Brand = "ichina" | "m1zwell" | "dseek";

export function brandForGroup(group?: string): Brand {
  return group === "dseek" ? "dseek" : "ichina";
}

export function BrandMark({
  brand,
  size = 32,
  className,
  alt = "",
}: {
  brand: Brand;
  size?: number;
  className?: string;
  alt?: string;
}) {
  return (
    <img
      src={`/marks/${brand}.png`}
      alt={alt}
      width={size}
      height={size}
      draggable={false}
      className={`inline-block shrink-0 select-none${className ? ` ${className}` : ""}`}
      style={{ width: size, height: size }}
    />
  );
}
