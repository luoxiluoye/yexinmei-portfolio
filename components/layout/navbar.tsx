"use client";

import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";

import { profile } from "@/data/profile";
import { navigationItems, isNavigationActive } from "@/lib/navigation";
import { openSystemMenu } from "@/lib/rpg-events";
import { PixelIcon } from "@/components/ui/pixel-icon";

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="portfolio-desktop-header">
      <div className="site-container portfolio-desktop-header-inner">
        <Link href="/" className="portfolio-brand" aria-label={`${profile.nameZh}，返回首页`}>
          <PixelIcon assetId="cat.head" decorative width={32} height={32} className="rpg-logo-cat" />
          <span className="portfolio-brand-name">
            <span>{profile.nameZh}<span aria-hidden="true" className="portfolio-brand-dot">.</span></span>
            <span className="portfolio-brand-caption">{profile.nameEn}</span>
          </span>
        </Link>

        <nav aria-label="主导航" className="portfolio-desktop-nav">
          <ul>
            {navigationItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isNavigationActive(pathname, item.href) ? "page" : undefined}
                  className="portfolio-desktop-nav-link"
                >
                  <span>{item.label}</span>
                  <span className="portfolio-nav-caption">{item.caption}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          onClick={openSystemMenu}
          className="portfolio-system-button"
          data-system-trigger
          aria-haspopup="dialog"
          aria-keyshortcuts="Meta+K Control+K"
          aria-label="打开快捷菜单，快捷键 Command K 或 Control K"
        >
          <PixelIcon assetId="items.chest" decorative width={18} height={18} />
          <span>快捷菜单</span>
          <kbd aria-hidden="true">⌘ K</kbd>
        </button>
      </div>
    </header>
  );
}
