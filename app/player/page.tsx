import type { Metadata } from "next";
import { Link } from "next-view-transitions";

import { FunFactsInspect } from "@/components/player/fun-facts-inspect";
import { JourneyArchive } from "@/components/player/journey-archive";
import { PlayerSnapshot } from "@/components/player/player-snapshot";
import { XPBar } from "@/components/ui/xp-bar";
import { profile } from "@/data/profile";

export const metadata: Metadata = {
  title: "关于我",
  description: "罗叶馨梅的个人经历、成长路径与内容、产品和 AI 实践。",
};

export default function PlayerPage() {
  return (
    <main className="site-container pb-12 pt-6 lg:pb-16 lg:pt-10">
      <section className="grid items-center gap-8 border-b border-divider pb-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-12 lg:pb-14">
        <div className="min-w-0 lg:pr-2">
          <p className="font-pixel text-[11px] tracking-[0.08em] text-accent">02 / PLAYER</p>
          <h1 className="mt-4 text-[42px] font-semibold leading-[1.06] tracking-[-0.04em] sm:text-[52px] lg:text-[64px]">
            罗叶馨梅
          </h1>
          <p className="mt-2 font-pixel text-[12px] tracking-[0.12em] text-muted">YEXINMEI LUO</p>

          <p className="mt-7 text-[20px] font-semibold leading-8 lg:text-[24px]">内容 × 产品 × AI</p>
          <p className="mt-4 max-w-[600px] text-[15px] leading-7 text-muted lg:text-[16px] lg:leading-8">
            从广播电视编导到新闻与传播，再到社区内容、新品运营与 AI 产品实践。我喜欢研究一件事为什么会让人停下来，也喜欢把一个想法真正做成可以被使用、被体验的东西。
          </p>

          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[13px] leading-6 text-muted">
            <span>成都</span>
            <span>电子科技大学 · 新闻与传播硕士</span>
            <span>内容运营 / AI 产品 / 科技内容</span>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/quests"
              className="inline-flex min-h-11 items-center justify-center border-2 border-border bg-foreground px-4 font-pixel text-[11px] text-white transition-[transform,border-color,background-color] duration-100 hover:-translate-y-px hover:border-accent hover:bg-accent"
            >
              看我的项目 →
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-11 items-center justify-center border-2 border-border bg-paper px-4 font-pixel text-[11px] transition-[transform,border-color,color] duration-100 hover:-translate-y-px hover:border-accent hover:text-accent"
            >
              联系我 ↗
            </Link>
          </div>

          <div className="mt-8 max-w-[290px] border-t border-divider pt-4 opacity-75">
            <XPBar
              level={profile.xp.level}
              current={profile.xp.current}
              max={profile.xp.max}
              label="SIDE QUEST XP"
            />
          </div>
        </div>

        <div className="min-w-0">
          <PlayerSnapshot />
        </div>
      </section>

      <section className="py-10 lg:py-14" aria-labelledby="journey-heading">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="font-pixel text-[10px] tracking-[0.08em] text-accent">JOURNEY / 01—07</p>
            <h2 id="journey-heading" className="mt-2 text-[30px] font-semibold tracking-[-0.03em] lg:text-[38px]">
              一路做过的事
            </h2>
          </div>
          <p className="max-w-[420px] text-[13px] leading-6 text-muted sm:text-right">
            时间线负责导航，当前经历负责讲故事。点选节点查看，再打开完整档案。
          </p>
        </div>
        <JourneyArchive />
      </section>

      <section className="grid gap-10 border-t border-divider py-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 lg:py-14">
        <div>
          <p className="font-pixel text-[10px] tracking-[0.08em] text-accent">A LITTLE MORE</p>
          <h2 className="mt-2 text-[28px] font-semibold tracking-[-0.03em] lg:text-[34px]">我在意什么</h2>
          <div className="mt-5 max-w-[620px] space-y-4 text-[15px] leading-7 text-muted">
            <p>
              我做过传统媒体、国际传播、新媒体和社区内容，也一直在折腾自己的项目。工作之外会写科技内容、摄影、研究新工具，也会把灵感做成真正能跑起来的小产品。
            </p>
            <p>
              到现在我仍然很喜欢观察：什么内容会让人停下来，什么体验会让人愿意继续，以及一个想法怎样从“有意思”变成“真的有人用”。
            </p>
          </div>
        </div>

        <div>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="font-pixel text-[10px] tracking-[0.08em] text-accent">SIDE QUESTS</p>
              <h2 className="mt-2 text-[28px] font-semibold tracking-[-0.03em] lg:text-[34px]">一些关于我的小事</h2>
            </div>
          </div>
          <FunFactsInspect />
        </div>
      </section>
    </main>
  );
}
