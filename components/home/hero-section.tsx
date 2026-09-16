"use client";

import { HomeWorld } from "@/components/home/home-world";

const proofSignals = [
  {
    label: "CURRENT",
    value: "知乎 · 数码 / 新品运营",
    detail: "社区内容、消费电子与新品",
  },
  {
    label: "BUILT FROM 0→1",
    value: "赤页 RED LEAF",
    detail: "AI 互动叙事产品 · 可在线体验",
  },
  {
    label: "RESULT",
    value: "20W+ GMV",
    detail: "CCD 个人项目 · 内容获客与经营",
  },
  {
    label: "BACKGROUND",
    value: "电子科技大学 · 2027",
    detail: "新闻与传播硕士",
  },
] as const;

export function HeroSection() {
  return (
    <section className="studio-hero" data-motion="calm" aria-labelledby="home-title">
      <div className="studio-hero-meta">
        <span className="studio-kicker">
          YEXINMEI LUO <span className="studio-meta-slash">/</span> PERSONAL PORTFOLIO
        </span>
      </div>

      <div className="studio-hero-layout">
        <div className="studio-hero-copy">
          <p className="studio-introduction">
            <span className="studio-intro-cross" aria-hidden="true">✳</span>
            你好，我是罗叶馨梅
          </p>

          <h1 id="home-title" className="studio-headline">
            <span className="block">把好奇，</span>
            <span className="block text-accent">变成作品。</span>
          </h1>

          <p className="studio-hero-role">
            内容运营 <span>×</span> AI 产品 <span>×</span> 科技内容
          </p>
          <p className="studio-hero-description">
            电子科技大学新闻与传播硕士，现做知乎数码 / 新品运营。
            <br className="studio-desktop-break" />
            做内容、研究用户，也把 AI 想法做成真正可以使用的产品。
          </p>

          <div className="studio-hero-actions">
            <a href="#flagship-project" className="studio-button studio-button-primary">
              先看代表作 <span aria-hidden="true">↓</span>
            </a>
            <a href="#selected-work" className="studio-button studio-button-quiet">
              看其他项目 <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <HomeWorld />
      </div>

      <div className="home-proof-grid" aria-label="核心经历与结果">
        {proofSignals.map((signal) => (
          <div key={signal.label} className="home-proof-item">
            <span className="home-proof-label">{signal.label}</span>
            <strong className="home-proof-value">{signal.value}</strong>
            <span className="home-proof-detail">{signal.detail}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
