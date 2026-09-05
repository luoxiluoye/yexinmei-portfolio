import { CharacterScene } from "@/components/scenes/character-scene";
import { MiniWorldScene } from "@/components/scenes/mini-world-scene";
import { JournalExplorer } from "@/components/journal/journal-explorer";
import { PixelPanel } from "@/components/ui/pixel-panel";

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
          <JournalExplorer />
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
