import type { QuestMetric } from "@/types/quest";

export function QuestOutcomes({
  outcomes,
  metrics = [],
  index,
}: {
  outcomes: string[];
  metrics?: QuestMetric[];
  index: number;
}) {
  if (!outcomes.length && !metrics.length) return null;

  const metricGrid =
    metrics.length >= 4
      ? "sm:grid-cols-2 xl:grid-cols-4"
      : metrics.length === 3
        ? "sm:grid-cols-3"
        : "sm:grid-cols-2";

  return (
    <section id="outcomes" className="scroll-mt-24 grid gap-3 border-t border-divider py-6 lg:grid-cols-[150px_1fr] lg:gap-6">
      <div>
        <p className="font-pixel text-[11px] text-accent">
          {String(index).padStart(2, "0")} · OUTCOMES
        </p>
        <h2 className="mt-1 text-[16px] font-bold leading-6">结果与沉淀</h2>
      </div>

      <div>
        {metrics.length > 0 && (
          <div className={`grid gap-3 ${metricGrid}`}>
            {metrics.map((metric) => (
              <div
                key={`${metric.value}-${metric.label}`}
                className="border border-divider bg-soft p-4"
              >
                <strong className="block text-[22px] font-black leading-7 text-accent">
                  {metric.value}
                </strong>
                <p className="mt-1 text-[12px] font-medium leading-5">{metric.label}</p>
                {metric.description && (
                  <p className="mt-2 text-[13px] leading-6 text-muted">
                    {metric.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        <ul className={metrics.length > 0 ? "mt-4 space-y-2" : "space-y-2"}>
          {outcomes.map((outcome) => (
            <li key={outcome} className="flex gap-3 text-[15px] leading-[26px]">
              <span className="mt-[10px] h-1.5 w-1.5 shrink-0 bg-accent" />
              <span>{outcome}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
