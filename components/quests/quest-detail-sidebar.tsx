import { MiniWorldScene } from "@/components/scenes/mini-world-scene";
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
    <div className="sticky top-[84px] space-y-4">
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

      <PixelPanel eyebrow="MASCOT" title="CURRENT QUEST" contentClassName="p-3">
        <MiniWorldScene kind="cat" className="min-h-[145px] border-0" />
      </PixelPanel>
    </div>
  );
}
