import Image from "next/image";

import { getAsset } from "@/lib/assets";

export function PlayerSnapshot() {
  return (
    <section
      aria-label="PLAYER SNAPSHOT"
      className="group relative isolate aspect-[4/3] w-full overflow-hidden bg-paper transition-transform duration-150 hover:-translate-y-px lg:min-h-[360px] lg:max-h-[430px]"
    >
      <div className="absolute inset-0 z-0 bg-paper" aria-hidden="true" />

      <Image
        src={getAsset("player.snapshotCloud")}
        alt=""
        width={160}
        height={107}
        aria-hidden="true"
        className="pointer-events-none absolute left-[1.5%] top-[40%] z-[1] w-[17%] opacity-70 [image-rendering:pixelated] sm:w-[15%]"
      />
      <Image
        src={getAsset("player.snapshotCloud")}
        alt=""
        width={160}
        height={107}
        aria-hidden="true"
        className="pointer-events-none absolute right-[8%] top-[25%] z-[1] w-[13%] opacity-60 [image-rendering:pixelated] sm:w-[11%]"
      />

      <Image
        src={getAsset("player.snapshotDecorCrossBlack")}
        alt=""
        width={24}
        height={24}
        aria-hidden="true"
        className="pointer-events-none absolute left-[20%] top-[18%] z-[1] w-[3.4%] min-w-[10px] [image-rendering:pixelated]"
      />
      <Image
        src={getAsset("player.snapshotDecorCrossRed")}
        alt=""
        width={24}
        height={24}
        aria-hidden="true"
        className="pointer-events-none absolute left-[18%] top-[51%] z-[1] w-[4%] min-w-[12px] [image-rendering:pixelated]"
      />
      <Image
        src={getAsset("player.snapshotDecorCrossRed")}
        alt=""
        width={24}
        height={24}
        aria-hidden="true"
        className="pointer-events-none absolute right-[18%] top-[17%] z-[1] hidden w-[3.8%] min-w-[11px] [image-rendering:pixelated] sm:block"
      />
      <Image
        src={getAsset("player.snapshotDecorHeartSmall")}
        alt=""
        width={24}
        height={22}
        aria-hidden="true"
        className="pointer-events-none absolute right-[6%] bottom-[24%] z-[1] hidden w-[3.8%] min-w-[12px] [image-rendering:pixelated] md:block"
      />

      <div className="absolute bottom-0 left-[4%] right-[-2%] top-[6%] z-[2] sm:left-[7%] sm:right-0 sm:top-[5%] lg:left-[9%] lg:right-[1%] lg:top-[4%]">
        <Image
          src={getAsset("player.snapshotPortrait")}
          alt="罗叶馨梅冬日肖像"
          fill
          priority
          unoptimized
          sizes="(max-width: 1023px) 100vw, 40vw"
          className="object-contain object-right-bottom"
        />
      </div>

      <Image
        src={getAsset("player.snapshotHello")}
        alt="HELLO!"
        width={200}
        height={133}
        className="absolute left-[11%] top-[29%] z-[3] w-[30%] transition-transform duration-150 group-hover:-translate-y-0.5 sm:left-[12%] sm:w-[27%] lg:w-[25%] [image-rendering:pixelated]"
      />

      <Image
        src={getAsset("player.snapshotGoodThings")}
        alt="GOOD THINGS AHEAD"
        width={100}
        height={76}
        className="pointer-events-none absolute right-[4.5%] top-[43%] z-[3] hidden w-[15%] opacity-90 [image-rendering:pixelated] md:block lg:w-[13%]"
      />

      <Image
        src={getAsset("player.snapshotCat")}
        alt="黑色像素猫"
        width={160}
        height={160}
        className="pointer-events-none absolute bottom-[4.5%] left-[3.5%] z-[3] w-[16%] min-w-[48px] max-w-[64px] [image-rendering:pixelated] sm:max-w-[78px] lg:max-w-[92px]"
      />

      <Image
        src={getAsset("player.snapshotFrame")}
        alt=""
        fill
        priority
        unoptimized
        aria-hidden="true"
        sizes="(max-width: 1023px) 100vw, 40vw"
        className="pointer-events-none absolute inset-0 z-[4] h-full w-full object-fill [image-rendering:pixelated]"
      />
    </section>
  );
}
