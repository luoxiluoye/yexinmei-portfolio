"use client";

import { useMemo, useState } from "react";
import { QuestCard } from "@/components/ui/quest-card";
import type { Quest } from "@/types/quest";

const questFilters = [
  { id: "ALL", label: "全部" },
  { id: "CONTENT", label: "内容运营" },
  { id: "COMMUNITY", label: "社区运营" },
  { id: "GROWTH", label: "增长实践" },
  { id: "CREATIVE", label: "创作与影像" },
] as const;
type QuestFilter = (typeof questFilters)[number]["id"];

const filterSlugs: Record<Exclude<QuestFilter, "ALL">, string[]> = {
  CONTENT: ["zhihu-auto-consumer-tech", "global-content", "tech-you-houhua", "inspiration-studio"],
  COMMUNITY: ["zhihu-auto-consumer-tech"],
  GROWTH: ["zhihu-auto-consumer-tech", "ccd-business"],
  CREATIVE: ["tech-you-houhua", "visual-storytelling", "inspiration-studio"],
};

export function QuestExplorer({ quests }: { quests: Quest[] }) {
  const [activeCategory, setActiveCategory] = useState<QuestFilter>("ALL");
  const filterCounts = useMemo(() => Object.fromEntries(questFilters.map(({ id }) => [id, id === "ALL" ? quests.length : quests.filter(quest => filterSlugs[id].includes(quest.slug)).length])), [quests]);
  const filteredQuests = useMemo(() => activeCategory === "ALL" ? quests : quests.filter(quest => filterSlugs[activeCategory].includes(quest.slug)), [activeCategory, quests]);
  const activeLabel = questFilters.find(filter => filter.id === activeCategory)?.label;

  return <>
    <div className="qb-filter-list" role="group" aria-label="按项目方向筛选">
      {questFilters.map(({ id, label }) => <button key={id} type="button" aria-pressed={activeCategory === id} aria-controls="quest-results" onClick={() => setActiveCategory(id)} className={`qb-filter${activeCategory === id ? " is-active" : ""}`}>
        {label}<span aria-hidden="true">{filterCounts[id]}</span>
      </button>)}
    </div>
    <p className="qb-results-summary" role="status" aria-live="polite" aria-atomic="true">{activeCategory === "ALL" ? "全部项目" : activeLabel}<span aria-hidden="true"> / </span>{filteredQuests.length} 项</p>
    <div id="quest-results" className="qb-project-grid">
      {filteredQuests.map(quest => <QuestCard key={quest.slug} quest={quest} />)}
    </div>
  </>;
}
