import { quests } from "@/data/quests";
import { MiniWorldScene } from "@/components/scenes/mini-world-scene";
import { PixelPanel } from "@/components/ui/pixel-panel";
import { PixelTag } from "@/components/ui/pixel-tag";

export function QuestStatusSidebar() {
  const active = quests.filter((quest) => quest.status === "ACTIVE").length;
  const ongoing = quests.filter((quest) => quest.status === "ONGOING").length;
  const completed = quests.filter((quest) => quest.status === "COMPLETED").length;

  return (
    <div className="space-y-4">
      <PixelPanel eyebrow="QUEST" title="STATUS">
        <div className="grid min-w-0 grid-cols-3 gap-2 lg:grid-cols-1">
          <Stat label="TOTAL" value={quests.length} />
          <Stat label="ACTIVE" value={active} accent />
          <Stat label="ONGOING" value={ongoing} />
        </div>

        <div className="mt-4 hidden border-t border-divider pt-4 lg:block">
          <div className="flex flex-wrap gap-2">
            <PixelTag variant="active">ACTIVE</PixelTag>
            <PixelTag variant="ongoing">ONGOING</PixelTag>
            <PixelTag variant="completed">COMPLETED</PixelTag>
          </div>
          <p className="mt-4 text-[13px] leading-6 text-muted">
            {completed > 0 ? `${completed} 个已完成任务已归档。` : "还有新的任务正在解锁。"}
          </p>
        </div>
      </PixelPanel>

      <div className="hidden lg:block">
        <PixelPanel eyebrow="MASCOT" title="CURRENT AREA" contentClassName="p-3">
          <MiniWorldScene kind="cat" className="min-h-[150px] border-0" />
        </PixelPanel>
      </div>
    </div>
  );
}

function Stat({ label, value, accent = false }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="min-w-0 overflow-hidden border border-divider bg-soft p-2.5 lg:p-3">
      <p className="font-pixel text-[10px] text-muted">{label}</p>
      <p className={accent ? "mt-1 text-xl font-black text-accent lg:text-2xl" : "mt-1 text-xl font-black lg:text-2xl"}>
        {String(value).padStart(2, "0")}
      </p>
    </div>
  );
}
