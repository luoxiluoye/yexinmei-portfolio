import { Link } from "next-view-transitions";
import { RealImage } from "@/components/media/real-image";
import { PixelIcon } from "@/components/ui/pixel-icon";
import { photographyCover } from "@/lib/real-assets";
import type { AssetId } from "@/lib/assets";
import type { Quest } from "@/types/quest";

const iconBySlug: Record<string, AssetId> = {
  "zhihu-auto-consumer-tech": "ui.speechBubble",
  "global-content": "ui.star",
  "tech-you-houhua": "items.notebook",
  "ccd-business": "items.camera",
  "visual-storytelling": "items.camera",
  "inspiration-studio": "ui.sparkle",
};

const statusLabels: Record<Quest["status"], string> = {
  ACTIVE: "进行中",
  COMPLETED: "已完成",
  ONGOING: "持续实践",
};

export function QuestCard({ quest }: { quest: Quest }) {
  const titleId = `project-title-${quest.slug}`;
  const metric = quest.outcomeMetrics?.[0];
  const isPhotography = quest.slug === "visual-storytelling";

  return (
    <article className="qb-tile" aria-labelledby={titleId}>
      <Link href={`/quests/${quest.slug}`} className="qb-tile-link" aria-labelledby={titleId} style={{ viewTransitionName: `project-${quest.slug}` }}>
        <div className="qb-tile-topline">
          <span className="qb-tile-code font-pixel">{quest.code}</span>
          <span className={`qb-status qb-status-${quest.status.toLowerCase()}`}><span aria-hidden="true" />{statusLabels[quest.status]}</span>
        </div>
        <div className="qb-tile-heading">
          <PixelIcon assetId={iconBySlug[quest.slug] ?? "items.notebook"} decorative width={25} height={25} />
          <h3 id={titleId}>{quest.title}</h3>
        </div>
        <div className={`qb-tile-body${isPhotography ? " qb-tile-body-photo" : ""}`}>
          <p>{quest.subtitle}</p>
          {isPhotography && <div className="qb-tile-photo"><RealImage asset={photographyCover} sizes="104px" /></div>}
        </div>
        <div className="qb-tile-footer">
          <div className="qb-tile-evidence">
            {metric ? <p><strong className="font-pixel">{metric.value}</strong><span>{metric.label}</span></p> : <p className="qb-tile-period">{quest.period === "NOW" || quest.period === "ONGOING" ? "持续更新中" : quest.period.replace("NOW", "至今")}</p>}
            <div className="qb-tile-categories">{quest.categories.slice(0, 2).map(category => <span key={category}>{category}</span>)}</div>
          </div>
          <span className="qb-tile-action" aria-hidden="true">查看项目 <span>↗</span></span>
        </div>
      </Link>
    </article>
  );
}
