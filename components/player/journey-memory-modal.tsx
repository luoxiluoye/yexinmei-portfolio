"use client";

import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { createPortal } from "react-dom";

import { PixelIcon } from "@/components/ui/pixel-icon";
import type { Memory } from "@/components/player/journey-data";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function JourneyMemoryModal({
  memory,
  index,
  total,
  onClose,
  onPrev,
  onNext,
}: {
  memory: Memory;
  index: number;
  total: number;
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

    const focusFrame = window.requestAnimationFrame(() => {
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
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, [mounted, onClose]);

  if (!mounted) return null;

  const titleId = `memory-dialog-title-${index}`;

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 px-3 pb-[calc(12px+env(safe-area-inset-bottom))] pt-[calc(12px+env(safe-area-inset-top))] lg:p-10"
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
        <div className="pixel-cut-surface flex max-h-[calc(100dvh_-_24px_-_env(safe-area-inset-top)_-_env(safe-area-inset-bottom))] min-h-0 flex-col bg-paper lg:max-h-[min(760px,calc(100vh-80px))]">
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
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
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
