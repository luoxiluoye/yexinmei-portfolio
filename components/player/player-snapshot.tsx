import Image from "next/image";

import { getAsset } from "@/lib/assets";

export function PlayerSnapshot() {
  return (
    <section
      aria-label="PLAYER SNAPSHOT"
      className="group relative isolate aspect-[4/3] w-full overflow-hidden bg-background transition-transform duration-150 hover:-translate-y-px lg:min-h-[360px] lg:max-h-[430px]"
    >
      <div className="absolute inset-0 z-0 bg-background" aria-hidden="true" />

      <Image
        src={getAsset("player.snapshotCloud")}
        alt=""
        width={160}
        height={107}
        aria-hidden="true"
        className="pointer-events-none absolute left-[2%] top-[39%] z-[1] w-[15%] opacity-55 [image-rendering:pixelated]"
      />

      <Image
        src={getAsset("player.snapshotDecorCrossRed")}
        alt=""
        width={24}
        height={24}
        aria-hidden="true"
        className="pointer-events-none absolute right-[16%] top-[18%] z-[1] hidden w-[3.6%] min-w-[11px] opacity-80 [image-rendering:pixelated] sm:block"
      />

      <div className="absolute bottom-[8%] left-[3%] right-[1%] top-[1%] z-[2] sm:left-[5%] lg:left-[5%]">
        <img
          src={getAsset("player.snapshotPortrait")}
          alt="罗叶馨梅冬日肖像"
          width={900}
          height={675}
          decoding="async"
          fetchPriority="high"
          className="h-full w-full object-contain object-right-bottom"
        />
      </div>

      <Image
        src={getAsset("player.snapshotHello")}
        alt="HELLO!"
        width={200}
        height={133}
        className="absolute left-[10%] top-[27%] z-[3] w-[28%] transition-transform duration-150 group-hover:-translate-y-0.5 sm:w-[25%] lg:w-[23%] [image-rendering:pixelated]"
      />

      <Image
        src={getAsset("player.snapshotCat")}
        alt="黑色像素猫"
        width={160}
        height={160}
        className="pointer-events-none absolute bottom-[8%] left-[3.5%] z-[3] w-[15%] min-w-[48px] max-w-[66px] [image-rendering:pixelated] sm:max-w-[78px] lg:max-w-[88px]"
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
