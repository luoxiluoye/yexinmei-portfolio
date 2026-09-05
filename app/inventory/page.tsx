import type { AssetId } from "@/lib/assets";
import { skills } from "@/data/skills";

import { InventoryChest } from "@/components/game/inventory-chest";
import { CharacterScene } from "@/components/scenes/character-scene";
import { PixelIcon } from "@/components/ui/pixel-icon";
import { PixelPanel } from "@/components/ui/pixel-panel";
import { PixelTag } from "@/components/ui/pixel-tag";
import { StatusBar } from "@/components/ui/status-bar";

const toolIcons: AssetId[] = [
  "items.laptop",
  "items.notebook",
  "items.camera",
  "items.key",
  "items.chest",
  "items.mail",
];

const toolIconSizes = [40, 40, 38, 28, 38, 36] as const;

const skillIcons: AssetId[] = [
  "items.sword",
  "items.shield",
  "items.potion",
  "ui.heart",
  "ui.star",
  "ui.sparkle",
  "ui.arrow",
];

const specialAssetIds: AssetId[] = [
  "items.camera",
  "items.notebook",
  "items.laptop",
  "cat.sit",
];

export default function InventoryPage() {
  return (
    <main className="site-container py-5 lg:py-8">
      <header className="grid gap-4 lg:grid-cols-[1fr_320px] lg:items-center">
        <div>
          <p className="font-pixel text-[12px] text-muted">05. INVENTORY</p>
          <h1 className="rpg-page-title mt-2">INVENTORY & SKILLS</h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-[26px] text-muted">
            内容策划、新媒体运营、社区运营、AI 辅助工作流，以及摄影与常用创作工具。
          </p>
        </div>

        <CharacterScene variant="inventory" />
      </header>

      <section className="mt-5 grid gap-4 lg:mt-8 lg:grid-cols-[72fr_28fr] lg:gap-5">
        <div className="min-w-0 space-y-4">
          <PixelPanel eyebrow="01" title={`TOOLS · ${skills.tools.length}`}>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {skills.tools.map((tool, index) => (
                <InventorySlot
                  key={tool.name}
                  assetId={toolIcons[index]}
                  index={index}
                  label={tool.name}
                  detail={tool.level}
                  iconSize={toolIconSizes[index]}
                />
              ))}
            </div>
          </PixelPanel>

          <PixelPanel eyebrow="02" title={`SKILLS · ${skills.core.length}`}>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {skills.core.map((skill, index) => (
                <InventorySlot
                  key={skill}
                  assetId={skillIcons[index]}
                  index={index}
                  label={skill}
                  iconSize={34}
                />
              ))}
            </div>
          </PixelPanel>

          <PixelPanel eyebrow="03" title={`SPECIAL ITEMS · ${skills.specialItems.length}`}>
            <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
              {skills.specialItems.map((item, index) => (
                <div
                  key={item.name}
                  className="rpg-item-slot flex min-w-[148px] flex-col items-center justify-center border border-divider bg-soft p-4 text-center lg:min-w-0"
                >
                  <div className="flex h-[58px] w-[58px] items-center justify-center border border-divider bg-paper">
                    <PixelIcon
                      assetId={specialAssetIds[index]}
                      decorative
                      width={46}
                      height={46}
                    />
                  </div>
                  <span className="mt-3 font-pixel text-[11px]">{item.name}</span>
                  <span className="mt-2 text-[12px] leading-5 text-muted">{item.buff}</span>
                </div>
              ))}
            </div>
          </PixelPanel>
        </div>

        <aside className="lg:sticky lg:top-[84px] lg:self-start">
          <PixelPanel eyebrow="SKILLS" title="SUMMARY" accent>
            <div className="space-y-3 text-[13px] leading-6">
              <p><strong>主线：</strong>内容策划 / 新媒体 / 社区运营</p>
              <p><strong>辅助：</strong>摄影 / 数据分析 / AI 提效</p>
              <p><strong>当前关注：</strong>怎样把好内容做得更容易被看见、讨论和留下。</p>
            </div>

            <div className="mt-5 border-t border-divider pt-4">
              <p className="mb-2 font-pixel text-[10px] text-muted">AI ASSIST</p>
              <div className="flex flex-wrap gap-2">
                {skills.aiAssist.map((item) => (
                  <PixelTag key={item}>{item}</PixelTag>
                ))}
              </div>
            </div>

            <InventoryChest />
          </PixelPanel>
        </aside>
      </section>

      <div className="mt-5 pb-8 lg:mt-8 lg:pb-0">
        <StatusBar
          items={[
            { label: "TOOLS", value: String(skills.tools.length).padStart(2, "0") },
            { label: "CORE", value: String(skills.core.length).padStart(2, "0"), accent: true },
            { label: "AI ASSIST", value: String(skills.aiAssist.length).padStart(2, "0") },
            { label: "SPECIAL", value: String(skills.specialItems.length).padStart(2, "0") },
          ]}
        />
      </div>
    </main>
  );
}

function InventorySlot({
  assetId,
  index,
  label,
  detail,
  iconSize,
}: {
  assetId: AssetId;
  index: number;
  label: string;
  detail?: string;
  iconSize: number;
}) {
  return (
    <div className="rpg-item-slot flex min-h-[116px] flex-col justify-between border border-divider bg-soft p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex h-[52px] w-[52px] items-center justify-center border border-divider bg-paper">
          <PixelIcon
            assetId={assetId}
            decorative
            width={iconSize}
            height={iconSize}
          />
        </div>
        <span className="font-pixel text-[10px] text-muted">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className="mt-3">
        <p className="text-[13px] font-semibold leading-5">{label}</p>
        {detail && <p className="mt-1 text-[11px] leading-5 text-muted">{detail}</p>}
      </div>
    </div>
  );
}
