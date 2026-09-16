"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { Link } from "next-view-transitions";

import { HomeWorld } from "@/components/home/home-world";
import { openQuickProfile } from "@/lib/rpg-events";

const delay = (ms: number) => ({ "--enter-delay": `${ms}ms` }) as CSSProperties;

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("yexinmei:intro-seen") && ref.current) {
        ref.current.dataset.returning = "true";
      }
      sessionStorage.setItem("yexinmei:intro-seen", "true");
    } catch {
      /* Storage is optional. */
    }
  }, []);

  return (
    <section ref={ref} className="studio-hero" data-motion="on" aria-labelledby="home-title">
      <div className="studio-hero-meta studio-enter" style={delay(0)}>
        <span className="studio-kicker">YEXINMEI LUO <span className="studio-meta-slash">/</span> PERSONAL PORTFOLIO</span>
      </div>

      <div className="studio-hero-layout">
        <div className="studio-hero-copy">
          <p className="studio-introduction studio-enter" style={delay(80)}>
            <span className="studio-intro-cross" aria-hidden="true">✳</span>
            你好，我是罗叶馨梅
          </p>

          <h1 id="home-title" className="studio-headline">
            <span className="studio-title-line"><span>把好奇，</span></span>
            <span className="studio-title-line studio-title-accent"><span>变成作品。</span></span>
          </h1>

          <div className="studio-enter" style={delay(280)}>
            <p className="studio-hero-role">内容运营 <span>×</span> AI 产品 <span>×</span> 科技内容</p>
            <p className="studio-hero-description">
              研究用户为什么停留，也探索内容还能怎样表达。<br className="studio-desktop-break" />
              在工作与生活之间，把有意思的想法真正做出来。
            </p>
          </div>

          <div className="studio-hero-actions studio-enter" style={delay(400)}>
            <Link href="/quests" className="studio-button studio-button-primary">
              探索我的项目 <span aria-hidden="true">↗</span>
            </Link>
            <button type="button" className="studio-button studio-button-quiet" onClick={openQuickProfile}>
              60 秒了解我 <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        <HomeWorld />
      </div>

      <div className="studio-hero-bottom studio-enter" style={delay(520)}>
        <a className="studio-scroll-link" href="#flagship-project">
          <span aria-hidden="true">↓</span>先看一个我真正做出来的东西
        </a>
      </div>
    </section>
  );
}
