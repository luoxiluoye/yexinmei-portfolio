"use client";

import { useState } from "react";

import { PixelIcon } from "@/components/ui/pixel-icon";

const CAT_STATES = ["cat.sit", "cat.wave", "cat.happy", "cat.peek", "cat.love"] as const;

export function FooterCatEasterEgg() {
  const [clicks, setClicks] = useState(0);
  const index = Math.min(clicks, CAT_STATES.length - 1);
  const unlocked = clicks >= 4;

  const handleClick = () => {
    setClicks((current) => (current >= 4 ? 0 : current + 1));
  };

  return (
    <div className="grid h-full w-[300px] shrink-0 grid-cols-[74px_1fr] items-center gap-2 overflow-hidden px-2">
      <button
        type="button"
        onClick={handleClick}
        aria-label="点击页脚猫咪发现隐藏彩蛋"
        className="group flex h-[62px] w-[62px] cursor-pointer items-center justify-center border-0 bg-transparent p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <PixelIcon
          assetId={CAT_STATES[index]}
          decorative
          width={58}
          height={58}
          className="h-[58px] w-[58px] object-contain transition-transform duration-100 group-hover:-translate-y-px"
        />
      </button>

      {unlocked ? (
        <div className="min-w-0 border-2 border-border bg-paper px-2.5 py-2 shadow-[3px_3px_0_rgba(17,17,17,.10)]">
          <p className="font-pixel text-[8px] leading-3 text-accent">HIDDEN MESSAGE ♥</p>
          <p className="font-pixel-zh mt-0.5 whitespace-nowrap text-[11px] leading-4">今天也要继续升级呀</p>
        </div>
      ) : (
        <div className="flex min-w-0 items-center justify-center gap-2">
          {[0, 1, 2].map((heartIndex) => (
            <PixelIcon
              key={heartIndex}
              assetId={clicks > heartIndex ? "ui.heart" : "ui.emptyHeart"}
              decorative
              width={20}
              height={20}
            />
          ))}
        </div>
      )}
    </div>
  );
}
