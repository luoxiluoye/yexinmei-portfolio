"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { Link } from "next-view-transitions";

import { PixelIcon } from "@/components/ui/pixel-icon";
import { PixelPanel } from "@/components/ui/pixel-panel";
import { skills } from "@/data/skills";
import type { AssetId } from "@/lib/assets";

type AbilityKey = (typeof skills.abilities)[number]["key"];

const abilityTabs: Record<AbilityKey, { icon: AssetId; label: string }> = {
  CONTENT: { icon: "items.notebook", label: "内容表达" },
  COMMUNITY: { icon: "ui.heart", label: "社区运营" },
  AI_PRODUCT: { icon: "ui.sparkle", label: "AI 产品" },
  VISUAL: { icon: "items.camera", label: "视觉制作" },
};

export function InventoryLoadout() {
  const [selectedKey, setSelectedKey] = useState<AbilityKey>(skills.abilities[0].key);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  function moveTab(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % skills.abilities.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + skills.abilities.length) % skills.abilities.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = skills.abilities.length - 1;
    else return;
    event.preventDefault();
    setSelectedKey(skills.abilities[next].key);
    tabs.current[next]?.focus();
  }

  return (
    <div className="inventory-loadout">
      <PixelPanel eyebrow="ABILITY SETS" title="我能做什么" accent contentClassName="ability-workbench">
        <div className="ability-tabs" role="tablist" aria-label="选择能力方向">
          {skills.abilities.map((ability, index) => (
            <button
              key={ability.key}
              ref={(element) => { tabs.current[index] = element; }}
              type="button"
              role="tab"
              id={`ability-tab-${ability.key}`}
              aria-controls={`ability-panel-${ability.key}`}
              aria-selected={selectedKey === ability.key}
              tabIndex={selectedKey === ability.key ? 0 : -1}
              onClick={() => setSelectedKey(ability.key)}
              onKeyDown={(event) => moveTab(event, index)}
            >
              <PixelIcon assetId={abilityTabs[ability.key].icon} decorative width={22} height={22} />
              <span>{abilityTabs[ability.key].label}</span>
            </button>
          ))}
        </div>

        {skills.abilities.map((ability) => (
          <div
            key={ability.key}
            role="tabpanel"
            id={`ability-panel-${ability.key}`}
            aria-labelledby={`ability-tab-${ability.key}`}
            hidden={selectedKey !== ability.key}
            tabIndex={0}
            className="ability-panel"
          >
            <div className="ability-panel__intro">
              <h3>{ability.title}</h3>
              <p>{ability.description}</p>
            </div>
            <dl className="ability-methods">
              {ability.items.map((item) => (
                <div key={item.name}>
                  <dt>{item.name}</dt>
                  <dd>{item.note}</dd>
                </div>
              ))}
            </dl>
            <div className="ability-evidence">
              <p>在这些项目中实践过</p>
              <div>
                {ability.projects.map((project) => (
                  <Link key={project.href} href={project.href} className="ability-project-link">
                    <span>{project.title}</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </PixelPanel>

      <section className="toolbox-list" aria-labelledby="toolbox-title">
        <header>
          <p className="font-pixel">TOOLBOX</p>
          <h2 id="toolbox-title">日常工具</h2>
          <p>用来把想法做出来。</p>
        </header>
        <dl>
          {skills.tools.map((tool) => (
            <div key={tool.name}>
              <dt>{tool.name}</dt>
              <dd>{tool.level}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
