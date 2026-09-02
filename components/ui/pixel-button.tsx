import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type PixelButtonVariant = "primary" | "secondary" | "ghost";
type PixelButtonSize = "sm" | "md" | "lg";

type PixelButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: PixelButtonVariant;
  size?: PixelButtonSize;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  ariaLabel?: string;
};

const variantStyles: Record<PixelButtonVariant, string> = {
  primary:
    "border-border bg-foreground text-white hover:border-accent hover:bg-accent",
  secondary:
    "border-border bg-paper text-foreground hover:border-accent hover:text-accent",
  ghost:
    "border-transparent bg-transparent text-foreground hover:border-border hover:bg-soft",
};

const sizeStyles: Record<PixelButtonSize, string> = {
  sm: "min-h-12 px-3 text-[11px] lg:min-h-11",
  md: "min-h-12 px-4 text-[12px] lg:min-h-11",
  lg: "min-h-12 px-5 text-[12px] lg:min-h-11",
};

export function PixelButton({
  children,
  href,
  variant = "secondary",
  size = "md",
  className,
  disabled,
  type = "button",
  onClick,
  ariaLabel,
}: PixelButtonProps) {
  const styles = cn(
    "inline-flex items-center justify-center gap-2 border-2 font-pixel uppercase tracking-[0.02em]",
    "transition-[transform,background-color,border-color,color] duration-100",
    "hover:-translate-x-px hover:-translate-y-px",
    "active:translate-x-px active:translate-y-px",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:border-divider disabled:bg-soft disabled:text-muted disabled:opacity-70",
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  if (href && !disabled) {
    return (
      <Link href={href} aria-label={ariaLabel} className={styles}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      className={styles}
    >
      {children}
    </button>
  );
}
