import { RealGallery } from "@/components/media/real-gallery";
import { playerMemoryRoll } from "@/lib/real-assets";
import type { Metadata } from "next";
import { Link } from "next-view-transitions";

import { FunFactsInspect } from "@/components/player/fun-facts-inspect";
import { JourneyArchive } from "@/components/player/journey-archive";
import { PlayerSnapshot } from "@/components/player/player-snapshot";
import { XPBar } from "@/components/ui/xp-bar";
import { PixelIcon } from "@/components/ui/pixel-icon";
import { profile } from "@/data/profile";

export const metadata: Metadata = {
  title: "关于我",
  description: "罗叶馨梅的成长路径、个人经历与生活侧面。",
};

export default function PlayerPage() {
  return (
    <main id="main-content" className="site-container portfolio-page pb-12 pt-5 lg:pb-14 lg:pt-8">
      <header className="mb-5 flex flex-col justify-between gap-4 border-b-2 border-border pb-5 lg:flex-row lg:items-end">
        <div>
          <p className="font-pixel text-[10px] text-accent">02 / PLAYER FILE</p>
          <h1 className="mt-2 font-pixel-zh text-[38px] leading-none lg:text-[48px]">罗叶馨梅</h1>
          <p className="mt-3 max-w-2xl text-[13px] leading-6 text-muted">
            这里记录我的成长路径和生活侧面。项目在 QUESTS，能力与工具在 INVENTORY。
          </p>
        </div>
        <div className="flex items-center gap-3 border border-divider bg-soft px-3 py-2">
          <PixelIcon assetId="character.avatar" decorative width={30} height={30} />
          <div>
            <span className="block font-pixel text-[12px]">YEXINMEI LUO</span>
            <span className="text-[10px] text-muted">CHENGDU · 2027</span>
          </div>
        </div>
      </header>

      <section className="grid items-center gap-5 lg:grid-cols-[0.86fr_1.14fr] lg:gap-8" aria-labelledby="player-intro">
        <div className="player-summary min-w-0 p-5 lg:p-6">
          <p className="font-pixel text-[9px] text-accent">PLAYER PROFILE</p>
          <h2 id="player-intro" className="mt-3 text-[24px] font-semibold leading-8 tracking-[-0.02em] lg:text-[30px]">
            从编导、新闻传播，一路走到内容与互联网。
          </h2>
          <p className="mt-4 text-[14px] leading-7 text-muted">
            本科读广播电视编导，后来到电子科技大学读新闻与传播。做过传统媒体、国际传播、新媒体和社区内容，也一直喜欢摄影、科技和新工具。
          </p>

          <dl className="mt-5 grid gap-px border border-divider bg-divider grid-cols-3">
            <PlayerMeta label="城市" value="成都" />
            <PlayerMeta label="学校" value="电子科技大学" />
            <PlayerMeta label="毕业" value="2027" />
          </dl>

          <div className="mt-5 max-w-[300px]">
            <XPBar level={profile.xp.level} current={profile.xp.current} max={profile.xp.max} label="PLAYER XP" />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/quests" className="inline-flex min-h-11 items-center border border-border bg-foreground px-3 text-[13px] text-white hover:border-accent hover:bg-accent">
              查看项目 →
            </Link>
            <Link href="/inventory" className="inline-flex min-h-11 items-center border border-divider bg-paper px-3 text-[13px] hover:border-accent hover:text-accent">
              能力与工具 →
            </Link>
          </div>
        </div>

        <PlayerSnapshot />
      </section>

      <section className="player-memory my-5" aria-labelledby="photo-archive">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="photo-archive" className="font-pixel text-[10px] text-accent">照片里的日常</h2>
          <p className="text-[11px] text-muted">我自己，和镜头前的人。点击翻看，手机可横滑。</p>
        </div>
        <RealGallery images={playerMemoryRoll} layout="roll" />
      </section>

      <section className="border-t border-divider py-8 lg:py-10" aria-labelledby="journey-heading">
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="font-pixel text-[9px] text-accent">JOURNEY / 01—07</p>
            <h2 id="journey-heading" className="mt-1.5 text-[26px] font-semibold tracking-[-0.03em] lg:text-[32px]">一路怎么走到这里</h2>
          </div>
          <p className="max-w-[430px] text-[12px] leading-5 text-muted sm:text-right">
            点节点看完整经历。这里保留时间线，不再重复项目详情和技能清单。
          </p>
        </div>
        <JourneyArchive />
      </section>

      <section className="border-t border-divider py-8 lg:py-10" aria-labelledby="player-facts-heading">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="font-pixel text-[9px] text-accent">SIDE QUESTS</p>
            <h2 id="player-facts-heading" className="mt-1.5 text-[26px] font-semibold tracking-[-0.03em] lg:text-[32px]">一些更像我的小事</h2>
          </div>
          <span className="hidden font-pixel text-[9px] text-muted sm:block">INSPECT ITEM →</span>
        </div>
        <FunFactsInspect />
      </section>
    </main>
  );
}

function PlayerMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-background px-3 py-3">
      <dt className="text-[11px] text-muted">{label}</dt>
      <dd className="mt-1 text-[12px] font-medium">{value}</dd>
    </div>
  );
}
