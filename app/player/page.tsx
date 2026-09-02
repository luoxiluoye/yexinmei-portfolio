import { profile } from "@/data/profile";
import { CharacterScene } from "@/components/scenes/character-scene";
import { PixelIcon } from "@/components/ui/pixel-icon";
import { PixelPanel } from "@/components/ui/pixel-panel";
import { PixelTag } from "@/components/ui/pixel-tag";
import { XPBar } from "@/components/ui/xp-bar";

const journey = [
  "编导与影像",
  "传统媒体",
  "国际传播",
  "新媒体运营",
  "社区与新品",
  "个人项目",
  "NOW",
];

const facts = [
  ["items.camera", "卖过 20W+ 的 CCD"],
  ["items.notebook", "会为了一个选题翻很多资料"],
  ["items.camera", "相机既是爱好，也是生产工具"],
  ["ui.sparkle", "喜欢研究内容为什么会火"],
  ["cat.head", "猫咪是本站常驻 NPC"],
] as const;

export default function PlayerPage() {
  return (
    <main className="site-container py-4 lg:py-8">
      <header className="mb-4 lg:mb-8">
        <p className="font-pixel text-[12px] text-muted">02. PLAYER</p>
        <h1 className="rpg-page-title mt-2">PLAYER PROFILE</h1>
      </header>

      <section className="grid gap-4 lg:grid-cols-[40fr_60fr] lg:gap-5">
        <CharacterScene variant="player" className="min-h-[340px] lg:min-h-[410px]" />

        <PixelPanel eyebrow="PLAYER" title={profile.nameEn.toUpperCase()} accent>
          <div className="grid gap-5 lg:grid-cols-[1fr_160px]">
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

      <section className="mt-4 grid gap-4 pb-8 lg:mt-8 lg:grid-cols-[30fr_40fr_30fr] lg:gap-5 lg:pb-0">
        <PixelPanel eyebrow="STORY" title="CHARACTER STORY">
          <div className="space-y-4 text-[15px] leading-[26px] text-muted">
            {profile.introLong.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </PixelPanel>

        <PixelPanel eyebrow="WORLD MAP" title="JOURNEY">
          <div className="hidden items-center justify-between gap-2 lg:flex">
            {journey.map((item, index) => (
              <div key={item} className="flex min-w-0 flex-1 items-center gap-2">
                <div className="flex min-h-[78px] flex-1 items-center justify-center border border-divider bg-soft px-2 text-center text-[13px] leading-5">
                  {item}
                </div>
                {index < journey.length - 1 && (
                  <PixelIcon assetId="ui.arrow" decorative width={18} height={18} />
                )}
              </div>
            ))}
          </div>

          <div className="lg:hidden">
            {journey.map((item, index) => (
              <div key={item} className="grid grid-cols-[28px_1fr] gap-3">
                <div className="flex flex-col items-center">
                  <span className="mt-1 h-3 w-3 border border-border bg-accent" />
                  {index < journey.length - 1 && <span className="h-10 w-[2px] bg-divider" />}
                </div>
                <div className="pb-4 text-[14px]">{item}</div>
              </div>
            ))}
          </div>
        </PixelPanel>

        <PixelPanel eyebrow="INTERESTS" title="FUN FACTS">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            {facts.map(([assetId, fact]) => (
              <div
                key={fact}
                className="flex min-h-[64px] items-center gap-3 border border-divider bg-soft p-3"
              >
                <PixelIcon assetId={assetId} decorative width={28} height={28} />
                <span className="text-sm leading-6">{fact}</span>
              </div>
            ))}
          </div>
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
