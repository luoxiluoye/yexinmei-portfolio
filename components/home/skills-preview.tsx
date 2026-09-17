import { skillGroups } from "@/data/home";

import { PixelButton } from "@/components/ui/pixel-button";
import { PixelIcon } from "@/components/ui/pixel-icon";
import { PixelPanel } from "@/components/ui/pixel-panel";

const groupIcons = ["items.notebook", "ui.sparkle", "items.camera"] as const;

export function SkillsPreview() {
  return (
    <PixelPanel eyebrow="INVENTORY" title="SKILLS" accent interactive className="h-full">
      <div className="space-y-3.5">
        {skillGroups.map((group, index) => (
          <div key={group.title} className="group/skill">
            <div className="mb-2 flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                <PixelIcon
                  assetId={groupIcons[index]}
                  decorative
                  width={28}
                  height={28}
                  className="transition-transform duration-100 group-hover/skill:-translate-y-px"
                />
              </div>
              <span className="font-pixel text-[11px]">{group.title}</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {group.items.slice(0, 4).map((skill) => (
                <span
                  key={skill}
                  className="border border-divider bg-soft px-2 py-1 text-[11px] leading-4 transition-colors hover:border-border hover:bg-paper"
                >
                  {skill}
                </span>
              ))}
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
