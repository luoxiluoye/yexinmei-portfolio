import type { Metadata } from "next";
import { Pixelify_Sans } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";

import "./globals.css";
import "@/styles/experience-motion.css";
import "@/styles/red-leaf-transition.css";
import "@/styles/home-flow.css";

import { AchievementToaster } from "@/components/game/achievement-toaster";
import { SystemMenu } from "@/components/game/system-menu";
import { SystemOverlays } from "@/components/game/system-overlays";
import { Navbar } from "@/components/layout/navbar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SiteFooter } from "@/components/layout/site-footer";

const siteUrl = "https://yexinmei-portfolio.vercel.app";

const pixelFont = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-pixel-source",
  display: "swap",
  preload: true,
  adjustFontFallback: false,
  fallback: ["Courier New", "Lucida Console", "monospace"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "罗叶馨梅 | Yexinmei Luo",
    template: "%s | 罗叶馨梅",
  },
  description:
    "罗叶馨梅的个人作品集，聚焦内容运营、AI 产品与科技内容，包含社区新品运营、AI 互动叙事产品与个人项目。",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/assets/cat/cat-head.png",
    shortcut: "/assets/cat/cat-head.png",
    apple: "/assets/cat/cat-head.png",
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: siteUrl,
    siteName: "YEXINMEI LUO",
    title: "罗叶馨梅 | Content · AI Product · Tech",
    description: "内容运营 × AI 产品 × 科技内容。社区、新品、互动叙事与个人项目作品集。",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "罗叶馨梅个人作品集",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "罗叶馨梅 | Content · AI Product · Tech",
    description: "内容运营 × AI 产品 × 科技内容。",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="zh-CN" className={pixelFont.variable}>
        <body className="pb-[calc(var(--rpg-bottom-tab-height)+env(safe-area-inset-bottom))] lg:pb-0">
          <Navbar />
          <MobileNav />
          <SystemMenu />
          <SystemOverlays />
          <AchievementToaster />
          {children}
          <SiteFooter />
        </body>
      </html>
    </ViewTransitions>
  );
}
