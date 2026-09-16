import { Link } from "next-view-transitions";

import { ScrollReveal } from "@/components/home/scroll-reveal";
import { ProjectCover } from "@/components/quests/project-cover";
import { quests } from "@/data/quests";

const selections = [
  {
    slug: "zhihu-auto-consumer-tech",
    number: "02",
    title: "把热点，变成值得讨论的好问题。",
    type: "COMMUNITY & CONTENT",
    note: "知乎 · 汽车与消费电子",
    description: "从选题、问答到新品与线上活动，让内容被看见，让讨论持续发生。",
    result: "内容供给 / 用户参与 / 数据复盘",
  },
  {
    slug: "ccd-business",
    number: "03",
    title: "一台相机，和一门小生意。",
    type: "INDEPENDENT PROJECT",
    note: "CCD · 内容获客与经营",
    description: "从一台闲置相机开始，探索选品、内容与用户信任。",
    result: "20W+ 累计 GMV",
  },
  {
    slug: "global-content",
    number: "04",
    title: "让故事，走得更远一点。",
    type: "GLOBAL COMMUNICATION",
    note: "国际传播 · 海外社媒",
    description: "跨过语言与平台，寻找能被不同文化理解的表达。",
    result: "1000+ 内容 / 8000+ 账号涨粉",
  },
] as const;

export function SelectedWork() {
  return (
    <section id="selected-work" className="studio-work" aria-labelledby="work-title">
      <ScrollReveal>
        <div className="studio-section-heading">
          <div>
            <p className="studio-kicker"><span>02 /</span> MORE WORK</p>
            <h2 id="work-title">另外一些认真做过的事<span className="studio-heading-star" aria-hidden="true">✳</span></h2>
          </div>
          <Link href="/quests" className="studio-text-link">全部项目 <span className="font-pixel">ALL ↗</span></Link>
        </div>
      </ScrollReveal>

      <div className="studio-work-grid">
        {selections.map((selection, index) => {
          const quest = quests.find((item) => item.slug === selection.slug)!;
          return (
            <ScrollReveal key={selection.slug} className={index === 0 ? "studio-work-featured" : ""}>
              <Link href={`/quests/${selection.slug}`} className="studio-work-card" aria-label={`查看项目：${quest.title}`}>
                <div className="studio-work-cover" style={{ viewTransitionName: `project-${selection.slug}` }}>
                  <ProjectCover slug={selection.slug} code={selection.number} />
                  <span className="studio-work-open" aria-hidden="true">↗</span>
                </div>
                <div className="studio-work-caption">
                  <div className="studio-work-topline"><span>{selection.type}</span><span>{selection.number}</span></div>
                  <p className="studio-work-client">{selection.note}</p>
                  <h3>{selection.title}</h3>
                  <p className="studio-work-description">{selection.description}</p>
                  <div className="studio-work-result"><span>{selection.result}</span><span>阅读项目 <span aria-hidden="true">→</span></span></div>
                </div>
              </Link>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
