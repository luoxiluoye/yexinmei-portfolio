import type { Metadata } from "next";
import { Pixelify_Sans } from "next/font/google";

import "./globals.css";

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
    "罗叶馨梅的像素 RPG 个人作品集，聚焦内容运营、社区与科技内容。",
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
    title: "罗叶馨梅 | Content · Community · Tech",
    description: "内容运营 × 社区 × 科技内容。一个轻复古 Pixel RPG 风格的个人作品集。",
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
    title: "罗叶馨梅 | Content · Community · Tech",
    description: "内容运营 × 社区 × 科技内容。",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={pixelFont.variable}>
      <body className="pb-[calc(var(--rpg-bottom-tab-height)+env(safe-area-inset-bottom))] lg:pb-0">
        <Navbar />
        <MobileNav />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
