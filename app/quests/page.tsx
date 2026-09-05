import type { Metadata } from "next";

import { quests } from "@/data/quests";
import { MiniWorldScene } from "@/components/scenes/mini-world-scene";
import { QuestExplorer } from "@/components/quests/quest-explorer";
import { QuestStatusSidebar } from "@/components/quests/quest-status-sidebar";

export const metadata: Metadata = {
  title: "项目经历与作品",
  description: "罗叶馨梅的项目与实践：内容运营、社区运营、新媒体、国际传播、科技内容、AI 工作流与个人项目。",
};

export default function QuestsPage() {
  return (
    <main className="site-container py-4 lg:py-8">
      <header className="grid gap-4 lg:grid-cols-[1fr_320px] lg:items-end">
        <div className="min-w-0">
          <p className="font-pixel text-[12px] text-muted">03. QUESTS</p>
          <h1 className="rpg-page-title mt-2">QUEST LOG</h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-[26px] text-muted">
            这里记录做过的项目、正在探索的方向，以及一些从兴趣出发的 Side Quests。
          </p>
        </div>
        <MiniWorldScene kind="cat" className="min-h-[104px] lg:min-h-[118px]" />
      </header>

      <section className="mt-4 grid gap-4 pb-8 lg:mt-8 lg:grid-cols-[72fr_28fr] lg:gap-5 lg:pb-0">
        <div className="min-w-0">
          <div className="mb-4 lg:hidden">
            <QuestStatusSidebar />
          </div>
          <QuestExplorer quests={quests} />
        </div>

        <aside className="hidden lg:block">
          <QuestStatusSidebar />
        </aside>
      </section>
    </main>
  );
}
