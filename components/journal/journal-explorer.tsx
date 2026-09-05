"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { AssetId } from "@/lib/assets";
import { journalCategories, journalSeed } from "@/data/journal";
import { PixelIcon } from "@/components/ui/pixel-icon";

const iconByCategory: Record<(typeof journalCategories)[number], AssetId> = {
  WRITING: "items.notebook",
  PHOTOS: "items.camera",
  NOTES: "ui.speechBubble",
  EXPERIMENTS: "ui.sparkle",
};

type JournalCategory = "ALL" | (typeof journalCategories)[number];

export function JournalExplorer() {
  const [activeCategory, setActiveCategory] = useState<JournalCategory>("ALL");

  const entries = useMemo(() => {
    if (activeCategory === "ALL") return journalSeed;
    return journalSeed.filter((entry) => entry.category === activeCategory);
  }, [activeCategory]);

  return (
    <>
      <div className="mb-4 border-y border-divider py-3">
        <div className="no-scrollbar -mx-4 overflow-x-auto px-4 lg:mx-0 lg:overflow-visible lg:px-0">
          <div className="flex min-w-max gap-2 lg:flex-wrap">
            {(["ALL", ...journalCategories] as JournalCategory[]).map((category) => {
              const active = category === activeCategory;
              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setActiveCategory(category)}
                  className={[
                    "min-h-11 border-2 px-3 font-pixel text-[11px] transition-[background-color,border-color,color]",
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

      <div className="mb-4 flex items-center justify-between font-pixel text-[10px] text-muted">
        <span>FILTER: {activeCategory}</span>
        <span>{entries.length} ENTRIES</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry) => {
          const content = (
            <>
              <div className="flex h-[80px] items-center justify-center border border-divider bg-soft sm:h-[100px]">
                <PixelIcon
                  assetId={iconByCategory[entry.category]}
                  decorative
                  width={48}
                  height={48}
                  className={entry.href ? "rpg-note-icon" : undefined}
                />
              </div>

              <div className="min-w-0 sm:mt-4">
                <p className="font-pixel text-[10px] text-accent">{entry.category}</p>
                <h2 className="mt-1 text-[16px] font-bold leading-6 transition-colors group-hover:text-accent">
                  {entry.title}
                </h2>
                <p className="mt-2 text-[13px] leading-6 text-muted">{entry.summary}</p>
                <div className="mt-3 flex items-center justify-between gap-3 border-t border-divider pt-3 font-pixel text-[10px]">
                  <span className="text-muted">{entry.status}</span>
                  <span className={entry.href ? "text-foreground group-hover:text-accent" : "text-muted"}>
                    {entry.href ? "OPEN ENTRY →" : "LOCKED"}
                  </span>
                </div>
              </div>
            </>
          );

          const className = [
            "rpg-note-card group grid grid-cols-[80px_1fr] gap-4 border-2 border-border bg-paper p-3 sm:block sm:min-h-[236px] sm:p-4",
            entry.href ? "rpg-note-interactive" : "cursor-default",
          ].join(" ");

          return entry.href ? (
            <Link key={entry.title} href={entry.href} className={className}>
              {content}
            </Link>
          ) : (
            <article key={entry.title} className={className} aria-label={`${entry.title}，尚未开放`}>
              {content}
            </article>
          );
        })}
      </div>

      <div className="mt-4 text-[13px] text-muted">更多内容持续更新中…</div>
    </>
  );
}
