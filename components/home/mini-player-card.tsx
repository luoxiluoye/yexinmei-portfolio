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
      subtitle={`${profile.nameEn} · 内容运营 / 社区 / 科技内容`}
      info={playerInfo}
      xp={{ label: "XP", ...profile.xp }}
      href="/player"
      actionLabel="更多关于我 →"
      className="h-full"
    />
  );
}
