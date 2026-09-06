"use client";

import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";

import { profile } from "@/data/profile";
import { PixelIcon } from "@/components/ui/pixel-icon";
import { XPBar } from "@/components/ui/xp-bar";
import { cn } from "@/lib/cn";
import { openSystemMenu } from "@/lib/rpg-events";

const mobileItems = [
  { label: "HOME", href: "/", assetId: "ui.heart" as const },
  { label: "QUESTS", href: "/quests", assetId: "items.sword" as const },
  { label: "PLAYER", href: "/player", assetId: "character.avatar" as const },
  { label: "CONTACT", href: "/contact", assetId: "items.mail" as const },
];

const moreRoutes = ["/inventory", "/journal"];

export function MobileNav() {
  const pathname = usePathname();
  const moreActive = moreRoutes.some((href) => pathname.startsWith(href));

  return (
    <>
      <header className="sticky top-0 z-40 border-b-2 border-border bg-background lg:hidden">
        <div className="flex h-[var(--rpg-mobile-header-height)] items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <PixelIcon assetId="cat.head" decorative width={30} height={30} />
            <span className="font-pixel text-[16px] leading-none">YEXINMEI LUO</span>
          </Link>

          <span className="flex items-center gap-1.5 font-pixel text-[10px] text-muted">
            <span aria-hidden="true" className="h-1.5 w-1.5 bg-accent" />
            ONLINE
          </span>
        </div>

        <div className="flex h-[var(--rpg-mobile-level-height)] items-center justify-between border-t border-divider bg-soft px-4">
          <span className="font-pixel text-[10px] text-muted">PLAYER STATUS</span>
          <XPBar
            compact
            level={profile.xp.level}
            current={profile.xp.current}
            max={profile.xp.max}
          />
        </div>
      </header>

      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-border bg-foreground pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        <ul className="grid h-[var(--rpg-bottom-tab-height)] grid-cols-5">
          {mobileItems.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex h-full min-h-11 flex-col items-center justify-center gap-1 font-pixel text-[9px] sm:text-[10px]",
                    active ? "bg-white text-foreground" : "text-white"
                  )}
                >
                  <PixelIcon
                    assetId={item.assetId}
                    decorative
                    width={20}
                    height={20}
                    className={cn(!active && "brightness-0 invert")}
                  />
                  {item.label}
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-3 top-0 h-[3px] bg-accent"
                    />
                  )}
                </Link>
              </li>
            );
          })}

          <li>
            <button
              type="button"
              aria-haspopup="dialog"
              aria-current={moreActive ? "page" : undefined}
              onClick={openSystemMenu}
              className={cn(
                "relative flex h-full w-full min-h-11 flex-col items-center justify-center gap-1 font-pixel text-[9px] sm:text-[10px]",
                moreActive ? "bg-white text-foreground" : "text-white"
              )}
            >
              <PixelIcon
                assetId="items.chest"
                decorative
                width={20}
                height={20}
                className={cn(!moreActive && "brightness-0 invert")}
              />
              MORE
              {moreActive && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-3 top-0 h-[3px] bg-accent"
                />
              )}
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
