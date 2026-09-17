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
  "global-content": "ui.star",
};

export function QuestLogPreview() {
  return (
    <PixelPanel
      eyebrow="CURRENT"
      title="QUEST LOG"
      rightSlot={<span className="font-pixel text-[11px] text-muted">04</span>}
      interactive
      className="h-full"
    >
      <Link
        href="/quests/red-leaf"
        className="group mb-3 grid grid-cols-[36px_1fr_auto] items-center gap-3 border-2 border-border bg-foreground px-2.5 py-3 text-white transition-[transform,border-color] duration-100 hover:-translate-y-px hover:border-accent"
      >
        <PixelIcon
          assetId="ui.sparkle"
          decorative
          width={32}
          height={32}
          className="brightness-0 invert transition-transform duration-100 group-hover:-translate-y-px"
        />
        <div className="min-w-0">
          <p className="font-pixel text-[9px] leading-4 text-accent">MAIN QUEST · 0→1 AI PRODUCT</p>
          <p className="truncate text-[14px] font-semibold leading-5">赤页 RED LEAF</p>
        </div>
        <span className="font-pixel text-[12px] text-accent" aria-hidden="true">→</span>
      </Link>

      <div className="divide-y divide-divider">
        {homeQuests.map((quest) => (
          <Link
            key={quest.slug}
            href={`/quests/${quest.slug}`}
            className="rpg-row-link group grid grid-cols-[36px_1fr_auto] items-center gap-3 py-2.5 first:pt-0 last:pb-0"
          >
            <PixelIcon
              assetId={questIconBySlug[quest.slug] ?? "items.notebook"}
              decorative
              width={30}
              height={30}
              className="transition-transform duration-100 group-hover:-translate-y-px"
            />

            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold leading-5">{quest.title}</p>
              <p className="truncate font-pixel text-[9px] leading-4 text-muted">{quest.code}</p>
            </div>

            <PixelTag variant={getStatusVariant(quest.status)}>
              {quest.status}
            </PixelTag>
          </Link>
        ))}
      </div>

      <div className="mt-4">
        <PixelButton href="/quests" variant="secondary" size="sm" className="w-full">
          全部任务 →
        </PixelButton>
      </div>
    </PixelPanel>
  );
}
