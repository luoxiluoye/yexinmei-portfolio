import type { Metadata } from "next";
import { Pixelify_Sans, ZCOOL_QingKe_HuangYou } from "next/font/google";

import "./globals.css";

import { Navbar } from "@/components/layout/navbar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SiteFooter } from "@/components/layout/site-footer";

const pixelFont = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-pixel-source",
  display: "swap",
  preload: true,
  adjustFontFallback: false,
  fallback: ["Courier New", "Lucida Console", "monospace"],
});

const zhDisplayFont = ZCOOL_QingKe_HuangYou({
  weight: "400",
  variable: "--font-zh-display",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: "罗叶馨梅 | Yexinmei Luo",
    template: "%s | 罗叶馨梅",
  },
  description:
    "罗叶馨梅的像素 RPG 个人主页，聚焦新媒体、内容运营、社区与传播。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${pixelFont.variable} ${zhDisplayFont.variable}`}>
      <body className="pb-[calc(var(--rpg-bottom-tab-height)+env(safe-area-inset-bottom))] lg:pb-0">
        <Navbar />
        <MobileNav />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
