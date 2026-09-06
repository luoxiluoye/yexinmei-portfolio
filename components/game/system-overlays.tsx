"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { RefObject } from "react";
import { useTransitionRouter } from "next-view-transitions";

import { ACHIEVEMENTS } from "@/lib/achievements";
import {
  ACHIEVEMENT_EVENT,
  getAchievementProgress,
  getUnlockedAchievementIds,
  QUICK_PROFILE_EVENT,
  SAVE_FILE_EVENT,
} from "@/lib/rpg-events";
import { PixelIcon } from "@/components/ui/pixel-icon";

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

function focusSystemTrigger(fallback: HTMLElement | null) {
  if (fallback && document.contains(fallback)) {
    fallback.focus({ preventScroll: true });
    return;
  }

  const desktop = document.querySelector<HTMLButtonElement>('button[aria-label*="System Menu"]');
  if (desktop) {
    desktop.focus({ preventScroll: true });
    return;
  }

  const mobile = Array.from(document.querySelectorAll<HTMLButtonElement>("button")).find(
    (button) => button.textContent?.trim().includes("MORE")
  );
  mobile?.focus({ preventScroll: true });
}

export function SystemOverlays() {
  const router = useTransitionRouter();
  const [panel, setPanel] = useState<"save" | "quick" | null>(null);
  const [snapshot, setSnapshot] = useState<SaveSnapshot>(() => ({
    unlocked: new Set(),
    quests: 0,
    memories: 0,
    inventory: 0,
  }));
  const dialogRef = useRef<HTMLElement | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setPanel(null);
    window.requestAnimationFrame(() => focusSystemTrigger(returnFocusRef.current));
  }, []);

  useEffect(() => {
    const rememberReturnTarget = () => {
      returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    };
    const openSave = () => {
      rememberReturnTarget();
      setSnapshot(readSnapshot());
      setPanel("save");
    };
    const openQuick = () => {
      rememberReturnTarget();
      setPanel("quick");
    };
    const refresh = () => setSnapshot(readSnapshot());

    window.addEventListener(SAVE_FILE_EVENT, openSave);
    window.addEventListener(QUICK_PROFILE_EVENT, openQuick);
    window.addEventListener(ACHIEVEMENT_EVENT, refresh);
    return () => {
      window.removeEventListener(SAVE_FILE_EVENT, openSave);
      window.removeEventListener(QUICK_PROFILE_EVENT, openQuick);
      window.removeEventListener(ACHIEVEMENT_EVENT, refresh);
    };
  }, []);

  useEffect(() => {
    if (!panel) return;
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
  }, [close, panel]);

  const go = useCallback(
    (href: string) => {
      setPanel(null);
      router.push(href);
    },
    [router]
  );

  if (!panel) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/35 p-3 lg:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      {panel === "save" ? (
        <SaveFile dialogRef={dialogRef} snapshot={snapshot} onClose={close} />
      ) : (
        <QuickProfile dialogRef={dialogRef} onClose={close} onGo={go} />
      )}
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
                <p className="mt-1 text-[12px] text-muted">CONTENT · COMMUNITY · TECH</p>
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

function QuickProfile({
  dialogRef,
  onClose,
  onGo,
}: {
  dialogRef: RefObject<HTMLElement | null>;
  onClose: () => void;
  onGo: (href: string) => void;
}) {
  return (
    <section
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="60 second Quick Profile"
      className="pixel-cut-frame w-[min(840px,100%)]"
    >
      <div className="pixel-cut-surface max-h-[min(90dvh,760px)] overflow-y-auto bg-paper">
        <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b-2 border-border bg-paper px-4 py-3 lg:px-5">
          <div>
            <p className="font-pixel text-[9px] text-accent">RECRUITER MODE</p>
            <h2 className="mt-1 font-pixel text-[16px]">QUICK PROFILE · 60 SEC</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center border-2 border-border bg-paper font-pixel text-[12px] hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="关闭 Quick Profile"
          >
            ×
          </button>
        </header>

        <div className="p-4 lg:p-6">
          <div className="grid gap-5 lg:grid-cols-[1fr_240px]">
            <div>
              <p className="font-pixel text-[11px] text-muted">YEXINMEI LUO</p>
              <h3 className="mt-2 font-pixel-zh text-[36px] leading-tight lg:text-[44px]">罗叶馨梅</h3>
              <p className="mt-2 font-pixel text-[11px] text-accent">CONTENT · COMMUNITY · TECH</p>
              <p className="mt-4 max-w-xl text-[14px] leading-7 text-muted">
                内容运营、新媒体与社区方向。擅长从热点判断、用户需求和内容供给出发，把选题、分发、活动与复盘串起来，也长期做科技内容、摄影和个人项目。
              </p>
            </div>
            <div className="border-2 border-border bg-soft p-4 text-[12px] leading-6">
              <p><strong>BASE</strong> · 成都</p>
              <p className="mt-2"><strong>EDU</strong> · 电子科技大学 · 新闻与传播</p>
              <p className="mt-2"><strong>FOCUS</strong> · 内容运营 / 产品运营 / AI 产品运营 / 品牌传播</p>
            </div>
          </div>

          <section className="mt-6 border-t-2 border-border pt-4">
            <p className="font-pixel text-[10px] text-accent">SELECTED RESULTS</p>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <QuickMetric value="20W+" label="个人项目 GMV" />
              <QuickMetric value="50%+" label="项目利润率" />
              <QuickMetric value="1000+" label="海外社媒内容" />
              <QuickMetric value="8000+" label="海外账号涨粉" />
            </div>
          </section>

          <section className="mt-6 border-t border-divider pt-4">
            <p className="font-pixel text-[10px] text-accent">SELECTED QUESTS</p>
            <div className="mt-3 grid gap-2 md:grid-cols-3">
              <QuickQuest code="Q01" title="知乎汽车与消费电子社区内容运营" onClick={() => onGo("/quests/zhihu-auto-consumer-tech")} />
              <QuickQuest code="Q04" title="CCD 20W+ GMV" onClick={() => onGo("/quests/ccd-business")} />
              <QuickQuest code="Q02" title="国际传播 / 海外社媒" onClick={() => onGo("/quests/global-content")} />
            </div>
          </section>

          <section className="mt-6 border-t border-divider pt-4">
            <p className="font-pixel text-[10px] text-accent">CORE SKILLS</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["内容策划", "社区运营", "用户洞察", "新媒体运营", "数据复盘", "AI Workflow"].map((skill) => (
                <span key={skill} className="border border-divider bg-soft px-2.5 py-1.5 text-[12px]">{skill}</span>
              ))}
            </div>
          </section>

          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => onGo("/quests")}
              className="min-h-12 border-2 border-border bg-foreground px-4 font-pixel text-[11px] text-white hover:border-accent hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              VIEW ALL QUESTS →
            </button>
            <button
              type="button"
              onClick={() => onGo("/contact")}
              className="min-h-12 border-2 border-border bg-paper px-4 font-pixel text-[11px] hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              CONTACT ME →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function QuickMetric({ value, label }: { value: string; label: string }) {
  return (
    <div className="border border-divider bg-soft p-3">
      <strong className="block font-pixel text-[22px] text-accent">{value}</strong>
      <span className="mt-1 block text-[11px] leading-5 text-muted">{label}</span>
    </div>
  );
}

function QuickQuest({ code, title, onClick }: { code: string; title: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-[84px] items-start gap-3 border border-divider bg-soft p-3 text-left hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <span className="font-pixel text-[9px] text-accent">{code}</span>
      <span className="text-[13px] font-semibold leading-5 group-hover:text-accent">{title}</span>
    </button>
  );
}
