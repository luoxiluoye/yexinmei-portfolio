import { Link } from "next-view-transitions";

import type { Quest } from "@/types/quest";
import { ProjectCover } from "@/components/quests/project-cover";
import "@/styles/project-list.css";

export function QuestCard({ quest }: { quest: Quest }) {
  const titleId = `project-title-${quest.slug}`;

  return (
    <article className="project-archive-card" aria-labelledby={titleId}>
      <Link href={`/quests/${quest.slug}`} className="project-archive-link" aria-labelledby={titleId}>
        <div className="project-archive-cover" style={{ viewTransitionName: `project-${quest.slug}` }}>
          <ProjectCover slug={quest.slug} code={quest.code} />
          <span className="project-archive-open" aria-hidden="true">↗</span>
        </div>
        <div className="project-archive-copy">
          <div className="project-archive-meta">
            <span className="font-pixel">{quest.code}</span>
            <span className="project-archive-status font-pixel" data-status={quest.status}>{quest.status}</span>
          </div>
          <h2 id={titleId}>{quest.title}</h2>
          <p className="project-archive-subtitle">{quest.subtitle}</p>
          <ul className="project-archive-categories" aria-label="项目领域">
            {quest.categories.map((category) => <li key={category}>{category}</li>)}
          </ul>
          <div className="project-archive-card-bottom">
            <span>{quest.role}</span>
            <span className="project-archive-read">阅读项目 <span aria-hidden="true">→</span></span>
          </div>
        </div>
      </Link>
    </article>
  );
}
