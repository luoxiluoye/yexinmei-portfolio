import type { Metadata } from "next";
import { Link } from "next-view-transitions";

import { RealImage } from "@/components/media/real-image";
import { OwnedChannels } from "@/components/quests/owned-channels";
import { QuestExplorer } from "@/components/quests/quest-explorer";
import { PixelIcon } from "@/components/ui/pixel-icon";
import { quests } from "@/data/quests";
import { redLeafGallery } from "@/lib/real-assets";
import "@/styles/quest-board.css";

export const metadata: Metadata = {
  title: "项目经历与作品",
  description: "罗叶馨梅的项目与实践：内容运营、AI 产品、社区运营、新媒体、国际传播、科技内容与个人项目。",
};

export default function QuestsPage() {
  return (
    <main className="site-container quest-board" id="main-content">
      <header className="qb-page-header">
        <div>
          <p className="qb-eyebrow font-pixel">01 / QUEST BOARD</p>
          <h1>项目与实践</h1>
          <p className="qb-intro">从内容运营到 AI 产品，看看我做过什么，以及怎样把想法落地。</p>
        </div>
        <div className="qb-project-count">
          <PixelIcon assetId="items.notebook" decorative width={26} height={26} />
          <span><strong>{String(quests.length + 1).padStart(2, "0")}</strong> 项项目</span>
        </div>
      </header>

      <section className="qb-feature" aria-labelledby="red-leaf-feature-title">
        <div className="qb-feature-copy">
          <p className="qb-eyebrow"><span className="qb-main-marker" />主线任务 <span className="qb-label-divider">/</span> AI 互动叙事产品</p>
          <h2 id="red-leaf-feature-title">赤页 <span className="font-pixel">RED LEAF</span></h2>
          <p className="qb-feature-lead">把知乎里的故事，变成可以走进去玩的世界。</p>
          <p className="qb-feature-description">独立完成的 AI 产品，将故事解析为人物、线索与剧情分支，生成可以直接游玩的文字冒险。</p>
          <div className="qb-feature-metrics">
            <Metric value="≈ 5 MIN" label="生成一局" />
            <Metric value="50" label="决策位置" />
            <Metric value="28" label="结局" />
          </div>
          <div className="qb-feature-actions">
            <Link href="/quests/red-leaf" className="qb-button qb-button-primary">查看完整案例 <span aria-hidden="true">→</span></Link>
            <a href="https://zhihu.hegelsalon.com/" target="_blank" rel="noreferrer" className="qb-button qb-button-secondary">在线体验 <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <Link href="/quests/red-leaf" className="qb-feature-preview" aria-label="查看赤页 RED LEAF 完整案例" style={{ viewTransitionName: "red-leaf-hero" }}>
          <div className="qb-preview-image"><RealImage asset={redLeafGallery[0]} sizes="(max-width: 639px) calc(100vw - 64px), 340px" priority /></div>
          <div className="qb-preview-caption"><span>真实产品画面</span><span>查看产品过程 →</span></div>
        </Link>
      </section>

      <section className="qb-projects" aria-labelledby="other-quests-title">
        <div className="qb-section-heading">
          <div><p className="qb-eyebrow font-pixel">SIDE QUESTS</p><h2 id="other-quests-title">更多项目与实践</h2></div>
          <p>点击卡片，查看过程与成果</p>
        </div>
        <QuestExplorer quests={quests} />
      </section>

      <OwnedChannels />
    </main>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return <div><strong className="font-pixel">{value}</strong><span>{label}</span></div>;
}
