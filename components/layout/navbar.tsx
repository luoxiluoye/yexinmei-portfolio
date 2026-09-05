"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";
import { profile } from "@/data/profile";
import { PixelIcon } from "@/components/ui/pixel-icon";
import { XPBar } from "@/components/ui/xp-bar";

const items = [
  { label: "HOME", href: "/" },
  { label: "PLAYER", href: "/player" },
  { label: "QUESTS", href: "/quests" },
  { label: "INVENTORY", href: "/inventory" },
  { label: "JOURNAL", href: "/journal" },
  { label: "CONTACT", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 hidden bg-background/95 py-2 lg:block">
      <div className="site-container pixel-cut-frame">
        <div className="pixel-cut-surface flex h-[48px] items-center justify-between gap-3 px-4 lg:px-5">
          <Link href="/" className="group flex shrink-0 items-center gap-2" aria-label="返回首页">
            <PixelIcon
              assetId="cat.head"
              alt=""
              decorative
              width={34}
              height={34}
              className="rpg-logo-cat"
            />
            <PixelIcon assetId="ui.heart" decorative width={18} height={18} />
          </Link>

          <nav aria-label="Main navigation" className="min-w-0 flex-1">
            <ul className="flex items-center gap-1">
              {items.map((item) => {
                const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex h-[38px] items-center border border-transparent px-3 font-pixel text-[12px] transition-[transform,background-color,border-color,color] hover:-translate-y-px",
                        active
                          ? "border-border bg-foreground text-white"
                          : "text-foreground hover:border-divider hover:bg-soft"
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-2 border-l border-divider pl-4">
            <PixelIcon assetId="items.potion" decorative width={20} height={20} />
            <XPBar
              compact
              level={profile.xp.level}
              current={profile.xp.current}
              max={profile.xp.max}
              label="XP"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
