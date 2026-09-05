import { PixelIcon } from "@/components/ui/pixel-icon";

export function JourneyEndingScene() {
  return (
    <div className="mt-3 flex min-h-[250px] flex-1 flex-col border border-divider bg-background p-3 lg:min-h-[280px]">
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

      <div className="relative min-h-[175px] flex-1 overflow-hidden lg:min-h-[195px]">
        {/* Background accents: keep them light so the scene reads in clear layers. */}
        <PixelIcon
          assetId="world.bush"
          decorative
          width={84}
          height={54}
          className="absolute bottom-[70px] left-[9%] z-0 h-auto w-[68px] opacity-90 lg:bottom-[78px] lg:w-[84px]"
        />
        <PixelIcon
          assetId="world.bush"
          decorative
          width={72}
          height={46}
          className="absolute bottom-[70px] right-[12%] z-0 h-auto w-[58px] opacity-90 lg:bottom-[78px] lg:w-[72px]"
        />

        {/* Ground: one long platform spans the scene instead of sitting as a small island. */}
        <PixelIcon
          assetId="world.grassLong"
          decorative
          width={520}
          height={180}
          className="absolute bottom-[-24px] left-1/2 z-10 h-auto w-[92%] max-w-[720px] -translate-x-1/2 lg:bottom-[-30px] lg:w-[94%]"
        />

        {/* Foreground characters are deliberately spread across the platform. */}
        <PixelIcon
          assetId="world.flower"
          decorative
          width={30}
          height={30}
          className="absolute bottom-[42px] left-[9%] z-20 h-auto w-[24px] lg:bottom-[48px] lg:w-[28px]"
        />
        <PixelIcon
          assetId="character.fullBody"
          decorative
          width={108}
          height={138}
          className="absolute bottom-[39px] left-[35%] z-20 h-auto w-[92px] -translate-x-1/2 lg:bottom-[45px] lg:w-[108px]"
        />
        <PixelIcon
          assetId="cat.sit"
          decorative
          width={72}
          height={72}
          className="absolute bottom-[40px] left-[57%] z-20 h-auto w-[62px] -translate-x-1/2 lg:bottom-[46px] lg:w-[72px]"
        />
        <PixelIcon
          assetId="world.woodenSign"
          decorative
          width={90}
          height={120}
          className="absolute bottom-[38px] right-[5%] z-20 h-auto w-[76px] lg:bottom-[44px] lg:right-[6%] lg:w-[90px]"
        />
      </div>

      <div className="grid grid-cols-[1fr_auto] items-center gap-3 border-t border-divider pt-2">
        <span className="font-pixel text-[8px] text-muted">TO BE CONTINUED...</span>
        <span className="font-pixel text-[8px] text-foreground">NEXT QUEST · TBD</span>
      </div>
    </div>
  );
}
