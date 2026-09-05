"use client";

import { useState } from "react";

import type { AssetId } from "@/lib/assets";
import { contact } from "@/data/contact";
import { profile } from "@/data/profile";

import { CharacterScene } from "@/components/scenes/character-scene";
import { PixelButton } from "@/components/ui/pixel-button";
import { PixelIcon } from "@/components/ui/pixel-icon";
import { PixelPanel } from "@/components/ui/pixel-panel";

const assetByType: Record<(typeof contact.items)[number]["type"], AssetId> = {
  email: "items.mail",
  phone: "items.laptop",
  wechat: "ui.heart",
};

const hintByType: Record<(typeof contact.items)[number]["type"], string> = {
  email: "求职 / 合作 / 内容交流",
  phone: "求职沟通可直接电话联系",
  wechat: "点击按钮复制微信号",
};

export default function ContactPage() {
  const [copied, setCopied] = useState(false);
  const email = contact.items.find((item) => item.type === "email")?.value ?? "";
  const wechat = contact.items.find((item) => item.type === "wechat")?.value ?? "";

  async function copyWechat() {
    try {
      await navigator.clipboard.writeText(wechat);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="site-container py-5 lg:py-8">
      <section className="mx-auto grid max-w-[1080px] items-center gap-4 lg:grid-cols-[44fr_56fr] lg:gap-6">
        <div className="order-2 lg:order-1">
          <p className="font-pixel text-[12px] text-muted">07. CONTACT</p>
          <h1 className="rpg-page-title mt-2">{contact.heading}</h1>
          <p className="mt-4 max-w-[42ch] text-[15px] leading-[26px] text-muted">
            {contact.bubble}
          </p>
          <p className="mt-4 font-pixel text-[10px] text-accent">MAILBOX OPEN · PLAYER ONLINE</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {profile.resumePath && (
              <PixelButton href={profile.resumePath} variant="primary">
                DOWNLOAD RESUME ↓
              </PixelButton>
            )}
            <PixelButton href={`mailto:${email}`} variant={profile.resumePath ? "secondary" : "primary"}>
              EMAIL ME →
            </PixelButton>
            <PixelButton variant="secondary" onClick={copyWechat}>
              {copied ? "WECHAT COPIED ✓" : "COPY WECHAT"}
            </PixelButton>
          </div>

          {profile.resumePath && (
            <p className="mt-2 font-pixel text-[9px] text-muted">
              PDF · UPDATED {contact.resumeUpdated}
            </p>
          )}
        </div>

        <div className="order-1 lg:order-2">
          <CharacterScene variant="contact" bubbleText="欢迎来找我聊聊 :)" />
        </div>
      </section>

      <section className="mx-auto mt-5 grid max-w-[1120px] gap-4 pb-8 sm:grid-cols-2 lg:mt-8 lg:grid-cols-3 lg:pb-0">
        {contact.items.map((item, index) => {
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
              eyebrow={`0${index + 1}`}
              title={item.label}
              accent={index === 0}
              className="h-full"
              contentClassName="flex h-[190px] flex-col p-4 lg:p-5"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-[56px] w-[56px] shrink-0 items-center justify-center border border-divider bg-soft">
                  <PixelIcon
                    assetId={assetByType[item.type]}
                    decorative
                    width={48}
                    height={48}
                    className="h-[46px] w-[46px]"
                  />
                </div>
                <div className="min-w-0">
                  <p className="break-all text-[14px] font-semibold leading-5">{item.value}</p>
                  <p className="mt-2 text-[12px] leading-5 text-muted">{hintByType[item.type]}</p>
                </div>
              </div>

              <div className="mt-auto pt-4">
                {isWechat ? (
                  <PixelButton variant="secondary" className="w-full" onClick={copyWechat}>
                    {copied ? "已复制微信号 ✓" : "复制微信号"}
                  </PixelButton>
                ) : (
                  <PixelButton
                    href={href}
                    variant={index === 0 ? "primary" : "secondary"}
                    className="w-full"
                  >
                    {item.type === "email" ? "发送邮件" : "拨打电话"}
                  </PixelButton>
                )}
              </div>
            </PixelPanel>
          );
        })}
      </section>

      {copied && (
        <div className="fixed bottom-[calc(var(--rpg-bottom-tab-height)+16px)] left-1/2 z-[70] -translate-x-1/2 border-2 border-border bg-foreground px-4 py-2 font-pixel text-[11px] text-white lg:bottom-6">
          WECHAT COPIED · 微信号已复制
        </div>
      )}
    </main>
  );
}
