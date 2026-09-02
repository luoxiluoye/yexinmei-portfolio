import { PixelIcon } from "@/components/ui/pixel-icon";
import { PixelPanel } from "@/components/ui/pixel-panel";

const sections = [
  ["01", "项目简介"],
  ["02", "项目目标"],
  ["03", "主要难点"],
  ["04", "我做了什么"],
  ["05", "结果与沉淀"],
  ["06", "复盘与收获"],
] as const;

export function QuestDetailSidebar() {
  return (
    <div className="sticky top-[92px] space-y-4">
      <PixelPanel eyebrow="QUEST" title="MAP">
        <div className="space-y-2">
          {sections.map(([index, label]) => (
            <div key={index} className="grid grid-cols-[30px_1fr] items-center border-b border-divider py-2 last:border-0">
              <span className="font-pixel text-[10px] text-accent">{index}</span>
              <span className="text-[13px]">{label}</span>
            </div>
          ))}
        </div>
      </PixelPanel>

      <PixelPanel eyebrow="MASCOT" title="CURRENT QUEST">
        <div className="relative min-h-[150px] overflow-hidden">
          <PixelIcon
            assetId="world.grassShort"
            decorative
            width={190}
            height={60}
            className="absolute bottom-0 left-1/2 z-10 w-[76%] -translate-x-1/2"
          />
          <PixelIcon
            assetId="cat.sit"
            decorative
            width={68}
            height={68}
            className="absolute bottom-[22px] left-1/2 z-20 -translate-x-1/2"
          />
          <PixelIcon
            assetId="ui.sparkle"
            decorative
            width={16}
            height={16}
            className="absolute right-[18%] top-[20%] z-0"
          />
        </div>
      </PixelPanel>
    </div>
  );
}
