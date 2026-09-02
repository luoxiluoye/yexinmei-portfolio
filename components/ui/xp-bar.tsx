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

  return (
    <div className={cn("min-w-0", className)}>
      {!compact && (
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
      )}

      <div className={cn("flex items-center gap-2", compact && "gap-1.5")}>
        {compact && typeof level === "number" && (
          <span className="font-pixel text-[10px]">LV.{level}</span>
        )}

        <div
          role="progressbar"
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-valuenow={current}
          className={cn(
            "relative h-[10px] overflow-hidden border border-border bg-paper",
            compact
              ? "w-[var(--rpg-xp-width-mobile)] lg:w-[var(--rpg-xp-width)]"
              : "w-full"
          )}
        >
          <div
            className="absolute inset-y-0 left-0 bg-accent"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {compact && showValue && (
          <span className="hidden font-pixel text-[9px] text-muted xl:inline">
            {current}/{max}
          </span>
        )}
      </div>
    </div>
  );
}
