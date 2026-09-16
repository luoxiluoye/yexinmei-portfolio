import type { Metadata } from "next";
import Image from "next/image";
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

      <section
        className="relative mb-12 overflow-hidden bg-[#0b0c0e] text-white lg:mb-16"
        aria-labelledby="featured-quest-title"
      >
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rotate-12 border-[28px] border-[#ef3340]/15" aria-hidden="true" />
        <div className="pointer-events-none absolute bottom-0 left-[43%] h-px w-[46%] bg-gradient-to-r from-[#ef3340] via-[#ef3340]/40 to-transparent" aria-hidden="true" />

        <div className="relative grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-center lg:gap-12 lg:px-10 lg:py-12 xl:px-12">
          <div className="max-w-[560px]">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 bg-[#ef3340]" aria-hidden="true" />
              <p className="font-pixel text-[9px] tracking-[0.12em] text-[#ff5963]">FEATURED QUEST / 00</p>
            </div>

            <h2 id="featured-quest-title" className="mt-5 text-[40px] font-semibold leading-[0.96] tracking-[-0.045em] sm:text-[48px] lg:text-[56px] xl:text-[62px]">
              赤页 <span className="text-[#ff424b]">RED LEAF</span>
            </h2>
            <p className="mt-5 max-w-[500px] text-[20px] font-semibold leading-8 tracking-[-0.02em] sm:text-[22px] lg:text-[24px] lg:leading-9">
              把知乎里的故事，变成可以走进去玩的世界。
            </p>
            <p className="mt-5 max-w-[520px] text-[14px] leading-7 text-white/62 lg:text-[15px]">
              从 0 到 1 完成的 AI 互动叙事产品。把知乎故事、盐选内容或回答解析成人物、场景、剧情分支、玩家选择与多结局，再生成一款真正可以玩的文字冒险游戏。
            </p>

            <div className="mt-7 grid grid-cols-3 border-y border-white/12 py-5">
              <Metric value="≈ 5 MIN" label="生成一局" />
              <Metric value="3,608" label="资源文件" />
              <Metric value="8.75 GiB" label="资源体量" />
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/quests/red-leaf"
                className="inline-flex min-h-11 items-center justify-center bg-white px-4 font-pixel text-[9px] text-[#0b0c0e] transition-[transform,background-color,color] duration-100 hover:-translate-y-px hover:bg-[#ff424b] hover:text-white"
              >
                查看完整案例 →
              </Link>
              <a
                href="https://zhihu.hegelsalon.com/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center justify-center border border-white/25 px-4 font-pixel text-[9px] text-white transition-[transform,border-color,color] duration-100 hover:-translate-y-px hover:border-[#ff424b] hover:text-[#ff5963]"
              >
                在线体验 ↗
              </a>
            </div>
          </div>

          <div className="relative lg:pl-2">
            <div className="absolute -bottom-3 -right-3 h-full w-full bg-[#ef3340] opacity-70" aria-hidden="true" />
            <div className="relative overflow-hidden border border-white/15 bg-[#111317] shadow-[0_30px_80px_rgba(0,0,0,.35)]">
              <div className="flex min-h-10 items-center justify-between border-b border-white/10 px-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-[#ff424b]" />
                  <span className="font-pixel text-[8px] tracking-[0.09em] text-white/72">RED LEAF / REAL PRODUCT</span>
                </div>
                <span className="font-pixel text-[8px] text-white/32">知乎故事书库</span>
              </div>

              <div className="relative overflow-hidden bg-[#111317]">
                <Image
                  src="/assets/projects/red-leaf/library.webp"
                  alt="赤页 RED LEAF 知乎故事书库真实产品界面"
                  width={900}
                  height={469}
                  sizes="(max-width: 1023px) 100vw, 58vw"
                  className="h-auto w-full object-cover object-top"
                  priority
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#090a0c] via-[#090a0c]/55 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                  <div>
                    <p className="font-pixel text-[8px] text-[#ff5963]">REAL PRODUCT SCREENSHOT</p>
                    <p className="mt-1 text-[15px] font-medium text-white sm:text-[18px]">知乎故事书库 · 《重生周》</p>
                  </div>
                  <span className="hidden font-pixel text-[8px] text-white/45 sm:block">50 决策位置 · 28 个结局</span>
                </div>
              </div>
            </div>
            <p className="mt-4 text-right font-pixel text-[7px] tracking-[0.08em] text-muted">REAL INTERFACE · RED LEAF ARCHIVE</p>
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

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="min-w-0 px-2 first:pl-0 last:pr-0 sm:px-4">
      <p className="font-pixel text-[11px] text-white sm:text-[13px]">{value}</p>
      <p className="mt-1 text-[10px] leading-4 text-white/35">{label}</p>
    </div>
  );
}
