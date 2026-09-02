import { homeStats } from "@/data/home";
import { PixelIcon } from "@/components/ui/pixel-icon";

const statIcons = ["ui.heart", "ui.star", "world.cloudSmall"] as const;

export function DataBadges() {
  return (
    <div className="grid grid-cols-3 gap-2 lg:gap-4">
      {homeStats.map((stat, index) => (
        <article key={stat.label} className="pixel-cut-frame min-w-0">
          <div className="pixel-cut-surface flex min-h-[78px] items-center gap-2 p-3 lg:min-h-[92px] lg:gap-3 lg:p-4">
            <PixelIcon
              assetId={statIcons[index]}
              decorative
              width={26}
              height={26}
              className="hidden shrink-0 sm:block"
            />
            <div className="min-w-0">
              <div className="flex flex-col gap-1 lg:flex-row lg:items-baseline lg:gap-2">
                <strong className="text-2xl font-black text-accent lg:text-3xl">
                  {stat.value}
                </strong>
                <span className="text-[11px] leading-4 lg:text-[12px]">
                  {stat.label}
                </span>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
