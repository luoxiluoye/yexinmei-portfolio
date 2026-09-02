import { homeStats } from "@/data/home";
import { PixelIcon } from "@/components/ui/pixel-icon";

const statIcons = ["ui.heart", "ui.star", "world.cloudSmall"] as const;

export function DataBadges() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {homeStats.map((stat, index) => (
        <article key={stat.label} className="pixel-cut-frame min-w-0">
          <div className="pixel-cut-surface flex min-h-[72px] items-center gap-2 px-3 py-2.5">
            <PixelIcon
              assetId={statIcons[index]}
              decorative
              width={22}
              height={index === 2 ? 17 : 22}
              className="hidden shrink-0 sm:block"
            />
            <div className="min-w-0">
              <strong className="block text-[22px] font-black leading-none text-accent lg:text-[24px]">
                {stat.value}
              </strong>
              <span className="mt-1 block text-[10px] leading-4 lg:text-[11px]">
                {stat.label}
              </span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
