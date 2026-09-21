import Link from "next/link";

import { MiniWorldScene } from "@/components/scenes/mini-world-scene";
import { PixelPanel } from "@/components/ui/pixel-panel";

const sections = [
  ["01", "项目概览", "quick-look"],
  ["02", "项目背景", "context"],
  ["03", "我做了什么", "actions"],
  ["04", "真实案例", "case"],
  ["05", "结果与沉淀", "outcomes"],
  ["06", "复盘与收获", "learnings"],
] as const;

export function QuestDetailSidebar({ photography = false }: { photography?: boolean }) {
  return (
    <div className="sticky top-[84px] space-y-4">
      <PixelPanel eyebrow="QUEST" title="案例目录">
        <nav aria-label="项目详情章节">
          {photography && <Link href="#photography" className="flex min-h-11 items-center border-b border-divider text-[13px] font-medium text-accent">摄影作品 · 五类现场 →</Link>}
          {sections.map(([index, label, id]) => (
            <Link
              key={index}
              href={`#${id}`}
              className="group grid min-h-11 grid-cols-[30px_1fr_auto] items-center border-b border-divider py-2 transition-colors last:border-0 hover:text-accent"
            >
              <span className="font-pixel text-[10px] text-accent">{index}</span>
              <span className="text-[13px]">{label}</span>
              <span aria-hidden="true" className="font-pixel text-[10px] text-muted group-hover:text-accent">→</span>
            </Link>
          ))}
        </nav>
      </PixelPanel>

      <PixelPanel eyebrow="MASCOT" title="任务伙伴" contentClassName="p-3">
        <MiniWorldScene kind="cat" className="min-h-[145px] border-0" />
      </PixelPanel>
    </div>
  );
}

