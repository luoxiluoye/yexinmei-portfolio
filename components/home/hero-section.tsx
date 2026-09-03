import { homeContent } from "@/data/home";
import { DataBadges } from "@/components/home/data-badges";
import { PixelButton } from "@/components/ui/pixel-button";
import { CharacterScene } from "@/components/scenes/character-scene";

export function HeroSection() {
  return (
    <section className="site-container pt-4 lg:pt-8">
      <div className="grid gap-4 lg:grid-cols-[45fr_55fr] lg:items-center lg:gap-5">
        <div className="order-2 py-2 lg:order-1 lg:py-4">
          <p className="font-pixel text-[11px] text-muted lg:text-[12px]">
            {homeContent.eyebrow}
          </p>

          <h1 className="mt-3">
            <span className="block text-[clamp(46px,12vw,58px)] font-black leading-[1.02] tracking-[-0.045em] lg:text-[64px]">
              {homeContent.titleZh}
              <span className="ml-2 align-top text-[0.34em] text-accent">♥</span>
            </span>
            <span className="mt-1.5 block font-pixel text-[16px] uppercase tracking-[-0.02em] text-muted lg:text-[19px]">
              {homeContent.titleEn}
            </span>
          </h1>

          <div className="mt-4 inline-grid max-w-full grid-cols-[auto_minmax(0,1fr)] border-2 border-border bg-paper shadow-[2px_2px_0_rgba(17,17,17,.10)]">
            <span className="flex items-center bg-foreground px-2.5 py-2 font-pixel text-[10px] leading-none text-white lg:px-3 lg:text-[11px]">
              CLASS
            </span>
            <span className="min-w-0 px-3 py-1.5 text-[12px] font-semibold leading-5 text-foreground lg:px-3.5 lg:py-2 lg:text-[13px]">
              {homeContent.keywords.join(" · ")}
            </span>
          </div>

          <p className="mt-4 max-w-[560px] text-[15px] leading-[26px] text-muted lg:text-[16px]">
            {homeContent.intro}
          </p>

          <div className="mt-4 max-w-[560px]">
            <DataBadges />
          </div>

          <div className="mt-4 grid gap-2 sm:flex sm:flex-wrap">
            <PixelButton href="/quests" variant="primary" className="w-full sm:w-auto">
              {homeContent.ctaPrimary} →
            </PixelButton>
            <PixelButton href="/player" variant="secondary" className="w-full sm:w-auto">
              {homeContent.ctaSecondary}
            </PixelButton>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <CharacterScene variant="home" bubbleText={homeContent.bubble} />
        </div>
      </div>
    </section>
  );
}
