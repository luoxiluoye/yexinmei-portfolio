import type { Metadata } from "next";

import { JournalExplorer } from "@/components/journal/journal-explorer";
import { PixelIcon } from "@/components/ui/pixel-icon";
import { journalSeed } from "@/data/journal";

export const metadata: Metadata = {
  title: "写作与观察",
  description: "罗叶馨梅的写作、摄影、内容观察与个人项目记录。",
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
    <main className="site-container pb-12 pt-5 lg:pb-14 lg:pt-8">
      <header className="mb-5 flex flex-col justify-between gap-4 border-b-2 border-border pb-5 lg:flex-row lg:items-end">
        <div>
          <p className="font-pixel text-[10px] text-accent">06 / JOURNAL</p>
          <h1 className="mt-2 font-pixel-zh text-[38px] leading-none lg:text-[48px]">写作与观察</h1>
          <p className="mt-3 max-w-2xl text-[13px] leading-6 text-muted">
            项目页放结果，这里只留观察、照片和过程记录。每篇从一个具体问题开始。
          </p>
        </div>
        <div className="flex items-center gap-3 border border-divider bg-soft px-3 py-2">
          <PixelIcon assetId="items.notebook" decorative width={30} height={30} />
          <div>
            <span className="block font-pixel text-[12px]">{String(journalSeed.length).padStart(2, "0")} NOTES</span>
            <span className="text-[10px] text-muted">FIELD NOTES · GROWING</span>
          </div>
        </div>
      </header>

      <section className="mb-5 grid gap-px border border-divider bg-divider sm:grid-cols-3" aria-label="手记分类统计">
        <JournalStat label="TECH NOTES" value={categoryCounts["TECH NOTES"]} icon="ui.sparkle" />
        <JournalStat label="PHOTO NOTES" value={categoryCounts["PHOTO NOTES"]} icon="items.camera" />
        <JournalStat label="SIDE PROJECT LOG" value={categoryCounts["SIDE PROJECT LOG"]} icon="items.key" />
      </section>

      <section aria-label="写作与观察列表">
        <JournalExplorer />
      </section>
    </main>
  );
}

function JournalStat({ label, value, icon }: { label: string; value: number; icon: "ui.sparkle" | "items.camera" | "items.key" }) {
  return (
    <div className="flex items-center gap-3 bg-background px-3 py-3">
      <PixelIcon assetId={icon} decorative width={26} height={26} />
      <div>
        <p className="font-pixel text-[8px] text-muted">{label}</p>
        <p className="mt-0.5 font-pixel text-[14px] text-foreground">{String(value).padStart(2, "0")}</p>
      </div>
    </div>
  );
}
