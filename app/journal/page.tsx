import type { Metadata } from "next";

import { JournalExplorer } from "@/components/journal/journal-explorer";
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
    <main className="site-container pb-12 pt-6 lg:pb-16 lg:pt-10">
      <header className="border-b border-divider pb-8 lg:pb-10">
        <p className="font-pixel text-[11px] tracking-[0.08em] text-accent">06 / JOURNAL</p>
        <div className="mt-3 grid gap-6 lg:grid-cols-[0.86fr_1.14fr] lg:items-end lg:gap-12">
          <div>
            <h1 className="text-[42px] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-[52px] lg:text-[64px]">
              FIELD NOTES
            </h1>
            <p className="mt-3 font-pixel text-[10px] tracking-[0.08em] text-muted">
              TECH · PHOTO · SIDE PROJECTS
            </p>
          </div>
          <div>
            <p className="max-w-[700px] text-[15px] leading-7 text-muted lg:text-[16px] lg:leading-8">
              这里记录我怎样看科技热点、怎样拍下一些瞬间，也记录 AI 工具和个人项目背后的取舍。每一篇都从一个具体问题开始。
            </p>
            <div className="mt-5 grid grid-cols-3 border-y border-divider">
              <JournalStat label="TECH" value={categoryCounts["TECH NOTES"]} />
              <JournalStat label="PHOTO" value={categoryCounts["PHOTO NOTES"]} bordered />
              <JournalStat label="SIDE PROJECT" value={categoryCounts["SIDE PROJECT LOG"]} bordered />
            </div>
          </div>
        </div>
      </header>

      <section className="py-9 lg:py-14" aria-label="写作与观察列表">
        <JournalExplorer />
      </section>

      <section className="grid gap-6 border-t border-divider py-8 lg:grid-cols-[1fr_auto] lg:items-center lg:py-10">
        <div>
          <p className="font-pixel text-[9px] tracking-[0.08em] text-accent">DIGITAL GARDEN</p>
          <h2 className="mt-2 text-[25px] font-semibold tracking-[-0.025em]">持续记录正在形成的判断。</h2>
          <p className="mt-3 max-w-[720px] text-[13px] leading-6 text-muted">
            写作、照片和小项目会继续长在这里。它们也会和项目页互相连接，让过程、方法和结果能够被一起看到。
          </p>
        </div>
        <span className="font-pixel text-[10px] text-muted">{String(journalSeed.length).padStart(2, "0")} NOTES · GROWING...</span>
      </section>
    </main>
  );
}

function JournalStat({ label, value, bordered = false }: { label: string; value: number; bordered?: boolean }) {
  return (
    <div className={bordered ? "border-l border-divider px-3 py-3" : "px-3 py-3"}>
      <p className="font-pixel text-[8px] text-muted">{label}</p>
      <p className="mt-1 font-pixel text-[14px] text-foreground">{String(value).padStart(2, "0")}</p>
    </div>
  );
}
