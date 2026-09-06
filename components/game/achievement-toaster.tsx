"use client";

import { useEffect } from "react";
import { Toaster, toast } from "sonner";

import { PixelIcon } from "@/components/ui/pixel-icon";
import { ACHIEVEMENT_EVENT } from "@/lib/rpg-events";

type AchievementDetail = {
  id: string;
  title: string;
  description: string;
};

export function AchievementToaster() {
  useEffect(() => {
    const onAchievement = (event: Event) => {
      const customEvent = event as CustomEvent<AchievementDetail>;
      const detail = customEvent.detail;
      if (!detail) return;

      toast.custom(
        () => (
          <div className="rpg-achievement-toast pixel-cut-frame w-[min(360px,calc(100vw-24px))]">
            <div className="pixel-cut-surface flex items-center gap-3 bg-paper px-3 py-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-divider bg-soft">
                <PixelIcon
                  assetId="player.achievementBadge"
                  decorative
                  width={40}
                  height={40}
                  className="h-10 w-10"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-pixel text-[8px] tracking-[0.04em] text-accent">ACHIEVEMENT UNLOCKED</p>
                <p className="mt-1 font-pixel text-[12px] leading-5 text-foreground">{detail.title}</p>
                <p className="mt-0.5 text-[12px] leading-5 text-muted">{detail.description}</p>
              </div>
            </div>
          </div>
        ),
        { duration: 4200 }
      );
    };

    window.addEventListener(ACHIEVEMENT_EVENT, onAchievement);
    return () => window.removeEventListener(ACHIEVEMENT_EVENT, onAchievement);
  }, []);

  return (
    <Toaster
      position="top-right"
      visibleToasts={3}
      gap={8}
      offset={12}
      mobileOffset={12}
      toastOptions={{
        style: {
          background: "transparent",
          border: "0",
          boxShadow: "none",
          padding: "0",
        },
      }}
    />
  );
}
