import type { Metadata } from "next";
import { Link } from "next-view-transitions";

import { InventoryChest } from "@/components/game/inventory-chest";
import { InventoryLoadout } from "@/components/inventory/inventory-loadout";
import { StatusBar } from "@/components/ui/status-bar";
import { skills } from "@/data/skills";
import "@/styles/inventory.css";

export const metadata: Metadata = {
  title: "技能与工具",
  description: "罗叶馨梅的内容、社区、AI 产品与视觉能力，以及实际使用的软件工具。",
};

export default function InventoryPage() {
  return (
    <main id="main-content" className="site-container portfolio-page pb-12 pt-5 lg:pb-14 lg:pt-8">
      <header className="mb-5 flex flex-col justify-between gap-4 border-b-2 border-border pb-5 lg:flex-row lg:items-end">
        <div>
          <p className="font-pixel text-[10px] text-accent">05 / INVENTORY</p>
          <h1 className="mt-2 font-pixel-zh text-[38px] leading-none lg:text-[48px]">技能与工具</h1>
          <p className="mt-3 max-w-2xl text-[13px] leading-6 text-muted">
            从内容判断、用户洞察，到产品与影像，把想法落到实际项目里。
          </p>
        </div>
      </header>

      <InventoryLoadout />

      <section className="inventory-next" aria-label="继续探索">
        <div>
          <Link href="/quests" className="inventory-next__link">去作品里看实际应用 <span aria-hidden="true">→</span></Link>
          <p className="inventory-next__copy">每一份项目档案里，都有具体的任务、做法和交付成果。</p>
        </div>
        <div>
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
