import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import { PixelIcon } from "./pixel-icon";

type PixelPanelProps = {
  children: ReactNode;
  title?: string;
  eyebrow?: string;
  rightSlot?: ReactNode;
  accent?: boolean;
  catPeek?: boolean;
  windowChrome?: boolean;
  className?: string;
  surfaceClassName?: string;
  contentClassName?: string;
};

export function PixelPanel({
  children,
  title,
  eyebrow,
  rightSlot,
  accent = false,
  catPeek = false,
  windowChrome = true,
  className,
  surfaceClassName,
  contentClassName,
}: PixelPanelProps) {
  return (
    <section className={cn("pixel-cut-frame", className)}>
      <div className={cn("pixel-cut-surface relative", surfaceClassName)}>
        {accent && (
          <span
            aria-hidden="true"
            className="absolute left-0 top-[var(--rpg-pixel-cut)] h-8 w-1 bg-accent"
          />
        )}

        {catPeek && (
          <PixelIcon
            assetId="cat.peek"
            decorative
            width={58}
            height={58}
            className="absolute -right-1 -top-7 z-10"
          />
        )}

        {(title || eyebrow || rightSlot) && (
          <div className="flex min-h-[42px] items-center justify-between gap-4 border-b border-divider px-4 lg:px-5">
            <div className="min-w-0">
              {eyebrow && (
                <p className="font-pixel text-[10px] leading-4 text-accent">
                  {eyebrow}
                </p>
              )}
              {title && (
                <h2 className="truncate font-pixel text-[14px] leading-5 lg:text-[17px]">
                  {title}
                </h2>
              )}
            </div>

            {rightSlot ? (
              <div className="shrink-0">{rightSlot}</div>
            ) : windowChrome ? (
              <div aria-hidden="true" className="hidden shrink-0 items-center gap-2 font-pixel text-[11px] leading-none text-muted lg:flex">
                <span>−</span>
                <span>□</span>
                <span>×</span>
              </div>
            ) : null}
          </div>
        )}

        <div className={cn("p-4 lg:p-5", contentClassName)}>{children}</div>
      </div>
    </section>
  );
}
