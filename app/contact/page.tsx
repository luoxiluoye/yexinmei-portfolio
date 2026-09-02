import type { AssetId } from "@/lib/assets";
import { contact } from "@/data/contact";

import { CharacterScene } from "@/components/scenes/character-scene";
import { PixelButton } from "@/components/ui/pixel-button";
import { PixelIcon } from "@/components/ui/pixel-icon";
import { PixelPanel } from "@/components/ui/pixel-panel";
import { SpeechBubble } from "@/components/ui/speech-bubble";

const assetByType: Record<(typeof contact.items)[number]["type"], AssetId> = {
  email: "items.mail",
  xiaohongshu: "ui.heart",
  wechat: "ui.speechBubble",
  resume: "items.notebook",
};

const hintByType: Record<(typeof contact.items)[number]["type"], string> = {
  email: "邮箱",
  xiaohongshu: "小红书",
  wechat: "微信",
  resume: "简历",
};

export default function ContactPage() {
  return (
    <main className="site-container py-4 lg:py-8">
      <section className="grid gap-4 lg:grid-cols-[52fr_48fr] lg:items-center lg:gap-5">
        <div>
          <p className="font-pixel text-[12px] text-muted">07. CONTACT</p>
          <h1 className="rpg-page-title mt-2">{contact.heading}</h1>
          <div className="mt-5">
            <SpeechBubble speaker="MINI">{contact.bubble}</SpeechBubble>
          </div>
        </div>

        <CharacterScene variant="contact" className="min-h-[280px] lg:min-h-[340px]" />
      </section>

      <section className="mt-4 grid gap-3 pb-8 sm:grid-cols-2 lg:mt-8 lg:grid-cols-4 lg:gap-4 lg:pb-0">
        {contact.items.map((item) => {
          const pending = item.value === "TODO";
          const displayValue = pending ? "稍后补充" : item.value;

          return (
            <PixelPanel key={item.type} title={item.label}>
              <div className="flex min-h-[132px] flex-col">
                <div className="flex items-center gap-3">
                  <PixelIcon
                    assetId={assetByType[item.type]}
                    decorative
                    width={34}
                    height={34}
                  />
                  <div>
                    <p className="text-[12px] text-muted">{hintByType[item.type]}</p>
                    <p className="mt-1 text-sm">{displayValue}</p>
                  </div>
                </div>

                <div className="mt-auto pt-5">
                  <PixelButton variant="secondary" disabled={pending} className="w-full">
                    {pending ? "待开放" : displayValue}
                  </PixelButton>
                </div>
              </div>
            </PixelPanel>
          );
        })}
      </section>
    </main>
  );
}
