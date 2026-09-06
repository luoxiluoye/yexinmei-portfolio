"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import type { AssetId } from "@/lib/assets";
import { markAchievementProgress, markProgress, unlockAchievement } from "@/lib/rpg-events";
import { PixelIcon } from "@/components/ui/pixel-icon";

type InventoryKind = "tool" | "skill" | "special";

type InspectMeta = {
  type: string;
  status: string;
  description: string;
  usedIn: Array<{ title: string; href: string }>;
  note?: string;
};

const META: Record<string, InspectMeta> = {
  Photoshop: {
    type: "CREATIVE TOOL",
    status: "EQUIPPED",
    description: "用于封面、视觉包装、图片处理和内容物料，是日常内容工作里最稳定的一件工具。",
    usedIn: [
      { title: "摄影 / 视觉内容", href: "/quests/visual-storytelling" },
      { title: "知乎汽车与消费电子社区内容运营", href: "/quests/zhihu-auto-consumer-tech" },
    ],
  },
  "Premiere Pro": {
    type: "CREATIVE TOOL",
    status: "EQUIPPED",
    description: "用于视频剪辑、活动记录和短内容制作，和摄影一起构成我的基础视觉表达能力。",
    usedIn: [{ title: "摄影 / 视觉内容", href: "/quests/visual-storytelling" }],
  },
  Excel: {
    type: "WORK TOOL",
    status: "ACTIVE",
    description: "用于内容数据整理、运营复盘、信息清洗和基础分析，让判断不只停留在感觉。",
    usedIn: [
      { title: "知乎汽车与消费电子社区内容运营", href: "/quests/zhihu-auto-consumer-tech" },
      { title: "国际传播 / 海外社媒", href: "/quests/global-content" },
    ],
  },
  "AI 工具": {
    type: "WORKFLOW TOOL",
    status: "HIGH FREQUENCY",
    description: "用于资料整理、选题辅助、信息结构化和 AIGC 创作，但最终判断和表达仍由我自己完成。",
    usedIn: [
      { title: "AI Workflow / 灵感编辑室", href: "/quests/inspiration-studio" },
      { title: "科技有后话", href: "/quests/tech-you-houhua" },
    ],
  },
  "摄影 / 相机": {
    type: "CREATIVE TOOL",
    status: "EQUIPPED",
    description: "既是爱好，也是生产工具。会用它记录人物、活动和日常，也会把视觉判断带回内容工作。",
    usedIn: [
      { title: "摄影 / 视觉内容", href: "/quests/visual-storytelling" },
      { title: "CCD 20W+ GMV", href: "/quests/ccd-business" },
    ],
  },
  "基础数据分析": {
    type: "WORK TOOL",
    status: "ACTIVE",
    description: "关注浏览、互动、转化和内容表现，用基础数据帮助判断什么值得继续做、什么需要调整。",
    usedIn: [
      { title: "知乎汽车与消费电子社区内容运营", href: "/quests/zhihu-auto-consumer-tech" },
      { title: "国际传播 / 海外社媒", href: "/quests/global-content" },
    ],
  },
  内容策划: {
    type: "CORE SKILL",
    status: "EQUIPPED",
    description: "从热点判断、信息整理到问题设计和内容结构，是我使用频率最高的一项能力。",
    usedIn: [
      { title: "知乎汽车与消费电子社区内容运营", href: "/quests/zhihu-auto-consumer-tech" },
      { title: "科技有后话", href: "/quests/tech-you-houhua" },
      { title: "国际传播 / 海外社媒", href: "/quests/global-content" },
    ],
  },
  新媒体运营: {
    type: "CORE SKILL",
    status: "EQUIPPED",
    description: "覆盖选题、编辑、发布、分发和复盘，更在意一条内容如何进入真实的平台语境。",
    usedIn: [
      { title: "国际传播 / 海外社媒", href: "/quests/global-content" },
      { title: "科技有后话", href: "/quests/tech-you-houhua" },
    ],
  },
  社区运营: {
    type: "CORE SKILL",
    status: "EQUIPPED",
    description: "围绕问题、用户和内容供给组织讨论，关注谁愿意参与、为什么参与，以及好内容怎样被继续放大。",
    usedIn: [{ title: "知乎汽车与消费电子社区内容运营", href: "/quests/zhihu-auto-consumer-tech" }],
  },
  用户洞察: {
    type: "CORE SKILL",
    status: "EQUIPPED",
    description: "从咨询、评论、搜索和行为里找真实需求，再把这些需求反向变成内容、产品或运营动作。",
    usedIn: [
      { title: "CCD 20W+ GMV", href: "/quests/ccd-business" },
      { title: "知乎汽车与消费电子社区内容运营", href: "/quests/zhihu-auto-consumer-tech" },
    ],
  },
  热点选题: {
    type: "CORE SKILL",
    status: "ACTIVE",
    description: "不只追热度，还会判断时效、搜索需求、受众关联和后续解释空间。",
    usedIn: [
      { title: "科技有后话", href: "/quests/tech-you-houhua" },
      { title: "知乎汽车与消费电子社区内容运营", href: "/quests/zhihu-auto-consumer-tech" },
    ],
  },
  内容分发: {
    type: "CORE SKILL",
    status: "ACTIVE",
    description: "根据平台机制、内容质量和用户兴趣安排分发，不把发布当成内容工作的终点。",
    usedIn: [
      { title: "知乎汽车与消费电子社区内容运营", href: "/quests/zhihu-auto-consumer-tech" },
      { title: "国际传播 / 海外社媒", href: "/quests/global-content" },
    ],
  },
  数据复盘: {
    type: "CORE SKILL",
    status: "ACTIVE",
    description: "把表现好的和没跑通的内容放回同一套指标里看，形成下一轮选题和运营动作。",
    usedIn: [
      { title: "国际传播 / 海外社媒", href: "/quests/global-content" },
      { title: "知乎汽车与消费电子社区内容运营", href: "/quests/zhihu-auto-consumer-tech" },
    ],
  },
  CAMERA: {
    type: "SPECIAL ITEM",
    status: "RARE · EQUIPPED",
    description: "视觉表达道具，也是 CCD Side Quest 的起点。",
    usedIn: [
      { title: "摄影 / 视觉内容", href: "/quests/visual-storytelling" },
      { title: "CCD 20W+ GMV", href: "/quests/ccd-business" },
    ],
    note: "KNOWN RESULT · 20W+ GMV / 50%+ Margin",
  },
  NOTEBOOK: {
    type: "SPECIAL ITEM",
    status: "EQUIPPED",
    description: "用来记选题、现场观察和突然冒出来的小想法。很多项目最开始都只是一条很短的记录。",
    usedIn: [
      { title: "科技有后话", href: "/quests/tech-you-houhua" },
      { title: "AI Workflow / 灵感编辑室", href: "/quests/inspiration-studio" },
    ],
  },
  "AI ASSISTANT": {
    type: "SPECIAL ITEM",
    status: "ACTIVE",
    description: "用于把重复的信息工作压缩掉，给真正需要判断、表达和创意的部分留更多时间。",
    usedIn: [{ title: "AI Workflow / 灵感编辑室", href: "/quests/inspiration-studio" }],
  },
  "CAT COMPANION": {
    type: "SPECIAL ITEM",
    status: "LEGENDARY",
    description: "本站常驻 NPC。没有 KPI，但负责让页面和心情都没那么紧绷。",
    usedIn: [{ title: "PLAYER PROFILE", href: "/player" }],
    note: "BUFF · +999 心情值",
  },
};

function fallbackMeta(kind: InventoryKind): InspectMeta {
  return {
    type: kind === "tool" ? "TOOL" : kind === "skill" ? "CORE SKILL" : "SPECIAL ITEM",
    status: "EQUIPPED",
    description: "这是当前 Inventory 中的一项能力或工具。",
    usedIn: [{ title: "VIEW ALL QUESTS", href: "/quests" }],
  };
}

function getFocusable(container: HTMLElement | null) {
  if (!container) return [] as HTMLElement[];
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter((element) => !element.hasAttribute("disabled") && element.getAttribute("aria-hidden") !== "true");
}

export function InventoryInspectButton({
  assetId,
  index,
  label,
  detail,
  iconSize,
  kind,
}: {
  assetId: AssetId;
  index: number;
  label: string;
  detail?: string;
  iconSize: number;
  kind: InventoryKind;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const meta = META[label] ?? fallbackMeta(kind);

  const openInspect = () => {
    setOpen(true);
    markProgress("inventory", `${kind}:${label}`);
    unlockAchievement({
      id: "inventory-curious",
      title: "ITEM INSPECTOR",
      description: "Inspected a skill or tool in Inventory.",
    });
    if (kind === "skill") {
      markAchievementProgress("skills", label, 7, {
        id: "skill-scout",
        title: "SKILL SCOUT",
        description: "Inspected all 7 core skills.",
      });
    }
  };

  const close = () => {
    setOpen(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus({ preventScroll: true }));
  };

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => closeButtonRef.current?.focus({ preventScroll: true }));

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = getFocusable(dialogRef.current);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const inspectLabel = kind === "skill" ? "VIEW SKILL →" : "INSPECT →";

  const modal = (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto bg-black/45 p-3 overscroll-contain lg:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${label} item inspect`}
        className={kind === "skill" ? "pixel-cut-frame my-auto w-[min(680px,100%)]" : "pixel-cut-frame my-auto w-[min(620px,100%)]"}
      >
        <div className="pixel-cut-surface max-h-[calc(100dvh-24px)] overflow-y-auto bg-paper lg:max-h-[min(88dvh,700px)]">
          <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b-2 border-border bg-paper px-4 py-3">
            <div>
              <p className="font-pixel text-[8px] text-accent">
                {kind === "skill" ? "SKILL FILE" : "ITEM INSPECT"} · {String(index + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-1 font-pixel text-[14px]">{label}</h2>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={close}
              className="flex h-11 w-11 shrink-0 items-center justify-center border-2 border-border bg-paper font-pixel text-[11px] hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label="关闭详情"
            >
              ×
            </button>
          </header>

          {kind === "skill" ? (
            <SkillInspectContent
              assetId={assetId}
              iconSize={iconSize}
              meta={meta}
              onNavigate={() => setOpen(false)}
            />
          ) : (
            <ItemInspectContent
              assetId={assetId}
              iconSize={iconSize}
              meta={meta}
              onNavigate={() => setOpen(false)}
            />
          )}
        </div>
      </section>
    </div>
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openInspect}
        aria-haspopup="dialog"
        className={[
          "rpg-item-slot group w-full cursor-pointer border border-divider bg-soft text-left transition-[transform,border-color,box-shadow] duration-100 hover:-translate-x-px hover:-translate-y-px hover:border-accent hover:shadow-[2px_2px_0_rgba(17,17,17,.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
          kind === "special"
            ? "flex min-h-[152px] min-w-[148px] flex-col items-center justify-center p-4 text-center lg:min-w-0"
            : "flex min-h-[116px] flex-col justify-between p-3",
        ].join(" ")}
      >
        {kind === "special" ? (
          <>
            <div className="flex h-[58px] w-[58px] items-center justify-center border border-divider bg-paper">
              <PixelIcon assetId={assetId} decorative width={iconSize} height={iconSize} />
            </div>
            <span className="mt-3 font-pixel text-[11px]">{label}</span>
            {detail ? <span className="mt-2 text-[12px] leading-5 text-muted">{detail}</span> : null}
            <span className="mt-2 font-pixel text-[8px] text-accent opacity-100 lg:opacity-0 lg:transition-opacity lg:group-hover:opacity-100 lg:group-focus-visible:opacity-100">{inspectLabel}</span>
          </>
        ) : (
          <>
            <div className="flex items-start justify-between gap-2">
              <div className="flex h-[52px] w-[52px] items-center justify-center border border-divider bg-paper">
                <PixelIcon assetId={assetId} decorative width={iconSize} height={iconSize} />
              </div>
              <span className="font-pixel text-[10px] text-muted">{String(index + 1).padStart(2, "0")}</span>
            </div>
            <div className="mt-3">
              <p className="text-[13px] font-semibold leading-5">{label}</p>
              {detail ? <p className="mt-1 text-[11px] leading-5 text-muted">{detail}</p> : null}
              <p className="mt-2 font-pixel text-[8px] text-accent opacity-100 lg:opacity-0 lg:transition-opacity lg:group-hover:opacity-100 lg:group-focus-visible:opacity-100">{inspectLabel}</p>
            </div>
          </>
        )}
      </button>

      {open && typeof document !== "undefined" ? createPortal(modal, document.body) : null}
    </>
  );
}

function SkillInspectContent({
  assetId,
  iconSize,
  meta,
  onNavigate,
}: {
  assetId: AssetId;
  iconSize: number;
  meta: InspectMeta;
  onNavigate: () => void;
}) {
  return (
    <div className="p-4 lg:p-5">
      <div className="grid gap-4 sm:grid-cols-[92px_1fr] sm:items-start">
        <div className="flex h-[92px] w-[92px] items-center justify-center border-2 border-border bg-soft">
          <PixelIcon assetId={assetId} decorative width={Math.min(iconSize + 30, 68)} height={Math.min(iconSize + 30, 68)} />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            <span className="border border-divider bg-soft px-2 py-1 font-pixel text-[8px] text-foreground">{meta.type}</span>
            <span className="border border-accent/40 bg-paper px-2 py-1 font-pixel text-[8px] text-accent">{meta.status}</span>
          </div>
          <p className="mt-3 text-[14px] leading-7 text-foreground">{meta.description}</p>
          <div className="mt-4 grid grid-cols-2 border-y border-divider text-[11px]">
            <div className="border-r border-divider py-2.5 pr-3">
              <p className="font-pixel text-[8px] text-muted">PROOF</p>
              <p className="mt-1 font-pixel text-[9px]">REAL QUESTS</p>
            </div>
            <div className="py-2.5 pl-3">
              <p className="font-pixel text-[8px] text-muted">USED IN</p>
              <p className="mt-1 font-pixel text-[9px] text-accent">{meta.usedIn.length} QUEST{meta.usedIn.length === 1 ? "" : "S"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 border-t border-divider pt-4">
        <div className="flex items-center justify-between gap-3">
          <p className="font-pixel text-[9px] text-accent">EVIDENCE / USED IN</p>
          <p className="font-pixel text-[8px] text-muted">OPEN PROJECT →</p>
        </div>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {meta.usedIn.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className="group flex min-h-[66px] items-center justify-between gap-3 border border-divider bg-soft px-3 py-2.5 hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <span className="text-[12px] font-semibold leading-5 group-hover:text-accent">{item.title}</span>
              <span className="shrink-0 font-pixel text-[9px] text-accent">→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function ItemInspectContent({
  assetId,
  iconSize,
  meta,
  onNavigate,
}: {
  assetId: AssetId;
  iconSize: number;
  meta: InspectMeta;
  onNavigate: () => void;
}) {
  return (
    <div className="p-4 lg:p-5">
      <div className="grid gap-4 sm:grid-cols-[96px_1fr]">
        <div className="flex h-[96px] w-[96px] items-center justify-center border-2 border-border bg-soft">
          <PixelIcon assetId={assetId} decorative width={Math.min(iconSize + 24, 72)} height={Math.min(iconSize + 24, 72)} />
        </div>
        <dl className="divide-y divide-divider border-y border-divider text-[12px]">
          <InspectRow label="TYPE" value={meta.type} />
          <InspectRow label="STATUS" value={meta.status} accent />
          <InspectRow label="USED IN" value={`${meta.usedIn.length} QUEST${meta.usedIn.length === 1 ? "" : "S"}`} />
        </dl>
      </div>

      <div className="mt-4 border-t border-divider pt-4">
        <p className="font-pixel text-[9px] text-accent">DESCRIPTION</p>
        <p className="mt-2 text-[14px] leading-7 text-muted">{meta.description}</p>
        {meta.note ? <p className="mt-3 border border-divider bg-soft px-3 py-2 font-pixel text-[9px] leading-5 text-foreground">{meta.note}</p> : null}
      </div>

      <div className="mt-4 border-t border-divider pt-4">
        <p className="font-pixel text-[9px] text-accent">USED IN</p>
        <div className="mt-2 divide-y divide-divider border-y border-divider">
          {meta.usedIn.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className="flex min-h-11 items-center justify-between gap-3 py-2.5 text-[12px] font-medium hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <span>{item.title}</span>
              <span className="font-pixel text-[9px] text-accent">OPEN →</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function InspectRow({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="grid grid-cols-[80px_1fr] gap-3 py-2.5">
      <dt className="font-pixel text-[9px] text-muted">{label}</dt>
      <dd className={accent ? "font-pixel text-[9px] text-accent" : "font-pixel text-[9px]"}>{value}</dd>
    </div>
  );
}