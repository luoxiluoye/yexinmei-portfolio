import Link from "next/link";
import { getPracticeRecord, records } from "./resume-content";
import styles from "./resume.module.css";

export function PracticeDetail({ slug }: { slug: string }) {
  const record = getPracticeRecord(slug);
  if (!record) return null;

  const related = records.filter((item) => item.slug !== record.slug && item.category === record.category).slice(0, 2);

  return (
    <main id="main-content" className={styles.page}>
      <nav className={styles.breadcrumb} aria-label="面包屑导航">
        <Link href="/quests">← 返回实践经历</Link>
        <span aria-current="page">{record.title}</span>
      </nav>

      <header className={styles.pageHeader}>
        <p className={styles.eyebrow}>{record.category}</p>
        <h1 className={styles.title}>{record.title}</h1>
        <p className={styles.lead}>{record.summary}</p>
        <dl className={styles.infoGrid}>
          <div className={styles.infoCell}><dt>参与单位 / 场景</dt><dd>{record.organization}</dd></div>
          <div className={styles.infoCell}><dt>承担角色</dt><dd>{record.role}</dd></div>
          {record.period ? <div className={styles.infoCell}><dt>时间</dt><dd>{record.period}</dd></div> : null}
        </dl>
      </header>

      <section className={styles.section} aria-labelledby="responsibilities-title">
        <div className={styles.sectionHead}>
          <span className={styles.sectionNumber}>01</span>
          <h2 id="responsibilities-title">我参与的工作</h2>
        </div>
        <ul className={styles.detailList}>
          {record.responsibilities.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="process-title">
        <div className={styles.sectionHead}>
          <span className={styles.sectionNumber}>02</span>
          <h2 id="process-title">具体过程</h2>
        </div>
        <div className={styles.rows}>
          {record.process.map((step, index) => (
            <article className={styles.row} key={step.title}>
              <p className={styles.rowMeta}>{String(index + 1).padStart(2, "0")} / {step.title}</p>
              <div className={styles.rowBody}><p>{step.description}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="outputs-title">
        <div className={styles.sectionHead}>
          <span className={styles.sectionNumber}>03</span>
          <h2 id="outputs-title">相关产出</h2>
        </div>
        <ul className={styles.list}>
          {record.outputs.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <div className={styles.tags}>
          {record.links.map((link) => (
            <a
              key={link.href}
              className={styles.buttonSecondary}
              href={link.href}
              target={link.href.startsWith("https://") ? "_blank" : undefined}
              rel={link.href.startsWith("https://") ? "noopener noreferrer" : undefined}
            >
              {link.label} <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </section>

      {related.length > 0 ? (
        <section className={styles.section} aria-labelledby="related-title">
          <div className={styles.sectionHead}><h2 id="related-title">继续了解</h2></div>
          <div className={styles.featureGrid}>
            {related.map((item) => (
              <article className={styles.feature} key={item.slug}>
                <p className={styles.sectionLabel}>{item.category}</p>
                <h3><Link className={styles.link} href={`/quests/${item.slug}`}>{item.title} <span aria-hidden="true">→</span></Link></h3>
                <p>{item.organization}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <div className={styles.footerPrompt}>
        <Link className={styles.link} href="/quests">← 返回全部经历</Link>
        <a className={styles.link} href="/portfolio">浏览作品集 →</a>
      </div>
    </main>
  );
}
