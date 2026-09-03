"use client";

import { useState } from "react";

import { PixelIcon } from "@/components/ui/pixel-icon";

const SECRET_FACTS = [
  "会为了一个选题翻很多资料，直到找到真正值得讲的角度。",
  "从卖闲置 CCD 开始，慢慢做出了累计 20W+ GMV 的小生意。",
  "相机既是爱好，也是我观察世界和生产内容的工具。",
  "很喜欢研究：什么内容会让人停下来、讨论，甚至做出决定。",
  "做过传统媒体、国际传播、新媒体和社区内容，也一直在试新的内容形态。",
  "比起把工具当炫技，我更喜欢把它们变成让工作顺手一点的 workflow。",
  "猫咪是这个网站的常驻 NPC，也是隐藏任务的发布者。",
  "如果一个东西足够有趣，我通常会忍不住把它拆开研究一遍。",
];

export function InventoryChest() {
  const [fact, setFact] = useState<string | null>(null);
  const [opened, setOpened] = useState(false);

  const openChest = () => {
    let next = SECRET_FACTS[Math.floor(Math.random() * SECRET_FACTS.length)];
    if (SECRET_FACTS.length > 1 && next === fact) {
      const index = (SECRET_FACTS.indexOf(next) + 1) % SECRET_FACTS.length;
      next = SECRET_FACTS[index];
    }
    setFact(next);
    setOpened(true);
  };

  return (
    <div className="mt-5 border-t border-divider pt-4">
      <p className="mb-2 font-pixel text-[10px] text-muted">SECRET SLOT</p>
      <button
        type="button"
        onClick={openChest}
        className="rpg-item-slot group flex w-full items-center gap-3 border border-border bg-soft p-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        aria-expanded={opened}
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-divider bg-paper">
          <PixelIcon assetId="items.chest" decorative width={38} height={38} className="rpg-item-icon" />
        </span>
        <span className="min-w-0">
          <span className="block font-pixel text-[11px] text-accent">MYSTERY CHEST</span>
          <span className="mt-1 block text-[12px] leading-5 text-muted">
            {opened ? "再点一次，继续抽取关于我的小彩蛋。" : "点击开启一个隐藏信息。"}
          </span>
        </span>
      </button>

      {fact && (
        <div className="rpg-achievement-toast mt-3 border-2 border-border bg-paper p-3 shadow-[3px_3px_0_rgba(17,17,17,.10)]">
          <p className="font-pixel-zh text-[14px] leading-6 text-accent">发现隐藏道具</p>
          <p className="mt-1 text-[13px] leading-6 text-foreground">{fact}</p>
        </div>
      )}
    </div>
  );
}
