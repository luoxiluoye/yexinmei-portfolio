"use client";

import { useState } from "react";
import { Link } from "next-view-transitions";

import { PixelIcon } from "@/components/ui/pixel-icon";
import { PixelPanel } from "@/components/ui/pixel-panel";
import { skills } from "@/data/skills";
import type { AssetId } from "@/lib/assets";

type AbilityKey = (typeof skills.abilities)[number]["key"];

const abilityIcons: Record<AbilityKey, AssetId> = {
  CONTENT: "items.notebook",
  COMMUNITY: "ui.heart",
  AI_PRODUCT: "ui.sparkle",
  VISUAL: "items.camera",
};

const toolIcons: AssetId[] = [
  "ui.star",
  "items.laptop",
  "ui.sparkle",
  "items.notebook",
  "items.potion",
  "ui.arrow",
];

export function InventoryLoadout() {
  const [selectedKey, setSelectedKey] = useState<AbilityKey>(skills.abilities[0].key);
  const selected = skills.abilities.find((ability) => ability.key === selectedKey) ?? skills.abilities[0];

  return (
    <div className="space-y-5">
      <section className="grid gap-4 lg:grid-cols-[290px_1fr] lg:gap-5" aria-label="能力装备栏">
        <PixelPanel eyebrow="ABILITY SLOTS" title="4 DISTINCT SETS" accent className="h-full">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {skills.abilities.map((ability, index) => {
              const active = ability.key === selectedKey;
              return (
                <button
                  key={ability.key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelectedKey(ability.key)}
                  className={[
                    "group grid min-h-[66px] grid-cols-[42px_1fr_auto] items-center gap-3 border px-3 py-2.5 text-left transition-[transform,border-color,background-color]",
                    active
                      ? "border-border bg-foreground text-white"
                      : "border-divider bg-soft hover:-translate-y-px hover:border-accent hover:bg-paper",
                  ].join(" ")}
                >
                  <span className={active ? "flex h-10 w-10 items-center justify-center bg-white/10" : "flex h-10 w-10 items-center justify-center bg-paper"}>
                    <PixelIcon
                      assetId={abilityIcons[ability.key]}
                      decorative
                      width={30}
                      height={30}
                      className={active ? "brightness-0 invert" : ""}
                    />
                  </span>
                  <span className="min-w-0">
                    <span className={active ? "block font-pixel text-[9px] text-accent" : "block font-pixel text-[9px] text-muted"}>
                      SLOT {String(index + 1).padStart(2, "0")}
                    </span>
                    <strong className="mt-0.5 block truncate text-[13px]">{ability.title}</strong>
                  </span>
                  <span className={active ? "font-pixel text-[10px] text-accent" : "font-pixel text-[10px] text-muted"} aria-hidden="true">
                    {active ? "●" : "○"}
                  </span>
                </button>
              );
            })}
          </div>
        </PixelPanel>

        <PixelPanel
          eyebrow={selected.key.replace("_", " / ")}
          title={selected.title}
          rightSlot={<span className="font-pixel text-[9px] text-accent">EQUIPPED</span>}
          className="h-full"
        >
          <p className="max-w-[760px] text-[13px] leading-6 text-muted">{selected.description}</p>

          <div key={selected.key} className="mt-4 grid gap-2 md:grid-cols-3">
            {selected.items.map((item, index) => (
              <article key={item.name} className="border border-divider bg-soft p-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-pixel text-[9px] text-accent">0{index + 1}</span>
                  <span className="h-1.5 w-1.5 bg-accent" aria-hidden="true" />
                </div>
                <h3 className="mt-2 text-[14px] font-semibold leading-5">{item.name}</h3>
                <p className="mt-1.5 text-[11px] leading-5 text-muted">{item.note}</p>
              </article>
            ))}
          </div>

          <div className="mt-5 border-t border-divider pt-4">
            <p className="font-pixel text-[9px] text-muted">USED IN / REAL PROJECTS</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {selected.projects.map((project) => (
                <Link
                  key={project.href}
                  href={project.href}
                  className="group flex min-h-10 items-center justify-between gap-3 border border-divider bg-paper px-3 text-[11px] transition-[transform,border-color,color] hover:-translate-y-px hover:border-accent hover:text-accent"
                >
                  <span className="truncate">{project.title}</span>
                  <span className="shrink-0 font-pixel text-[8px]">OPEN →</span>
                </Link>
              ))}
            </div>
          </div>
        </PixelPanel>
      </section>

      <PixelPanel eyebrow="TOOLBOX" title="SOFTWARE & TOOLS" catPeek>
        <p className="mb-3 text-[12px] leading-5 text-muted">
          工具只在这里出现一次。它们是执行手段，和上面的能力分类分开看。
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {skills.tools.map((tool, index) => (
            <div key={tool.name} className="grid min-h-[58px] grid-cols-[38px_1fr] items-center gap-3 border border-divider bg-soft px-3 py-2">
              <span className="flex h-9 w-9 items-center justify-center bg-paper">
                <PixelIcon assetId={toolIcons[index]} decorative width={28} height={28} />
              </span>
              <span className="min-w-0">
                <strong className="block truncate text-[12px]">{tool.name}</strong>
                <span className="mt-0.5 block truncate text-[10px] text-muted">{tool.level}</span>
              </span>
            </div>
          ))}
        </div>
      </PixelPanel>
    </div>
  );
}
