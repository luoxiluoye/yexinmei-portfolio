import { quests } from "@/data/quests";
import { PixelIcon } from "@/components/ui/pixel-icon";
import { PixelPanel } from "@/components/ui/pixel-panel";
import { PixelTag } from "@/components/ui/pixel-tag";

export function QuestStatusSidebar() {
  const active = quests.filter((quest) => quest.status === "ACTIVE").length;
  const ongoing = quests.filter((quest) => quest.status === "ONGOING").length;
  const completed = quests.filter((quest) => quest.status === "COMPLETED").length;

  return (
    <div className="space-y-4">
      <PixelPanel eyebrow="QUEST" title="STATUS">
        <div className="grid grid-cols-3 gap-2 lg:grid-cols-1">
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
            {completed > 0
              ? `${completed} 个已完成任务已归档。`
              : "还有新的任务正在解锁。"}
          </p>
        </div>
      </PixelPanel>

      <div className="hidden lg:block">
        <PixelPanel eyebrow="MASCOT" title="CURRENT AREA">
          <div className="relative flex min-h-[176px] items-end justify-center overflow-hidden bg-background">
            <PixelIcon
              assetId="world.cloudSmall"
              decorative
              width={72}
              height={54}
              className="absolute right-4 top-3"
            />
            <PixelIcon
              assetId="cat.sit"
              decorative
              width={72}
              height={72}
              className="relative z-20 mb-6"
            />
            <PixelIcon
              assetId="world.grassShort"
              decorative
              width={200}
              height={64}
              className="absolute bottom-0 left-1/2 z-10 -translate-x-1/2"
            />
          </div>
        </PixelPanel>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="border border-divider bg-soft p-3">
      <p className="font-pixel text-[10px] text-muted">{label}</p>
      <p className={accent ? "mt-1 text-2xl font-black text-accent" : "mt-1 text-2xl font-black"}>
        {String(value).padStart(2, "0")}
      </p>
    </div>
  );
}
