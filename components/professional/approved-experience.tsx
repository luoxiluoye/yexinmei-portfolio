import Link from "next/link";
import {
  campusExperience,
  internships,
  otherInternships,
  records,
  type ExperienceEntry,
} from "./resume-content";
import styles from "./resume.module.css";

function ExperienceRow({ entry }: { entry: ExperienceEntry }) {
  return (
    <article className={styles.row}>
      <div className={styles.rowMeta}>
        {entry.period ? <p>{entry.period}</p> : null}
        <p>{entry.role}</p>
      </div>
      <div className={styles.rowBody}>
        <h3>{entry.organization}</h3>
        <p>{entry.summary}</p>
        <ul className={styles.list}>
          {entry.work.map((item) => <li key={item}>{item}</li>)}
        </ul>
        {entry.practiceSlug ? (
          <Link className={styles.link} href={`/quests/${entry.practiceSlug}`}>
            查看工作内容 <span aria-hidden="true">→</span>
          </Link>
        ) : null}
      </div>
    </article>
  );
}

export function ApprovedExperience() {
  return (
    <main id="main-content" className={styles.page}>
      <header className={styles.pageHeader}>
        <p className={styles.eyebrow}>经历与实践</p>
        <h1 className={styles.title}>参与过的工作</h1>
        <p className={styles.lead}>从内容编辑、宣传制作到人员沟通与活动执行，逐步积累具体工作的经验。</p>
      </header>

      <nav className={styles.tags} aria-label="经历页面目录">
        <a className={styles.tag} href="#internships">实习经历</a>
        <a className={styles.tag} href="#campus">校园经历</a>
        <a className={styles.tag} href="#practice">项目实践</a>
      </nav>

      <section id="internships" className={styles.section} aria-labelledby="internships-title">
        <div className={styles.sectionHead}>
          <span className={styles.sectionNumber}>01</span>
          <h2 id="internships-title">实习经历</h2>
        </div>
        <div className={styles.rows}>
          {internships.map((entry) => <ExperienceRow entry={entry} key={entry.organization} />)}
        </div>
        <div className={styles.notice}>
          <h3>其他实习</h3>
          {otherInternships.map((entry) => (
            <p key={entry.organization}>
              <strong>{entry.organization} · {entry.role}</strong><br />
              {entry.description}
            </p>
          ))}
        </div>
      </section>

      <section id="campus" className={styles.section} aria-labelledby="campus-title">
        <div className={styles.sectionHead}>
          <span className={styles.sectionNumber}>02</span>
          <h2 id="campus-title">校园经历</h2>
        </div>
        <div className={styles.rows}>
          {campusExperience.map((entry) => <ExperienceRow entry={entry} key={entry.organization} />)}
        </div>
      </section>

      <section id="practice" className={styles.section} aria-labelledby="practice-title">
        <div className={styles.sectionHead}>
          <span className={styles.sectionNumber}>03</span>
          <h2 id="practice-title">项目实践</h2>
        </div>
        <p className={styles.note}>按具体工作整理参与过程；文字、摄影、视觉及视频成品收录在作品集中。</p>
        <div className={styles.featureGrid}>
          {records.map((record) => (
            <article className={styles.feature} key={record.slug}>
              <p className={styles.sectionLabel}>{record.category}</p>
              <h3><Link href={`/quests/${record.slug}`}>{record.title}</Link></h3>
              <p>{record.summary}</p>
              <Link className={styles.link} href={`/quests/${record.slug}`}>
                查看详情 <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <div className={styles.footerPrompt}>
        <p>更多文字、影像与视觉成品，可以在作品集中查看。</p>
        <a className={styles.button} href="/portfolio">进入作品集 <span aria-hidden="true">↗</span></a>
      </div>
    </main>
  );
}
