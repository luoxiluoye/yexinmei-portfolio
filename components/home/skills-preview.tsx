import { skillGroups } from "@/data/home";

import { PixelButton } from "@/components/ui/pixel-button";
import { PixelIcon } from "@/components/ui/pixel-icon";
import { PixelPanel } from "@/components/ui/pixel-panel";

const groupIcons = ["items.notebook", "cat.head", "items.camera"] as const;

export function SkillsPreview() {
  return (
    <PixelPanel eyebrow="INVENTORY" title="SKILLS" accent className="h-full">
      <div className="space-y-4">
        {skillGroups.map((group, index) => (
          <div key={group.title}>
            <div className="mb-2 flex items-center gap-2">
              <PixelIcon
                assetId={groupIcons[index]}
                decorative
                width={24}
                height={24}
              />
              <span className="font-pixel text-[12px]">{group.title}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {group.items.slice(0, 4).map((skill) => (
                <span
                  key={skill}
                  className="border border-divider bg-soft px-2 py-1 text-[12px] leading-5"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <PixelButton href="/inventory" variant="secondary" className="w-full">
          查看技能 →
        </PixelButton>
      </div>
    </PixelPanel>
  );
}
