import { BrandMark } from "@/app/components/BrandMark";

export function LogoMark({ size = 36 }: { size?: number }) {
  return <BrandMark brand="ichina" size={size} className="logo-float" />;
}
