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

type Fact = {
  title: string;
  itemTitle: string;
  icon: AssetId;
  type: string;
  rarity: number;
  status: string;
  story: string[];
};

const facts: Fact[] = [
  {
    title: "卖过 20W+ 的 CCD",
    itemTitle: "CCD CAMERA",
    icon: "player.factCcd",
    type: "SIDE QUEST",
    rarity: 4,
    status: "ONGOING",
    story: [
      "最开始只是处理一台闲置 CCD，后来慢慢研究选品、定价、内容和交易。",
      "这件小事最后变成了累计 GMV 20W+ 的个人项目，也让我更喜欢把兴趣真正做起来。",
    ],
  },
  {
    title: "会为了一个选题翻很多资料",
    itemTitle: "RESEARCH NOTES",
    icon: "player.factNotes",
    type: "WORK HABIT",
    rarity: 4,
    status: "ALWAYS ON",
    story: [
      "遇到一个想讲清楚的选题，我通常会顺着线索继续翻报道、资料和数据。",
      "很多时候，真正有意思的角度就藏在那些看起来不起眼的细节里。",
    ],
  },
  {
    title: "相机既是爱好，也是生产工具",
    itemTitle: "CAMERA KIT",
    icon: "player.factCameraKit",
    type: "EQUIPMENT",
    rarity: 5,
    status: "EQUIPPED",
    story: [
      "我喜欢拍照，也习惯把相机带进自己的内容工作和个人项目里。",
      "它既负责记录生活，也会变成内容素材、作品和新的小生意。",
    ],
  },
  {
    title: "喜欢研究内容为什么会火",
    itemTitle: "CONTENT SPARK",
    icon: "player.factContentSpark",
    type: "PASSIVE SKILL",
    rarity: 4,
    status: "ACTIVE",
    story: [
      "我一直很喜欢观察：什么内容会让人停下来，为什么有人愿意看、愿意讨论。",
      "这种好奇心也是我做选题、社区和内容运营时最常用的一项能力。",
    ],
  },
  {
    title: "猫咪是本站常驻 NPC",
    itemTitle: "CAT COMPANION NPC",
    icon: "player.factCatNpc",
    type: "COMPANION",
    rarity: 5,
    status: "ALWAYS ONLINE",
    story: [
      "一只神出鬼没的黑猫，常年蹲守在本站各个页面。",
      "没有固定任务、不卖装备、不发经验，只负责陪你看世界，以及在需要的时候默默提供情绪价值。",
      "据说，它比你更早连接了这个网站。也可能，才是这里的真正主人。",
    ],
  },
];

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

export function FunFactsInspect() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const restoreFocusRef = useRef(false);

  const close = useCallback(() => {
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

  return (
    <>
      <div className="space-y-3">
        {facts.map((fact, index) => (
          <button
            key={fact.title}
            type="button"
            onClick={(event) => {
              restoreFocusRef.current = false;
              lastTriggerRef.current = event.currentTarget;
              setActiveIndex(index);
            }}
            className="group flex min-h-[82px] w-full cursor-pointer items-center gap-3 border border-divider bg-soft px-3 py-3 text-left transition-[transform,border-color,box-shadow] duration-100 hover:-translate-x-px hover:-translate-y-px hover:border-accent hover:shadow-[2px_2px_0_rgba(17,17,17,.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-haspopup="dialog"
            aria-label={`查看 ${fact.title}`}
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center">
              <PixelIcon assetId={fact.icon} decorative width={46} height={46} className="h-auto max-h-11 w-auto max-w-11" />
            </span>
            <span className="min-w-0 flex-1 text-[14px] leading-6">{fact.title}</span>
            <span className="shrink-0 font-pixel text-[8px] text-accent lg:text-[9px]">
              <span className="lg:hidden">VIEW →</span>
              <span className="hidden lg:inline">INSPECT →</span>
            </span>
          </button>
        ))}
      </div>

      {activeIndex !== null ? (
        <FunFactModal fact={facts[activeIndex]} index={activeIndex} onClose={close} />
      ) : null}
    </>
  );
}

function FunFactModal({ fact, index, onClose }: { fact: Fact; index: number; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    if (scrollbarWidth > 0) {
      const currentPadding = Number.parseFloat(window.getComputedStyle(document.body).paddingRight || "0");
      document.body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
    }
    document.body.style.overflow = "hidden";

    const frame = window.requestAnimationFrame(() => closeRef.current?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (!focusable.length) {
        event.preventDefault();
        dialog.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, [mounted, onClose]);

  if (!mounted) return null;

  const titleId = `fun-fact-dialog-title-${index}`;

  return createPortal(
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/40 px-3 pb-[calc(12px+env(safe-area-inset-bottom))] pt-[calc(12px+env(safe-area-inset-top))] lg:p-10"
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
        className="pixel-cut-frame w-[calc(100vw-24px)] max-w-[760px] focus:outline-none lg:w-[min(760px,calc(100vw-64px))]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="pixel-cut-surface flex max-h-[calc(100dvh-24px-env(safe-area-inset-top)-env(safe-area-inset-bottom))] min-h-0 flex-col overflow-hidden bg-paper lg:max-h-[min(680px,calc(100vh-80px))]">
          <header className="flex shrink-0 items-start justify-between gap-4 border-b border-divider px-4 py-3 lg:px-5">
            <div className="min-w-0">
              <p className="font-pixel text-[9px] text-accent">ITEM FOUND</p>
              <h2 id={titleId} className="mt-1 font-pixel text-[16px] leading-6 lg:text-[19px]">INSPECT ITEM</h2>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="inline-flex min-h-10 shrink-0 cursor-pointer items-center justify-center border-2 border-border bg-paper px-3 font-pixel text-[10px] transition-[transform,border-color,color] duration-100 hover:-translate-x-px hover:-translate-y-px hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label="关闭 Inspect Item"
            >
              CLOSE ×
            </button>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 lg:px-5 lg:py-5">
            <div className="grid min-w-0 gap-5 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-6">
              <div className="flex min-h-[190px] items-center justify-center border-2 border-border bg-soft p-5">
                <PixelIcon assetId={fact.icon} decorative width={150} height={150} className="h-auto max-h-[150px] w-auto max-w-[150px]" />
              </div>

              <div className="min-w-0">
                <p className="font-pixel text-[13px] leading-5 lg:text-[15px]">{fact.itemTitle}</p>
                <h3 className="mt-3 break-words text-[20px] font-semibold leading-8 lg:text-[22px]">{fact.title}</h3>
                <div className="mt-5 space-y-3 text-[14px] leading-7 text-muted lg:text-[15px]">
                  {fact.story.map((paragraph) => (
                    <p key={paragraph} className="break-words">{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <footer className="shrink-0 border-t border-divider px-4 py-3 lg:px-5">
            <div className="grid gap-3 text-[12px] sm:grid-cols-3 sm:items-center">
              <div className="min-w-0">
                <span className="font-pixel text-[9px] text-muted">TYPE:</span>
                <span className="ml-2 break-words font-medium">{fact.type}</span>
              </div>
              <div className="min-w-0 sm:text-center">
                <span className="font-pixel text-[9px] text-muted">RARITY:</span>
                <span className="ml-2 whitespace-nowrap" aria-label={`${fact.rarity} / 5 stars`}>
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <span key={starIndex} className={starIndex < fact.rarity ? "text-[#d5a300]" : "text-muted"}>★</span>
                  ))}
                </span>
              </div>
              <div className="min-w-0 sm:text-right">
                <span className="font-pixel text-[9px] text-muted">STATUS:</span>
                <span className="ml-2 break-words font-medium text-[#22863a]">{fact.status}</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>,
    document.body
  );
}
