import { PixelButton } from "@/components/ui/pixel-button";
import { PixelIcon } from "@/components/ui/pixel-icon";
import { StatusBar } from "@/components/ui/status-bar";

export default function QuestNotFound() {
  return (
    <main className="site-container py-8">
      <section className="grid min-h-[62vh] items-center gap-6 lg:grid-cols-[42fr_58fr]">
        <div>
          <p className="font-pixel text-[12px] text-accent">QUEST ERROR</p>
          <h1 className="rpg-page-title mt-2">QUEST NOT FOUND</h1>
          <p className="mt-4 text-[15px] leading-[26px] text-muted">
            看起来你走进了一块还没有解锁的地图。
          </p>
          <div className="mt-5 grid gap-2 sm:flex">
            <PixelButton href="/quests" variant="primary" className="w-full sm:w-auto">
              BACK TO QUESTS
            </PixelButton>
            <PixelButton href="/" variant="secondary" className="w-full sm:w-auto">
              HOME
            </PixelButton>
          </div>
        </div>

        <div className="rpg-scene relative min-h-[300px]">
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-center">
            <PixelIcon assetId="cat.sit" decorative width={92} height={92} className="relative z-20 mb-8" />
            <PixelIcon assetId="world.woodenSign" decorative width={98} height={128} className="relative z-20 mb-6" />
            <PixelIcon assetId="world.grassLong" decorative width={430} height={108} className="absolute bottom-0 left-1/2 z-10 w-[86%] -translate-x-1/2" />
          </div>
        </div>
      </section>

      <StatusBar
        items={[
          { label: "QUEST", value: "NOT FOUND", accent: true },
          { label: "STATUS", value: "EMPTY" },
          { label: "MAP", value: "WRONG WAY" },
          { label: "ACTION", value: "RETURN" },
        ]}
      />
    </main>
  );
}
