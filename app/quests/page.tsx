import type { Metadata } from "next";
import { Link } from "next-view-transitions";

import { QuestExplorer } from "@/components/quests/quest-explorer";
import { PixelIcon } from "@/components/ui/pixel-icon";
import { quests } from "@/data/quests";

export const metadata: Metadata = {
  title: "项目经历与作品",
  description: "罗叶馨梅的项目与实践：内容运营、AI 产品、社区运营、新媒体、国际传播、科技内容与个人项目。",
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
        <div className="project-archive-counter" aria-label="项目仍在持续增加">
          <PixelIcon assetId="items.notebook" decorative width={52} height={52} />
          <div><span className="font-pixel">06+</span><span>段探索，持续发生。</span></div>
        </div>
      </header>

      <section className="mb-10 border-y border-divider py-7 lg:mb-14 lg:py-9" aria-labelledby="featured-quest-title">
        <div className="grid items-center gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:gap-10">
          <div>
            <p className="font-pixel text-[9px] tracking-[0.08em] text-accent">FEATURED QUEST / 00</p>
            <h2 id="featured-quest-title" className="mt-3 text-[30px] font-semibold tracking-[-0.03em] lg:text-[40px]">赤页 RED LEAF</h2>
            <p className="mt-3 text-[18px] font-semibold leading-7">把知乎里的故事，变成可以走进去玩的世界。</p>
            <p className="mt-4 max-w-[650px] text-[14px] leading-7 text-muted">
              从 0 到 1 完成的 AI 互动叙事产品：把知乎故事、盐选内容或回答解析成包含人物、场景、剧情分支、玩家选择与多结局的文字冒险游戏。
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-[11px] text-muted">
              <span className="border border-divider px-2.5 py-1.5">≈ 5 MIN 生成</span>
              <span className="border border-divider px-2.5 py-1.5">3,608 资源文件</span>
              <span className="border border-divider px-2.5 py-1.5">8.75 GiB</span>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/quests/red-leaf" className="inline-flex min-h-10 items-center border-2 border-border bg-foreground px-4 font-pixel text-[9px] text-white hover:border-accent hover:bg-accent">
                查看案例 →
              </Link>
              <a href="https://zhihu.hegelsalon.com/" target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center border-2 border-border px-4 font-pixel text-[9px] hover:border-accent hover:text-accent">
                在线体验 ↗
              </a>
            </div>
          </div>

          <div className="overflow-hidden border-2 border-border bg-[#0b0c0e]">
            <div className="flex min-h-10 items-center justify-between border-b border-white/10 px-3 text-white">
              <span className="font-pixel text-[8px]">RED LEAF / LIVE</span>
              <span className="h-2 w-2 bg-[#ff424b]" />
            </div>
            <div className="relative aspect-[16/9] min-h-[260px] overflow-hidden bg-[#111317]">
              <iframe
                src="https://zhihu.hegelsalon.com/"
                title="赤页 RED LEAF 产品预览"
                loading="lazy"
                tabIndex={-1}
                className="pointer-events-none absolute left-0 top-0 h-[128%] w-[128%] origin-top-left border-0 opacity-95 [transform:scale(.78125)]"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0b0c0e] to-transparent" />
              <p className="absolute bottom-4 left-4 font-pixel text-[9px] text-white">《重生周》 · 50 决策位置 · 28 个结局</p>
            </div>
          </div>
        </div>
      </section>

      <section className="project-archive-explorer" aria-label="筛选与浏览其他项目">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="font-pixel text-[9px] tracking-[0.08em] text-accent">OTHER QUESTS</p>
            <h2 className="mt-2 text-[26px] font-semibold tracking-[-0.03em]">其他项目</h2>
          </div>
        </div>
        <QuestExplorer quests={quests} />
      </section>
    </main>
  );
}
