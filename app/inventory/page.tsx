import type { Metadata } from "next";

import { InventoryChest } from "@/components/game/inventory-chest";
import { InventoryLoadout } from "@/components/inventory/inventory-loadout";
import { StatusBar } from "@/components/ui/status-bar";
import { PixelIcon } from "@/components/ui/pixel-icon";
import { skills } from "@/data/skills";

export const metadata: Metadata = {
  title: "技能与工具",
  description: "罗叶馨梅的内容、社区、AI 产品与视觉能力，以及实际使用的软件工具。",
};

export default function InventoryPage() {
  return (
    <main className="site-container pb-12 pt-5 lg:pb-14 lg:pt-8">
      <header className="mb-5 flex flex-col justify-between gap-4 border-b-2 border-border pb-5 lg:flex-row lg:items-end">
        <div>
          <p className="font-pixel text-[10px] text-accent">05 / INVENTORY</p>
          <h1 className="mt-2 font-pixel-zh text-[38px] leading-none lg:text-[48px]">技能与工具</h1>
          <p className="mt-3 max-w-2xl text-[13px] leading-6 text-muted">
            这里把「我会做什么」和「我用什么做」分开。能力只归类一次，软件工具也只出现一次。
          </p>
        </div>
        <div className="flex items-center gap-3 border border-divider bg-soft px-3 py-2">
          <PixelIcon assetId="items.chest" decorative width={30} height={30} />
          <div>
            <span className="block font-pixel text-[13px]">04 SETS</span>
            <span className="text-[10px] text-muted">{skills.tools.length} TOOLS · 1 SECRET</span>
          </div>
        </div>
      </header>

      <InventoryLoadout />

      <section className="mt-5 grid gap-4 lg:grid-cols-[1fr_320px] lg:items-start">
        <div className="border-t border-divider pt-4">
          <p className="font-pixel text-[9px] text-accent">HOW TO READ</p>
          <p className="mt-2 max-w-[720px] text-[12px] leading-6 text-muted">
            能力区展示实际做事的方法，TOOLBOX 只记录执行工具。想看这些能力怎样被使用，直接进入对应项目 Case File。
          </p>
        </div>
        <div className="border border-divider bg-soft px-4 pb-4">
          <InventoryChest />
        </div>
      </section>

      <div className="mt-5">
        <StatusBar
          items={[
            { label: "ABILITY SETS", value: "04" },
            { label: "TOOLS", value: String(skills.tools.length).padStart(2, "0"), accent: true },
            { label: "SECRET SLOT", value: "01" },
            { label: "STATUS", value: "EQUIPPED" },
          ]}
        />
      </div>
    </main>
  );
}
