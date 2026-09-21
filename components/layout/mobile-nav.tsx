"use client";

import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";

import { profile } from "@/data/profile";
import { PixelIcon } from "@/components/ui/pixel-icon";
import { mobileNavigationItems, isNavigationActive } from "@/lib/navigation";
import { openSystemMenu } from "@/lib/rpg-events";

export function MobileNav() {
  const pathname = usePathname();
  const moreActive = ["/inventory", "/journal"].some((href) => isNavigationActive(pathname, href));

  return (
    <>
      <header className="portfolio-mobile-header">
        <div className="site-container portfolio-mobile-header-inner">
          <Link href="/" className="portfolio-brand" aria-label={`${profile.nameZh}，返回首页`}>
            <PixelIcon assetId="cat.head" decorative width={28} height={28} />
            <span className="portfolio-brand-name">
              <span>{profile.nameZh}<span aria-hidden="true" className="portfolio-brand-dot">.</span></span>
              <span className="portfolio-brand-caption">{profile.nameEn}</span>
            </span>
          </Link>

          <button
            type="button"
            className="portfolio-mobile-menu"
            onClick={openSystemMenu}
            data-system-trigger
            aria-haspopup="dialog"
            aria-label="打开快捷菜单"
          >
            <span>菜单</span>
            <span aria-hidden="true" className="portfolio-menu-glyph"><span /><span /></span>
          </button>
        </div>
      </header>

      <nav aria-label="移动端导航" className="portfolio-mobile-nav">
        <ul>
          {mobileNavigationItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isNavigationActive(pathname, item.href) ? "page" : undefined}
                className="portfolio-mobile-nav-link"
              >
                <PixelIcon assetId={item.assetId} decorative width={20} height={20} />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}

          <li>
            <button
              type="button"
              aria-haspopup="dialog"
              aria-label={moreActive ? "更多导航，当前位于工具箱或手记" : "打开更多导航"}
              data-active={moreActive || undefined}
              data-system-trigger
              onClick={openSystemMenu}
              className="portfolio-mobile-nav-link"
            >
              <PixelIcon assetId="items.chest" decorative width={20} height={20} />
              <span>更多</span>
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
