import { PixelIcon } from "@/components/ui/pixel-icon";

export function JourneyEndingScene() {
  return (
    <div className="mt-3 flex min-h-[230px] flex-1 flex-col border border-divider bg-background p-3 lg:min-h-[250px]">
      <div className="flex items-center justify-between gap-3 border-b border-divider pb-2">
        <div>
          <p className="font-pixel text-[8px] text-muted">CURRENT POSITION</p>
          <p className="mt-1 font-pixel text-[11px] text-foreground">07 · NOW</p>
        </div>
        <div className="text-right">
          <p className="font-pixel text-[8px] text-muted">NEXT QUEST</p>
          <p className="mt-1 font-pixel text-[11px] text-accent">TBD</p>
        </div>
      </div>

      <div className="relative min-h-[150px] flex-1 overflow-hidden">
        <p className="absolute left-1/2 top-3 z-30 -translate-x-1/2 whitespace-nowrap border border-divider bg-paper px-2 py-1 font-pixel text-[8px] text-muted">
          NEXT QUEST · ?
        </p>

        <PixelIcon
          assetId="world.grassLong"
          decorative
          width={430}
          height={215}
          className="absolute bottom-[-36px] left-1/2 z-10 h-auto w-[112%] max-w-none -translate-x-1/2 lg:bottom-[-42px]"
        />
        <PixelIcon
          assetId="world.flower"
          decorative
          width={30}
          height={30}
          className="absolute bottom-[28px] left-[16%] z-20 h-auto w-[28px]"
        />
        <PixelIcon
          assetId="character.fullBody"
          decorative
          width={92}
          height={118}
          className="absolute bottom-[25px] left-[43%] z-20 h-auto w-[82px] -translate-x-1/2 lg:w-[92px]"
        />
        <PixelIcon
          assetId="cat.sit"
          decorative
          width={62}
          height={62}
          className="absolute bottom-[27px] left-[58%] z-20 h-auto w-[56px] -translate-x-1/2 lg:w-[62px]"
        />
        <PixelIcon
          assetId="world.woodenSign"
          decorative
          width={78}
          height={104}
          className="absolute bottom-[24px] right-[8%] z-20 h-auto w-[70px] lg:w-[78px]"
        />
      </div>

      <div className="grid grid-cols-[1fr_auto] items-center gap-3 border-t border-divider pt-2">
        <span className="font-pixel text-[8px] text-muted">TO BE CONTINUED...</span>
        <span className="font-pixel text-[8px] text-foreground">NEXT QUEST · TBD</span>
      </div>
    </div>
  );
}
