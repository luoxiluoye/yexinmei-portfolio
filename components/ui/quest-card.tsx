import { Link } from "next-view-transitions";

import type { Quest } from "@/types/quest";
import type { AssetId } from "@/lib/assets";
import { PixelIcon } from "@/components/ui/pixel-icon";
import { PixelTag } from "@/components/ui/pixel-tag";

const iconBySlug: Record<string, AssetId> = {
  "zhihu-auto-consumer-tech": "ui.speechBubble",
  "global-content": "ui.star",
  "tech-you-houhua": "items.notebook",
  "ccd-business": "items.camera",
  "visual-storytelling": "items.camera",
  "inspiration-studio": "ui.sparkle",
};

function statusVariant(status: Quest["status"]) {
  if (status === "ACTIVE") return "active" as const;
  if (status === "COMPLETED") return "completed" as const;
  return "ongoing" as const;
}

export function QuestCard({ quest }: { quest: Quest }) {
  const titleId = `project-title-${quest.slug}`;
  const metric = quest.outcomeMetrics?.[0];

  return (
    <article className="min-w-0" aria-labelledby={titleId}>
      <Link
        href={`/quests/${quest.slug}`}
        className="group flex h-full min-h-[188px] flex-col border-2 border-border bg-paper p-4 transition-[transform,border-color,box-shadow] duration-100 hover:-translate-y-1 hover:border-accent hover:shadow-[5px_5px_0_rgba(17,17,17,.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        aria-labelledby={titleId}
        style={{ viewTransitionName: `project-${quest.slug}` }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-divider bg-soft transition-transform duration-100 group-hover:-translate-y-px">
              <PixelIcon assetId={iconBySlug[quest.slug] ?? "items.notebook"} decorative width={30} height={30} />
            </span>
            <div className="min-w-0">
              <p className="font-pixel text-[9px] text-muted">{quest.code}</p>
              <h2 id={titleId} className="mt-1 line-clamp-2 text-[15px] font-bold leading-5">{quest.title}</h2>
            </div>
          </div>
          <PixelTag variant={statusVariant(quest.status)}>{quest.status}</PixelTag>
        </div>

        <p className="mt-3 line-clamp-2 text-[12px] leading-5 text-muted">{quest.subtitle}</p>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-divider pt-3">
          <div className="min-w-0">
            {metric ? (
              <div className="flex items-baseline gap-2">
                <strong className="font-pixel text-[15px] text-accent">{metric.value}</strong>
                <span className="truncate text-[10px] text-muted">{metric.label}</span>
              </div>
            ) : (
              <span className="font-pixel text-[9px] text-muted">{quest.period}</span>
            )}
            <div className="mt-1.5 flex max-w-[220px] gap-1.5 overflow-hidden">
              {quest.categories.slice(0, 2).map((category) => (
                <span key={category} className="shrink-0 border border-divider bg-soft px-1.5 py-0.5 text-[9px] text-muted">
                  {category}
                </span>
              ))}
            </div>
          </div>

          <span className="shrink-0 font-pixel text-[10px] text-foreground transition-[transform,color] group-hover:translate-x-1 group-hover:text-accent" aria-hidden="true">
            ENTER →
          </span>
        </div>
      </Link>
    </article>
  );
}
