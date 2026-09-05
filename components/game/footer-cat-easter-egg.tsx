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
    <div className="relative h-full w-[260px] overflow-visible">
      {unlocked && (
        <div className="rpg-achievement-toast absolute bottom-[58px] right-1 z-30 w-[220px] border-2 border-border bg-paper px-3 py-2 text-center shadow-[3px_3px_0_rgba(17,17,17,.10)]">
          <p className="font-pixel text-[9px] text-accent">HIDDEN MESSAGE ♥</p>
          <p className="font-pixel-zh mt-1 text-[13px] leading-5">今天也要继续升级呀</p>
        </div>
      )}

      <button
        type="button"
        onClick={handleClick}
        aria-label="点击页脚猫咪发现隐藏彩蛋"
        className="group absolute bottom-[8px] right-[104px] z-10 flex h-[58px] w-[58px] cursor-pointer items-center justify-center border-0 bg-transparent p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <PixelIcon
          assetId={CAT_STATES[index]}
          decorative
          width={58}
          height={58}
          className="h-[58px] w-[58px] object-contain transition-transform duration-100 group-hover:-translate-y-px"
        />
      </button>

      <div className="absolute bottom-[25px] right-3 flex items-center gap-1.5">
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
    </div>
  );
}
