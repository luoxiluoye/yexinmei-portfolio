import type { Metadata } from "next";

import { quests } from "@/data/quests";
import { QuestExplorer } from "@/components/quests/quest-explorer";
import { PixelIcon } from "@/components/ui/pixel-icon";

export const metadata: Metadata = {
  title: "项目经历与作品",
  description: "罗叶馨梅的项目与实践：内容运营、社区运营、新媒体、国际传播、科技内容、AI 工作流与个人项目。",
};

export default function QuestsPage() {
  return (
    <main className="site-container project-archive" id="main-content">
      <header className="project-archive-header">
        <div>
          <p className="project-archive-eyebrow font-pixel"><span>01 /</span> PROJECTS & PRACTICE</p>
          <h1>项目与实践<span aria-hidden="true">✳</span></h1>
          <p className="project-archive-intro">
            这里记录做过的项目、正在探索的方向，以及一些从兴趣出发的 Side Quests。
          </p>
        </div>
        <div className="project-archive-counter" aria-label={`共 ${quests.length} 个项目`}>
          <PixelIcon assetId="items.notebook" decorative width={52} height={52} />
          <div><span className="font-pixel">{String(quests.length).padStart(2, "0")}</span><span>段探索，持续发生。</span></div>
        </div>
      </header>
      <section className="project-archive-explorer" aria-label="筛选与浏览项目">
        <QuestExplorer quests={quests} />
      </section>
    </main>
  );
}
