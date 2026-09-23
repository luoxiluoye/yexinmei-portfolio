import type { AssetId } from "@/lib/assets";

type NavigationItem = {
  label: string;
  caption: string;
  href: string;
  assetId: AssetId;
};

export const navigationItems = [
  { label: "首页", caption: "HOME", href: "/", assetId: "ui.heart" },
  { label: "作品集", caption: "PORTFOLIO", href: "/portfolio", assetId: "items.camera" },
  { label: "关于我", caption: "PLAYER", href: "/player", assetId: "character.avatar" },
  { label: "工具箱", caption: "INVENTORY", href: "/inventory", assetId: "items.chest" },
  { label: "手记", caption: "JOURNAL", href: "/journal", assetId: "items.notebook" },
  { label: "联系我", caption: "CONTACT", href: "/contact", assetId: "items.mail" },
] as const satisfies readonly NavigationItem[];

export const mobileNavigationItems = navigationItems.filter((item) =>
  ["/", "/portfolio", "/player", "/contact"].includes(item.href)
);

export function isNavigationActive(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
}
