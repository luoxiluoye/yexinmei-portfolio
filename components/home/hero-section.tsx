import { homeContent } from "@/data/home";
import { DataBadges } from "@/components/home/data-badges";
import { PixelButton } from "@/components/ui/pixel-button";
import { CharacterScene } from "@/components/scenes/character-scene";

export function HeroSection() {
  return (
    <section className="site-container home-intro pt-4 lg:pt-8">
      <div className="grid gap-4 lg:grid-cols-[45fr_55fr] lg:items-center lg:gap-5">
        <div className="order-1 py-2 lg:py-4">
          <p className="font-pixel text-[11px] text-muted lg:text-[12px]">
            {homeContent.eyebrow}
          </p>

          <h1 className="mt-3">
            <span className="font-pixel-zh block text-[clamp(48px,12vw,60px)] leading-[1.02] tracking-[-0.01em] lg:text-[58px]">
              {homeContent.titleZh}
              <span className="ml-2 align-top font-pixel text-[0.30em] text-accent">♥</span>
            </span>
            <span className="mt-1.5 block font-pixel text-[16px] uppercase tracking-[-0.02em] text-muted lg:text-[19px]">
              {homeContent.titleEn}
            </span>
          </h1>

          <p className="mt-4 font-pixel text-[11px] tracking-[0.06em] text-accent">{homeContent.keywords.join(" / ")}</p>

          <p className="mt-3 text-[13px] font-semibold text-foreground lg:text-[14px]">
            {homeContent.directionZh}
          </p>

          <p className="mt-3 max-w-[560px] text-[15px] leading-[26px] text-muted lg:text-[16px]">
            {homeContent.intro}
          </p>

          <div className="mt-4 flex max-w-[560px] items-center gap-2 py-1.5">
            <span className="h-2 w-2 shrink-0 bg-accent" aria-hidden="true" />
            <span className="font-pixel text-[9px] text-muted">NOW PLAYING</span>
            <span className="min-w-0 truncate text-[12px] font-medium">知乎数码 / 新品运营</span>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <PixelButton href="/quests/red-leaf" variant="primary" className="flex-1 sm:flex-none">
              探索赤页 →
            </PixelButton>
            <PixelButton href="/portfolio" variant="secondary" className="flex-1 sm:flex-none">
              进入作品集
            </PixelButton>
            <PixelButton href="/player" variant="ghost" className="flex-1 sm:flex-none">
              关于我
            </PixelButton>
          </div>

          <div className="mt-4 hidden max-w-[560px] lg:block">
            <DataBadges />
          </div>
        </div>

        <div className="order-2">
          <CharacterScene variant="home" bubbleText={homeContent.bubble} />
        </div>
      </div>

      <div className="mt-4 lg:hidden">
        <DataBadges />
      </div>
    </section>
  );
}
