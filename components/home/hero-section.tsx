"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { Link } from "next-view-transitions";

import { HomeWorld } from "@/components/home/home-world";
import { openQuickProfile } from "@/lib/rpg-events";

const delay = (ms: number) => ({ "--enter-delay": `${ms}ms` }) as CSSProperties;

const recruiterSignals = [
  {
    label: "EDU · 2027",
    value: "电子科技大学",
    detail: "新闻与传播硕士",
    href: "/player",
  },
  {
    label: "NOW · ZHIHU",
    value: "数码 / 新品运营",
    detail: "社区内容与新品",
    href: "/quests/zhihu-auto-consumer-tech",
  },
  {
    label: "BUILT · 0→1",
    value: "赤页 RED LEAF",
    detail: "AI 互动叙事产品",
    href: "/quests/red-leaf",
  },
  {
    label: "RESULT · 20W+",
    value: "CCD 小生意",
    detail: "个人项目累计 GMV",
    href: "/quests/ccd-business",
  },
] as const;

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem("yexinmei:intro-seen") && ref.current) {
      ref.current.dataset.returning = "true";
    }
    sessionStorage.setItem("yexinmei:intro-seen", "true");
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
              HR 60 秒速览 <span aria-hidden="true">→</span>
            </button>
          </div>

          <div
            className="studio-enter mt-7 max-w-[680px] border-y border-divider"
            style={delay(470)}
            aria-label="招聘者十秒快速信息"
          >
            <div className="flex items-center justify-between gap-3 border-b border-divider py-2">
              <span className="font-pixel text-[9px] tracking-[0.08em] text-accent">RECRUITER SNAPSHOT · 10 SEC</span>
              <button
                type="button"
                onClick={openQuickProfile}
                className="font-pixel text-[8px] text-muted transition-colors hover:text-accent"
              >
                OPEN PROFILE →
              </button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4">
              {recruiterSignals.map((signal, index) => (
                <Link
                  key={signal.label}
                  href={signal.href}
                  className={[
                    "group min-w-0 px-3 py-3 transition-colors hover:bg-soft",
                    index % 2 === 1 ? "border-l border-divider" : "",
                    index >= 2 ? "border-t border-divider lg:border-t-0" : "",
                    index > 0 ? "lg:border-l lg:border-divider" : "lg:border-l-0",
                  ].join(" ")}
                >
                  <span className="block font-pixel text-[8px] tracking-[0.04em] text-muted group-hover:text-accent">
                    {signal.label}
                  </span>
                  <strong className="mt-1.5 block truncate text-[12px] font-semibold leading-5 lg:text-[13px]">
                    {signal.value}
                  </strong>
                  <span className="mt-0.5 block truncate text-[10px] leading-4 text-muted">
                    {signal.detail}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <HomeWorld />
      </div>

      <div className="studio-hero-bottom studio-enter" style={delay(560)}>
        <a className="studio-scroll-link" href="#flagship-project">
          <span aria-hidden="true">↓</span>先看一个我真正做出来的东西
        </a>
      </div>
    </section>
  );
}
