import { KioskApp } from "@/app/components/kiosk/KioskApp";
import { seo } from "@/lib/seo";

export const metadata = seo({
  title: "Hostel kiosk",
  description: "Self-service hostel check-in — Cloudbeds, QFPay, ProUSB, and card dispenser, simulated on this garden.",
  path: "/kiosk",
});

export default function KioskPage() {
  return <KioskApp initialLang="zh-Hant" />;
}
