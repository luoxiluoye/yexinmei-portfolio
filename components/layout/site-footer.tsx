import { PixelIcon } from "@/components/ui/pixel-icon";

export function SiteFooter() {
  return (
    <footer className="mt-8 border-t-2 border-border bg-background">
      <div className="site-container hidden h-[92px] items-end justify-between lg:flex">
        <div className="relative h-full w-[260px]">
          <PixelIcon
            assetId="world.grassLong"
            decorative
            width={236}
            height={118}
            className="absolute bottom-0 left-0 z-0 w-[236px]"
          />
          <PixelIcon
            assetId="world.castle"
            decorative
            width={70}
            height={70}
            className="absolute bottom-[16px] left-[10px] z-10"
          />
          <PixelIcon
            assetId="world.pineTree"
            decorative
            width={42}
            height={56}
            className="absolute bottom-[16px] left-[100px] z-10"
          />
          <PixelIcon
            assetId="world.tree"
            decorative
            width={52}
            height={69}
            className="absolute bottom-[16px] left-[160px] z-10"
          />
        </div>

        <div className="mb-4 border-2 border-border bg-paper px-8 py-2 font-pixel text-[13px]">
          <span className="text-accent">●</span>
          <span className="ml-3">Stay curious. Keep building.</span>
        </div>

        <div className="relative h-full w-[260px]">
          <PixelIcon
            assetId="cat.sit"
            decorative
            width={64}
            height={64}
            className="absolute bottom-[12px] right-[104px] z-10"
          />
          <div className="absolute bottom-[28px] right-0 flex gap-1.5">
            <PixelIcon assetId="ui.heart" decorative width={22} height={22} />
            <PixelIcon assetId="ui.heart" decorative width={22} height={22} />
            <PixelIcon assetId="ui.heart" decorative width={22} height={22} />
          </div>
        </div>
      </div>

      <div className="site-container py-5 text-center text-xs text-muted lg:hidden">
        © 2026 YEXINMEI LUO · Stay curious. Keep building.
      </div>
    </footer>
  );
}
