import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type PixelTagVariant =
  | "default"
  | "accent"
  | "dark"
  | "active"
  | "ongoing"
  | "completed";

type PixelTagProps = {
  children: ReactNode;
  variant?: PixelTagVariant;
  dot?: boolean;
  className?: string;
};

const variants: Record<PixelTagVariant, string> = {
  default: "border-divider bg-soft text-foreground",
  accent: "border-accent bg-accent text-white",
  dark: "border-border bg-foreground text-white",
  active: "border-accent bg-accent text-white",
  ongoing: "border-[#c99c1c] bg-yellow text-foreground",
  completed: "border-[#5b9558] bg-green text-foreground",
};

export function PixelTag({
  children,
  variant = "default",
  dot = false,
  className,
}: PixelTagProps) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 border px-2 font-pixel text-[11px] leading-none",
        variants[variant],
        className
      )}
    >
      {dot && (
        <span
          aria-hidden="true"
          className={cn(
            "rpg-blink h-1.5 w-1.5",
            variant === "accent" || variant === "active"
              ? "bg-white"
              : "bg-accent"
          )}
        />
      )}
      {children}
    </span>
  );
}
