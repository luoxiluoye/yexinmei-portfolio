import { profile } from "@/data/profile";
import { PlayerCard } from "@/components/ui/player-card";

const playerInfo = [
  { label: "NAME", value: profile.nameZh },
  { label: "BASE", value: profile.base },
  { label: "CLASS", value: profile.className.join(" / ") },
];

export function MiniPlayerCard() {
  return (
    <PlayerCard
      name={profile.nameZh}
      subtitle={`${profile.nameEn} · ${profile.keywords.join(" / ")}`}
      info={playerInfo}
      xp={{ label: "XP", current: 78, max: 100, level: 28 }}
      href="/player"
      actionLabel="更多关于我 →"
      className="h-full"
    />
  );
}
