import Link from "next/link";
import { capabilities, education, honors } from "./resume-content";
import styles from "./resume.module.css";

export function ApprovedProfile() {
  return (
    <main id="main-content" className={styles.page}>
      <header className={styles.pageHeader}>
        <p className={styles.eyebrow}>关于我</p>
        <h1 className={styles.title}>罗叶馨梅</h1>
        <p className={styles.lead}>电子科技大学新闻与传播硕士在读，2027 届毕业生。</p>
      </header>

      <section className={styles.profileIntro} aria-label="个人简介">
        <div className={styles.introGrid}>
          <div className={styles.body}>
            <p>本科就读于成都理工大学广播电视编导专业，随后推免进入电子科技大学攻读新闻与传播硕士。学习和实践中，我逐渐积累了文字编辑、影像制作、内容运营与活动组织经验。</p>
            <p>我参与过媒体编辑、品牌新媒体和社区内容工作，也承担过校园宣传与学术活动的具体事务。做事时习惯先把需求和资料理清楚，持续跟进沟通、制作与交付。</p>
            <p>希望在成都从事宣传、品牌传播、党群或综合管理相关工作。平时喜欢摄影和记录，也会尝试用新工具改进日常的内容制作。</p>
            <dl className={styles.infoGrid}>
              <div className={styles.infoCell}><dt>毕业年份</dt><dd>2027 届</dd></div>
              <div className={styles.infoCell}><dt>意向城市</dt><dd>成都</dd></div>
              <div className={styles.infoCell}><dt>政治面貌</dt><dd>中共党员</dd></div>
              <div className={styles.infoCell}><dt>专业方向</dt><dd>新闻与传播</dd></div>
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
            <figcaption className={styles.portraitCaption}>罗叶馨梅</figcaption>
          </figure>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="education-title">
        <div className={styles.sectionHead}>
          <span className={styles.sectionNumber}>01</span>
          <h2 id="education-title">教育经历</h2>
        </div>
        <div className={styles.educationList}>
          {education.map((item) => (
            <article className={styles.row} key={item.school}>
              <p className={styles.rowMeta}>{item.period}</p>
              <div className={styles.rowBody}>
                <h3>{item.school}</h3>
                <p className={styles.meta}>{item.degree}</p>
                <p>{item.note}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="capabilities-title">
        <div className={styles.sectionHead}>
          <span className={styles.sectionNumber}>02</span>
          <h2 id="capabilities-title">专业能力</h2>
        </div>
        <div className={`${styles.featureGrid} ${styles.featureGridTwo}`}>
          {capabilities.map((item) => (
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
          <span className={styles.sectionNumber}>03</span>
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
