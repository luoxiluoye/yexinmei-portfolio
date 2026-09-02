import { HeroSection } from "@/components/home/hero-section";
import { MiniPlayerCard } from "@/components/home/mini-player-card";
import { QuestLogPreview } from "@/components/home/quest-log-preview";
import { SkillsPreview } from "@/components/home/skills-preview";
import { StatusBar } from "@/components/ui/status-bar";

export default function HomePage() {
  return (
    <main>
      <HeroSection />

      <section className="site-container mt-4 grid gap-4 lg:mt-5 lg:grid-cols-[30fr_38fr_32fr] lg:gap-[18px]">
        <MiniPlayerCard />
        <QuestLogPreview />
        <SkillsPreview />
      </section>

      <div className="site-container mt-4 pb-8 lg:mt-5 lg:pb-0">
        <StatusBar
          items={[
            { label: "PLAYER", value: "YEXINMEI" },
            { label: "STATUS", value: "ONLINE", accent: true },
            { label: "BASE", value: "CHENGDU" },
            { label: "MODE", value: "LEVELING UP" },
          ]}
        />
      </div>
    </main>
  );
}
