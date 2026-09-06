import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JournalReadAchievement } from "@/components/journal/journal-read-achievement";
import { PixelTag } from "@/components/ui/pixel-tag";
import { getJournalEntry, getJournalSlugs, journalSeed } from "@/data/journal";
import { buildPageMetadata } from "@/lib/site-metadata";

type JournalNotePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getJournalSlugs();
}

export async function generateMetadata({ params }: JournalNotePageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getJournalEntry(slug);

  if (!entry) return { title: "Note Not Found", robots: { index: false, follow: false } };

  return buildPageMetadata({
    title: entry.title,
    description: entry.summary,
    path: `/journal/${slug}`,
  });
}

export default async function JournalNotePage({ params }: JournalNotePageProps) {
  const { slug } = await params;
  const entry = getJournalEntry(slug);

  if (!entry) notFound();

  const index = journalSeed.findIndex((item) => item.slug === slug);
  const previous = journalSeed[(index - 1 + journalSeed.length) % journalSeed.length];
  const next = journalSeed[(index + 1) % journalSeed.length];

  return (
    <main className="site-container py-4 lg:py-8">
      <JournalReadAchievement />

      <div className="sticky top-[calc(var(--rpg-mobile-header-height)+var(--rpg-mobile-level-height))] z-30 -mx-4 mb-4 border-b border-divider bg-background px-4 lg:static lg:mx-0 lg:mb-6 lg:border-0 lg:bg-transparent lg:px-0">
        <div className="flex min-h-11 items-center justify-between gap-3">
          <Link
            href="/journal"
            className="inline-flex min-h-11 items-center font-pixel text-[10px] text-foreground transition-[transform,color] hover:-translate-x-px hover:text-accent"
          >
            ← 返回 JOURNAL
          </Link>
          <p className="font-pixel text-[9px] text-muted">06. FIELD NOTE</p>
        </div>
      </div>

      <section className="grid gap-4 pb-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-5 lg:pb-0">
        <article className="pixel-cut-frame min-w-0">
          <div className="pixel-cut-surface bg-paper">
            <header className="border-b-2 border-border p-4 lg:p-6">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-pixel text-[9px]">
                <span className="text-accent">{entry.category}</span>
                <span className="text-muted">{entry.date}</span>
                <span className="text-muted">{entry.readTime}</span>
              </div>
              <h1 className="mt-4 max-w-3xl font-pixel-zh text-[30px] font-bold leading-[1.35] lg:text-[42px]">
                {entry.title}
              </h1>
              <p className="mt-4 max-w-3xl text-[15px] leading-7 text-muted">{entry.summary}</p>
            </header>

            <div className="p-4 lg:p-6">
              <div className="mx-auto max-w-[720px] space-y-5 text-[15px] leading-8 text-foreground/90 lg:text-[16px]">
                {entry.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="mx-auto mt-8 max-w-[720px] border-t border-divider pt-5">
                <p className="font-pixel text-[9px] text-accent">TOOLS / TAGS</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {entry.tools.map((tool) => (
                    <PixelTag key={tool}>{tool}</PixelTag>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </article>

        <aside className="space-y-4 lg:sticky lg:top-[84px] lg:self-start">
          <section className="pixel-cut-frame">
            <div className="pixel-cut-surface bg-paper p-4">
              <p className="font-pixel text-[9px] text-accent">RELATED QUEST</p>
              <h2 className="mt-2 text-[15px] font-bold leading-6">{entry.relatedQuest.title}</h2>
              <Link
                href={entry.relatedQuest.href}
                className="mt-4 flex min-h-11 items-center justify-between border-2 border-border bg-soft px-3 font-pixel text-[9px] hover:border-accent hover:text-accent"
              >
                OPEN QUEST <span>→</span>
              </Link>
            </div>
          </section>

          <section className="border-2 border-border bg-foreground p-4 text-white">
            <p className="font-pixel text-[9px] text-white/55">DIGITAL GARDEN</p>
            <p className="mt-2 font-pixel text-[12px]">NOTE {String(index + 1).padStart(2, "0")} / {String(journalSeed.length).padStart(2, "0")}</p>
            <p className="mt-3 text-[12px] leading-6 text-white/70">写作、照片和工作流会继续慢慢长在这里。</p>
          </section>
        </aside>
      </section>

      <nav className="grid gap-2 pb-8 sm:grid-cols-2 lg:pb-0" aria-label="Journal note navigation">
        <Link
          href={`/journal/${previous.slug}`}
          className="min-h-12 border-2 border-border bg-paper px-4 py-3 hover:border-accent"
        >
          <span className="font-pixel text-[8px] text-muted">← PREV NOTE</span>
          <span className="mt-1 block text-[12px] font-semibold leading-5">{previous.title}</span>
        </Link>
        <Link
          href={`/journal/${next.slug}`}
          className="min-h-12 border-2 border-border bg-paper px-4 py-3 text-right hover:border-accent"
        >
          <span className="font-pixel text-[8px] text-muted">NEXT NOTE →</span>
          <span className="mt-1 block text-[12px] font-semibold leading-5">{next.title}</span>
        </Link>
      </nav>
    </main>
  );
}
