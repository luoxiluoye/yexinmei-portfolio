import Link from "next/link";
import { IconBadge, SectionTitle, UiIcon, type UiIconName } from "./editorial-ui";
import styles from "./resume.module.css";

const highlights = [
  { title: "校园宣传", icon: "pen", tone: "brick", text: "统筹 15 人网络文化工作室，跟进选题、团队分工与内容制作，参与校园新媒体工作。", href: "/quests/campus-publicity", label: "查看宣传工作" },
  { title: "文字与影像", icon: "camera", tone: "bronze", text: "参与新闻与人物稿件编辑、活动摄影和视频制作，整理资料，记录具体的人与事。", href: "/quests/news-writing", label: "查看采编经历" },
  { title: "组织与协调", icon: "people", tone: "sage", text: "参与党小组工作、学术会议及导师项目，跟进人员联络、现场执行和资料整理。", href: "/quests/conference-coordination", label: "查看协调工作" },
] satisfies Array<{ title: string; icon: UiIconName; tone: "brick" | "bronze" | "sage"; text: string; href: string; label: string }>;

export function ApprovedHome() {
  return (
    <main id="main-content" className={styles.page}>
      <section className={styles.hero} aria-labelledby="home-title">
        <div className={styles.heroText}>
          <p className={styles.welcome}><span aria-hidden="true">👋</span> 你好，欢迎来访<span className={styles.welcomeLine} aria-hidden="true" /></p>
          <h1 id="home-title" className={styles.heroName}>罗叶馨梅</h1>
          <p className={styles.heroEducation}>电子科技大学 · 新闻与传播硕士</p>
          <div className={`${styles.meta} ${styles.heroMeta}`}><span><UiIcon name="graduation" /> 2027 届毕业生</span><span>中共党员</span><span><UiIcon name="pin" /> 成都</span></div>
          <p className={styles.heroIntro}>有校园宣传、内容运营与活动组织经历。<br />关注宣传传播、党群及综合管理相关工作。</p>
          <div className={styles.actions}>
            <Link className={styles.button} href="/quests">查看实践经历 <span aria-hidden="true">→</span></Link>
            <a className={styles.buttonSecondary} href="/portfolio">浏览作品集 <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <figure className={styles.heroVisual}>
          <img
            src="/assets/profile-20261020/editorial-study.webp"
            alt="书页与相机组成的编辑、记录主题页面配图"
            width={1536}
            height={1024}
            fetchPriority="high"
          />
          <figcaption className={styles.heroCaption}><UiIcon name="book" /> 文字 · 影像 · 日常记录</figcaption>
        </figure>
      </section>

      <section className={styles.section} aria-labelledby="home-practice">
        <div className={styles.sectionHead}>
          <SectionTitle id="home-practice" number="01">我的工作与实践</SectionTitle>
          <Link className={styles.link} href="/quests">全部经历 <span aria-hidden="true">→</span></Link>
        </div>
        <div className={`${styles.featureGrid} ${styles.featureCards}`}>
          {highlights.map(item => <article className={styles.feature} key={item.title}>
            <div className={styles.featureHeading}><IconBadge name={item.icon} tone={item.tone} /><h3>{item.title}</h3></div><p>{item.text}</p>
            <Link className={styles.link} href={item.href}>{item.label} <span aria-hidden="true">→</span></Link>
          </article>)}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="home-internships">
        <div className={styles.sectionHead}><SectionTitle id="home-internships" number="02">实习经历</SectionTitle><Link className={styles.link} href="/quests#internships">查看全部实习 <span aria-hidden="true">→</span></Link></div>
        <div className={styles.rows}>
          <article className={styles.row}><div className={styles.rowMeta}><p>2026.06 — 至今 <span className={styles.currentTag}>进行中</span></p><h3>知乎</h3><span>内容运营实习</span></div><div className={styles.rowBody}><h3>科技内容与新品活动运营</h3><p>参与数码、汽车、消费电子及家电方向的内容运营，跟进选题、创作者沟通、活动内容组织与复盘。</p><Link className={styles.link} href="/quests/zhihu-auto-consumer-tech">了解这段经历 <span aria-hidden="true">→</span></Link></div></article>
          <article className={styles.row}><div className={styles.rowMeta}><p>2025.12 — 2026.04</p><h3>蔚来</h3><span>新媒体运营实习</span></div><div className={styles.rowBody}><h3>新媒体内容与品牌传播协作</h3><p>参与达人内容合作，跟进需求沟通、脚本与素材审核、发布安排和传播资料整理。</p><Link className={styles.link} href="/quests/brand-communication">了解这段经历 <span aria-hidden="true">→</span></Link></div></article>
        </div>
      </section>

      <section className={styles.worksBand} aria-labelledby="home-works">
        <div><p className={styles.sectionLabel}><UiIcon name="camera" /> 文字 · 摄影 · 视觉 · 视频</p><h2 id="home-works">文字与影像作品</h2><p>新闻与人物稿件、活动摄影、视觉设计和纪录影像，收录在作品集中。</p><a className={styles.button} href="/portfolio">进入作品集 <span aria-hidden="true">↗</span></a></div>
        <a href="/portfolio#photography" className={styles.workPhoto}><img src="/assets/editorial/stage.jpeg" alt="本人拍摄的开心麻花《捞金晚宴》舞台剧照" width={720} height={480} loading="lazy" /><span>《捞金晚宴》舞台摄影 <span aria-hidden="true">↗</span></span></a>
      </section>
      <nav className={styles.moreLinks} aria-label="继续了解">
        <Link href="/inventory"><UiIcon name="sparkle" /><span>专业能力与工具</span><span aria-hidden="true">→</span></Link>
        <Link href="/journal"><UiIcon name="book" /><span>工作与创作手记</span><span aria-hidden="true">→</span></Link>
        <Link href="/contact"><UiIcon name="mail" /><span>联系与交流</span><span aria-hidden="true">→</span></Link>
      </nav>
    </main>
  );
}
