import { homeContent } from "@/data/home";
import { PixelButton } from "@/components/ui/pixel-button";
import { PixelTag } from "@/components/ui/pixel-tag";
import { CharacterScene } from "@/components/scenes/character-scene";

export function HeroSection() {
  return (
    <section className="site-container pt-4 lg:pt-8">
      <div className="grid gap-4 lg:grid-cols-[45fr_55fr] lg:items-center lg:gap-5">
        <div className="order-2 py-2 lg:order-1 lg:py-8">
          <div className="hidden flex-wrap items-center gap-2 lg:flex">
            <PixelTag variant="active" dot>PLAYER ONLINE</PixelTag>
            <PixelTag>STILL LEVELING UP</PixelTag>
          </div>

          <p className="mt-2 font-pixel text-[12px] text-muted lg:mt-6">
            {homeContent.eyebrow}
          </p>

          <h1 className="mt-3">
            <span className="block text-[clamp(46px,12vw,58px)] font-black leading-[1.05] tracking-[-0.04em] lg:text-[64px]">
              {homeContent.titleZh}
              <span className="ml-2 align-top text-[0.34em] text-accent">♥</span>
            </span>
            <span className="mt-2 block font-pixel text-[18px] uppercase tracking-[0.04em] text-muted lg:text-[21px]">
              {homeContent.titleEn}
            </span>
          </h1>

          <div className="mt-4 inline-flex bg-foreground px-3 py-1.5 text-[12px] text-white">
            {homeContent.keywords.join(" / ")}
          </div>

          <p className="mt-5 max-w-[560px] text-[15px] leading-[26px] text-muted lg:text-[16px]">
            {homeContent.intro}
          </p>

          <div className="mt-5 grid gap-2 sm:flex sm:flex-wrap">
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
