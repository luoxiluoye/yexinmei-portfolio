import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getQuestBySlug, getQuestSlugs } from "@/data/quests";
import { buildPageMetadata } from "@/lib/site-metadata";
import { getPracticeRecord, records } from "@/components/professional/resume-content";
import { PracticeDetail } from "@/components/professional/practice-details";
import { LegacyPractice, legacyPracticeTitle } from "@/components/professional/legacy-practice";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return Array.from(new Set([...getQuestSlugs().map(item => item.slug), ...records.map(item => item.slug)]))
    .filter(slug => slug !== "red-leaf")
    .map(slug => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const curated = getPracticeRecord(slug);
  const legacy = getQuestBySlug(slug);
  const record = curated ?? legacy;
  if (!record) return { title: "未找到这段经历", robots: { index: false, follow: false } };
  const title = curated?.title ?? (legacy ? legacyPracticeTitle(legacy) : record.title);
  return buildPageMetadata({ title, description: record.summary, path: `/quests/${slug}` });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  if (getPracticeRecord(slug)) return <PracticeDetail slug={slug} />;
  const quest = getQuestBySlug(slug);
  if (!quest) notFound();
  return <LegacyPractice quest={quest} />;
}
