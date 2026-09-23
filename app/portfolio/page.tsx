import type { Metadata } from "next";

import { PortfolioStudio } from "@/components/portfolio/portfolio-studio";

export const metadata: Metadata = {
  title: "作品集",
  description: "罗叶馨梅的 3D 作品集空间，展示文字、摄影、AIGC 视觉与视频作品。",
};

export default function PortfolioPage() {
  return (
    <main id="main-content" className="portfolio-studio-page">
      <PortfolioStudio />
    </main>
  );
}
