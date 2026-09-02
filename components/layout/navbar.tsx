"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";
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
    <header className="sticky top-0 z-50 hidden bg-background/95 py-3 backdrop-blur-[2px] lg:block">
      <div className="site-container pixel-cut-frame">
        <div className="pixel-cut-surface flex h-[58px] items-center justify-between gap-4 px-4 xl:px-5">
          <Link href="/" className="group flex shrink-0 items-center gap-2" aria-label="返回首页">
            <PixelIcon
              assetId="cat.head"
              alt=""
              decorative
              width={36}
              height={36}
              className="rpg-logo-cat"
            />
            <PixelIcon assetId="ui.heart" decorative width={20} height={20} />
          </Link>

          <nav aria-label="Main navigation" className="min-w-0 flex-1">
            <ul className="flex items-center gap-1.5">
              {items.map((item) => {
                const active =
                  item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex h-[38px] items-center border border-transparent px-3 font-pixel text-[11px] transition-[transform,background-color,border-color,color] hover:-translate-y-px",
                        active
                          ? "border-border bg-foreground text-white shadow-[2px_2px_0_rgba(17,17,17,.12)]"
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
            <PixelIcon assetId="items.potion" decorative width={22} height={22} />
            <XPBar
              compact
              level={28}
              current={7888}
              max={10000}
              label="XP"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
