import { PixelIcon } from "@/components/ui/pixel-icon";
import type { AssetId } from "@/lib/assets";

type Fact = {
  title: string;
  label: string;
  icon: AssetId;
  description: string;
};

const facts: Fact[] = [
  {
    title: "跨专业旅行者",
    label: "MAP CHANGE",
    icon: "player.factContentSpark",
    description: "本科读广播电视编导，后来读新闻与传播，一路在媒体、内容和互联网之间换地图。",
  },
  {
    title: "相机常驻背包",
    label: "EQUIPMENT",
    icon: "player.factCameraKit",
    description: "摄影是长期爱好，也是记录生活、理解画面和制作内容的一种方式。",
  },
  {
    title: "新工具探索癖",
    label: "PASSIVE TRAIT",
    icon: "ui.sparkle",
    description: "看到新工具会先试一遍，真正能解决问题、让事情更顺手的才会留下。",
  },
  {
    title: "猫咪常驻 NPC",
    label: "COMPANION",
    icon: "player.factCatNpc",
    description: "它没有固定任务，主要负责隐藏彩蛋、陪逛网站，以及提供一点情绪价值。",
  },
];

export function FunFactsInspect() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {facts.map((fact) => (
        <article key={fact.title} className="min-h-[150px] border border-divider bg-soft p-3">
          <div className="flex items-start justify-between gap-3">
            <span className="flex h-11 w-11 items-center justify-center bg-paper">
              <PixelIcon assetId={fact.icon} decorative width={38} height={38} className="h-auto max-h-9 w-auto max-w-9" />
            </span>
            <span className="font-pixel text-[8px] text-accent">{fact.label}</span>
          </div>
          <h3 className="mt-3 text-[14px] font-semibold leading-5">{fact.title}</h3>
          <p className="mt-1.5 text-[11px] leading-5 text-muted">{fact.description}</p>
        </article>
      ))}
    </div>
  );
}
