import Link from "next/link";

import { homeQuests } from "@/data/home";
import type { QuestStatus } from "@/types/quest";
import type { AssetId } from "@/lib/assets";
import { PixelButton } from "@/components/ui/pixel-button";
import { PixelIcon } from "@/components/ui/pixel-icon";
import { PixelPanel } from "@/components/ui/pixel-panel";
import { PixelTag } from "@/components/ui/pixel-tag";

function getStatusVariant(status: QuestStatus) {
  if (status === "ACTIVE") return "active" as const;
  if (status === "COMPLETED") return "completed" as const;
  return "ongoing" as const;
}

const questIconBySlug: Record<string, AssetId> = {
  "zhihu-auto-consumer-tech": "ui.speechBubble",
  "ccd-business": "items.key",
  "inspiration-studio": "ui.sparkle",
};

export function QuestLogPreview() {
  return (
    <PixelPanel
      eyebrow="CURRENT"
      title="QUEST LOG"
      rightSlot={<span className="font-pixel text-[11px] text-muted">03</span>}
      interactive
      className="h-full"
    >
      <div className="divide-y divide-divider">
        {homeQuests.map((quest) => (
          <Link
            key={quest.slug}
            href={`/quests/${quest.slug}`}
            className="rpg-row-link group grid grid-cols-[36px_1fr_auto] items-center gap-3 py-3 first:pt-0 last:pb-0"
          >
            <PixelIcon
              assetId={questIconBySlug[quest.slug] ?? "items.notebook"}
              decorative
              width={32}
              height={32}
              className="transition-transform duration-100 group-hover:-translate-y-px"
            />

            <div className="min-w-0">
              <p className="truncate text-[14px] font-semibold leading-5">{quest.title}</p>
              <p className="truncate font-pixel text-[10px] leading-5 text-muted">{quest.code}</p>
            </div>

            <PixelTag variant={getStatusVariant(quest.status)}>
              {quest.status}
            </PixelTag>
          </Link>
        ))}
      </div>

      <div className="mt-5">
        <PixelButton href="/quests" variant="secondary" className="w-full">
          查看全部项目 →
        </PixelButton>
      </div>
    </PixelPanel>
  );
}
