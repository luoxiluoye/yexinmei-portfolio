import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getQuestBySlug, getQuestSlugs } from "@/data/quests";
import { QuestDetailSidebar } from "@/components/quests/quest-detail-sidebar";
import { QuestGallery } from "@/components/quests/quest-gallery";
import { QuestHero } from "@/components/quests/quest-hero";
import { QuestMeta } from "@/components/quests/quest-meta";
import { QuestOutcomes } from "@/components/quests/quest-outcomes";
import { QuestSection } from "@/components/quests/quest-section";
import { PixelButton } from "@/components/ui/pixel-button";

type QuestPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getQuestSlugs();
}

export async function generateMetadata({
  params,
}: QuestPageProps): Promise<Metadata> {
  const { slug } = await params;
  const quest = getQuestBySlug(slug);

  if (!quest) return { title: "Quest Not Found" };

  return {
    title: quest.title,
    description: quest.summary,
  };
}

export default async function QuestPage({ params }: QuestPageProps) {
  const { slug } = await params;
  const quest = getQuestBySlug(slug);

  if (!quest) notFound();

  return (
    <main className="site-container py-4 lg:py-8">
      <Link
        href="/quests"
        className="inline-flex min-h-11 items-center text-[13px] hover:text-accent"
      >
        ← 返回项目列表
      </Link>

      <div className="mt-3">
        <QuestHero quest={quest} />
      </div>

      <section className="mt-4 grid gap-4 pb-8 lg:mt-8 lg:grid-cols-[72fr_28fr] lg:gap-5 lg:pb-0">
        <article className="min-w-0">
          <QuestMeta quest={quest} />

          <div className="mt-4 border-2 border-border bg-paper px-4 lg:px-5">
            <QuestSection index={1} label="INTRO" title="项目简介" content={quest.summary} />
            <QuestSection index={2} label="OBJECTIVE" title="项目目标" content={quest.objective} />
            <QuestSection index={3} label="CHALLENGE" title="主要难点" content={quest.challenge} />
            <QuestSection index={4} label="ACTIONS" title="我做了什么" bullets={quest.actions} />
            <QuestOutcomes index={5} outcomes={quest.outcomes} metrics={quest.outcomeMetrics} />
            <QuestSection index={6} label="LEARNINGS" title="复盘与收获" content={quest.learnings} />
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
