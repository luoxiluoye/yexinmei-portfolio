"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { RefObject } from "react";

import { ACHIEVEMENTS } from "@/lib/achievements";
import {
  ACHIEVEMENT_EVENT,
  getAchievementProgress,
  getUnlockedAchievementIds,
  SAVE_FILE_EVENT,
} from "@/lib/rpg-events";
import { PixelIcon } from "@/components/ui/pixel-icon";
import { focusSystemTrigger } from "@/lib/system-focus";

const INVENTORY_TOTAL = 17;
const QUEST_TOTAL = 6;
const MEMORY_TOTAL = 7;

type SaveSnapshot = {
  unlocked: Set<string>;
  quests: number;
  memories: number;
  inventory: number;
};

function readSnapshot(): SaveSnapshot {
  return {
    unlocked: getUnlockedAchievementIds(),
    quests: Math.min(getAchievementProgress("quests").size, QUEST_TOTAL),
    memories: Math.min(getAchievementProgress("journey").size, MEMORY_TOTAL),
    inventory: Math.min(getAchievementProgress("inventory").size, INVENTORY_TOTAL),
  };
}

function getFocusable(container: HTMLElement | null) {
  if (!container) return [] as HTMLElement[];
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter((element) => element.getAttribute("aria-hidden") !== "true");
}

export function SystemOverlays() {
  const [open, setOpen] = useState(false);
  const [snapshot, setSnapshot] = useState<SaveSnapshot>(() => ({
    unlocked: new Set(),
    quests: 0,
    memories: 0,
    inventory: 0,
  }));
  const dialogRef = useRef<HTMLElement | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    window.requestAnimationFrame(() => focusSystemTrigger(returnFocusRef.current));
  }, []);

  useEffect(() => {
    const openSave = () => {
      returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setSnapshot(readSnapshot());
      setOpen(true);
    };
    const refresh = () => setSnapshot(readSnapshot());

    window.addEventListener(SAVE_FILE_EVENT, openSave);
    window.addEventListener(ACHIEVEMENT_EVENT, refresh);
    return () => {
      window.removeEventListener(SAVE_FILE_EVENT, openSave);
      window.removeEventListener(ACHIEVEMENT_EVENT, refresh);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.requestAnimationFrame(() => {
      getFocusable(dialogRef.current)[0]?.focus({ preventScroll: true });
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = getFocusable(dialogRef.current);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [close, open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/35 p-3 lg:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <SaveFile dialogRef={dialogRef} snapshot={snapshot} onClose={close} />
    </div>
  );
}

function SaveFile({
  dialogRef,
  snapshot,
  onClose,
}: {
  dialogRef: RefObject<HTMLElement | null>;
  snapshot: SaveSnapshot;
  onClose: () => void;
}) {
  const unlockedCount = useMemo(
    () => ACHIEVEMENTS.filter((item) => snapshot.unlocked.has(item.id)).length,
    [snapshot.unlocked]
  );

  return (
    <section
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Save File"
      className="pixel-cut-frame w-[min(900px,100%)]"
    >
      <div className="pixel-cut-surface max-h-[min(88dvh,760px)] overflow-y-auto bg-paper">
        <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b-2 border-border bg-paper px-4 py-3 lg:px-5">
          <div>
            <p className="font-pixel text-[9px] text-accent">SYSTEM / SLOT 01</p>
            <h2 className="mt-1 font-pixel text-[16px]">SAVE FILE</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center border-2 border-border bg-paper font-pixel text-[12px] hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="关闭 Save File"
          >
            ×
          </button>
        </header>

        <div className="grid gap-4 p-4 lg:grid-cols-[280px_1fr] lg:p-5">
          <div className="border-2 border-border bg-soft p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-[88px] w-[88px] shrink-0 items-center justify-center border-2 border-border bg-paper">
                <PixelIcon assetId="character.avatar" decorative width={78} height={78} />
              </div>
              <div className="min-w-0">
                <p className="font-pixel text-[13px]">YEXINMEI LUO</p>
                <p className="mt-1 text-[12px] text-muted">CONTENT · AI PRODUCT · TECH</p>
                <p className="mt-3 font-pixel text-[11px] text-accent">LV.28</p>
              </div>
            </div>

            <div className="mt-5">
              <div className="flex justify-between font-pixel text-[9px] text-muted">
                <span>XP</span>
                <span>7888 / 10000</span>
              </div>
              <div className="mt-2 h-3 border border-border bg-paper p-[1px]">
                <div className="h-full bg-accent" style={{ width: "78.88%" }} />
              </div>
            </div>

            <dl className="mt-5 divide-y divide-divider border-y border-divider text-[12px]">
              <SaveStat label="QUESTS" value={`${snapshot.quests} / ${QUEST_TOTAL}`} />
              <SaveStat label="MEMORIES" value={`${snapshot.memories} / ${MEMORY_TOTAL}`} />
              <SaveStat label="ACHIEVEMENTS" value={`${unlockedCount} / ${ACHIEVEMENTS.length}`} />
              <SaveStat label="ITEMS INSPECTED" value={`${snapshot.inventory} / ${INVENTORY_TOTAL}`} />
            </dl>
          </div>

          <div className="min-w-0">
            <div className="mb-3 flex items-end justify-between gap-3 border-b border-divider pb-3">
              <div>
                <p className="font-pixel text-[9px] text-accent">COLLECTION</p>
                <h3 className="mt-1 font-pixel text-[13px]">ACHIEVEMENTS</h3>
              </div>
              <span className="font-pixel text-[9px] text-muted">{unlockedCount} UNLOCKED</span>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {ACHIEVEMENTS.map((item, index) => {
                const unlocked = snapshot.unlocked.has(item.id);
                return (
                  <article
                    key={item.id}
                    className={[
                      "grid min-h-[116px] grid-cols-[48px_1fr] gap-3 border p-3",
                      unlocked ? "border-border bg-soft" : "border-divider bg-background/60",
                    ].join(" ")}
                  >
                    <div className="flex h-12 w-12 items-center justify-center border border-divider bg-paper">
                      <PixelIcon
                        assetId={unlocked ? "player.achievementBadge" : "player.memoryLocked"}
                        decorative
                        width={38}
                        height={38}
                        className={unlocked ? "" : "opacity-55"}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-pixel text-[8px] text-muted">#{String(index + 1).padStart(2, "0")}</p>
                        <span className={unlocked ? "font-pixel text-[8px] text-accent" : "font-pixel text-[8px] text-muted"}>
                          {unlocked ? "UNLOCKED" : "LOCKED"}
                        </span>
                      </div>
                      <p className="mt-1 font-pixel text-[10px] leading-4">{unlocked ? item.title : "???"}</p>
                      <p className="mt-1 text-[11px] leading-5 text-muted">
                        {unlocked ? item.description : item.hint}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SaveStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <dt className="font-pixel text-[9px] text-muted">{label}</dt>
      <dd className="font-pixel text-[10px]">{value}</dd>
    </div>
  );
}
