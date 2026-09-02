import type { Quest } from "@/types/quest";
import { PixelPanel } from "@/components/ui/pixel-panel";
import { PixelTag } from "@/components/ui/pixel-tag";

export function QuestMeta({ quest }: { quest: Quest }) {
  return (
    <PixelPanel eyebrow="QUEST" title="META">
      <dl className="grid gap-3 sm:grid-cols-3">
        <Meta label="ROLE" value={quest.role} />
        <Meta label="TIME" value={quest.period} />
        <Meta label="STATUS" value={quest.status} />
      </dl>

      <div className="mt-4 border-t border-divider pt-4">
        <p className="mb-2 font-pixel text-[10px] text-muted">TOOLS</p>
        <div className="flex flex-wrap gap-2">
          {quest.tools.map((tool) => (
            <PixelTag key={tool}>{tool}</PixelTag>
          ))}
        </div>
      </div>
    </PixelPanel>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-divider pb-3 last:border-0 last:pb-0 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-3 sm:last:border-r-0 sm:last:pr-0">
      <dt className="font-pixel text-[10px] text-muted">{label}</dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  );
}
