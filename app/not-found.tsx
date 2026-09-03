import { PixelButton } from "@/components/ui/pixel-button";
import { PixelIcon } from "@/components/ui/pixel-icon";
import { StatusBar } from "@/components/ui/status-bar";

export default function NotFound() {
  return (
    <main className="site-container flex min-h-[calc(100vh-180px)] flex-col justify-center py-8">
      <section className="grid items-center gap-6 lg:grid-cols-[42fr_58fr] lg:gap-5">
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
            width={132}
            height={99}
            className="absolute left-[8%] top-[14%] z-0 h-auto w-[110px] opacity-80 lg:w-[132px]"
          />
          <PixelIcon
            assetId="world.cloudSmall"
            decorative
            width={84}
            height={63}
            className="absolute right-[9%] top-[19%] z-0 h-auto w-[70px] opacity-80 lg:w-[84px]"
          />
          <PixelIcon
            assetId="ui.star"
            decorative
            width={18}
            height={18}
            className="absolute left-[36%] top-[34%] z-0"
          />
          <PixelIcon
            assetId="ui.sparkle"
            decorative
            width={18}
            height={18}
            className="absolute right-[29%] top-[29%] z-0"
          />

          <PixelIcon
            assetId="world.grassLong"
            decorative
            width={650}
            height={325}
            className="absolute left-[50%] top-[68%] z-10 h-auto w-[500px] max-w-none lg:w-[650px]"
            style={{ transform: "translate(-50%, -46.2%)" }}
          />
          <PixelIcon
            assetId="world.flower"
            decorative
            width={36}
            height={36}
            className="absolute left-[29%] top-[68%] z-20 h-auto w-[32px] lg:w-[36px]"
            style={{ transform: "translate(-50%, -73.6%)" }}
          />
          <PixelIcon
            assetId="cat.sit"
            decorative
            width={140}
            height={140}
            className="absolute left-[47%] top-[68%] z-20 h-auto w-[118px] lg:w-[140px]"
            style={{ transform: "translate(-50%, -79.9%)" }}
          />
          <PixelIcon
            assetId="world.woodenSign"
            decorative
            width={200}
            height={267}
            className="absolute left-[72%] top-[68%] z-20 h-auto w-[165px] lg:w-[200px]"
            style={{ transform: "translate(-50%, -77.7%)" }}
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
