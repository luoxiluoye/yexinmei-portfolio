"use client";

import Link from "next/link";

import type { AssetId } from "@/lib/assets";
import { journalSeed } from "@/data/journal";
import { PixelIcon } from "@/components/ui/pixel-icon";

const iconByCategory: Record<(typeof journalSeed)[number]["category"], AssetId> = {
  "TECH NOTES": "items.notebook",
  "PHOTO NOTES": "items.camera",
  "SIDE PROJECT LOG": "ui.sparkle",
};

export function JournalExplorer() {
  return (
    <>
      <div className="mb-4 flex items-center justify-between border-y border-divider py-3 font-pixel text-[10px] text-muted">
        <span>FIELD NOTES · SELECTED ENTRIES</span>
        <span>{journalSeed.length} ENTRIES</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {journalSeed.map((entry) => (
          <Link
            key={entry.slug}
            href={`/journal/${entry.slug}`}
            className="rpg-note-card rpg-note-interactive group grid grid-cols-[80px_1fr] gap-4 border-2 border-border bg-paper p-3 sm:block sm:min-h-[268px] sm:p-4"
          >
            <div className="flex h-[80px] items-center justify-center border border-divider bg-soft sm:h-[100px]">
              <PixelIcon
                assetId={iconByCategory[entry.category]}
                decorative
                width={48}
                height={48}
                className="rpg-note-icon"
              />
            </div>

            <div className="min-w-0 sm:mt-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-pixel text-[9px] text-accent">{entry.category}</p>
                <p className="font-pixel text-[8px] text-muted">{entry.readTime}</p>
              </div>
              <h2 className="mt-1 text-[16px] font-bold leading-6 transition-colors group-hover:text-accent">
                {entry.title}
              </h2>
              <p className="mt-2 line-clamp-3 text-[13px] leading-6 text-muted">{entry.summary}</p>
              <div className="mt-3 flex items-center justify-between border-t border-divider pt-3 font-pixel text-[9px]">
                <span className="text-muted">{entry.date}</span>
                <span className="text-foreground group-hover:text-accent">OPEN NOTE →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
