import { KioskApp } from "@/app/components/kiosk/KioskApp";
import { seo } from "@/lib/seo";

export const metadata = seo({
  title: "Hostel PMS",
  description: "Self-service hostel check-in — Cloudbeds, QFPay, ProUSB, and card dispenser, simulated on this garden.",
  path: "/PMS",
});

export default function PmsPage() {
  return <KioskApp initialLang="zh-Hant" />;
}
