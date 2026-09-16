"use client";

import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";

import { PixelIcon } from "@/components/ui/pixel-icon";
import { openSystemMenu } from "@/lib/rpg-events";
import "@/styles/navigation.css";

const items = [
  { label: "关于我", gameLabel: "PLAYER", href: "/player" },
  { label: "项目", gameLabel: "QUESTS", href: "/quests" },
  { label: "技能", gameLabel: "INVENTORY", href: "/inventory" },
  { label: "手记", gameLabel: "JOURNAL", href: "/journal" },
  { label: "联系", gameLabel: "CONTACT", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="portfolio-desktop-header">
      <div className="site-container portfolio-desktop-header-inner">
        <Link href="/" className="group portfolio-brand" aria-label="罗叶馨梅，返回首页">
          <PixelIcon assetId="cat.head" decorative width={34} height={34} className="rpg-logo-cat" />
          <span className="portfolio-brand-name">
            <span>罗叶馨梅<span aria-hidden="true" className="portfolio-brand-dot">.</span></span>
            <span className="font-pixel portfolio-brand-caption">YEXINMEI LUO</span>
          </span>
        </Link>

        <nav aria-label="主导航" className="portfolio-desktop-nav">
          <ul>
            {items.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link href={item.href} aria-current={active ? "page" : undefined} className="portfolio-desktop-nav-link">
                    <span>{item.label}</span>
                    <span className="font-pixel portfolio-nav-caption" aria-hidden="true">{item.gameLabel}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          type="button"
          data-system-trigger
          onClick={openSystemMenu}
          className="portfolio-system-button"
          aria-haspopup="dialog"
          aria-label="打开快捷菜单，快捷键 Command K 或 Control K"
        >
          <PixelIcon assetId="items.chest" decorative width={18} height={18} />
          <span className="font-pixel">SYSTEM</span>
          <kbd aria-hidden="true">⌘ K</kbd>
        </button>
      </div>
    </header>
  );
}
