import { Special_Elite, ZCOOL_XiaoWei } from "next/font/google";
import "@/app/components/game/nz-tokens.css";

const nzType = Special_Elite({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--nz-font-type",
});

const nzDisplay = ZCOOL_XiaoWei({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--nz-font-display",
  preload: false,
  adjustFontFallback: false,
});

export default function GameLayout({ children }: { children: React.ReactNode }) {
  return <div className={`nz ${nzType.variable} ${nzDisplay.variable}`}>{children}</div>;
}
