import { KioskSim } from "@/app/components/kiosk/KioskSim";
import { seo } from "@/lib/seo";

export const metadata = seo({
  title: "Hostel PMS",
  description:
    "Night-shift hostel kiosk sim — Cloudbeds, QFPay, ProUSB. The interlocks are the game.",
  path: "/PMS",
});

export default function PmsPage() {
  return <KioskSim initialLang="zh-Hant" />;
}
