"use client";

import { useState } from "react";

import { PixelIcon } from "@/components/ui/pixel-icon";

const TARGETS = [
  { left: "76%", top: "24%" },
  { left: "20%", top: "52%" },
  { left: "84%", top: "49%" },
  { left: "61%", top: "28%" },
  { left: "29%", top: "23%" },
] as const;

const GOAL = 3;

export function HeroCatQuest() {
  const [active, setActive] = useState(false);
  const [score, setScore] = useState(0);
  const [targetIndex, setTargetIndex] = useState(0);
  const [complete, setComplete] = useState(false);

  function startQuest() {
    setActive(true);
    setComplete(false);
    setScore(0);
    setTargetIndex((current) => (current + 1) % TARGETS.length);
  }

  function catchHeart() {
    const nextScore = score + 1;

    if (nextScore >= GOAL) {
      setScore(GOAL);
      setActive(false);
      setComplete(true);
      return;
    }

    setScore(nextScore);
    setTargetIndex((current) => (current + 2) % TARGETS.length);
  }

  const target = TARGETS[targetIndex];

  return (
    <div className="pointer-events-none absolute inset-0 z-[36]">
      <button
        type="button"
        onClick={startQuest}
        aria-label={complete ? "重新开始猫咪小游戏" : "点击猫咪开启小游戏"}
        className="group/cat pointer-events-auto absolute left-[37%] top-[68%] z-30 w-[92px] border-0 bg-transparent p-0 outline-none lg:left-[38%] lg:w-[112px]"
        style={{ transform: "translate(-50%, -79.9%)" }}
      >
        <span className="pointer-events-none absolute -top-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap border border-border bg-foreground px-2 py-1 font-pixel text-[9px] text-white group-hover/cat:block lg:text-[10px]">
          {complete ? "PLAY AGAIN?" : "CAT QUEST?"}
        </span>
        <PixelIcon
          assetId={complete ? "cat.love" : active ? "cat.wave" : "cat.sit"}
          decorative
          width={120}
          height={120}
          className="rpg-game-cat h-auto w-full transition-transform duration-100 group-hover/cat:-translate-y-1"
        />
      </button>

      {(active || complete) && (
        <div
          className={`absolute right-2 top-2 z-50 border-2 px-3 py-2 font-pixel text-[9px] leading-4 lg:right-4 lg:top-4 lg:text-[10px] ${
            complete
              ? "border-accent bg-accent text-white"
              : "border-border bg-paper text-foreground"
          }`}
        >
          {complete ? (
            <>
              QUEST COMPLETE ♥<br />
              <span className="text-[8px] lg:text-[9px]">点击猫咪再玩一次</span>
            </>
          ) : (
            <>
              CAT QUEST · {score}/{GOAL}<br />
              <span className="text-[8px] text-muted lg:text-[9px]">抓住跳出来的爱心!</span>
            </>
          )}
        </div>
      )}

      {active && (
        <button
          type="button"
          aria-label={`抓住爱心，当前 ${score} / ${GOAL}`}
          onClick={catchHeart}
          className="rpg-quest-heart pointer-events-auto absolute z-50 flex h-11 w-11 items-center justify-center border-0 bg-transparent p-0 outline-none"
          style={{
            left: target.left,
            top: target.top,
            transform: "translate(-50%, -50%)",
          }}
        >
          <PixelIcon assetId="ui.heart" decorative width={34} height={34} />
        </button>
      )}
    </div>
  );
}
