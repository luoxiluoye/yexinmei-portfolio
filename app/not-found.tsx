import { PixelButton } from "@/components/ui/pixel-button";
import { PixelIcon } from "@/components/ui/pixel-icon";
import { StatusBar } from "@/components/ui/status-bar";

export default function NotFound() {
  return (
    <main className="site-container flex min-h-[calc(100vh-180px)] flex-col justify-center py-8">
      <section className="grid items-center gap-6 lg:grid-cols-[42fr_58fr]">
        <div>
          <p className="font-pixel text-[12px] text-muted">08. 404 PAGE PREVIEW</p>
          <h1 className="rpg-page-title mt-2 text-[56px] lg:text-[72px]">404</h1>
          <p className="mt-2 font-pixel text-[15px]">QUEST NOT FOUND</p>
          <p className="mt-4 max-w-md text-[15px] leading-[26px] text-muted">
            这里没有发现任务。可能是走错了方向，也可能这块地图还没有解锁。
          </p>

          <div className="mt-5 grid gap-2 sm:flex">
            <PixelButton href="/" variant="primary" className="w-full sm:w-auto">
              返回首页 →
            </PixelButton>
            <PixelButton href="/quests" variant="secondary" className="w-full sm:w-auto">
              查看任务
            </PixelButton>
          </div>
        </div>

        <div className="rpg-scene relative min-h-[300px] overflow-hidden lg:min-h-[380px]">
          <PixelIcon
            assetId="world.cloudMedium"
            decorative
            width={112}
            height={72}
            className="absolute left-[8%] top-[16%] z-0 opacity-85"
          />
          <PixelIcon
            assetId="world.cloudSmall"
            decorative
            width={70}
            height={46}
            className="absolute right-[9%] top-[20%] z-0 opacity-85"
          />
          <PixelIcon
            assetId="ui.star"
            decorative
            width={18}
            height={18}
            className="absolute left-[36%] top-[36%] z-0"
          />
          <PixelIcon
            assetId="ui.sparkle"
            decorative
            width={18}
            height={18}
            className="absolute right-[29%] top-[31%] z-0"
          />

          <PixelIcon
            assetId="world.grassLong"
            decorative
            width={440}
            height={110}
            className="absolute bottom-0 left-[47%] z-10 w-[70%] -translate-x-1/2"
          />
          <PixelIcon
            assetId="world.flower"
            decorative
            width={34}
            height={34}
            className="absolute bottom-8 left-[27%] z-20"
          />
          <PixelIcon
            assetId="cat.sit"
            decorative
            width={96}
            height={96}
            className="absolute bottom-8 left-[47%] z-20 -translate-x-1/2"
          />
          <PixelIcon
            assetId="world.woodenSign"
            decorative
            width={98}
            height={128}
            className="absolute bottom-5 right-[7%] z-20"
          />
        </div>
      </section>

      <div className="mt-6">
        <StatusBar
          items={[
            { label: "ERROR", value: "404", accent: true },
            { label: "QUEST", value: "NOT FOUND" },
            { label: "MAP", value: "EMPTY" },
            { label: "STATUS", value: "RETURN" },
          ]}
        />
      </div>
    </main>
  );
}
