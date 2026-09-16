import type { Metadata } from "next";

import { InventoryChest } from "@/components/game/inventory-chest";
import { InventoryLoadout } from "@/components/inventory/inventory-loadout";
import { StatusBar } from "@/components/ui/status-bar";
import { skills } from "@/data/skills";

export const metadata: Metadata = {
  title: "技能与工具",
  description: "罗叶馨梅的内容运营、新媒体、社区运营、摄影、数据分析与 AI 辅助工作流能力。",
};

export default function InventoryPage() {
  return (
    <main className="site-container pb-12 pt-6 lg:pb-16 lg:pt-10">
      <header className="border-b border-divider pb-8 lg:pb-10">
        <p className="font-pixel text-[11px] tracking-[0.08em] text-accent">05 / INVENTORY</p>
        <div className="mt-3 grid gap-5 lg:grid-cols-[0.78fr_1.22fr] lg:items-end lg:gap-10">
          <div>
            <h1 className="text-[42px] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-[52px] lg:text-[64px]">
              PLAYER LOADOUT
            </h1>
            <p className="mt-3 font-pixel text-[11px] tracking-[0.08em] text-muted">CONTENT · GROWTH · CREATIVE · AI</p>
          </div>
          <p className="max-w-[700px] text-[15px] leading-7 text-muted lg:text-[16px] lg:leading-8">
            把技能按真实使用场景重新装进角色栏。选择一个能力区域，可以查看对应工具、核心能力，以及它们具体出现在哪些项目里；点击装备本身可以继续打开完整详情。
          </p>
        </div>
      </header>

      <div className="py-9 lg:py-14">
        <InventoryLoadout />
      </div>

      <section className="grid gap-8 border-t border-divider py-9 lg:grid-cols-[1fr_380px] lg:items-start lg:gap-12 lg:py-12">
        <div>
          <p className="font-pixel text-[9px] tracking-[0.08em] text-accent">CURRENT FOCUS</p>
          <h2 className="mt-2 text-[28px] font-semibold tracking-[-0.03em] lg:text-[34px]">现在持续加强的方向</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="border-t border-divider pt-3">
              <p className="font-pixel text-[9px] text-muted">CONTENT</p>
              <p className="mt-2 text-[13px] leading-6">怎样让好内容更容易被看见、讨论和留下。</p>
            </div>
            <div className="border-t border-divider pt-3">
              <p className="font-pixel text-[9px] text-muted">PRODUCT</p>
              <p className="mt-2 text-[13px] leading-6">怎样把内容理解、用户需求和交互体验连接起来。</p>
            </div>
            <div className="border-t border-divider pt-3">
              <p className="font-pixel text-[9px] text-muted">AI</p>
              <p className="mt-2 text-[13px] leading-6">怎样用 AI 提高信息处理效率，并继续完成真实产品。</p>
            </div>
          </div>
        </div>

        <div className="border border-divider bg-soft px-4 pb-4">
          <InventoryChest />
        </div>
      </section>

      <div className="pb-2 pt-2">
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
