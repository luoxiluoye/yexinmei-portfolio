import Link from "next/link";
import type { Quest } from "@/types/quest";
import styles from "./resume.module.css";

type Presentation = {
  title?: string;
  actions?: string[];
  outputs?: string[];
  learning?: string;
};

// Existing project descriptions are retained; unconfirmed headline metrics are not repeated.
const presentations: Record<string, Presentation> = {
  "global-content": {
    title: "海外社媒内容实践",
    outputs: ["海外社媒选题、编辑与发布实践。", "内容表现跟踪与跨平台表达的经验。"],
    learning: "面对不同语境，先明确背景信息与受众关心的问题，再调整标题、内容顺序和表达方式。",
  },
  "tech-you-houhua": {
    title: "科技有后话 · 内容创作",
    outputs: ["围绕 AI、芯片、智能汽车等方向持续进行内容创作。", "整理热点背景、公司动作与用户关注的问题。"],
    learning: "核对事件与时间线后，继续查找相关背景和影响，把信息整理得具体、清楚。",
  },
  "ccd-business": {
    title: "二手影像设备运营实践",
    outputs: ["二手相机销售与租赁的个人实践。", "围绕设备成色、使用方式和用户需求，整理商品说明与咨询信息。"],
    learning: "从咨询中记录反复出现的问题，补充商品说明与使用信息，便于后续沟通。",
  },
  "inspiration-studio": {
    title: "灵感编辑室 · 内容工作流程",
    actions: [
      "梳理选题、素材、创作、发布和复盘中的重复事项。",
      "整理内容记录所需字段与看板，集中保存来源、进度和发布信息。",
      "使用 AI 辅助资料归纳、选题整理与重复性工作。",
    ],
    outputs: ["覆盖选题、制作、发布及复盘的个人内容工作流程。", "可查询的选题、素材、进度与反馈记录。"],
    learning: "根据工作中的实际需要使用工具，持续检查资料、进度与记录是否清楚。",
  },
};

function readablePeriod(period: string) {
  if (["NOW", "ONGOING", "ACTIVE", "TODO", ""].includes(period)) return null;
  return period.replace(/\bNOW\b/g, "至今");
}

function visibleText(text: string) {
  return text
    .replace(
      "我不会直接把中文内容照搬过去，而是先判断平台语境、信息重点和用户兴趣，再重新组织标题、信息密度和表达方式",
      "我会先判断平台语境、信息重点和用户兴趣，再组织标题、信息密度和表达方式",
    )
    .replace("而不是只复述新闻本身", "补充事件背后的具体信息");
}

export function legacyPracticeTitle(quest: Quest) {
  return presentations[quest.slug]?.title ?? quest.title;
}

export function LegacyPractice({ quest }: { quest: Quest }) {
  const presentation = presentations[quest.slug] ?? {};
  const title = legacyPracticeTitle(quest);
  const actions = presentation.actions ?? quest.actions;
  const outputs = presentation.outputs ?? quest.outcomes.filter((item) => !/[0-9％%]/.test(item));
  const period = readablePeriod(quest.period);
  const steps = quest.realCase?.steps ?? [];

  return (
    <main id="main-content" className={styles.page}>
      <nav className={styles.breadcrumb} aria-label="面包屑导航">
        <Link href="/quests">← 返回实践经历</Link>
        <span aria-current="page">{title}</span>
      </nav>

      <header className={styles.pageHeader}>
        <p className={styles.eyebrow}>项目实践</p>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.lead}>{visibleText(quest.summary)}</p>
        <dl className={styles.infoGrid}>
          <div className={styles.infoCell}><dt>角色</dt><dd>{quest.role}</dd></div>
          <div className={styles.infoCell}><dt>平台 / 场景</dt><dd>{quest.platform}</dd></div>
          {period ? <div className={styles.infoCell}><dt>时间</dt><dd>{period}</dd></div> : null}
        </dl>
      </header>

      <section className={styles.section} aria-labelledby="legacy-work-title">
        <div className={styles.sectionHead}>
          <span className={styles.sectionNumber}>01</span>
          <h2 id="legacy-work-title">我参与的工作</h2>
        </div>
        <ul className={styles.detailList}>
          {actions.map((item) => <li key={item}>{visibleText(item)}</li>)}
        </ul>
      </section>

      {quest.realCase ? (
        <section className={styles.section} aria-labelledby="legacy-process-title">
          <div className={styles.sectionHead}>
            <span className={styles.sectionNumber}>02</span>
            <h2 id="legacy-process-title">具体过程</h2>
          </div>
          <div className={styles.body}>
            <h3>{quest.realCase.title}</h3>
            <p>{visibleText(quest.realCase.summary)}</p>
          </div>
          {steps.length > 0 ? (
            <div className={styles.rows}>
              {steps.map((step, index) => (
                <div className={styles.row} key={step}>
                  <p className={styles.rowMeta}>步骤 {String(index + 1).padStart(2, "0")}</p>
                  <div className={styles.rowBody}><p>{visibleText(step)}</p></div>
                </div>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {outputs.length > 0 ? (
        <section className={styles.section} aria-labelledby="legacy-output-title">
          <div className={styles.sectionHead}>
            <span className={styles.sectionNumber}>{quest.realCase ? "03" : "02"}</span>
            <h2 id="legacy-output-title">实践记录</h2>
          </div>
          <ul className={styles.list}>
            {outputs.map((item) => <li key={item}>{visibleText(item)}</li>)}
          </ul>
          <p className={styles.note}>{visibleText(presentation.learning ?? quest.learnings)}</p>
        </section>
      ) : null}

      <div className={styles.footerPrompt}>
        <Link className={styles.link} href="/quests">← 查看全部经历</Link>
        <a className={styles.buttonSecondary} href="/portfolio">浏览作品集 <span aria-hidden="true">↗</span></a>
      </div>
    </main>
  );
}
