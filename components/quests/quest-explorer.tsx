"use client";

import { useMemo, useState } from "react";

import type { Quest } from "@/types/quest";
import { questCategories } from "@/data/quests";
import { QuestCard } from "@/components/ui/quest-card";

export function QuestExplorer({ quests }: { quests: Quest[] }) {
  const [activeCategory, setActiveCategory] = useState("ALL");

  const filteredQuests = useMemo(() => {
    if (activeCategory === "ALL") return quests;
    return quests.filter((quest) => quest.categories.includes(activeCategory));
  }, [activeCategory, quests]);

  return (
    <>
      <div className="mb-4 border-y border-divider py-3">
        <div className="no-scrollbar -mx-4 overflow-x-auto px-4 lg:mx-0 lg:overflow-visible lg:px-0">
          <div className="flex min-w-max gap-2 lg:flex-wrap">
            {questCategories.map((category) => {
              const active = activeCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setActiveCategory(category)}
                  className={[
                    "min-h-11 border-2 px-3 font-pixel text-[12px] transition-[transform,background-color,color,border-color]",
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

      <div className="mb-4 flex items-center justify-between font-pixel text-[11px] text-muted">
        <span>AREA: {activeCategory}</span>
        <span>{filteredQuests.length} FOUND</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredQuests.map((quest, index) => (
          <QuestCard key={quest.slug} quest={quest} index={index} />
        ))}
      </div>

      {filteredQuests.length === 0 && (
        <div className="border-2 border-border bg-paper p-10 text-center">
          <p className="font-pixel text-[14px]">NO QUEST FOUND</p>
        </div>
      )}
    </>
  );
}
