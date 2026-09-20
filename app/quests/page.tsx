import type { Metadata } from "next";
import { RealImage } from "@/components/media/real-image";
import { redLeafGallery } from "@/lib/real-assets";
import { Link } from "next-view-transitions";

import { OwnedChannels } from "@/components/quests/owned-channels";
import { QuestExplorer } from "@/components/quests/quest-explorer";
import { PixelIcon } from "@/components/ui/pixel-icon";
import { PixelPanel } from "@/components/ui/pixel-panel";
import { quests } from "@/data/quests";

export const metadata: Metadata = {
  title: "项目经历与作品",
  description: "罗叶馨梅的项目与实践：内容运营、AI 产品、社区运营、新媒体、国际传播、科技内容与个人项目。",
};

export default function QuestsPage() {
  return (
    <main className="site-container py-5 lg:py-8" id="main-content">
      <header className="mb-5 flex flex-col justify-between gap-4 border-b-2 border-border pb-5 lg:flex-row lg:items-end">
        <div>
          <p className="font-pixel text-[10px] text-accent">01 / QUEST BOARD</p>
          <h1 className="mt-2 font-pixel-zh text-[38px] leading-none lg:text-[48px]">项目与实践</h1>
          <p className="mt-3 max-w-2xl text-[13px] leading-6 text-muted">
            主线、支线和一些从兴趣开始的任务。想快速看就扫任务板，想看细节再进入对应 Case File。
          </p>
        </div>
        <div className="flex items-center gap-3 border border-divider bg-soft px-3 py-2">
          <PixelIcon assetId="items.notebook" decorative width={30} height={30} />
          <div>
            <span className="block font-pixel text-[13px]">07 QUESTS</span>
            <span className="text-[10px] text-muted">持续更新中</span>
          </div>
        </div>
      </header>

      <PixelPanel
        eyebrow="MAIN QUEST · AI PRODUCT"
        title="赤页 RED LEAF"
        accent
        interactive
        className="mb-5"
        contentClassName="p-3 lg:p-4"
        rightSlot={<span className="font-pixel text-[9px] text-accent">0→1 / PLAYABLE</span>}
      >
        <div className="grid gap-4 lg:grid-cols-[1fr_360px] lg:items-center">
          <div className="min-w-0">
            <p className="text-[17px] font-bold leading-6 lg:text-[19px]">把知乎里的故事，变成可以走进去玩的世界。</p>
            <p className="mt-2 max-w-2xl text-[12px] leading-5 text-muted">
              独立完成的 AI 互动叙事产品。故事进入系统后，会被解析成人物、线索与剧情分支，再生成可以直接游玩的文字冒险。
            </p>

            <div className="mt-3 grid grid-cols-3 border-y border-divider py-2.5">
              <Metric value="≈ 5 MIN" label="生成一局" />
              <Metric value="50" label="决策位置" />
              <Metric value="28" label="结局" />
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/quests/red-leaf" className="inline-flex min-h-9 items-center border-2 border-border bg-foreground px-3 font-pixel text-[9px] text-white transition-[transform,background-color] hover:-translate-y-px hover:bg-accent">
                ENTER CASE FILE →
              </Link>
              <a href="https://zhihu.hegelsalon.com/" target="_blank" rel="noreferrer" className="inline-flex min-h-9 items-center border border-border bg-paper px-3 font-pixel text-[9px] transition-[transform,border-color,color] hover:-translate-y-px hover:border-accent hover:text-accent">
                PLAY ONLINE ↗
              </a>
            </div>
          </div>

          <Link
            href="/quests/red-leaf"
            className="group relative block overflow-hidden border-2 border-border bg-[#111317]"
            aria-label="查看赤页 RED LEAF 完整案例"
            style={{ viewTransitionName: "red-leaf-hero" }}
          >
            <div className="flex h-8 items-center justify-between border-b border-white/10 px-3 text-white">
              <span className="font-pixel text-[8px] text-[#ff5963]">REAL PRODUCT</span>
              <span className="font-pixel text-[7px] text-white/45">《重生周》</span>
            </div>
            <RealImage asset={redLeafGallery[0]} sizes="(max-width: 1023px) 320px, 360px" className="h-[110px]! w-full object-contain" priority />
          </Link>
        </div>
      </PixelPanel>

      <OwnedChannels />

      <section aria-labelledby="other-quests-title">
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <p className="font-pixel text-[9px] text-accent">SIDE QUESTS</p>
            <h2 id="other-quests-title" className="mt-1 text-[22px] font-bold">其他任务</h2>
          </div>
          <span className="font-pixel text-[9px] text-muted">SELECT A QUEST →</span>
        </div>
        <QuestExplorer quests={quests} />
      </section>
    </main>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="min-w-0 border-r border-divider px-2 first:pl-0 last:border-r-0 last:pr-0 sm:px-3">
      <p className="font-pixel text-[11px] text-foreground">{value}</p>
      <p className="mt-0.5 text-[9px] text-muted">{label}</p>
    </div>
  );
}
