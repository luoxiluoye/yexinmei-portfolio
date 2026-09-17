import { homeStats } from "@/data/home";
import { PixelIcon } from "@/components/ui/pixel-icon";

const statIcons = ["ui.sparkle", "items.key", "ui.star"] as const;

export function DataBadges() {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {homeStats.map((stat, index) => (
        <article
          key={stat.label}
          className="pixel-cut-frame rpg-stat-card group min-w-0"
        >
          <div className="pixel-cut-surface flex min-h-[78px] items-center gap-2.5 px-2.5 py-2.5 lg:min-h-[84px] lg:gap-3 lg:px-3">
            <div className="hidden h-[38px] w-[38px] shrink-0 items-center justify-center sm:flex lg:h-[42px] lg:w-[42px]">
              <PixelIcon
                assetId={statIcons[index]}
                decorative
                width={34}
                height={34}
                className="rpg-stat-icon h-auto max-h-[36px] w-auto max-w-[40px]"
              />
            </div>

            <div className="min-w-0">
              <strong className="block font-pixel text-[22px] font-bold leading-none tracking-[-0.035em] text-accent sm:text-[24px] lg:text-[26px]">
                {stat.value}
              </strong>
              <span className="mt-1.5 block text-[10px] font-medium leading-4 text-foreground/85 lg:text-[11px]">
                {stat.label}
              </span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
