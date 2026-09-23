"use client";

import Image from "next/image";
import { Link } from "next-view-transitions";

export type PortfolioCategory = "writing" | "photography" | "aigc" | "video";

const categoryMeta: Record<PortfolioCategory, { title: string; eyebrow: string; intro: string }> = {
  writing: {
    title: "文字作品",
    eyebrow: "WRITING",
    intro: "文章、策划文案与长内容作品将在这里按成品展示。",
  },
  photography: {
    title: "摄影作品",
    eyebrow: "PHOTOGRAPHY",
    intro: "以照片本身为主，保留系列浏览与单张放大。",
  },
  aigc: {
    title: "AIGC 视觉",
    eyebrow: "AIGC VISUAL",
    intro: "活动主视觉、海报与系列延展物料将在这里完整陈列。",
  },
  video: {
    title: "视频作品",
    eyebrow: "VIDEO",
    intro: "视频封面与播放器将直接承载完整作品。",
  },
};

const photographyItems = [
  "/assets/photos/portrait/portrait-01.jpeg",
  "/assets/photos/portrait/portrait-05.jpeg",
  "/assets/photos/portrait/portrait-08.jpeg",
  "/assets/photos/yu-chaoying-concert/concert-02.jpeg",
  "/assets/photos/yu-chaoying-concert/concert-05.jpeg",
  "/assets/photos/happy-mahua/still-02.jpeg",
  "/assets/photos/ziroom-campaign/campaign-03.jpeg",
  "/assets/photos/meituan-product/product-04.jpeg",
];

export function PortfolioGallery({ category }: { category: PortfolioCategory }) {
  const meta = categoryMeta[category];
  const hasPhotography = category === "photography";

  return (
    <main className="portfolio-gallery-page">
      <header className="portfolio-gallery-header">
        <Link href="/portfolio" className="portfolio-gallery-back">← 返回 3D 工作台</Link>
        <div>
          <p>{meta.eyebrow}</p>
          <h1>{meta.title}</h1>
          <span>{meta.intro}</span>
        </div>
      </header>

      {hasPhotography ? (
        <section className="portfolio-gallery-grid" aria-label="摄影作品">
          {photographyItems.map((src, index) => (
            <figure key={src} className={index % 3 === 0 ? "is-wide" : undefined}>
              <Image src={src} alt={`摄影作品 ${index + 1}`} fill sizes="(max-width: 800px) 100vw, 50vw" />
            </figure>
          ))}
        </section>
      ) : (
        <section className="portfolio-gallery-empty">
          <div className="portfolio-gallery-empty-frame" />
          <p>这里会直接接入你的真实成品，不添加职责、运营过程或重复的个人主页信息。</p>
        </section>
      )}
    </main>
  );
}
