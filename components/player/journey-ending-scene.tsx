import { PixelIcon } from "@/components/ui/pixel-icon";

export function JourneyEndingScene() {
  return (
    <div className="mt-auto border-t border-divider pt-3">
      <div className="flex items-end justify-between gap-3 px-1">
        <div>
          <p className="font-pixel text-[8px] text-muted">CURRENT POSITION</p>
          <p className="mt-1 font-pixel text-[10px] text-foreground">07 · NOW</p>
        </div>
        <div className="text-right">
          <p className="font-pixel text-[8px] text-muted">NEXT QUEST</p>
          <p className="mt-1 font-pixel text-[10px] text-accent">TBD</p>
        </div>
      </div>

      <div className="relative mx-auto mt-2 h-[118px] w-full max-w-[480px] overflow-hidden sm:h-[126px] lg:h-[132px]">
        <PixelIcon
          assetId="world.bush"
          decorative
          width={58}
          height={34}
          className="absolute bottom-[31px] left-[8%] z-10 h-auto w-[48px] opacity-90 sm:w-[54px]"
        />
        <PixelIcon
          assetId="world.bush"
          decorative
          width={58}
          height={34}
          className="absolute bottom-[32px] right-[11%] z-10 h-auto w-[44px] opacity-80 sm:w-[50px]"
        />
        <PixelIcon
          assetId="world.grassLong"
          decorative
          width={430}
          height={215}
          className="absolute bottom-[-45px] left-1/2 z-10 h-auto w-[88%] max-w-none -translate-x-1/2 sm:bottom-[-48px] lg:w-[90%]"
        />
        <PixelIcon
          assetId="world.flower"
          decorative
          width={24}
          height={24}
          className="absolute bottom-[20px] left-[7%] z-20 h-auto w-[18px] sm:w-[20px]"
        />
        <PixelIcon
          assetId="character.fullBody"
          decorative
          width={76}
          height={98}
          className="absolute bottom-[22px] left-[37%] z-20 h-auto w-[64px] -translate-x-1/2 sm:w-[70px] lg:w-[74px]"
        />
        <PixelIcon
          assetId="cat.sit"
          decorative
          width={54}
          height={54}
          className="absolute bottom-[22px] left-[56%] z-20 h-auto w-[42px] -translate-x-1/2 sm:w-[46px] lg:w-[50px]"
        />
        <PixelIcon
          assetId="world.woodenSign"
          decorative
          width={62}
          height={82}
          className="absolute bottom-[21px] right-[7%] z-20 h-auto w-[50px] sm:w-[54px] lg:w-[58px]"
        />
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-divider px-1 pt-2">
        <span className="font-pixel text-[8px] text-muted">TO BE CONTINUED...</span>
        <span className="font-pixel text-[8px] text-foreground">NEXT QUEST · TBD</span>
      </div>
    </div>
  );
}
