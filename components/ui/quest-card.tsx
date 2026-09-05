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
  const iconBySlug: Record<string, AssetId> = {
    "zhihu-auto-consumer-tech": "ui.speechBubble",
    "global-content": "items.mail",
    "tech-you-houhua": "items.laptop",
    "ccd-business": "items.key",
    "visual-storytelling": "items.camera",
    "inspiration-studio": "ui.sparkle",
  };

  return iconBySlug[quest.slug] ?? "items.notebook";
}

export function QuestCard({ quest }: { quest: Quest }) {
  return (
    <Link
      href={`/quests/${quest.slug}`}
      className="group pixel-cut-frame rpg-window-interactive block"
    >
      <article className="pixel-cut-surface flex min-h-[198px] flex-col p-4 lg:min-h-[210px] lg:p-5">
        <div className="grid min-w-0 grid-cols-[1fr_auto] items-start gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-divider bg-soft transition-colors group-hover:border-border group-hover:bg-paper">
              <PixelIcon
                assetId={getQuestIcon(quest)}
                decorative
                width={36}
                height={36}
                className="rpg-item-icon"
              />
            </div>

            <div className="min-w-0">
              <p className="font-pixel text-[10px] text-muted">{quest.code}</p>
              <h2 className="mt-1 text-[17px] font-bold leading-6 transition-colors group-hover:text-accent lg:text-[18px]">
                {quest.title}
              </h2>
            </div>
          </div>

          <PixelTag variant={getStatusVariant(quest.status)}>{quest.status}</PixelTag>
        </div>

        <p className="mt-3 line-clamp-2 text-[14px] leading-6 text-muted lg:line-clamp-3">
          {quest.subtitle}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {quest.categories.slice(0, 3).map((category) => (
            <PixelTag key={category}>{category}</PixelTag>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-divider pt-3">
          <span className="text-[12px] text-muted">{quest.role}</span>
          <span className="font-pixel text-[11px] transition-transform duration-100 group-hover:translate-x-1 group-hover:text-accent">
            OPEN →
          </span>
        </div>
      </article>
    </Link>
  );
}
