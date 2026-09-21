import { skills } from "@/data/skills";

import { PixelButton } from "@/components/ui/pixel-button";
import { PixelIcon } from "@/components/ui/pixel-icon";
import { PixelPanel } from "@/components/ui/pixel-panel";
import type { AssetId } from "@/lib/assets";

const abilityIcons: AssetId[] = ["items.notebook", "ui.heart", "ui.sparkle", "items.camera"];

export function SkillsPreview() {
  return (
    <PixelPanel eyebrow="INVENTORY" title="能力与工具" accent className="h-full">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
        {skills.abilities.map((ability, index) => (
          <div key={ability.key} className="grid grid-cols-[32px_1fr] items-center gap-2.5 border-b border-divider pb-2.5 last:border-0 last:pb-0">
            <span className="flex h-8 w-8 items-center justify-center bg-soft">
              <PixelIcon assetId={abilityIcons[index]} decorative width={25} height={25} />
            </span>
            <div className="min-w-0">
              <span className="block text-[13px] font-medium">{ability.title}</span>
              <span className="mt-0.5 block text-[12px] text-muted">{ability.subtitle}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <PixelButton href="/inventory" variant="secondary" size="sm" className="w-full">
          打开背包 →
        </PixelButton>
      </div>
    </PixelPanel>
  );
}
