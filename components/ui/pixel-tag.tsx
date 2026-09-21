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
  active: "border-[#e6b4ae] bg-[#f8e9e5] text-[#96362d]",
  ongoing: "border-[#dfd0ad] bg-[#f4eedf] text-[#796125]",
  completed: "border-[#c5d3c2] bg-[#edf2e9] text-[#43633d]",
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
            variant === "accent"
              ? "bg-white"
              : "bg-accent"
          )}
        />
      )}
      {children}
    </span>
  );
}

