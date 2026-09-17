"use client";

import { useMemo, useState } from "react";

import type { Quest } from "@/types/quest";
import { QuestCard } from "@/components/ui/quest-card";

const questFilters = ["ALL", "CONTENT", "COMMUNITY", "GROWTH", "CREATIVE"] as const;
type QuestFilter = (typeof questFilters)[number];

const filterSlugs: Record<Exclude<QuestFilter, "ALL">, string[]> = {
  CONTENT: ["zhihu-auto-consumer-tech", "global-content", "tech-you-houhua", "inspiration-studio"],
  COMMUNITY: ["zhihu-auto-consumer-tech"],
  GROWTH: ["zhihu-auto-consumer-tech", "ccd-business"],
  CREATIVE: ["tech-you-houhua", "visual-storytelling", "inspiration-studio"],
};

export function QuestExplorer({ quests }: { quests: Quest[] }) {
  const [activeCategory, setActiveCategory] = useState<QuestFilter>("ALL");

  const filteredQuests = useMemo(() => {
    if (activeCategory === "ALL") return quests;
    const slugs = filterSlugs[activeCategory];
    return quests.filter((quest) => slugs.includes(quest.slug));
  }, [activeCategory, quests]);

  return (
    <>
      <div className="mb-3 border-y border-divider py-2.5">
        <div className="no-scrollbar -mx-4 overflow-x-auto px-4 lg:mx-0 lg:overflow-visible lg:px-0">
          <div className="flex min-w-max gap-1.5 lg:flex-wrap">
            {questFilters.map((category) => {
              const active = activeCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setActiveCategory(category)}
                  className={[
                    "min-h-9 border px-2.5 font-pixel text-[10px] transition-[background-color,color,border-color,transform] hover:-translate-y-px",
                    active
                      ? "border-border bg-foreground text-white"
                      : "border-divider bg-soft text-foreground hover:border-accent hover:text-accent",
                  ].join(" ")}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between font-pixel text-[10px] text-muted">
        <span>AREA: {activeCategory}</span>
        <span>{filteredQuests.length} FOUND</span>
      </div>

      <div key={activeCategory} className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {filteredQuests.map((quest) => (
          <QuestCard key={quest.slug} quest={quest} />
        ))}
      </div>
    </>
  );
}
