"use client";

import { useState } from "react";
import { Link } from "next-view-transitions";

import styles from "@/components/inventory/inventory-loadout.module.css";
import { InventoryInspectButton } from "@/components/inventory/inventory-inspect-button";
import { PixelIcon } from "@/components/ui/pixel-icon";
import { skills } from "@/data/skills";
import type { AssetId } from "@/lib/assets";

type LoadoutKey = "CONTENT" | "GROWTH" | "CREATIVE" | "AI";
type LoadoutKind = "tool" | "skill";

type LoadoutItem = {
  label: string;
  detail?: string;
  assetId: AssetId;
  iconSize: number;
  kind: LoadoutKind;
  sourceIndex: number;
};

type LoadoutCategory = {
  key: LoadoutKey;
  title: string;
  subtitle: string;
  description: string;
  icon: AssetId;
  items: LoadoutItem[];
  projects: Array<{ title: string; href: string }>;
  assist?: readonly string[];
};

const toolItems: LoadoutItem[] = [
  { label: skills.tools[0].name, detail: skills.tools[0].level, assetId: "ui.star", iconSize: 38, kind: "tool", sourceIndex: 0 },
  { label: skills.tools[1].name, detail: skills.tools[1].level, assetId: "items.laptop", iconSize: 42, kind: "tool", sourceIndex: 1 },
  { label: skills.tools[2].name, detail: skills.tools[2].level, assetId: "items.notebook", iconSize: 38, kind: "tool", sourceIndex: 2 },
  { label: skills.tools[3].name, detail: skills.tools[3].level, assetId: "ui.sparkle", iconSize: 38, kind: "tool", sourceIndex: 3 },
  { label: skills.tools[4].name, detail: skills.tools[4].level, assetId: "items.camera", iconSize: 44, kind: "tool", sourceIndex: 4 },
  { label: skills.tools[5].name, detail: skills.tools[5].level, assetId: "ui.arrow", iconSize: 36, kind: "tool", sourceIndex: 5 },
];

const skillItems: LoadoutItem[] = [
  { label: skills.core[0], assetId: "items.sword", iconSize: 36, kind: "skill", sourceIndex: 0 },
  { label: skills.core[1], assetId: "items.shield", iconSize: 36, kind: "skill", sourceIndex: 1 },
  { label: skills.core[2], assetId: "items.potion", iconSize: 36, kind: "skill", sourceIndex: 2 },
  { label: skills.core[3], assetId: "ui.heart", iconSize: 36, kind: "skill", sourceIndex: 3 },
  { label: skills.core[4], assetId: "ui.star", iconSize: 36, kind: "skill", sourceIndex: 4 },
  { label: skills.core[5], assetId: "ui.sparkle", iconSize: 36, kind: "skill", sourceIndex: 5 },
  { label: skills.core[6], assetId: "ui.arrow", iconSize: 36, kind: "skill", sourceIndex: 6 },
];

const categories: LoadoutCategory[] = [
  {
    key: "CONTENT",
    title: "内容能力",
    subtitle: "选题、表达与分发",
    description: "从选题判断、内容结构到平台表达与分发，让内容进入真实语境并形成持续供给。",
    icon: "items.notebook",
    items: [skillItems[0], skillItems[1], skillItems[4], skillItems[5]],
    projects: [
      { title: "知乎汽车与消费电子社区内容运营", href: "/quests/zhihu-auto-consumer-tech" },
      { title: "科技有后话", href: "/quests/tech-you-houhua" },
      { title: "国际传播 / 海外社媒", href: "/quests/global-content" },
    ],
  },
  {
    key: "GROWTH",
    title: "增长与社区",
    subtitle: "用户、数据与转化",
    description: "通过用户反馈、社区讨论与数据表现判断真实需求，再把判断转成内容、商品与运营动作。",
    icon: "ui.arrow",
    items: [skillItems[2], skillItems[3], skillItems[6], toolItems[2], toolItems[5]],
    projects: [
      { title: "知乎汽车与消费电子社区内容运营", href: "/quests/zhihu-auto-consumer-tech" },
      { title: "CCD 20W+ GMV", href: "/quests/ccd-business" },
      { title: "国际传播 / 海外社媒", href: "/quests/global-content" },
    ],
  },
  {
    key: "CREATIVE",
    title: "视觉创作",
    subtitle: "摄影、剪辑与设计",
    description: "用摄影、剪辑与图片处理完成视觉表达，也把画面判断带回内容和产品展示。",
    icon: "items.camera",
    items: [toolItems[0], toolItems[1], toolItems[4]],
    projects: [
      { title: "摄影 / 视觉内容", href: "/quests/visual-storytelling" },
      { title: "CCD 20W+ GMV", href: "/quests/ccd-business" },
      { title: "赤页 RED LEAF", href: "/quests/red-leaf" },
    ],
  },
  {
    key: "AI",
    title: "AI 与产品",
    subtitle: "工具、工作流与产品实践",
    description: "使用 AI 完成资料整理、内容辅助与工作流设计，并把相关能力继续延伸到可交互的产品实践。",
    icon: "ui.sparkle",
    items: [toolItems[3]],
    projects: [
      { title: "赤页 RED LEAF", href: "/quests/red-leaf" },
      { title: "灵感编辑室", href: "/quests/inspiration-studio" },
      { title: "科技有后话", href: "/quests/tech-you-houhua" },
    ],
    assist: skills.aiAssist,
  },
];

const specialAssetIds: AssetId[] = [
  "items.camera",
  "items.notebook",
  "items.laptop",
  "cat.sit",
];

export function InventoryLoadout() {
  const [selectedKey, setSelectedKey] = useState<LoadoutKey>("CONTENT");
  const selected = categories.find((category) => category.key === selectedKey) ?? categories[0];

  return (
    <>
      <section className={styles.shell} aria-label="技能装备界面">
        <div className={styles.stage}>
          <span className={`${styles.connector} ${styles.connectorOne}`} aria-hidden="true" />
          <span className={`${styles.connector} ${styles.connectorTwo}`} aria-hidden="true" />
          <span className={`${styles.connector} ${styles.connectorThree}`} aria-hidden="true" />
          <span className={`${styles.connector} ${styles.connectorFour}`} aria-hidden="true" />

          <div className={styles.player} aria-hidden="true">
            <PixelIcon assetId="character.fullBody" decorative width={330} height={440} />
          </div>

          {categories.map((category) => {
            const active = category.key === selectedKey;
            return (
              <button
                key={category.key}
                type="button"
                aria-pressed={active}
                onClick={() => setSelectedKey(category.key)}
                className={`${styles.slot} ${active ? styles.slotActive : ""}`}
              >
                <span className={styles.slotIcon}>
                  <PixelIcon assetId={category.icon} decorative width={32} height={32} />
                </span>
                <span>
                  <span className={styles.slotLabel}>{category.key}</span>
                  <span className={styles.slotMeta}>{category.items.length} EQUIPPED</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className={styles.panel} aria-live="polite">
          <div className={styles.panelHeader}>
            <div>
              <p className={styles.panelIndex}>LOADOUT / {String(categories.findIndex((item) => item.key === selected.key) + 1).padStart(2, "0")}</p>
              <h2 className={styles.panelTitle}>{selected.title}</h2>
              <p className={styles.panelDescription}>{selected.description}</p>
            </div>
            <div>
              <p className="font-pixel text-[8px] text-muted">ACTIVE SET</p>
              <div className={styles.selectionBar} aria-hidden="true"><span key={selected.key} /></div>
            </div>
          </div>

          <div key={selected.key} className={styles.panelBody}>
            <p className={styles.sectionLabel}>{selected.subtitle.toUpperCase()} · EQUIPPED ITEMS</p>
            <div className={styles.items}>
              {selected.items.map((item) => (
                <InventoryInspectButton
                  key={`${selected.key}-${item.label}`}
                  assetId={item.assetId}
                  index={item.sourceIndex}
                  label={item.label}
                  detail={item.detail}
                  iconSize={item.iconSize}
                  kind={item.kind}
                />
              ))}
            </div>

            {selected.assist ? (
              <div className="mt-6 border-t border-divider pt-5">
                <p className={styles.sectionLabel}>AI ASSIST</p>
                <div className={styles.assistList}>
                  {selected.assist.map((item) => <span key={item}>{item}</span>)}
                </div>
              </div>
            ) : null}

            <div className="mt-6 border-t border-divider pt-5">
              <p className={styles.sectionLabel}>USED IN / REAL PROJECTS</p>
              <div className={styles.projectLinks}>
                {selected.projects.map((project) => (
                  <Link key={project.href} href={project.href} className={styles.projectLink}>
                    <span>{project.title}</span>
                    <span className="font-pixel text-[9px]">OPEN →</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.specialSection} aria-labelledby="special-items-heading">
        <p className="font-pixel text-[9px] tracking-[0.08em] text-accent">SPECIAL ITEMS</p>
        <div className="mt-2 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <h2 id="special-items-heading" className="text-[26px] font-semibold tracking-[-0.03em]">随身物品与长期 Buff</h2>
          <p className="text-[12px] text-muted">点击物品可以查看它参与过的项目。</p>
        </div>
        <div className={styles.specialGrid}>
          {skills.specialItems.map((item, index) => (
            <InventoryInspectButton
              key={item.name}
              assetId={specialAssetIds[index]}
              index={index}
              label={item.name}
              detail={item.buff}
              iconSize={46}
              kind="special"
            />
          ))}
        </div>
      </section>
    </>
  );
}
