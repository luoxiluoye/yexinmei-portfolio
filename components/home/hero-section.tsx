"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "next-view-transitions";
import { openQuickProfile } from "@/lib/rpg-events";
import { HomeWorld } from "@/components/home/home-world";
const delay = (ms: number) => ({ "--enter-delay": `${ms}ms` }) as CSSProperties;
export function HeroSection() {
    const ref = useRef<HTMLElement>(null);
    const [motion, setMotion] = useState(true);
    useEffect(() => {
        try {
            if (sessionStorage.getItem("yexinmei:intro-seen") && ref.current)
                ref.current.dataset.returning = "true";
            sessionStorage.setItem("yexinmei:intro-seen", "true");
        }
        catch { /* Storage is optional. */ }
    }, []);
    function replay() {
        const node = ref.current;
        if (!node)
            return;
        node.dataset.returning = "false";
        node.getAnimations({ subtree: true }).forEach(animation => {
            if (animation.effect?.getTiming().iterations !== Infinity) {
                animation.currentTime = 0;
                animation.play();
            }
        });
    }
    return <section ref={ref} className="studio-hero" data-motion={motion ? "on" : "off"} aria-labelledby="home-title">
    <div className="studio-hero-meta studio-enter" style={delay(0)}>
      <span className="studio-kicker">YEXINMEI LUO <span className="studio-meta-slash">/</span> PERSONAL WORLD</span>
      <span className="studio-location"><span aria-hidden="true"/>成都，中国 <span className="font-pixel">↗</span></span>
    </div>
    <div className="studio-hero-layout">
      <div className="studio-hero-copy">
        <p className="studio-introduction studio-enter" style={delay(90)}><span className="studio-intro-cross" aria-hidden="true">✳</span>你好，我是罗叶馨梅</p>
        <h1 id="home-title" className="studio-headline"><span className="studio-title-line"><span>把好奇，</span></span><span className="studio-title-line studio-title-accent"><span>变成作品。</span></span></h1>
        <div className="studio-enter" style={delay(360)}><p className="studio-hero-role">内容运营 <span>×</span> 社区 <span>×</span> 科技内容</p><p className="studio-hero-description">研究用户为什么停留，也探索内容还能怎样表达。<br className="studio-desktop-break"/>在工作与生活之间，持续创作一点新东西。</p></div>
        <div className="studio-hero-actions studio-enter" style={delay(480)}><Link href="/quests" className="studio-button studio-button-primary">探索我的项目 <span aria-hidden="true">↗</span></Link><button type="button" className="studio-button studio-button-quiet" onClick={openQuickProfile}>60 秒了解我 <span aria-hidden="true">→</span></button></div>
        <div className="studio-hero-note studio-enter" style={delay(610)}><span className="studio-note-line" aria-hidden="true"/>内容有后话，好奇无终点。</div>
      </div>
      <HomeWorld />
    </div>
    <div className="studio-hero-bottom studio-enter" style={delay(650)}><a className="studio-scroll-link" href="#selected-work"><span aria-hidden="true">↓</span>往下看看，故事才刚开始</a><div className="studio-motion-controls"><button type="button" onClick={replay} aria-label="重播首页进场动画">重播开场 <span aria-hidden="true">↺</span></button><button type="button" onClick={() => setMotion(value => !value)}>{motion ? "暂停动效" : "开启动效"}</button></div></div>
  </section>;
}
