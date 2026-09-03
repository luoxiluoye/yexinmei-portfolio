import { journalCategories, journalSeed } from "@/data/journal";
import { CharacterScene } from "@/components/scenes/character-scene";
import { MiniWorldScene } from "@/components/scenes/mini-world-scene";
import { PixelIcon } from "@/components/ui/pixel-icon";
import { PixelPanel } from "@/components/ui/pixel-panel";
import { PixelTag } from "@/components/ui/pixel-tag";

export default function JournalPage() {
  return (
    <main className="site-container py-5 lg:py-8">
      <header className="grid gap-4 lg:grid-cols-[1fr_300px] lg:items-center">
        <div className="min-w-0">
          <p className="font-pixel text-[12px] text-muted">06. JOURNAL</p>
          <h1 className="rpg-page-title mt-2">JOURNAL</h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-[26px] text-muted">
            一些写作、照片、内容观察，以及正在尝试的小东西。
          </p>
        </div>
        <CharacterScene variant="journal" />
      </header>

      <section className="mt-5 grid gap-4 pb-8 lg:mt-8 lg:grid-cols-[75fr_25fr] lg:gap-5 lg:pb-0">
        <div className="min-w-0">
          <div className="no-scrollbar mb-4 flex min-w-0 gap-2 overflow-x-auto border-y border-divider py-3">
            <PixelTag variant="dark">ALL</PixelTag>
            {journalCategories.map((category) => (
              <PixelTag key={category}>{category}</PixelTag>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {journalSeed.map((entry) => (
              <article
                key={entry.title}
                className="grid grid-cols-[76px_1fr] gap-4 border-2 border-border bg-paper p-3 sm:block sm:min-h-[236px] sm:p-4"
              >
                <div className="flex h-[76px] items-center justify-center border border-divider bg-soft sm:h-[96px]">
                  <PixelIcon assetId="items.notebook" decorative width={44} height={44} />
                </div>

                <div className="min-w-0 sm:mt-4">
                  <p className="font-pixel text-[10px] text-accent">{entry.category}</p>
                  <h2 className="mt-1 text-[16px] font-bold leading-6">{entry.title}</h2>
                  <p className="mt-2 text-[13px] leading-6 text-muted">{entry.summary}</p>
                  <p className="mt-3 font-pixel text-[10px] text-muted">{entry.status}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-4 text-[13px] text-muted">更多内容持续更新中…</div>
        </div>

        <aside className="hidden lg:block">
          <PixelPanel eyebrow="DIGITAL" title="GARDEN SUMMARY" contentClassName="p-3">
            <MiniWorldScene kind="garden" className="min-h-[190px] border-0" />
            <p className="mt-3 px-2 pb-2 text-[13px] leading-6 text-muted">
              这里会慢慢长出写作、照片、内容观察和一些还在发芽的小项目。
            </p>
          </PixelPanel>
        </aside>
      </section>
    </main>
  );
}
