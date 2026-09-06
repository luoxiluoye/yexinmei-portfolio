import type { Metadata } from "next";

import { CharacterScene } from "@/components/scenes/character-scene";
import { JournalExplorer } from "@/components/journal/journal-explorer";
import { PixelIcon } from "@/components/ui/pixel-icon";
import { PixelPanel } from "@/components/ui/pixel-panel";
import { journalSeed } from "@/data/journal";

export const metadata: Metadata = {
  title: "写作与观察",
  description: "罗叶馨梅的写作、摄影、内容观察与 AI 工作流记录。",
};

const categoryCounts = journalSeed.reduce(
  (counts, entry) => {
    counts[entry.category] += 1;
    return counts;
  },
  {
    "TECH NOTES": 0,
    "PHOTO NOTES": 0,
    "SIDE PROJECT LOG": 0,
  } as Record<(typeof journalSeed)[number]["category"], number>
);

export default function JournalPage() {
  return (
    <main className="site-container py-5 lg:py-8">
      <header className="grid gap-4 lg:grid-cols-[1fr_300px] lg:items-center">
        <div className="min-w-0">
          <p className="font-pixel text-[12px] text-muted">06. JOURNAL</p>
          <h1 className="rpg-page-title mt-2">JOURNAL</h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-[26px] text-muted">
            一些写作、照片、内容观察，以及正在尝试的小东西。
          </p>
        </div>
        <CharacterScene variant="journal" />
      </header>

      <section className="mt-5 grid gap-4 pb-8 lg:mt-8 lg:grid-cols-[75fr_25fr] lg:gap-5 lg:pb-0">
        <div className="min-w-0">
          <JournalExplorer />
        </div>

        <aside className="hidden lg:block">
          <PixelPanel eyebrow="DIGITAL" title="GARDEN SUMMARY" contentClassName="p-4">
            <div className="grid grid-cols-2 gap-2">
              <GardenStat label="FIELD NOTES" value={journalSeed.length} accent />
              <GardenStat label="TECH" value={categoryCounts["TECH NOTES"]} />
              <GardenStat label="PHOTO" value={categoryCounts["PHOTO NOTES"]} />
              <GardenStat label="SIDE PROJECT" value={categoryCounts["SIDE PROJECT LOG"]} />
            </div>

            <div className="mt-4 flex items-end justify-between gap-3 border-t border-divider pt-4">
              <div>
                <p className="font-pixel text-[9px] text-muted">GARDEN STATUS</p>
                <p className="mt-1 font-pixel text-[11px] text-accent">GROWING...</p>
                <p className="mt-2 text-[12px] leading-5 text-muted">
                  写作、照片和还在发芽的小项目，会继续慢慢长在这里。
                </p>
              </div>
              <PixelIcon assetId="cat.sit" decorative width={58} height={58} className="shrink-0" />
            </div>
          </PixelPanel>
        </aside>
      </section>
    </main>
  );
}

function GardenStat({ label, value, accent = false }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="border border-divider bg-soft p-3">
      <p className="font-pixel text-[8px] leading-4 text-muted">{label}</p>
      <p className={accent ? "mt-2 font-pixel text-[18px] text-accent" : "mt-2 font-pixel text-[18px]"}>
        {String(value).padStart(2, "0")}
      </p>
    </div>
  );
}
