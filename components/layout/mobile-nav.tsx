"use client";

import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";

import { PixelIcon } from "@/components/ui/pixel-icon";
import { openSystemMenu } from "@/lib/rpg-events";

const mobileItems = [
  { label: "首页", href: "/", assetId: "ui.heart" as const },
  { label: "项目", href: "/quests", assetId: "items.sword" as const },
  { label: "关于我", href: "/player", assetId: "character.avatar" as const },
  { label: "联系", href: "/contact", assetId: "items.mail" as const },
];

const moreRoutes = ["/inventory", "/journal"];

export function MobileNav() {
  const pathname = usePathname();
  const moreActive = moreRoutes.some((href) => pathname.startsWith(href));

  return (
    <>
      <header className="portfolio-mobile-header">
        <div className="site-container portfolio-mobile-header-inner">
          <Link href="/" className="group portfolio-brand" aria-label="罗叶馨梅，返回首页">
            <PixelIcon assetId="cat.head" decorative width={30} height={30} className="rpg-logo-cat" />
            <span className="portfolio-brand-name">
              <span>罗叶馨梅<span aria-hidden="true" className="portfolio-brand-dot">.</span></span>
              <span className="font-pixel portfolio-brand-caption">YEXINMEI LUO</span>
            </span>
          </Link>

          <button type="button" data-system-trigger onClick={openSystemMenu} className="portfolio-mobile-menu" aria-haspopup="dialog" aria-label="打开快捷菜单">
            <span className="font-pixel">MENU</span>
            <span className="portfolio-menu-glyph" aria-hidden="true"><span /><span /></span>
          </button>
        </div>
      </header>

      <nav aria-label="移动端导航" className="portfolio-mobile-nav">
        <ul>
          {mobileItems.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link href={item.href} aria-current={active ? "page" : undefined} className="portfolio-mobile-nav-link">
                  <PixelIcon assetId={item.assetId} decorative width={20} height={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
          <li>
            <button type="button" data-system-trigger aria-haspopup="dialog" aria-label="更多：技能、手记与快捷操作" data-active={moreActive || undefined} onClick={openSystemMenu} className="portfolio-mobile-nav-link">
              <PixelIcon assetId="items.chest" decorative width={20} height={20} />
              <span>更多</span>
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
