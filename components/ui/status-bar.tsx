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
        "portfolio-status grid grid-cols-2 border border-border bg-foreground text-white md:grid-cols-4",
        className
      )}
    >
      {items.map((item, index) => (
        <div
          key={`${item.label}-${index}`}
          className="flex min-h-[var(--rpg-status-height-mobile)] min-w-0 items-center gap-2 px-3 font-pixel text-[10px] lg:min-h-[var(--rpg-status-height)]"
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
