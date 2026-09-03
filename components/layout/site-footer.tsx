import { PixelIcon } from "@/components/ui/pixel-icon";

export function SiteFooter() {
  return (
    <footer className="mt-8 border-t-2 border-border bg-background">
      <div className="site-container hidden h-[92px] items-end justify-between lg:flex">
        <div className="relative h-full w-[280px] overflow-hidden">
          <PixelIcon
            assetId="world.grassShort"
            decorative
            width={270}
            height={90}
            className="absolute left-[48%] top-[68%] z-0 h-auto w-[270px] max-w-none"
            style={{ transform: "translate(-50%, -49%)" }}
          />
          <PixelIcon
            assetId="world.castle"
            decorative
            width={92}
            height={92}
            className="absolute left-[18%] top-[68%] z-10 h-auto w-[92px]"
            style={{ transform: "translate(-50%, -85.2%)" }}
          />
          <PixelIcon
            assetId="world.pineTree"
            decorative
            width={62}
            height={83}
            className="absolute left-[48%] top-[68%] z-10 h-auto w-[62px]"
            style={{ transform: "translate(-50%, -82.9%)" }}
          />
          <PixelIcon
            assetId="world.tree"
            decorative
            width={62}
            height={83}
            className="absolute left-[72%] top-[68%] z-10 h-auto w-[62px]"
            style={{ transform: "translate(-50%, -89.4%)" }}
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
            width={72}
            height={72}
            className="absolute bottom-[7px] right-[104px] z-10 h-auto w-[72px]"
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
