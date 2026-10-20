import Link from "next/link";
import { journalSeed, type JournalEntry } from "@/data/journal";
import styles from "./resume.module.css";

const abilityGroups = [
  {
    title: "文字与内容编辑",
    description: "围绕具体主题整理资料、核对信息，完成稿件与平台内容。",
    work: "整理选题资料与信息来源，编辑新闻、活动和公众号稿件，并跟进内容发布与反馈记录。",
    tools: "文字编辑、图文排版、Excel",
    practice: { label: "查看文字工作实践", href: "/quests/news-writing" },
  },
  {
    title: "摄影与视觉制作",
    description: "根据内容需求完成现场记录、素材筛选、图片处理和视频剪辑。",
    work: "拍摄人物、舞台和活动，整理并剪辑视频素材、制作字幕，完成宣传海报与封面等基础视觉内容。",
    tools: "Photoshop、Premiere Pro、After Effects、剪映",
    practice: { label: "查看影像制作实践", href: "/quests/visual-storytelling" },
  },
  {
    title: "沟通与组织协调",
    description: "明确需求与分工，跟进人员沟通、活动准备和过程中的具体事项。",
    work: "跟进工作室选题分工、会务和导师项目执行，沟通达人合作与招聘流程中的具体事项。",
    tools: "工作记录、进度表、资料与素材台账",
    practice: { label: "查看活动组织实践", href: "/quests/conference-coordination" },
  },
  {
    title: "数据整理与 AI 辅助",
    description: "结合实际任务使用工具，辅助整理资料、汇总记录与制作内容。",
    work: "用 Excel 整理内容表现和工作台账，用 AI 辅助资料归纳、文案与创意制作，并结合内容项目学习 Python、SQL 和自动化工具。",
    tools: "Excel、ChatGPT、Claude、Coze",
    practice: { label: "查看工具应用实践", href: "/quests/inspiration-studio" },
  },
] as const;

const journalCategories: Record<JournalEntry["category"], string> = {
  "TECH NOTES": "内容观察",
  "PHOTO NOTES": "摄影记录",
  "SIDE PROJECT LOG": "工作方法",
};

const monthNumbers: Record<string, string> = {
  JAN: "01", FEB: "02", MAR: "03", APR: "04", MAY: "05", JUN: "06",
  JUL: "07", AUG: "08", SEP: "09", OCT: "10", NOV: "11", DEC: "12",
};

function journalDate(date: string) {
  const match = /^([A-Z]{3}) (\d{2}) · (\d{4})$/.exec(date);
  if (!match || !monthNumbers[match[1]]) return { label: date, iso: undefined };
  const month = monthNumbers[match[1]];
  return { label: `${match[3]} 年 ${Number(month)} 月 ${Number(match[2])} 日`, iso: `${match[3]}-${month}-${match[2]}` };
}

// Keep the original observations, with one small phrasing edit for the requested tone.
function journalParagraph(paragraph: string) {
  return paragraph.replace(
    "真正值得拍的往往不是最标准的那一刻，而是人物之间刚好发生关系的瞬间",
    "我会留意人物之间刚好发生关系的瞬间",
  );
}

export function SupportSkills() {
  return (
    <main id="main-content" className={styles.page}>
      <header className={styles.pageHeader}>
        <p className={styles.eyebrow}>专业能力</p>
        <h1 className={styles.title}>能力与工具</h1>
        <p className={styles.lead}>在内容、宣传与日常协作中使用的工作方法，以及持续学习的工具。</p>
      </header>

      <section className={styles.section} aria-label="专业能力与实际应用">
        <div className={styles.abilityGrid}>
          {abilityGroups.map((group) => (
            <article className={styles.abilityBlock} key={group.title}>
              <h2>{group.title}</h2>
              <p>{group.description}</p>
              <p>{group.work}</p>
              <p className={styles.abilityMeta}>工具与方法：{group.tools}</p>
              <Link className={styles.link} href={group.practice.href}>{group.practice.label} <span aria-hidden="true">→</span></Link>
            </article>
          ))}
        </div>
      </section>

      <div className={styles.footerPrompt}>
        <p>文字、摄影、视觉和视频作品中，可以看到这些能力的实际应用。</p>
        <a className={styles.button} href="/portfolio">浏览作品集 <span aria-hidden="true">↗</span></a>
      </div>
    </main>
  );
}

export function SupportJournal() {
  return (
    <main id="main-content" className={styles.page}>
      <header className={styles.pageHeader}>
        <p className={styles.eyebrow}>手记</p>
        <h1 className={styles.title}>写作与观察</h1>
        <p className={styles.lead}>关于选题、摄影与工具使用的观察，记录实践过程中的思考。</p>
      </header>

      <section className={styles.section} aria-label="文章列表">
        <div className={styles.journalList}>
          {journalSeed.map((entry) => {
            const date = journalDate(entry.date);
            return (
              <article className={styles.journalEntry} key={entry.slug}>
                <div className={styles.journalMeta}>
                  <time dateTime={date.iso}>{date.label}</time>
                  <span>{journalCategories[entry.category]}</span>
                </div>
                <h2><Link href={`/journal/${entry.slug}`}>{entry.title}</Link></h2>
                <p>{entry.summary}</p>
                <Link className={styles.link} href={`/journal/${entry.slug}`}>阅读全文 <span aria-hidden="true">→</span></Link>
              </article>
            );
          })}
        </div>
      </section>

      <div className={styles.footerPrompt}>
        <p>相关工作的职责与执行过程，也整理在实践经历中。</p>
        <Link className={styles.link} href="/quests">查看实践经历 <span aria-hidden="true">→</span></Link>
      </div>
    </main>
  );
}

export function SupportJournalArticle({ entry }: { entry: JournalEntry }) {
  const date = journalDate(entry.date);
  const index = journalSeed.findIndex((item) => item.slug === entry.slug);
  const previous = index > 0 ? journalSeed[index - 1] : null;
  const next = index < journalSeed.length - 1 ? journalSeed[index + 1] : null;

  return (
    <main id="main-content" className={styles.page}>
      <nav className={styles.breadcrumb} aria-label="面包屑导航">
        <Link href="/journal">← 返回写作与观察</Link>
      </nav>

      <article>
        <header className={`${styles.pageHeader} ${styles.articleHeader}`}>
          <p className={styles.eyebrow}>{journalCategories[entry.category]}</p>
          <h1 className={styles.title}>{entry.title}</h1>
          <p className={styles.lead}>{entry.summary}</p>
          <div className={styles.meta}>
            <span><time dateTime={date.iso}>{date.label}</time></span>
            <span>罗叶馨梅</span>
          </div>
        </header>

        <div className={styles.article}>
          {entry.body.map((paragraph, paragraphIndex) => <p key={`${entry.slug}-${paragraphIndex}`}>{journalParagraph(paragraph)}</p>)}

          <footer className={styles.articleFooter}>
            <div className={styles.tags} aria-label="文章主题">
              {entry.tools.map((tool) => <span className={styles.tag} key={tool}>{tool === "AI Workflow" ? "AI 辅助工作流程" : tool}</span>)}
            </div>
            <Link className={styles.link} href={entry.relatedQuest.href}>
              相关实践：{entry.relatedQuest.title.replace("AI Workflow / ", "")} <span aria-hidden="true">→</span>
            </Link>
          </footer>
        </div>
      </article>

      <nav className={styles.footerPrompt} aria-label="文章导航">
        {previous ? <Link className={styles.link} href={`/journal/${previous.slug}`}>← {previous.title}</Link> : <Link className={styles.link} href="/journal">← 全部文章</Link>}
        {next ? <Link className={styles.link} href={`/journal/${next.slug}`}>{next.title} →</Link> : <Link className={styles.link} href="/journal">全部文章 →</Link>}
      </nav>
    </main>
  );
}
