import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export type StatusItem = {
  label: string;
  value: ReactNode;
  accent?: boolean;
};

type StatusBarProps = {
  items: StatusItem[];
  className?: string;
};

export function StatusBar({ items, className }: StatusBarProps) {
  return (
    <div
      className={cn(
        "no-scrollbar flex min-h-[var(--rpg-status-height-mobile)] overflow-x-auto border-2 border-border bg-foreground text-white lg:grid lg:min-h-[var(--rpg-status-height)] lg:grid-cols-4 lg:overflow-visible",
        className
      )}
    >
      {items.map((item, index) => (
        <div
          key={`${item.label}-${index}`}
          className="flex min-w-[132px] shrink-0 items-center gap-2 border-r border-white/20 px-3 font-pixel text-[10px] last:border-r-0 lg:min-w-0 lg:shrink"
        >
          <span className="text-white/55">{item.label}</span>
          <span className={cn("truncate", item.accent ? "text-accent" : "text-white")}>
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}
