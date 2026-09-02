import Link from "next/link";

import type { Quest, QuestStatus } from "@/types/quest";
import type { AssetId } from "@/lib/assets";
import { PixelIcon } from "./pixel-icon";
import { PixelTag } from "./pixel-tag";

function getStatusVariant(status: QuestStatus) {
  if (status === "ACTIVE") return "active" as const;
  if (status === "COMPLETED") return "completed" as const;
  return "ongoing" as const;
}

function getQuestIcon(quest: Quest): AssetId {
  if (quest.categories.includes("摄影") || quest.categories.includes("视频")) {
    return "items.camera";
  }
  if (quest.categories.includes("AI 提效")) return "items.laptop";
  if (quest.categories.includes("个人项目")) return "items.key";
  return "items.notebook";
}

export function QuestCard({ quest, index }: { quest: Quest; index: number }) {
  return (
    <Link
      href={`/quests/${quest.slug}`}
      className="group pixel-cut-frame block transition-transform hover:-translate-x-px hover:-translate-y-px active:translate-x-px active:translate-y-px"
    >
      <article className="pixel-cut-surface flex min-h-[204px] flex-col p-4 lg:min-h-[220px] lg:p-5">
        <div className="grid min-w-0 grid-cols-[1fr_auto] items-start gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-divider bg-soft">
              <PixelIcon
                assetId={getQuestIcon(quest)}
                decorative
                width={30}
                height={30}
              />
            </div>

            <div className="min-w-0">
              <p className="font-pixel text-[11px] text-muted">
                {quest.code} · {String(index + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-1 text-[17px] font-bold leading-6 lg:text-[18px] lg:leading-7">{quest.title}</h2>
            </div>
          </div>

          <PixelTag variant={getStatusVariant(quest.status)}>{quest.status}</PixelTag>
        </div>

        <p className="mt-3 line-clamp-2 text-[14px] leading-6 text-muted lg:mt-4 lg:line-clamp-3">
          {quest.subtitle}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {quest.categories.slice(0, 3).map((category) => (
            <PixelTag key={category}>{category}</PixelTag>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-divider pt-4">
          <span className="text-[12px] text-muted">{quest.role}</span>
          <span className="font-pixel text-[11px] transition-colors group-hover:text-accent">
            OPEN →
          </span>
        </div>
      </article>
    </Link>
  );
}
