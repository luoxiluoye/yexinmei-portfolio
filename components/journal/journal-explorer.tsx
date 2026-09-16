"use client";

import { Link } from "next-view-transitions";

import { journalSeed } from "@/data/journal";
import { PixelIcon } from "@/components/ui/pixel-icon";

export function JournalExplorer() {
  return (
    <>
      <div className="mb-5 flex items-center justify-between border-y border-divider py-3 font-pixel text-[9px] tracking-[0.06em] text-muted">
        <span>FIELD NOTES · SELECTED ENTRIES</span>
        <span>{journalSeed.length} ENTRIES</span>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.925fr_0.925fr]">
        {journalSeed.map((entry, index) => (
          <Link
            key={entry.slug}
            href={`/journal/${entry.slug}`}
            className="group min-w-0"
            aria-label={`阅读：${entry.title}`}
          >
            <article className="h-full border border-divider bg-paper transition-[transform,border-color,box-shadow] duration-300 ease-out group-hover:-translate-y-1 group-hover:border-foreground group-hover:shadow-[5px_5px_0_rgba(17,17,17,.08)]">
              <JournalCover category={entry.category} index={index} />

              <div className="p-4 lg:p-5">
                <div className="flex items-center justify-between gap-3 font-pixel text-[8px] tracking-[0.04em]">
                  <span className="text-accent">{entry.category}</span>
                  <span className="text-muted">{entry.readTime}</span>
                </div>

                <h2 className="mt-3 text-[19px] font-semibold leading-7 tracking-[-0.02em] transition-colors group-hover:text-accent lg:text-[21px]">
                  {entry.title}
                </h2>
                <p className="mt-3 line-clamp-3 text-[13px] leading-6 text-muted">{entry.summary}</p>

                <div className="mt-5 flex items-center justify-between border-t border-divider pt-3 font-pixel text-[8px]">
                  <span className="text-muted">{entry.date}</span>
                  <span className="transition-[transform,color] duration-200 group-hover:translate-x-1 group-hover:text-accent">
                    OPEN NOTE →
                  </span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </>
  );
}

function JournalCover({
  category,
  index,
}: {
  category: (typeof journalSeed)[number]["category"];
  index: number;
}) {
  if (category === "TECH NOTES") {
    return (
      <div className="relative h-[250px] overflow-hidden bg-[#20211e] p-5 text-[#f7f2e7] lg:h-[290px]">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.11)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.11)_1px,transparent_1px)] [background-size:28px_28px]" />
        <div className="relative flex h-full flex-col justify-between">
          <div className="flex items-start justify-between gap-4">
            <span className="font-pixel text-[9px] tracking-[0.08em] text-[#d96854]">TECH SIGNAL / 01</span>
            <span className="h-2 w-2 animate-pulse bg-[#d96854]" />
          </div>

          <div>
            <p className="font-pixel text-[10px] text-white/40">SEARCHING BEYOND THE HEADLINE...</p>
            <p className="mt-3 max-w-[16ch] text-[31px] font-semibold leading-[1.08] tracking-[-0.04em] lg:text-[38px]">
              NEWS → SIGNAL → CONTEXT
            </p>
            <div className="mt-5 grid gap-2 font-pixel text-[8px] text-white/55">
              <span>&gt; COMPANY MOVE</span>
              <span>&gt; INDUSTRY CONTEXT</span>
              <span>&gt; USER IMPACT<span className="ml-1 inline-block animate-pulse text-[#d96854]">_</span></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (category === "PHOTO NOTES") {
    return (
      <div className="relative h-[250px] overflow-hidden bg-[#e9e3d6] p-5 lg:h-[290px]">
        <span className="absolute right-5 top-4 font-pixel text-[9px] text-muted">FRAME / 02</span>
        <div className="absolute inset-x-5 top-12 grid grid-cols-2 gap-2 rotate-[-2deg] border border-[#777064] bg-[#f9f6ee] p-2 shadow-[7px_7px_0_rgba(79,72,60,.13)] transition-transform duration-500 group-hover:rotate-0">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="relative aspect-[4/3] overflow-hidden border border-[#bdb4a4] bg-[#d5ccbc]">
              <span className="absolute bottom-2 left-2 h-[38%] w-[38%] bg-[#8c8377]/35" />
              <span className="absolute right-2 top-2 h-[52%] w-[28%] bg-[#6c665d]/25" />
              {item === 2 ? <span className="absolute inset-x-3 top-1/2 h-px bg-[#9e4437]" /> : null}
            </div>
          ))}
        </div>
        <div className="absolute bottom-5 left-5 flex items-end gap-3">
          <PixelIcon assetId="items.camera" decorative width={46} height={46} className="h-auto w-10" />
          <div>
            <p className="font-pixel text-[8px] text-accent">KEEP THE MOMENT</p>
            <p className="mt-1 text-[13px] font-semibold">情绪 · 关系 · 信息</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[250px] overflow-hidden bg-[#ece9df] p-5 lg:h-[290px]">
      <div className="absolute inset-0 opacity-45 [background-image:radial-gradient(#7e7568_1px,transparent_1px)] [background-size:20px_20px]" />
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-start justify-between gap-4">
          <span className="font-pixel text-[9px] tracking-[0.08em] text-accent">WORKFLOW LAB / 03</span>
          <PixelIcon assetId="ui.sparkle" decorative width={26} height={26} />
        </div>

        <div className="relative mx-auto h-[135px] w-[90%] max-w-[300px]">
          <FlowNode className="left-0 top-12" label="IDEA" />
          <FlowNode className="left-[37%] top-0" label="SORT" accent />
          <FlowNode className="right-0 top-12" label="MAKE" />
          <FlowNode className="left-[37%] bottom-0" label="REVIEW" />
          <span className="absolute left-[22%] top-[43%] h-px w-[30%] rotate-[-25deg] bg-[#837a6d]" />
          <span className="absolute right-[20%] top-[43%] h-px w-[30%] rotate-[25deg] bg-[#837a6d]" />
          <span className="absolute bottom-[29%] left-[22%] h-px w-[30%] rotate-[25deg] bg-[#837a6d]" />
          <span className="absolute bottom-[29%] right-[20%] h-px w-[30%] rotate-[-25deg] bg-[#837a6d]" />
        </div>

        <p className="font-pixel text-[8px] text-muted">SAVE TIME FOR JUDGMENT · STRUCTURE · EXPRESSION</p>
      </div>
    </div>
  );
}

function FlowNode({ className, label, accent = false }: { className: string; label: string; accent?: boolean }) {
  return (
    <span
      className={[
        "absolute z-10 grid h-12 min-w-14 place-items-center border px-2 font-pixel text-[8px] shadow-[3px_3px_0_rgba(17,17,17,.08)]",
        className,
        accent ? "border-accent bg-accent text-white" : "border-border bg-paper text-foreground",
      ].join(" ")}
    >
      {label}
    </span>
  );
}
