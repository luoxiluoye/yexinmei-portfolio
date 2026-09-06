"use client";

import { useEffect } from "react";

import { markAchievementProgress } from "@/lib/rpg-events";

const LEGACY_VISITED_KEY = "yexinmei-visited-quests";

export function QuestVisitAchievement({ slug }: { slug: string }) {
  useEffect(() => {
    let visited = [slug];

    try {
      const stored = window.localStorage.getItem(LEGACY_VISITED_KEY);
      const legacy = stored ? (JSON.parse(stored) as unknown) : [];
      if (Array.isArray(legacy)) {
        visited = Array.from(
          new Set([
            ...legacy.filter((value): value is string => typeof value === "string"),
            slug,
          ])
        );
      }
      window.localStorage.setItem(LEGACY_VISITED_KEY, JSON.stringify(visited));
    } catch {
      // Local storage is optional; progress can still work for this session.
    }

    visited.forEach((questSlug) => {
      markAchievementProgress("quests", questSlug, 3, {
        id: "quest-walker",
        title: "QUEST WALKER",
        description: "Visited 3 project quests.",
      });
    });
  }, [slug]);

  return null;
}
