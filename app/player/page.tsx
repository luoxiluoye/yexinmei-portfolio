import type { Metadata } from "next";

import { FunFactsInspect, JourneyArchive } from "@/components/player/player-interactions";
import { CharacterScene } from "@/components/scenes/character-scene";
import { PixelPanel } from "@/components/ui/pixel-panel";
import { PixelTag } from "@/components/ui/pixel-tag";
import { XPBar } from "@/components/ui/xp-bar";
import { profile } from "@/data/profile";

export const metadata: Metadata = {
  title: "关于我",
  description: "罗叶馨梅的个人经历、成长路径与内容运营方向。",
};

export default function PlayerPage() {
  return (
    <main className="site-container py-5 lg:py-8">
      <header className="mb-5 lg:mb-8">
        <p className="font-pixel text-[12px] text-muted">02. PLAYER</p>
        <h1 className="rpg-page-title mt-2">PLAYER PROFILE</h1>
      </header>

      <section className="grid gap-4 lg:grid-cols-[40fr_60fr] lg:items-start lg:gap-5">
        <CharacterScene variant="player" />

        <PixelPanel eyebrow="PLAYER" title={profile.nameEn.toUpperCase()} accent>
          <div className="grid gap-5 lg:grid-cols-[1fr_170px]">
            <dl className="space-y-4">
              <ProfileRow label="Name" value={profile.nameZh} />
              <ProfileRow label="Base" value={profile.base} />
              <ProfileRow label="Education" value={profile.education} />
              <ProfileRow label="Keywords" value={profile.keywords.join(" / ")} />
              <ProfileRow label="Class" value={profile.className.join(" / ")} />
            </dl>

            <div className="border-t border-divider pt-4 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
              <PixelTag variant="active" dot>ACTIVE</PixelTag>
              <div className="mt-5">
                <XPBar level={28} current={7888} max={10000} label="XP" />
              </div>
              <p className="mt-5 text-[13px] leading-6 text-muted">{profile.status}</p>
            </div>
          </div>
        </PixelPanel>
      </section>

      <section className="mt-5 grid gap-4 pb-8 lg:mt-8 lg:grid-cols-[28fr_42fr_30fr] lg:items-stretch lg:gap-5 lg:pb-0">
        <PixelPanel
          eyebrow="STORY"
          title="CHARACTER STORY"
          className="h-full"
          surfaceClassName="h-full"
        >
          <div className="space-y-4 text-[15px] leading-[26px] text-muted">
            {profile.introLong.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </PixelPanel>

        <PixelPanel
          eyebrow="WORLD MAP"
          title="JOURNEY"
          windowChrome={false}
          rightSlot={<span className="font-pixel text-[9px] text-muted">PATH 01—07</span>}
          className="h-full"
          surfaceClassName="h-full"
        >
          <JourneyArchive />
        </PixelPanel>

        <PixelPanel
          eyebrow="INTERESTS"
          title="FUN FACTS"
          className="h-full"
          surfaceClassName="h-full"
        >
          <FunFactsInspect />
        </PixelPanel>
      </section>
    </main>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[116px_1fr] sm:gap-4">
      <dt className="font-pixel text-[12px] text-muted">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
