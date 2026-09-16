"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { memories } from "@/components/player/journey-data";
import { JourneyMemoryModal } from "@/components/player/journey-memory-modal";
import { PixelIcon } from "@/components/ui/pixel-icon";
import { markAchievementProgress, unlockAchievement } from "@/lib/rpg-events";

export function JourneyArchive() {
  const [selectedIndex, setSelectedIndex] = useState(4);
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const restoreFocusRef = useRef(false);

  const openMemory = useCallback((index: number, trigger: HTMLButtonElement) => {
    restoreFocusRef.current = false;
    lastTriggerRef.current = trigger;
    setModalIndex(index);

    unlockAchievement({
      id: "memory-hunter",
      title: "MEMORY HUNTER",
      description: "Opened the first Memory Archive.",
    });
    markAchievementProgress("journey", String(index), memories.length, {
      id: "archive-complete",
      title: "ARCHIVE COMPLETE",
      description: "Explored all 7 Journey memories.",
    });
  }, []);

  const closeMemory = useCallback(() => {
    restoreFocusRef.current = true;
    setModalIndex(null);
  }, []);

  useEffect(() => {
    if (modalIndex !== null || !restoreFocusRef.current) return;

    restoreFocusRef.current = false;
    const frame = window.requestAnimationFrame(() => {
      lastTriggerRef.current?.focus({ preventScroll: true });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [modalIndex]);

  const move = useCallback((delta: number) => {
    setModalIndex((current) => {
      if (current === null) return null;
      const next = (current + delta + memories.length) % memories.length;
      setSelectedIndex(next);
      return next;
    });
  }, []);

  const active = memories[selectedIndex];
  const modalMemory = modalIndex === null ? null : memories[modalIndex];

  return (
    <div className="min-w-0">
      <div className="no-scrollbar overflow-x-auto pb-2">
        <div className="relative min-w-[680px]">
          <div aria-hidden="true" className="absolute left-[6%] right-[6%] top-5 h-px bg-divider" />
          <ol className="relative z-10 grid grid-cols-7 gap-2">
            {memories.map((memory, index) => {
              const selected = index === selectedIndex;
              return (
                <li key={memory.title} className="min-w-0 text-center">
                  <button
                    type="button"
                    onClick={() => setSelectedIndex(index)}
                    className="group flex w-full cursor-pointer flex-col items-center border-0 bg-transparent p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    aria-pressed={selected}
                    aria-label={`查看 ${memory.title}`}
                  >
                    <span
                      className={[
                        "flex h-10 w-10 items-center justify-center border-2 font-pixel text-[9px] transition-[transform,border-color,background-color,color] duration-100 group-hover:-translate-y-px",
                        selected
                          ? "border-foreground bg-foreground text-white"
                          : "border-divider bg-background text-muted group-hover:border-accent group-hover:text-accent",
                      ].join(" ")}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={[
                        "mt-3 max-w-[86px] text-[12px] leading-[18px]",
                        selected ? "font-semibold text-foreground" : "text-muted",
                      ].join(" ")}
                    >
                      {memory.title}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <article className="mt-6 grid gap-6 border-y border-divider py-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 lg:py-8">
        <div className="flex items-start gap-4 lg:block">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-divider bg-soft lg:h-16 lg:w-16">
            <PixelIcon assetId={active.icon} decorative width={46} height={46} className="h-10 w-10" />
          </div>
          <div className="min-w-0 lg:mt-5">
            <p className="font-pixel text-[10px] tracking-[0.08em] text-accent">{String(selectedIndex + 1).padStart(2, "0")}</p>
            <p className="mt-1 font-pixel text-[10px] text-muted">{active.time}</p>
            {active.current ? (
              <span className="mt-3 inline-flex border border-accent px-2 py-1 font-pixel text-[8px] text-accent">CURRENT</span>
            ) : null}
          </div>
        </div>

        <div className="min-w-0">
          <h3 className="text-[26px] font-semibold tracking-[-0.02em] lg:text-[32px]">{active.title}</h3>
          <div className="mt-4 max-w-[760px] space-y-2 text-[15px] leading-7 text-muted">
            {active.summary.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {active.abilities.map((ability) => (
              <span key={ability.title} className="border border-divider bg-soft px-3 py-2 text-[12px] text-muted">
                <strong className="font-medium text-foreground">{ability.title}</strong>
                <span className="mx-1.5 text-divider">/</span>
                {ability.detail}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={(event) => openMemory(selectedIndex, event.currentTarget)}
            className="mt-6 inline-flex min-h-10 cursor-pointer items-center border-b border-foreground bg-transparent px-0 font-pixel text-[10px] transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            打开完整档案 →
          </button>
        </div>
      </article>

      <div className="mt-3 flex items-center justify-between font-pixel text-[8px] tracking-[0.06em] text-muted">
        <span>START / MEDIA</span>
        <span>CONTENT · COMMUNITY · BUILD</span>
        <span>NOW / 07</span>
      </div>

      {modalMemory && modalIndex !== null ? (
        <JourneyMemoryModal
          memory={modalMemory}
          index={modalIndex}
          total={memories.length}
          onClose={closeMemory}
          onPrev={() => move(-1)}
          onNext={() => move(1)}
        />
      ) : null}
    </div>
  );
}
