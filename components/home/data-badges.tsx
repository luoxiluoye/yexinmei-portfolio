import { homeStats } from "@/data/home";
import { PixelIcon } from "@/components/ui/pixel-icon";

const statIcons = ["ui.heart", "ui.star", "world.cloudSmall"] as const;

export function DataBadges() {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {homeStats.map((stat, index) => (
        <article
          key={stat.label}
          className="pixel-cut-frame rpg-stat-card group min-w-0"
        >
          <div className="pixel-cut-surface flex min-h-[86px] items-center gap-2.5 px-3 py-3 lg:min-h-[92px] lg:gap-3 lg:px-3.5">
            <div className="hidden h-[42px] w-[42px] shrink-0 items-center justify-center sm:flex lg:h-[46px] lg:w-[46px]">
              <PixelIcon
                assetId={statIcons[index]}
                decorative
                width={index === 2 ? 44 : 36}
                height={index === 2 ? 33 : 36}
                className="rpg-stat-icon h-auto max-h-[38px] w-auto max-w-[44px]"
              />
            </div>

            <div className="min-w-0">
              <strong className="block font-pixel text-[25px] font-bold leading-none tracking-[-0.035em] text-accent sm:text-[27px] lg:text-[30px]">
                {stat.value}
              </strong>
              <span className="mt-1.5 block text-[11px] font-medium leading-4 text-foreground/85 lg:text-[12px] lg:leading-[18px]">
                {stat.label}
              </span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
