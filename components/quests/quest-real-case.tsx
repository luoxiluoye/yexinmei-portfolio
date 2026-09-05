import type { QuestRealCase } from "@/types/quest";

export function QuestRealCaseSection({
  realCase,
  index,
}: {
  realCase: QuestRealCase;
  index: number;
}) {
  return (
    <section id="case" className="scroll-mt-24 border-t border-divider py-6">
      <div className="grid gap-4 lg:grid-cols-[150px_1fr] lg:gap-6">
        <div>
          <p className="font-pixel text-[11px] text-accent">
            {String(index).padStart(2, "0")} · ONE REAL CASE
          </p>
          <h2 className="mt-1 text-[16px] font-bold leading-6">一个真实案例</h2>
        </div>

        <div className="border-2 border-border bg-soft p-4 lg:p-5">
          <p className="font-pixel text-[10px] text-accent">CASE FILE</p>
          <h3 className="mt-2 text-[17px] font-bold leading-6">{realCase.title}</h3>
          <p className="mt-3 text-[14px] leading-7 text-muted">{realCase.summary}</p>

          {realCase.steps && realCase.steps.length > 0 && (
            <ol className="mt-4 grid gap-2">
              {realCase.steps.map((step, stepIndex) => (
                <li key={step} className="grid grid-cols-[28px_1fr] gap-3 text-[13px] leading-6">
                  <span className="flex h-7 w-7 items-center justify-center border border-border bg-paper font-pixel text-[9px] text-accent">
                    {String(stepIndex + 1).padStart(2, "0")}
                  </span>
                  <span className="pt-0.5 text-muted">{step}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </section>
  );
}
