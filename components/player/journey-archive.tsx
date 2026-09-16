"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import styles from "@/components/player/journey-archive.module.css";
import { memories } from "@/components/player/journey-data";
import { JourneyMemoryModal } from "@/components/player/journey-memory-modal";
import { PixelIcon } from "@/components/ui/pixel-icon";
import { markAchievementProgress, unlockAchievement } from "@/lib/rpg-events";

const NODE_POINTS = [
  { x: 6, y: 54 },
  { x: 20, y: 42 },
  { x: 34, y: 56 },
  { x: 49, y: 38 },
  { x: 64, y: 52 },
  { x: 79, y: 34 },
  { x: 94, y: 48 },
] as const;

const ROUTE_PATH = "M6 54 C12 42 15 39 20 42 S28 60 34 56 S43 32 49 38 S57 58 64 52 S72 29 79 34 S88 55 94 48";

function clampProgress(value: number) {
  return Math.min(1, Math.max(0, value));
}

function getRoutePoint(progress: number) {
  const scaled = clampProgress(progress) * (NODE_POINTS.length - 1);
  const index = Math.min(Math.floor(scaled), NODE_POINTS.length - 2);
  const local = scaled - index;
  const start = NODE_POINTS[index];
  const end = NODE_POINTS[index + 1];

  return {
    x: start.x + (end.x - start.x) * local,
    y: start.y + (end.y - start.y) * local,
  };
}

export function JourneyArchive() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [exploreProgress, setExploreProgress] = useState(0);
  const routeRef = useRef<HTMLDivElement | null>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const restoreFocusRef = useRef(false);

  const routeProgress = Math.max(scrollProgress, exploreProgress);
  const playerPoint = getRoutePoint(routeProgress);

  useEffect(() => {
    const route = routeRef.current;
    if (!route) return;

    let frame = 0;

    const updateProgress = () => {
      frame = 0;
      const rect = route.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const start = viewportHeight * 0.84;
      const end = viewportHeight * 0.34;
      const next = clampProgress((start - rect.top) / (start - end));
      setScrollProgress(next);
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  const selectMemory = useCallback((index: number) => {
    setSelectedIndex(index);
    setExploreProgress((current) => Math.max(current, index / (memories.length - 1)));
  }, []);

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
      selectMemory(next);
      return next;
    });
  }, [selectMemory]);

  const active = memories[selectedIndex];
  const modalMemory = modalIndex === null ? null : memories[modalIndex];

  return (
    <div className="min-w-0">
      <div ref={routeRef} className={styles.routeViewport} aria-label="成长路径">
        <div className={styles.routeStage}>
          <svg className={styles.routeSvg} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path className={styles.routeBase} d={ROUTE_PATH} />
            <path
              className={styles.routeActive}
              d={ROUTE_PATH}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - routeProgress}
            />
          </svg>

          <div
            className={styles.playerMarker}
            style={{ left: `${playerPoint.x}%`, top: `${playerPoint.y}%` }}
            aria-hidden="true"
          >
            <PixelIcon assetId="character.avatar" decorative width={42} height={42} />
          </div>

          <ol>
            {memories.map((memory, index) => {
              const selected = index === selectedIndex;
              const unlocked = routeProgress + 0.035 >= index / (memories.length - 1);
              const point = NODE_POINTS[index];

              return (
                <li
                  key={memory.title}
                  className={[
                    styles.node,
                    unlocked ? styles.unlocked : "",
                    selected ? styles.selected : "",
                    memory.current ? styles.current : "",
                  ].join(" ")}
                  style={{ left: `${point.x}%`, top: `${point.y}%` }}
                >
                  {memory.current ? <span className={styles.currentTag}>YOU ARE HERE</span> : null}
                  <button
                    type="button"
                    onClick={() => selectMemory(index)}
                    className={styles.nodeButton}
                    aria-pressed={selected}
                    aria-label={`查看 ${memory.title}`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </button>
                  <span className={styles.nodeLabel}>{memory.title}</span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <div className={styles.progressMeta} aria-hidden="true">
        <span>START / MEDIA</span>
        <span>SCROLL TO UNLOCK · CLICK TO EXPLORE</span>
        <span>NOW / 07</span>
      </div>

      <article
        key={selectedIndex}
        className={`${styles.detailCard} mt-6 grid gap-6 border-y border-divider py-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 lg:py-8`}
      >
        <div className="flex items-start gap-4 lg:block">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-divider bg-soft lg:h-16 lg:w-16">
            <PixelIcon assetId={active.icon} decorative width={46} height={46} className="h-10 w-10" />
          </div>
          <div className="min-w-0 lg:mt-5">
            <p className="font-pixel text-[10px] tracking-[0.08em] text-accent">{String(selectedIndex + 1).padStart(2, "0")}</p>
            <p className="mt-1 font-pixel text-[10px] text-muted">{active.time}</p>
            {active.current ? (
              <span className="mt-3 inline-flex border border-accent px-2 py-1 font-pixel text-[8px] text-accent">CURRENT · YOU ARE HERE</span>
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
