import type { Quest } from "@/types/quest";
import type { AssetId } from "@/lib/assets";
import { PixelIcon } from "@/components/ui/pixel-icon";
import { PixelTag } from "@/components/ui/pixel-tag";

function getStatusVariant(status: Quest["status"]) {
  if (status === "ACTIVE") return "active" as const;
  if (status === "COMPLETED") return "completed" as const;
  return "ongoing" as const;
}

const questIconBySlug: Record<string, AssetId> = {
  "zhihu-auto-consumer-tech": "ui.speechBubble",
  "global-content": "items.mail",
  "tech-you-houhua": "items.laptop",
  "ccd-business": "items.key",
  "visual-storytelling": "items.camera",
  "inspiration-studio": "ui.sparkle",
};

export function QuestHero({ quest }: { quest: Quest }) {
  return (
    <header className="relative">
      <div className="flex flex-wrap items-center gap-2">
        <PixelTag variant={getStatusVariant(quest.status)}>{quest.status}</PixelTag>
        {quest.categories.map((category) => (
          <PixelTag key={category}>{category}</PixelTag>
        ))}
      </div>

      <p className="mt-5 font-pixel text-[12px] text-muted">
        {quest.code} · {quest.period}
      </p>

      <div className="mt-2 flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="rpg-page-title max-w-4xl">{quest.title}</h1>
          <p className="mt-4 max-w-3xl text-[17px] font-medium leading-7">
            {quest.subtitle}
          </p>
        </div>

        <div className="hidden h-[72px] w-[72px] shrink-0 items-center justify-center border-2 border-border bg-soft lg:flex">
          <PixelIcon
            assetId={questIconBySlug[quest.slug] ?? "items.notebook"}
            decorative
            width={52}
            height={52}
          />
        </div>
      </div>
    </header>
  );
}
