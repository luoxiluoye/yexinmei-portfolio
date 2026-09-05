"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { memories } from "@/components/player/journey-data";
import { JourneyMemoryModal } from "@/components/player/journey-memory-modal";
import { PixelIcon } from "@/components/ui/pixel-icon";

export function JourneyArchive() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const restoreFocusRef = useRef(false);

  const openMemory = useCallback((index: number, trigger: HTMLButtonElement) => {
    restoreFocusRef.current = false;
    lastTriggerRef.current = trigger;
    setActiveIndex(index);
  }, []);

  const closeMemory = useCallback(() => {
    restoreFocusRef.current = true;
    setActiveIndex(null);
  }, []);

  useEffect(() => {
    if (activeIndex !== null || !restoreFocusRef.current) return;

    restoreFocusRef.current = false;
    const frame = window.requestAnimationFrame(() => {
      lastTriggerRef.current?.focus({ preventScroll: true });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [activeIndex]);

  const move = useCallback((delta: number) => {
    setActiveIndex((current) => {
      if (current === null) return null;
      return (current + delta + memories.length) % memories.length;
    });
  }, []);

  const active = activeIndex === null ? null : memories[activeIndex];

  return (
    <div className="flex h-full w-full min-h-0 min-w-0 max-w-full flex-1 flex-col">
      <div className="relative flex min-h-0 w-full min-w-0 max-w-full flex-1 flex-col border border-divider bg-soft px-3 py-4 lg:px-4 lg:py-5">
        <div className="flex min-h-0 flex-1 items-center">
          <div className="w-full min-w-0">
            <div className="no-scrollbar w-full min-w-0 max-w-full overflow-x-auto pb-1 snap-x snap-mandatory lg:snap-none">
              <div className="relative min-w-[620px] lg:min-w-0">
                <div
                  aria-hidden="true"
                  className="absolute left-[6%] right-[6%] top-[22px] h-[2px] bg-divider lg:top-[46px]"
                />
                <ol className="relative z-10 grid grid-cols-7 gap-2">
                  {memories.map((memory, index) => {
                    const isNow = memory.current;
                    return (
                      <li key={memory.title} className="min-w-0 snap-center text-center lg:snap-align-none">
                        <button
                          type="button"
                          onClick={(event) => openMemory(index, event.currentTarget)}
                          className="group relative mx-auto flex min-h-[86px] w-full cursor-pointer flex-col items-center border-0 bg-transparent p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-soft lg:min-h-[110px] lg:pt-6"
                          aria-haspopup="dialog"
                          aria-label={`打开 ${memory.title} 的记忆档案`}
                        >
                          <span className="pointer-events-none absolute inset-x-0 top-0 hidden h-5 items-center justify-center whitespace-nowrap font-pixel text-[8px] leading-5 text-accent opacity-0 transition-opacity duration-100 group-hover:opacity-100 group-focus-visible:opacity-100 lg:flex">
                            OPEN MEMORY
                          </span>
                          <span
                            className={[
                              "relative flex h-10 w-10 items-center justify-center border-2 font-pixel text-[9px] transition-[transform,box-shadow,background-color,color,border-color] duration-100 group-hover:-translate-x-px group-hover:-translate-y-px group-hover:shadow-[2px_2px_0_rgba(17,17,17,.12)]",
                              isNow
                                ? "border-foreground bg-foreground text-white group-hover:border-accent"
                                : "border-border bg-paper text-accent group-hover:border-accent",
                            ].join(" ")}
                          >
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <p
                            className={[
                              "mt-3 max-w-[76px] text-[12px] font-medium leading-[18px]",
                              isNow ? "font-pixel text-[11px]" : "",
                            ].join(" ")}
                          >
                            {memory.title}
                          </p>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>

            <div className="mt-2 flex items-center justify-center gap-2 lg:hidden">
              <PixelIcon
                assetId="player.journeySwipeLeft"
                decorative
                width={16}
                height={16}
                className="h-4 w-4"
              />
              <p className="text-center font-pixel text-[8px] tracking-[0.03em] text-muted">
                SWIPE TO EXPLORE · TAP TO OPEN
              </p>
              <PixelIcon
                assetId="player.journeySwipeLeft"
                decorative
                width={16}
                height={16}
                className="h-4 w-4"
                style={{ transform: "scaleX(-1)" }}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 grid shrink-0 grid-cols-[auto_1fr_auto] items-center gap-3 border-t border-divider pt-3 font-pixel text-[9px] text-muted lg:mt-5">
          <span>START</span>
          <span className="text-center">MEDIA · CONTENT · COMMUNITY</span>
          <span className="text-foreground">07 · NOW</span>
        </div>
      </div>

      {active && activeIndex !== null ? (
        <JourneyMemoryModal
          memory={active}
          index={activeIndex}
          total={memories.length}
          onClose={closeMemory}
          onPrev={() => move(-1)}
          onNext={() => move(1)}
        />
      ) : null}
    </div>
  );
}
