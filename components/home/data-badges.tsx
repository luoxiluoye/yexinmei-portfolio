import { homeStats } from "@/data/home";
import { PixelIcon } from "@/components/ui/pixel-icon";

const statIcons = ["ui.sparkle", "items.key", "ui.star"] as const;

export function DataBadges() {
  return (
    <div className="home-facts grid grid-cols-3">
      {homeStats.map((stat, index) => (
        <article
          key={stat.label}
          className="home-fact min-w-0"
        >
          <div className="flex min-h-[68px] items-center gap-2 px-2 py-3">
            <div className="hidden h-[24px] w-[24px] shrink-0 items-center justify-center sm:flex lg:h-[24px] lg:w-[24px]">
              <PixelIcon
                assetId={statIcons[index]}
                decorative
                width={24}
                height={24}
                className="rpg-stat-icon h-auto max-h-[24px] w-auto max-w-[24px]"
              />
            </div>

            <div className="min-w-0">
              <strong className="block font-pixel text-[22px] font-bold leading-none tracking-[-0.035em] text-accent sm:text-[24px] lg:text-[23px]">
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
