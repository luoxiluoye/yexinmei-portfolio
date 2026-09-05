import { cn } from "@/lib/cn";

type XPBarProps = {
  current: number;
  max: number;
  level?: number;
  label?: string;
  showValue?: boolean;
  compact?: boolean;
  className?: string;
};

export function XPBar({
  current,
  max,
  level,
  label = "XP",
  showValue = true,
  compact = false,
  className,
}: XPBarProps) {
  const safeMax = Math.max(max, 1);
  const percentage = Math.min(Math.max((current / safeMax) * 100, 0), 100);

  if (compact) {
    return (
      <div className={cn("flex min-w-0 items-center gap-1.5", className)}>
        {typeof level === "number" && (
          <span className="shrink-0 font-pixel text-[10px]">LV.{level}</span>
        )}
        <span aria-hidden="true" className="font-pixel text-[9px] text-muted">·</span>
        <div
          role="progressbar"
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-valuenow={current}
          className="relative h-[10px] w-[var(--rpg-xp-width-mobile)] overflow-hidden border border-border bg-paper lg:w-[var(--rpg-xp-width)]"
        >
          <div
            className="absolute inset-y-0 left-0 bg-accent"
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showValue && (
          <span className="shrink-0 font-pixel text-[9px] text-muted">
            {current}/{max}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={cn("min-w-0", className)}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {typeof level === "number" && (
            <span className="font-pixel text-[11px]">LV.{level}</span>
          )}
          <span className="font-pixel text-[11px] text-muted">{label}</span>
        </div>

        {showValue && (
          <span className="font-pixel text-[10px] text-muted">
            {current}/{max}
          </span>
        )}
      </div>

      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={current}
        className="relative h-[10px] w-full overflow-hidden border border-border bg-paper"
      >
        <div
          className="absolute inset-y-0 left-0 bg-accent"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
