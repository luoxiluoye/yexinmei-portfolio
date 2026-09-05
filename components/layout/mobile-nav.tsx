"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { profile } from "@/data/profile";
import { PixelIcon } from "@/components/ui/pixel-icon";
import { XPBar } from "@/components/ui/xp-bar";
import { cn } from "@/lib/cn";

const mobileItems = [
  { label: "HOME", href: "/", assetId: "ui.heart" as const },
  { label: "QUESTS", href: "/quests", assetId: "items.sword" as const },
  { label: "PLAYER", href: "/player", assetId: "character.avatar" as const },
  { label: "CONTACT", href: "/contact", assetId: "items.mail" as const },
];

const moreItems = [
  { label: "INVENTORY", href: "/inventory", assetId: "items.chest" as const },
  { label: "JOURNAL", href: "/journal", assetId: "items.notebook" as const },
];

export function MobileNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreButtonRef = useRef<HTMLButtonElement | null>(null);
  const moreActive = moreItems.some((item) => pathname.startsWith(item.href));

  const closeMore = useCallback((restoreFocus = false) => {
    setMoreOpen(false);
    if (restoreFocus) {
      window.requestAnimationFrame(() => {
        moreButtonRef.current?.focus({ preventScroll: true });
      });
    }
  }, []);

  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!moreOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      closeMore(true);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [closeMore, moreOpen]);

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

      {moreOpen && (
        <>
          <div
            aria-hidden="true"
            className="fixed inset-0 z-[55] bg-black/20 lg:hidden"
            onMouseDown={() => closeMore(true)}
          />
          <div className="fixed inset-x-4 bottom-[calc(var(--rpg-bottom-tab-height)+env(safe-area-inset-bottom)+12px)] z-[60] lg:hidden">
            <div className="pixel-cut-frame shadow-[4px_4px_0_rgba(17,17,17,.14)]">
              <div className="pixel-cut-surface p-3">
                <div className="mb-2 flex items-center justify-between border-b border-divider pb-2">
                  <span className="font-pixel text-[10px] text-accent">MORE MENU</span>
                  <button
                    type="button"
                    onClick={() => closeMore(true)}
                    className="min-h-11 min-w-11 border border-divider bg-soft font-pixel text-[12px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    aria-label="关闭更多菜单"
                  >
                    ×
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {moreItems.map((item) => {
                    const active = pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex min-h-14 items-center gap-2 border-2 px-3 font-pixel text-[11px]",
                          active
                            ? "border-border bg-foreground text-white"
                            : "border-divider bg-soft text-foreground"
                        )}
                      >
                        <PixelIcon
                          assetId={item.assetId}
                          decorative
                          width={22}
                          height={22}
                          className={cn(active && "brightness-0 invert")}
                        />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

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
              ref={moreButtonRef}
              type="button"
              aria-expanded={moreOpen}
              aria-current={moreActive ? "page" : undefined}
              onClick={() => setMoreOpen((open) => !open)}
              className={cn(
                "relative flex h-full w-full min-h-11 flex-col items-center justify-center gap-1 font-pixel text-[9px] sm:text-[10px]",
                moreActive || moreOpen ? "bg-white text-foreground" : "text-white"
              )}
            >
              <PixelIcon
                assetId="items.chest"
                decorative
                width={20}
                height={20}
                className={cn(!(moreActive || moreOpen) && "brightness-0 invert")}
              />
              MORE
              {(moreActive || moreOpen) && (
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
