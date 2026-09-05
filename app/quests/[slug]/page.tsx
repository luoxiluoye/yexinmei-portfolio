import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { QuestVisitAchievement } from "@/components/game/quest-visit-achievement";
import { getQuestBySlug, getQuestSlugs } from "@/data/quests";
import { buildPageMetadata } from "@/lib/site-metadata";
import { QuestContext } from "@/components/quests/quest-context";
import { QuestDetailSidebar } from "@/components/quests/quest-detail-sidebar";
import { QuestGallery } from "@/components/quests/quest-gallery";
import { QuestHero } from "@/components/quests/quest-hero";
import { QuestMeta } from "@/components/quests/quest-meta";
import { QuestOutcomes } from "@/components/quests/quest-outcomes";
import { QuestRealCaseSection } from "@/components/quests/quest-real-case";
import { QuestSection } from "@/components/quests/quest-section";
import { PixelButton } from "@/components/ui/pixel-button";

type QuestPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getQuestSlugs();
}

export async function generateMetadata({ params }: QuestPageProps): Promise<Metadata> {
  const { slug } = await params;
  const quest = getQuestBySlug(slug);

  if (!quest) return { title: "Quest Not Found", robots: { index: false, follow: false } };

  return buildPageMetadata({
    title: quest.title,
    description: quest.summary,
    path: `/quests/${slug}`,
  });
}

export default async function QuestPage({ params }: QuestPageProps) {
  const { slug } = await params;
  const quest = getQuestBySlug(slug);

  if (!quest) notFound();

  return (
    <main className="site-container py-4 lg:py-8">
      <QuestVisitAchievement slug={slug} />

      <div className="sticky top-[calc(var(--rpg-mobile-header-height)+var(--rpg-mobile-level-height))] z-30 -mx-4 mb-3 border-b border-divider bg-background px-4 lg:static lg:mx-0 lg:mb-0 lg:border-0 lg:bg-transparent lg:px-0">
        <Link
          href="/quests"
          className="inline-flex min-h-11 items-center font-pixel text-[10px] text-foreground transition-[transform,color] hover:-translate-x-px hover:-translate-y-px hover:text-accent lg:hidden"
        >
          ← 返回项目
        </Link>
      </div>

      <div className="hidden lg:block">
        <p className="font-pixel text-[11px] text-muted">04. QUEST DETAIL</p>
        <PixelButton href="/quests" variant="secondary" size="sm" className="mt-3">
          ← 返回全部项目
        </PixelButton>
      </div>

      <div className="lg:hidden">
        <p className="font-pixel text-[10px] text-muted">04. QUEST DETAIL</p>
      </div>

      <div className="mt-3">
        <QuestHero quest={quest} />
      </div>

      <section className="mt-4 grid gap-4 pb-8 lg:mt-8 lg:grid-cols-[72fr_28fr] lg:gap-5 lg:pb-0">
        <article className="min-w-0">
          <QuestMeta quest={quest} />

          <div className="mt-4 border-2 border-border bg-paper px-4 lg:px-5">
            <QuestContext quest={quest} index={2} />
            <QuestSection id="actions" index={3} label="WHAT I DID" title="我实际做了什么" bullets={quest.actions} />
            {quest.realCase && <QuestRealCaseSection realCase={quest.realCase} index={4} />}
            <QuestOutcomes index={5} outcomes={quest.outcomes} metrics={quest.outcomeMetrics} />
            <QuestSection id="learnings" index={6} label="LEARNINGS" title="复盘与收获" content={quest.learnings} />
            <QuestGallery gallery={quest.gallery} />
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <PixelButton href="/quests" variant="primary" className="w-full sm:w-auto">
              返回项目
            </PixelButton>
            <PixelButton href="/contact" variant="secondary" className="w-full sm:w-auto">
              联系我
            </PixelButton>
          </div>
        </article>

        <aside className="hidden lg:block">
          <QuestDetailSidebar />
        </aside>
      </section>
    </main>
  );
}
