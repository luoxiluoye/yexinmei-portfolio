import { FooterCatEasterEgg } from "@/components/game/footer-cat-easter-egg";
import { PixelIcon } from "@/components/ui/pixel-icon";

export function SiteFooter() {
  return (
    <footer className="mt-6 bg-background pb-4 lg:mt-8">
      <div className="site-container hidden lg:block">
        <div className="pixel-cut-frame">
          <div className="pixel-cut-surface flex h-[82px] items-end justify-between px-3">
            <div className="relative h-full w-[280px] overflow-hidden">
              <PixelIcon
                assetId="world.grassShort"
                decorative
                width={270}
                height={90}
                className="absolute left-[48%] top-[70%] z-0 h-auto w-[270px] max-w-none"
                style={{ transform: "translate(-50%, -49%)" }}
              />
              <PixelIcon
                assetId="world.castle"
                decorative
                width={86}
                height={86}
                className="absolute left-[18%] top-[70%] z-10 h-auto w-[86px]"
                style={{ transform: "translate(-50%, -85.2%)" }}
              />
              <PixelIcon
                assetId="world.pineTree"
                decorative
                width={56}
                height={75}
                className="absolute left-[47%] top-[70%] z-10 h-auto w-[56px]"
                style={{ transform: "translate(-50%, -82.9%)" }}
              />
              <PixelIcon
                assetId="world.tree"
                decorative
                width={58}
                height={77}
                className="absolute left-[72%] top-[70%] z-10 h-auto w-[58px]"
                style={{ transform: "translate(-50%, -89.4%)" }}
              />
            </div>

            <div className="mb-3 min-w-[430px] border-2 border-border bg-paper px-8 py-2 text-center font-pixel text-[13px]">
              <span className="text-accent">●</span>
              <span className="ml-3">Stay curious. Keep building. Make impact.</span>
            </div>

            <FooterCatEasterEgg />
          </div>
        </div>
      </div>

      <div className="site-container py-4 text-center text-xs text-muted lg:hidden">
        © 2026 YEXINMEI LUO · Stay curious. Keep building.
      </div>
    </footer>
  );
}
