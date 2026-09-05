import type { Quest } from "@/types/quest";

export function QuestContext({ quest, index }: { quest: Quest; index: number }) {
  return (
    <section id="context" className="scroll-mt-24 border-t border-divider py-6">
      <div className="grid gap-4 lg:grid-cols-[150px_1fr] lg:gap-6">
        <div>
          <p className="font-pixel text-[11px] text-accent">
            {String(index).padStart(2, "0")} · CONTEXT
          </p>
          <h2 className="mt-1 text-[16px] font-bold leading-6">项目背景</h2>
        </div>

        <div>
          <p className="max-w-3xl text-[15px] leading-[26px] text-muted">{quest.summary}</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="border border-divider bg-soft p-4">
              <p className="font-pixel text-[9px] text-accent">GOAL</p>
              <p className="mt-2 text-[13px] leading-6 text-muted">{quest.objective}</p>
            </div>
            <div className="border border-divider bg-soft p-4">
              <p className="font-pixel text-[9px] text-accent">CHALLENGE</p>
              <p className="mt-2 text-[13px] leading-6 text-muted">{quest.challenge}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
