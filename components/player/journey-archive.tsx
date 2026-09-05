"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { createPortal } from "react-dom";

import { PixelIcon } from "@/components/ui/pixel-icon";
import type { AssetId } from "@/lib/assets";

type Memory = {
  title: string;
  time: string;
  icon: AssetId;
  summary: string[];
  abilities: Array<{ title: string; detail: string; icon: AssetId }>;
  current?: boolean;
};

const memories: Memory[] = [
  {
    title: "编导与影像",
    time: "本科阶段",
    icon: "player.journeyFilm",
    summary: [
      "从广播电视编导出发，开始系统接触影像、内容和叙事。",
      "在拍摄、剪辑和创作练习里，慢慢建立起对画面与表达的感知。",
    ],
    abilities: [
      { title: "影像表达", detail: "镜头语言与画面表达", icon: "player.journeyFilm" },
      { title: "叙事感知", detail: "故事结构与信息组织", icon: "player.memoryArchive" },
      { title: "内容基础", detail: "策划、制作与执行", icon: "items.notebook" },
    ],
  },
  {
    title: "传统媒体",
    time: "EARLY CAREER",
    icon: "player.journeyMedia",
    summary: [
      "进入媒体内容工作后，开始高频处理选题、信息和稿件。",
      "这段经历让我更在意事实、结构，也更习惯先把复杂的信息梳理清楚。",
    ],
    abilities: [
      { title: "选题判断", detail: "从信息中寻找值得讲的事", icon: "player.journeyMedia" },
      { title: "信息筛选", detail: "快速找到可信与关键内容", icon: "player.factNotes" },
      { title: "编辑表达", detail: "把信息组织成可读内容", icon: "items.notebook" },
    ],
  },
  {
    title: "国际传播",
    time: "2023 — 2024",
    icon: "player.journeyGlobal",
    summary: [
      "参与海外社媒内容运营，把内容放进不同平台和语境里重新理解。",
      "累计发布 1000+ 海外社媒内容，也第一次更明确地用数据观察传播结果。",
    ],
    abilities: [
      { title: "海外社媒", detail: "多平台内容运营", icon: "player.journeyGlobal" },
      { title: "跨文化传播", detail: "语境、受众与表达适配", icon: "player.journeyContent" },
      { title: "数据复盘", detail: "从传播结果反推内容", icon: "ui.star" },
    ],
  },
  {
    title: "新媒体运营",
    time: "2025 — 2026",
    icon: "player.journeyContent",
    summary: [
      "继续做内容、热点和账号，也开始接触更多行业与不同形态的内容项目。",
      "我越来越习惯把选题、生产、分发和复盘看成一条完整的内容链路。",
    ],
    abilities: [
      { title: "内容策划", detail: "选题与内容结构", icon: "player.journeyContent" },
      { title: "热点运营", detail: "快速判断与跟进节奏", icon: "ui.exclamation" },
      { title: "账号运营", detail: "持续生产与分发", icon: "items.laptop" },
    ],
  },
  {
    title: "社区与新品",
    time: "2026.06 — NOW",
    icon: "player.journeyCommunity",
    summary: [
      "在知乎负责汽车与消费电子领域的社区内容运营。",
      "工作覆盖问答、新品、热点、线上活动、用户与答主运营，以及数据分析和复盘。",
    ],
    abilities: [
      { title: "社区运营", detail: "供给、互动与活跃", icon: "player.journeyCommunity" },
      { title: "用户洞察", detail: "观察讨论与参与动机", icon: "player.inspectEye" },
      { title: "新品运营", detail: "新品议题与内容组织", icon: "items.laptop" },
    ],
  },
  {
    title: "个人项目",
    time: "SIDE QUESTS",
    icon: "player.journeySidequest",
    summary: [
      "工作之外，我也持续写科技内容、摄影、折腾相机和自己的小项目。",
      "从卖闲置 CCD 开始，慢慢做出了一个累计 GMV 20W+ 的小生意。",
    ],
    abilities: [
      { title: "独立运营", detail: "从想法到执行自己跑通", icon: "player.journeySidequest" },
      { title: "20W+ GMV", detail: "把兴趣做成真实交易", icon: "player.factCcd" },
      { title: "摄影创作", detail: "相机也是我的生产工具", icon: "player.factCameraKit" },
    ],
  },
  {
    title: "NOW",
    time: "2026 — ?",
    icon: "player.journeyNow",
    current: true,
    summary: [
      "正在继续探索内容、社区与新媒体之间更适合自己的位置。",
      "学习、实践、连接、创造，希望把喜欢的事情慢慢做成有意义的东西。",
    ],
    abilities: [
      { title: "持续学习", detail: "保持好奇，每天进步一点", icon: "items.notebook" },
      { title: "社区连接", detail: "倾听与分享，一起创造价值", icon: "ui.heart" },
      { title: "内容实践", detail: "从想法到落地，解决真实问题", icon: "items.sword" },
    ],
  },
];

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function JourneyArchive() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  const openMemory = useCallback((index: number, trigger: HTMLButtonElement) => {
    lastTriggerRef.current = trigger;
    setActiveIndex(index);
  }, []);

  const closeMemory = useCallback(() => {
    setActiveIndex(null);
    window.requestAnimationFrame(() => {
      lastTriggerRef.current?.focus();
    });
  }, []);

  const move = useCallback((delta: number) => {
    setActiveIndex((current) => {
      if (current === null) return null;
      return (current + delta + memories.length) % memories.length;
    });
  }, []);

  const active = activeIndex === null ? null : memories[activeIndex];

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <div className="relative shrink-0 border border-divider bg-soft px-3 pb-3 pt-5 lg:px-4 lg:pb-4 lg:pt-6">
        <div className="no-scrollbar overflow-x-auto pb-1">
          <div className="relative min-w-[620px] lg:min-w-0">
            <div
              aria-hidden="true"
              className="absolute left-[6%] right-[6%] top-[22px] h-[2px] bg-divider"
            />
            <ol className="relative z-10 grid grid-cols-7 gap-2">
              {memories.map((memory, index) => {
                const isNow = memory.current;
                return (
                  <li key={memory.title} className="min-w-0 text-center">
                    <button
                      type="button"
                      onClick={(event) => openMemory(index, event.currentTarget)}
                      className="group relative mx-auto flex min-h-[86px] w-full cursor-pointer flex-col items-center border-0 bg-transparent p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-soft"
                      aria-haspopup="dialog"
                      aria-label={`打开 ${memory.title} 的记忆档案`}
                    >
                      <span className="pointer-events-none absolute -top-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap border-2 border-border bg-paper px-2 py-1 font-pixel text-[9px] shadow-[2px_2px_0_rgba(17,17,17,.12)] group-hover:block">
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

        <p className="mt-2 text-center font-pixel text-[8px] tracking-[0.03em] text-muted lg:hidden">
          ← SWIPE · TAP A STAGE TO OPEN MEMORY →
        </p>

        <div className="mt-3 grid grid-cols-[auto_1fr_auto] items-center gap-3 border-t border-divider pt-3 font-pixel text-[9px] text-muted">
          <span>START</span>
          <span className="text-center">MEDIA · CONTENT · COMMUNITY</span>
          <span className="text-foreground">07 · NOW</span>
        </div>
      </div>

      <JourneyEndingScene />

      {active && activeIndex !== null ? (
        <MemoryModal
          memory={active}
          index={activeIndex}
          onClose={closeMemory}
          onPrev={() => move(-1)}
          onNext={() => move(1)}
        />
      ) : null}
    </div>
  );
}

function JourneyEndingScene() {
  return (
    <div className="mt-3 flex min-h-[230px] flex-1 flex-col border border-divider bg-background p-3 lg:min-h-[250px]">
      <div className="flex items-center justify-between gap-3 border-b border-divider pb-2">
        <div>
          <p className="font-pixel text-[8px] text-muted">CURRENT POSITION</p>
          <p className="mt-1 font-pixel text-[11px] text-foreground">07 · NOW</p>
        </div>
        <div className="text-right">
          <p className="font-pixel text-[8px] text-muted">NEXT QUEST</p>
          <p className="mt-1 font-pixel text-[11px] text-accent">TBD</p>
        </div>
      </div>

      <div className="relative min-h-[150px] flex-1 overflow-hidden">
        <p className="absolute left-1/2 top-3 z-30 -translate-x-1/2 whitespace-nowrap border border-divider bg-paper px-2 py-1 font-pixel text-[8px] text-muted">
          NEXT QUEST · ?
        </p>

        <PixelIcon
          assetId="world.grassLong"
          decorative
          width={430}
          height={215}
          className="absolute bottom-[-36px] left-1/2 z-10 h-auto w-[112%] max-w-none -translate-x-1/2 lg:bottom-[-42px]"
        />
        <PixelIcon
          assetId="world.flower"
          decorative
          width={30}
          height={30}
          className="absolute bottom-[28px] left-[16%] z-20 h-auto w-[28px]"
        />
        <PixelIcon
          assetId="character.fullBody"
          decorative
          width={92}
          height={118}
          className="absolute bottom-[25px] left-[43%] z-20 h-auto w-[82px] -translate-x-1/2 lg:w-[92px]"
        />
        <PixelIcon
          assetId="cat.sit"
          decorative
          width={62}
          height={62}
          className="absolute bottom-[27px] left-[58%] z-20 h-auto w-[56px] -translate-x-1/2 lg:w-[62px]"
        />
        <PixelIcon
          assetId="world.woodenSign"
          decorative
          width={78}
          height={104}
          className="absolute bottom-[24px] right-[8%] z-20 h-auto w-[70px] lg:w-[78px]"
        />
      </div>

      <div className="grid grid-cols-[1fr_auto] items-center gap-3 border-t border-divider pt-2">
        <span className="font-pixel text-[8px] text-muted">TO BE CONTINUED...</span>
        <span className="font-pixel text-[8px] text-foreground">NEXT QUEST · TBD</span>
      </div>
    </div>
  );
}

function MemoryModal({
  memory,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  memory: Memory;
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    if (scrollbarWidth > 0) {
      const computedPadding = Number.parseFloat(
        window.getComputedStyle(document.body).paddingRight || "0"
      );
      document.body.style.paddingRight = `${computedPadding + scrollbarWidth}px`;
    }
    document.body.style.overflow = "hidden";

    const focusCloseButton = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter((element) => !element.hasAttribute("disabled"));

      if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.cancelAnimationFrame(focusCloseButton);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, [mounted, onClose]);

  if (!mounted) return null;

  const titleId = `memory-dialog-title-${index}`;

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 px-3 py-[calc(12px+env(safe-area-inset-top))] lg:p-10"
      onMouseDown={(event: ReactMouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="pixel-cut-frame w-[calc(100vw-24px)] max-w-[860px] focus:outline-none lg:w-[min(860px,calc(100vw-64px))]"
        onMouseDown={(event: ReactMouseEvent<HTMLDivElement>) => event.stopPropagation()}
      >
        <div className="pixel-cut-surface flex max-h-[calc(100dvh-var(--rpg-mobile-header-height)-var(--rpg-mobile-level-height)-var(--rpg-bottom-tab-height)-env(safe-area-inset-bottom)-24px)] min-h-0 flex-col bg-paper lg:max-h-[min(760px,calc(100vh-80px))]">
          <div className="flex shrink-0 items-start justify-between gap-4 border-b border-divider px-4 py-3 lg:px-5">
            <div className="min-w-0">
              <p className="font-pixel text-[9px] text-accent">
                MEMORY ARCHIVE · STAGE {String(index + 1).padStart(2, "0")}
              </p>
              <h2
                id={titleId}
                className="mt-1 font-pixel text-[16px] leading-6 lg:text-[19px]"
              >
                {memory.title}
              </h2>
              <p className="mt-1 font-pixel text-[9px] text-muted">{memory.time}</p>
            </div>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="inline-flex min-h-10 shrink-0 cursor-pointer items-center justify-center border-2 border-border bg-paper px-3 font-pixel text-[10px] transition-[transform,border-color,color] duration-100 hover:-translate-x-px hover:-translate-y-px hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
              aria-label="关闭记忆档案"
            >
              CLOSE ×
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 lg:px-5 lg:py-5">
            <div className="grid gap-4 lg:grid-cols-[240px_1fr] lg:gap-5">
              <div className="flex min-h-[180px] items-center justify-center border-2 border-border bg-soft p-4">
                <div className="relative flex h-[150px] w-full items-center justify-center overflow-hidden">
                  <PixelIcon
                    assetId="player.memoryArchive"
                    decorative
                    width={190}
                    height={190}
                    className="absolute inset-1/2 h-auto w-[150px] -translate-x-1/2 -translate-y-1/2 opacity-35"
                  />
                  <div className="relative z-10 flex h-[96px] w-[96px] items-center justify-center border-2 border-border bg-paper">
                    <PixelIcon
                      assetId={memory.icon}
                      decorative
                      width={68}
                      height={68}
                      className="h-auto w-[68px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <p className="font-pixel text-[9px] text-muted">ARCHIVE NOTE</p>
                <div className="mt-2 space-y-3 text-[14px] leading-7 text-muted">
                  {memory.summary.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>

                <div className="mt-5 border-t border-divider pt-4">
                  <p className="font-pixel text-[9px] text-muted">KEY ABILITIES</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-3">
                    {memory.abilities.map((ability) => (
                      <div
                        key={ability.title}
                        className="border border-divider bg-soft p-3"
                      >
                        <PixelIcon
                          assetId={ability.icon}
                          decorative
                          width={28}
                          height={28}
                          className="h-auto w-[28px]"
                        />
                        <p className="mt-2 text-[13px] font-semibold leading-5">
                          {ability.title}
                        </p>
                        <p className="mt-1 text-[11px] leading-5 text-muted">
                          {ability.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-between gap-3 border-t border-divider px-4 py-3 lg:px-5">
            <button
              type="button"
              onClick={onPrev}
              className="inline-flex min-h-10 cursor-pointer items-center gap-2 border-2 border-border bg-paper px-3 font-pixel text-[9px] transition-[transform,border-color,color] duration-100 hover:-translate-x-px hover:-translate-y-px hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <PixelIcon
                assetId="player.memoryArrowLeft"
                decorative
                width={18}
                height={18}
              />
              PREV
            </button>

            <span className="font-pixel text-[9px] text-muted">
              {String(index + 1).padStart(2, "0")} / {String(memories.length).padStart(2, "0")}
            </span>

            <button
              type="button"
              onClick={onNext}
              className="inline-flex min-h-10 cursor-pointer items-center gap-2 border-2 border-border bg-paper px-3 font-pixel text-[9px] transition-[transform,border-color,color] duration-100 hover:-translate-x-px hover:-translate-y-px hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              NEXT
              <PixelIcon
                assetId="player.memoryArrowRight"
                decorative
                width={18}
                height={18}
              />
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
