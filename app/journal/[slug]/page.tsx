import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getJournalEntry, getJournalSlugs } from "@/data/journal";
import { buildPageMetadata } from "@/lib/site-metadata";
import { SupportJournalArticle } from "@/components/professional/support-pages";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return getJournalSlugs(); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = getJournalEntry(slug);
  if (!entry) return { title: "未找到这篇手记", robots: { index: false, follow: false } };
  return buildPageMetadata({ title: entry.title, description: entry.summary, path: `/journal/${slug}` });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const entry = getJournalEntry(slug);
  if (!entry) notFound();
  return <SupportJournalArticle entry={entry} />;
}
