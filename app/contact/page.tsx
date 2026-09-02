"use client";

import { useState } from "react";

import type { AssetId } from "@/lib/assets";
import { contact } from "@/data/contact";

import { CharacterScene } from "@/components/scenes/character-scene";
import { PixelButton } from "@/components/ui/pixel-button";
import { PixelIcon } from "@/components/ui/pixel-icon";
import { PixelPanel } from "@/components/ui/pixel-panel";
import { SpeechBubble } from "@/components/ui/speech-bubble";

const assetByType: Record<(typeof contact.items)[number]["type"], AssetId> = {
  email: "items.mail",
  phone: "items.laptop",
  wechat: "ui.speechBubble",
  resume: "items.notebook",
};

const hintByType: Record<(typeof contact.items)[number]["type"], string> = {
  email: "邮箱",
  phone: "手机号",
  wechat: "微信",
  resume: "简历",
};

const noteByType: Record<(typeof contact.items)[number]["type"], string> = {
  email: "适合求职 / 合作 / 内容交流",
  phone: "需要时可以直接联系",
  wechat: "点击按钮复制微信号",
  resume: "PDF 版本稍后补充",
};

export default function ContactPage() {
  const [copied, setCopied] = useState(false);

  async function copyWechat(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="site-container py-4 lg:py-7">
      <section className="grid gap-4 lg:grid-cols-[50fr_50fr] lg:items-center lg:gap-8">
        <div>
          <p className="font-pixel text-[12px] text-muted">07. CONTACT</p>
          <h1 className="rpg-page-title mt-2">{contact.heading}</h1>
          <p className="mt-2 font-pixel text-[11px] text-accent">MAILBOX OPEN · PLAYER ONLINE</p>
          <div className="mt-5">
            <SpeechBubble speaker="MINI">{contact.bubble}</SpeechBubble>
          </div>
        </div>

        <CharacterScene variant="contact" />
      </section>

      <section className="mt-4 grid gap-3 pb-8 sm:grid-cols-2 lg:mt-6 lg:grid-cols-4 lg:gap-4 lg:pb-0">
        {contact.items.map((item, index) => {
          const pending = item.value === "TODO";
          const displayValue = pending ? "COMING SOON" : item.value;
          const isWechat = item.type === "wechat";
          const href =
            item.type === "email"
              ? `mailto:${item.value}`
              : item.type === "phone"
                ? `tel:${item.value}`
                : undefined;

          return (
            <PixelPanel
              key={item.type}
              eyebrow={`SLOT 0${index + 1}`}
              title={item.label}
              accent={index === 0 || index === 2}
            >
              <div className="flex min-h-[154px] flex-col">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-divider bg-soft">
                    <PixelIcon
                      assetId={assetByType[item.type]}
                      decorative
                      width={32}
                      height={32}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] text-muted">{hintByType[item.type]}</p>
                    <p className="mt-1 break-all text-[14px] font-medium leading-5">
                      {displayValue}
                    </p>
                    <p className="mt-2 text-[11px] leading-4 text-muted">
                      {noteByType[item.type]}
                    </p>
                  </div>
                </div>

                <div className="mt-auto pt-5">
                  {pending ? (
                    <PixelButton variant="secondary" disabled className="w-full">
                      RESUME COMING SOON
                    </PixelButton>
                  ) : isWechat ? (
                    <PixelButton
                      variant="secondary"
                      className="w-full"
                      onClick={() => copyWechat(item.value)}
                    >
                      {copied ? "COPIED ✓" : "复制微信号"}
                    </PixelButton>
                  ) : (
                    <PixelButton href={href} variant="secondary" className="w-full">
                      {item.type === "email" ? "发送邮件" : "拨打电话"}
                    </PixelButton>
                  )}
                </div>
              </div>
            </PixelPanel>
          );
        })}
      </section>

      <div className="pb-4 text-center font-pixel text-[10px] text-muted lg:pb-0">
        SELECT A CONTACT SLOT · THANKS FOR VISITING MY WORLD ♥
      </div>
    </main>
  );
}
