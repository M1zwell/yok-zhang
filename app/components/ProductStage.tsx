import { ToolStage } from "@/app/components/ToolStage";
import { TiltFrame } from "@/app/components/TiltFrame";
import { WorldsCard } from "@/app/components/WorldsCard";
import { stageTools } from "@/lib/site";

export function ProductStage() {
  return (
    <div className="space-y-8">
      <TiltFrame>
        <WorldsCard />
      </TiltFrame>
      <ToolStage tools={stageTools} />
    </div>
  );
}
