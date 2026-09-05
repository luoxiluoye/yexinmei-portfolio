import Link from "next/link";

import { experience } from "@/data/experience";
import { PixelPanel } from "@/components/ui/pixel-panel";

const questHrefByOrg: Record<string, string> = {
  知乎: "/quests/zhihu-auto-consumer-tech",
  "四川国际传播中心（四川日报集团）": "/quests/global-content",
};

const selectedExperience = experience.filter((item) => item.period !== "TODO");

export function ExperienceTimeline() {
  return (
    <PixelPanel
      eyebrow="CAREER LOG"
      title="SELECTED EXPERIENCE"
      rightSlot={
        <span className="font-pixel text-[9px] text-muted">
          {String(selectedExperience.length).padStart(2, "0")} RECORDS
        </span>
      }
    >
      <ol className="divide-y divide-divider">
        {selectedExperience.map((item, index) => {
          const href = questHrefByOrg[item.org];

          return (
            <li
              key={`${item.org}-${item.period}`}
              className="grid gap-3 py-4 first:pt-0 last:pb-0 lg:grid-cols-[138px_220px_minmax(0,1fr)] lg:gap-5"
            >
              <div className="flex items-start gap-3">
                <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center border border-border bg-foreground font-pixel text-[9px] text-white">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="pt-1 font-pixel text-[10px] leading-5 text-accent">
                  {item.period}
                </p>
              </div>

              <div className="min-w-0">
                <h3 className="text-[15px] font-bold leading-6">{item.org}</h3>
                <p className="mt-1 text-[13px] leading-5 text-muted">{item.role}</p>
              </div>

              <div className="min-w-0">
                <p className="text-[14px] leading-6 text-muted">{item.summary}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-divider bg-soft px-2 py-1 text-[11px] leading-none"
                    >
                      {tag}
                    </span>
                  ))}
                  {href && (
                    <Link
                      href={href}
                      className="ml-auto inline-flex min-h-8 items-center font-pixel text-[10px] text-accent hover:underline"
                    >
                      VIEW QUEST →
                    </Link>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </PixelPanel>
  );
}
