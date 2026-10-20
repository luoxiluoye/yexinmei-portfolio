import Link from "next/link";
import styles from "./resume.module.css";

const highlights = [
  { number: "01", title: "校园宣传", text: "统筹 15 人网络文化工作室，安排选题、采写、摄制和审校，参与学院新媒体运营。", href: "/quests/campus-publicity", label: "查看宣传工作" },
  { number: "02", title: "文字与影像", text: "参与新闻与人物稿件编辑、活动摄影和视频制作，整理信息，也记录具体的人与事。", href: "/quests/news-writing", label: "查看采编经历" },
  { number: "03", title: "组织与协调", text: "参与党小组工作、学术会议及导师项目，跟进人员联络、现场执行和资料归档。", href: "/quests/conference-coordination", label: "查看协调工作" },
];

export function ApprovedHome() {
  return (
    <main id="main-content" className={styles.page}>
      <section className={styles.hero} aria-labelledby="home-title">
        <div >
          <p className={styles.eyebrow}><span className={styles.marker} aria-hidden="true" />个人履历与实践记录</p>
          <h1 id="home-title" className={styles.heroName}>罗叶馨梅</h1>
          <p className={styles.heroEducation}>电子科技大学 · 新闻与传播硕士</p>
          <div className={styles.meta}><span>2027 届毕业生</span><span>中共党员</span><span>成都</span></div>
          <p className={styles.heroIntro}>有校园宣传、内容运营与活动组织经历，参与稿件采编、图文影像制作、人员联络和资料整理。关注宣传传播、党群宣传与综合管理相关工作。</p>
          <div className={styles.actions}>
            <Link className={styles.button} href="/quests">查看实践经历 <span aria-hidden="true">→</span></Link>
            <a className={styles.buttonSecondary} href="/portfolio">浏览作品集 <span aria-hidden="true">↗</span></a>
          </div>
          <p className={styles.heroFootnote}>广播电视编导本科 · 新闻与传播硕士在读</p>
        </div>
        <aside className={styles.profileCard} aria-label="个人简况">
          <div className={styles.cardTop}><span>个人简况</span><span>2027</span></div>
          <div className={styles.cardProfile}>
            <img className={styles.cardPortrait} src="/assets/portraits/profile-from-portfolio.jpeg" alt="罗叶馨梅的生活照片" width={158} height={210} />
            <div className={styles.cardIdentity}>
              <p>学习与实践</p>
              <strong>文字采编<br />宣传策划<br />组织协调</strong>
              <Link className={styles.link} href="/player">了解更多 <span aria-hidden="true">→</span></Link>
            </div>
          </div>
          <dl className={styles.cardFacts}>
            <div><dt>研究生</dt><dd>电子科技大学<span>新闻与传播 · 推免入学</span></dd></div>
            <div><dt>本科</dt><dd>成都理工大学<span>广播电视编导</span></dd></div>
          </dl>
        </aside>
      </section>

      <section className={styles.section} aria-labelledby="home-practice">
        <div className={styles.sectionHead}>
          <div><p className={styles.sectionLabel}>实践概览</p><h2 id="home-practice">在具体工作中积累经验</h2></div>
          <Link className={styles.link} href="/quests">全部经历 <span aria-hidden="true">→</span></Link>
        </div>
        <div className={styles.featureGrid}>
          {highlights.map(item => <article className={styles.feature} key={item.number}>
            <span className={styles.sectionNumber}>{item.number}</span>
            <h3>{item.title}</h3><p>{item.text}</p>
            <Link className={styles.link} href={item.href}>{item.label} <span aria-hidden="true">→</span></Link>
          </article>)}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="home-internships">
        <div className={styles.sectionHead}><div><p className={styles.sectionLabel}>实习经历</p><h2 id="home-internships">从校园走向工作现场</h2></div><Link className={styles.link} href="/quests#internships">查看实习经历 <span aria-hidden="true">→</span></Link></div>
        <div className={styles.rows}>
          <article className={styles.row}><div className={styles.rowMeta}><p>2026.06 — 至今</p><h3>知乎</h3><span>内容运营实习</span></div><div className={styles.rowBody}><h3>科技内容与新品活动运营</h3><p>参与数码、汽车、消费电子及家电方向的内容运营，跟进选题、创作者沟通、活动内容组织与复盘。</p><Link className={styles.link} href="/quests/zhihu-auto-consumer-tech">了解这段经历 <span aria-hidden="true">→</span></Link></div></article>
          <article className={styles.row}><div className={styles.rowMeta}><p>2025.12 — 2026.04</p><h3>蔚来</h3><span>新媒体运营实习</span></div><div className={styles.rowBody}><h3>新媒体内容与品牌传播协作</h3><p>参与达人内容合作，跟进需求沟通、脚本与素材审核、发布安排和传播资料整理。</p><Link className={styles.link} href="/quests/brand-communication">了解这段经历 <span aria-hidden="true">→</span></Link></div></article>
        </div>
      </section>

      <section className={styles.worksBand} aria-labelledby="home-works">
        <div><p className={styles.sectionLabel}>文字 · 摄影 · 视觉 · 视频</p><h2 id="home-works">作品，留在这里。</h2><p>新闻与人物稿件、活动摄影、视觉设计和纪录影像，收录在作品集中。</p><a className={styles.button} href="/portfolio">进入作品集 <span aria-hidden="true">↗</span></a></div>
        <a href="/portfolio#photography" className={styles.workPhoto}><img src="/assets/editorial/stage.jpeg" alt="本人拍摄的开心麻花《捞金晚宴》舞台剧照" width={720} height={480} loading="lazy" /><span>《捞金晚宴》舞台摄影 <span aria-hidden="true">↗</span></span></a>
      </section>
      <nav className={styles.moreLinks} aria-label="继续了解"><Link href="/inventory">专业能力与工具 <span aria-hidden="true">→</span></Link><Link href="/journal">工作与创作手记 <span aria-hidden="true">→</span></Link><Link href="/contact">联系与交流 <span aria-hidden="true">→</span></Link></nav>
    </main>
  );
}
