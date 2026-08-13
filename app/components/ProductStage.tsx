import { ToolStage } from "@/app/components/ToolStage";
import { TiltFrame } from "@/app/components/TiltFrame";
import { WorldsCard } from "@/app/components/WorldsCard";
import type { Locale } from "@/lib/i18n";
import { stageTools } from "@/lib/site";

export function ProductStage({ locale = "en" }: { locale?: Locale }) {
  return (
    <div className="space-y-8">
      <TiltFrame>
        <WorldsCard locale={locale} />
      </TiltFrame>
      <ToolStage tools={stageTools} />
    </div>
  );
}
