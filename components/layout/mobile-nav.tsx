"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { PixelIcon } from "@/components/ui/pixel-icon";
import { XPBar } from "@/components/ui/xp-bar";
import { cn } from "@/lib/cn";

const mobileItems = [
  { label: "HOME", href: "/", assetId: "ui.heart" as const },
  { label: "QUESTS", href: "/quests", assetId: "items.sword" as const },
  { label: "PLAYER", href: "/player", assetId: "character.avatar" as const },
  { label: "CONTACT", href: "/contact", assetId: "items.mail" as const },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-40 border-b-2 border-border bg-background lg:hidden">
        <div className="flex h-[var(--rpg-mobile-header-height)] items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <PixelIcon assetId="cat.head" decorative width={30} height={30} />
            <span className="font-pixel text-[16px] leading-none">YEXINMEI LUO</span>
          </Link>

          <span className="font-pixel text-[11px] text-muted">LV.28</span>
        </div>

        <div className="flex h-[var(--rpg-mobile-level-height)] items-center justify-between border-t border-divider bg-soft px-4">
          <span className="font-pixel text-[10px] text-muted">PLAYER STATUS</span>
          <XPBar compact level={28} current={7888} max={10000} />
        </div>
      </header>

      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-border bg-foreground pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        <ul className="grid h-[var(--rpg-bottom-tab-height)] grid-cols-4">
          {mobileItems.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex h-full min-h-11 flex-col items-center justify-center gap-1 font-pixel text-[10px]",
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
        </ul>
      </nav>
    </>
  );
}
