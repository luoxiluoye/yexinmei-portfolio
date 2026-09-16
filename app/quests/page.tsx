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
                  <span className="font-pixel text-[8px] tracking-[0.09em] text-white/72">RED LEAF / PRODUCT VIEW</span>
                </div>
                <span className="font-pixel text-[8px] text-white/32">STORY → PLAYABLE WORLD</span>
              </div>

              <div className="grid min-h-[360px] grid-cols-[86px_minmax(0,1fr)] sm:grid-cols-[112px_minmax(0,1fr)] lg:min-h-[430px]">
                <aside className="border-r border-white/10 bg-[#0d0e10] p-3 sm:p-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-[#e6323f] sm:h-10 sm:w-10" aria-hidden="true" />
                    <div className="hidden sm:block">
                      <p className="font-pixel text-[8px] text-white">赤页</p>
                      <p className="mt-0.5 font-pixel text-[6px] text-white/38">RED LEAF</p>
                    </div>
                  </div>
                  <div className="mt-8 space-y-5 font-pixel text-[7px] leading-4 text-white/30 sm:text-[8px]">
                    <p className="text-[#ff5963]">知乎故事书库</p>
                    <p>新故事工作台</p>
                    <p>我的存档</p>
                    <p>结局档案</p>
                  </div>
                  <div className="mt-8 h-px bg-white/10" />
                  <p className="mt-4 hidden text-[8px] leading-4 text-white/24 sm:block">原作在这里，下一步由你。</p>
                </aside>

                <div className="relative overflow-hidden p-5 sm:p-7 lg:p-8">
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <p className="font-pixel text-[7px] tracking-[0.1em] text-white/30">ZHIHU STORIES / RED LEAF EDITION</p>
                      <h3 className="mt-3 text-[24px] font-semibold tracking-[-0.035em] sm:text-[30px] lg:text-[34px]">知乎故事书库<span className="text-[#ff424b]">。</span></h3>
                    </div>
                    <div className="text-right">
                      <p className="font-pixel text-[22px] text-white sm:text-[28px]">21</p>
                      <p className="text-[10px] text-white/35">篇原作</p>
                    </div>
                  </div>

                  <div className="relative mt-7 overflow-hidden border border-white/10 bg-[#16181b] p-5 sm:p-6 lg:p-7">
                    <div className="absolute inset-y-0 right-0 w-[43%] bg-[radial-gradient(circle_at_60%_42%,rgba(255,255,255,.15),transparent_30%),linear-gradient(135deg,#283039,#121417_70%)]" aria-hidden="true" />
                    <div className="absolute bottom-0 right-[6%] h-[72%] w-[30%] border-l border-white/10 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,.025))]" aria-hidden="true" />
                    <div className="relative z-10 max-w-[68%]">
                      <p className="font-pixel text-[8px] text-[#76aaff]">知乎 / 原作精选</p>
                      <h4 className="mt-5 text-[20px] font-semibold leading-7 tracking-[-0.025em] sm:text-[24px] sm:leading-8 lg:text-[27px]">
                        末日的45度角躺平：<br className="hidden sm:block" />重生周
                      </h4>
                      <p className="mt-4 max-w-[420px] text-[11px] leading-5 text-white/45 sm:text-[12px] sm:leading-6">
                        重回改变前七天，你能否留住身边的人？阅读剧情、选择分支，走向属于你的结局。
                      </p>
                      <div className="mt-5 inline-flex min-h-9 items-center bg-[#ef3340] px-3 font-pixel text-[8px] text-white">
                        翻开这个故事 →
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                    <div>
                      <p className="font-pixel text-[7px] text-[#ff5963]">FEATURED STORY</p>
                      <p className="mt-1 text-[13px] font-medium">《重生周》</p>
                    </div>
                    <p className="text-[10px] text-white/35">50 个决策位置 · 20 个常规结局 · 8 个失败结局</p>
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-4 text-right font-pixel text-[7px] tracking-[0.08em] text-muted">INTERFACE OVERVIEW · LIVE PRODUCT AVAILABLE</p>
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
