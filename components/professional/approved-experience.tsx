import Link from "next/link";
import { SectionTitle, UiIcon } from "./editorial-ui";
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
    <article className={styles.experienceRow}>
      <div className={styles.experienceMeta}>
        {entry.period ? (
          <p>
            {entry.period}
            {entry.period.includes("至今") ? <span className={styles.currentTag}>进行中</span> : null}
          </p>
        ) : null}
        <h3>{entry.organization}</h3>
        <span>{entry.role}</span>
      </div>
      <div className={styles.rowBody}>
        <p>{entry.summary}</p>
        {entry.practiceSlug ? (
          <Link className={styles.link} href={`/quests/${entry.practiceSlug}`}>
            查看工作内容 <span aria-hidden="true">→</span>
          </Link>
        ) : (
          <details className={styles.experienceMore}>
            <summary>工作内容</summary>
            <ul className={styles.list}>{entry.work.map((item) => <li key={item}>{item}</li>)}</ul>
          </details>
        )}
      </div>
    </article>
  );
}

export function ApprovedExperience() {
  return (
    <main id="main-content" className={styles.page}>
      <header className={styles.pageHeader}>
        <p className={styles.eyebrow}>学习 · 参与 · 积累</p>
        <h1 className={styles.title}>实践经历</h1>
        <p className={styles.lead}>从内容编辑、宣传制作到人员沟通与活动执行，逐步积累具体工作的经验。</p>
      </header>

      <nav className={styles.tags} aria-label="经历页面目录">
        <a className={styles.tag} href="#internships"><UiIcon name="briefcase" />实习经历</a>
        <a className={styles.tag} href="#campus"><UiIcon name="book" />校园经历</a>
        <a className={styles.tag} href="#practice"><UiIcon name="folder" />项目实践</a>
      </nav>

      <section id="internships" className={styles.section} aria-labelledby="internships-title">
        <div className={styles.sectionHead}>
          <SectionTitle id="internships-title" number="01">实习经历</SectionTitle>
        </div>
        <div className={styles.experienceList}>
          {internships.map((entry) => <ExperienceRow entry={entry} key={entry.organization} />)}
        </div>
        <div className={styles.otherExperience}>
          {otherInternships.map((entry) => (
            <article key={entry.organization}>
              <h3>{entry.organization}<span>{entry.role}</span></h3>
              <p>{entry.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="campus" className={styles.section} aria-labelledby="campus-title">
        <div className={styles.sectionHead}>
          <SectionTitle id="campus-title" number="02">校园经历</SectionTitle>
        </div>
        <div className={styles.experienceList}>
          {campusExperience.map((entry) => <ExperienceRow entry={entry} key={entry.organization} />)}
        </div>
      </section>

      <section id="practice" className={styles.section} aria-labelledby="practice-title">
        <div className={styles.sectionHead}>
          <SectionTitle id="practice-title" number="03">项目实践</SectionTitle>
        </div>
        <div className={styles.featureGrid}>
          {records.filter((record) => ["news-writing", "visual-storytelling", "red-leaf"].includes(record.slug)).map((record) => (
            <article className={styles.feature} key={record.slug}>
              <p className={styles.sectionLabel}>
                <UiIcon name={record.slug === "news-writing" ? "pen" : record.slug === "visual-storytelling" ? "camera" : "book"} />
                {record.category}
              </p>
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
