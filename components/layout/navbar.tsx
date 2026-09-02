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
    <header className="sticky top-0 z-50 hidden h-[var(--rpg-navbar-height)] border-b-2 border-border bg-background lg:block">
      <div className="site-container flex h-full items-center justify-between gap-5">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <PixelIcon
            assetId="cat.head"
            alt=""
            decorative
            width={34}
            height={34}
          />
          <span className="truncate font-pixel text-[18px] leading-none">
            YEXINMEI LUO
          </span>
          <span className="text-accent">♥</span>
          <span className="hidden font-pixel text-[13px] text-muted xl:inline">
            · PIXEL RPG PORTFOLIO
          </span>
        </Link>

        <nav aria-label="Main navigation" className="shrink-0">
          <ul className="flex items-center gap-1">
            {items.map((item) => {
              const active =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex h-[38px] items-center px-2.5 font-pixel text-[12px] transition-colors",
                      active
                        ? "bg-foreground text-white"
                        : "text-foreground hover:bg-soft"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
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
    </header>
  );
}
