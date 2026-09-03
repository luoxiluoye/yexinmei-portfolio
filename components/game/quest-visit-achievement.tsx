"use client";

import { useEffect, useState } from "react";

const VISITED_KEY = "yexinmei-visited-quests";
const UNLOCKED_KEY = "yexinmei-quest-achievement-shown";
const GOAL = 3;

export function QuestVisitAchievement({ slug }: { slug: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(VISITED_KEY);
      const visited = stored ? (JSON.parse(stored) as string[]) : [];
      const nextVisited = Array.from(new Set([...visited, slug]));
      window.localStorage.setItem(VISITED_KEY, JSON.stringify(nextVisited));

      const hasShown = window.localStorage.getItem(UNLOCKED_KEY) === "1";
      if (nextVisited.length >= GOAL && !hasShown) {
        setVisible(true);
        window.localStorage.setItem(UNLOCKED_KEY, "1");
      }
    } catch {
      // Local storage is optional; the portfolio still works without it.
    }
  }, [slug]);

  if (!visible) return null;

  return (
    <div className="rpg-achievement-toast fixed bottom-24 left-1/2 z-[80] w-[min(92vw,360px)] -translate-x-1/2 border-2 border-border bg-paper p-3 shadow-[4px_4px_0_rgba(17,17,17,.16)] lg:bottom-8 lg:left-auto lg:right-8 lg:translate-x-0">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-pixel text-[10px] text-accent">ACHIEVEMENT UNLOCKED</p>
          <p className="font-pixel-zh mt-1 text-[15px] leading-6">已查看 3 个任务</p>
          <p className="mt-1 text-[12px] leading-5 text-muted">你正在深入了解这位玩家。</p>
        </div>
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="font-pixel text-[12px] text-muted hover:text-accent"
          aria-label="关闭成就提示"
        >
          ×
        </button>
      </div>
    </div>
  );
}
