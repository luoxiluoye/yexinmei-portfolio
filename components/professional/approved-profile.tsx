import Link from "next/link";
import { capabilities, education, honors } from "./resume-content";
import styles from "./resume.module.css";

export function ApprovedProfile() {
  return (
    <main id="main-content" className={styles.page}>
      <header className={`${styles.pageHeader} ${styles.profileOpening}`}>
        <div className={styles.introGrid}>
          <div className={styles.profileCopy}>
            <p className={styles.eyebrow}>关于我</p>
            <h1 className={styles.title}>罗叶馨梅</h1>
            <p className={styles.lead}>电子科技大学新闻与传播硕士在读。</p>
            <div className={styles.body}>
              <p>从广播电视编导专业出发，我持续参与稿件编辑、摄影摄像和新媒体内容制作，也承担过校园宣传、学术活动与人员协调工作。</p>
              <p>我习惯先把资料与需求理清楚，再跟进沟通、制作和交付。希望在成都从事宣传传播、党群或综合管理相关工作。</p>
              <p>工作之外，喜欢摄影与日常记录，也会尝试用新工具整理素材、制作内容。</p>
            </div>
            <dl className={styles.profileFacts}>
              <div><dt>毕业年份</dt><dd>2027 届</dd></div>
              <div><dt>政治面貌</dt><dd>中共党员</dd></div>
              <div><dt>意向城市</dt><dd>成都</dd></div>
            </dl>
          </div>
          <figure className={styles.portrait}>
            <img
              className={styles.photo}
              src="/assets/portraits/profile-from-portfolio.jpeg"
              width={567}
              height={850}
              alt="罗叶馨梅个人照片"
            />
            <figcaption className={styles.portraitCaption}>日常留影</figcaption>
          </figure>
        </div>
      </header>

      <section className={styles.section} aria-labelledby="education-title">
        <div className={styles.sectionHead}>
          <h2 id="education-title">教育经历</h2>
        </div>
        <div className={styles.educationGrid}>
          {education.map((item) => (
            <article className={styles.educationItem} key={item.school}>
                <h3>{item.school}</h3>
                <p className={styles.educationDegree}>{item.degree}</p>
                <p className={styles.meta}>{item.period}</p>
                <p className={styles.small}>{item.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="capabilities-title">
        <div className={styles.sectionHead}>
          <h2 id="capabilities-title">专业能力</h2>
          <Link className={styles.link} href="/inventory">能力与工具 <span aria-hidden="true">→</span></Link>
        </div>
        <div className={`${styles.featureGrid} ${styles.featureGridTwo}`}>
          {capabilities.slice(0, 2).map((item) => (
            <article className={styles.feature} key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <p className={styles.evidence}>{item.evidence}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="honors-title">
        <div className={styles.sectionHead}>
          <h2 id="honors-title">部分荣誉</h2>
        </div>
        <ul className={styles.awardList}>
          {honors.map((item) => (
            <li key={item.title}>
              <span>{item.title}</span>
              <span className={styles.meta}>{item.organization}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className={styles.footerPrompt}>
        <p>具体工作与参与过程，记录在经历页面中。</p>
        <Link className={styles.button} href="/quests">查看实践经历 <span aria-hidden="true">→</span></Link>
        <a className={styles.buttonSecondary} href="/portfolio">浏览作品集 <span aria-hidden="true">↗</span></a>
      </div>
    </main>
  );
}
