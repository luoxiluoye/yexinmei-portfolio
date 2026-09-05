import type { Quest } from "@/types/quest";
import { PixelPanel } from "@/components/ui/pixel-panel";
import { PixelTag } from "@/components/ui/pixel-tag";

export function QuestMeta({ quest }: { quest: Quest }) {
  return (
    <div id="quick-look" className="scroll-mt-24">
      <PixelPanel eyebrow="01" title="QUICK LOOK">
        <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Meta label="ROLE" value={quest.role} />
          <Meta label="TIME" value={quest.period} />
          <Meta label="PLATFORM" value={quest.platform} />
          <Meta label="CATEGORY" value={quest.categories.slice(0, 2).join(" / ")} />
        </dl>

        <div className="mt-4 border-t border-divider pt-4">
          <p className="mb-2 font-pixel text-[10px] text-muted">TOOLS / SKILLS</p>
          <div className="flex flex-wrap gap-2">
            {quest.tools.map((tool) => (
              <PixelTag key={tool}>{tool}</PixelTag>
            ))}
          </div>
        </div>
      </PixelPanel>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-divider pb-3 last:border-0 last:pb-0 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-3 sm:last:border-r-0 sm:last:pr-0">
      <dt className="font-pixel text-[9px] text-muted">{label}</dt>
      <dd className="mt-1 text-[13px] font-medium leading-5">{value}</dd>
    </div>
  );
}
