"use client";

import { useState } from "react";

import type { AssetId } from "@/lib/assets";
import { contact } from "@/data/contact";

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
  email: "求职 / 合作 / 内容交流都可以发邮件给我",
  phone: "如果事情比较急，可以直接电话联系",
  wechat: "复制微信号后添加即可",
  resume: "PDF 版本之后补充，这个槽位先锁着",
};

const channelByType: Record<(typeof contact.items)[number]["type"], string> = {
  email: "MAIL CHANNEL",
  phone: "CALL CHANNEL",
  wechat: "CHAT CHANNEL",
  resume: "FILE CHANNEL",
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
      <section className="grid gap-5 lg:grid-cols-[42fr_58fr] lg:items-stretch lg:gap-8">
        <div className="flex flex-col justify-center py-2 lg:py-4">
          <p className="font-pixel text-[12px] text-muted">07. CONTACT</p>
          <h1 className="rpg-page-title mt-2">{contact.heading}</h1>

          <div className="mt-3 flex flex-wrap gap-2 font-pixel text-[9px] lg:text-[10px]">
            <span className="border border-border bg-foreground px-2.5 py-1.5 text-white">MAILBOX OPEN</span>
            <span className="border border-divider bg-soft px-2.5 py-1.5">PLAYER ONLINE</span>
            <span className="border border-divider bg-soft px-2.5 py-1.5">3 / 4 SLOTS READY</span>
          </div>

          <div className="mt-5 max-w-[360px]">
            <SpeechBubble speaker="MINI">{contact.bubble}</SpeechBubble>
          </div>
        </div>

        <div className="relative min-h-[270px] overflow-hidden lg:min-h-[340px]">
          <div className="absolute inset-x-[4%] bottom-2 top-3 border border-divider bg-soft/45" />

          <PixelIcon
            assetId="world.cloudMedium"
            decorative
            width={132}
            height={82}
            className="absolute left-[8%] top-[10%] z-10 opacity-90"
          />
          <PixelIcon
            assetId="world.cloudSmall"
            decorative
            width={82}
            height={58}
            className="absolute right-[9%] top-[16%] z-10 opacity-85"
          />
          <PixelIcon
            assetId="ui.sparkle"
            decorative
            width={24}
            height={24}
            className="absolute left-[35%] top-[18%] z-20"
          />
          <PixelIcon
            assetId="ui.heart"
            decorative
            width={26}
            height={26}
            className="absolute right-[26%] top-[28%] z-20"
          />

          <PixelIcon
            assetId="world.grassLong"
            decorative
            width={620}
            height={310}
            className="absolute bottom-0 left-1/2 z-20 w-[86%] -translate-x-1/2 lg:w-[82%]"
          />
          <PixelIcon
            assetId="world.woodenSign"
            decorative
            width={116}
            height={150}
            className="absolute bottom-[28px] right-[8%] z-30 w-[86px] lg:bottom-[38px] lg:w-[108px]"
          />
          <PixelIcon
            assetId="cat.wave"
            decorative
            width={96}
            height={96}
            className="absolute bottom-[40px] left-[22%] z-40 w-[76px] lg:bottom-[50px] lg:left-[24%] lg:w-[92px]"
          />
          <PixelIcon
            assetId="character.wave"
            alt="Yexinmei Luo pixel character"
            width={214}
            height={286}
            className="absolute bottom-[28px] left-[52%] z-40 h-auto w-[136px] -translate-x-1/2 lg:bottom-[38px] lg:w-[178px]"
          />

          <div className="absolute bottom-4 left-1/2 z-50 -translate-x-1/2 border-2 border-border bg-paper px-3 py-2 font-pixel text-[9px] shadow-[3px_3px_0_rgba(17,17,17,.12)] lg:bottom-5 lg:text-[10px]">
            SEND A MESSAGE →
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 pb-7 md:grid-cols-2 lg:mt-7 lg:gap-5 lg:pb-0">
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
              accent={!pending}
              catPeek={item.type === "wechat"}
              rightSlot={
                <span
                  className={`border px-2 py-1 font-pixel text-[9px] ${
                    pending
                      ? "border-divider bg-soft text-muted"
                      : "border-border bg-foreground text-white"
                  }`}
                >
                  {pending ? "LOCKED" : "READY"}
                </span>
              }
              contentClassName="p-4 lg:p-5"
            >
              <div className="flex min-h-[202px] flex-col">
                <div className="flex items-start gap-4 lg:gap-5">
                  <div className="relative flex h-[82px] w-[82px] shrink-0 items-center justify-center border-2 border-border bg-soft shadow-[3px_3px_0_rgba(17,17,17,.08)] lg:h-[92px] lg:w-[92px]">
                    <PixelIcon
                      assetId={assetByType[item.type]}
                      decorative
                      width={62}
                      height={62}
                      className="h-[58px] w-[58px] lg:h-[66px] lg:w-[66px]"
                    />
                    {!pending && (
                      <PixelIcon
                        assetId={index % 2 === 0 ? "ui.heart" : "ui.star"}
                        decorative
                        width={18}
                        height={18}
                        className="absolute -right-2 -top-2"
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1 pt-1">
                    <p className="font-pixel text-[9px] text-accent">{channelByType[item.type]}</p>
                    <p className="mt-1 text-[12px] text-muted">{hintByType[item.type]}</p>
                    <p className="mt-1 break-all text-[16px] font-semibold leading-6 lg:text-[18px]">
                      {displayValue}
                    </p>
                    <p className="mt-2 max-w-[36ch] text-[12px] leading-5 text-muted lg:text-[13px]">
                      {noteByType[item.type]}
                    </p>
                  </div>
                </div>

                <div className="mt-auto pt-5">
                  {pending ? (
                    <PixelButton variant="secondary" disabled className="w-full sm:w-[220px]">
                      简历稍后补充
                    </PixelButton>
                  ) : isWechat ? (
                    <PixelButton
                      variant="primary"
                      className="w-full sm:w-[220px]"
                      onClick={() => copyWechat(item.value)}
                    >
                      {copied ? "已复制 ✓" : "复制微信号"}
                    </PixelButton>
                  ) : (
                    <PixelButton href={href} variant="primary" className="w-full sm:w-[220px]">
                      {item.type === "email" ? "发送邮件" : "拨打电话"}
                    </PixelButton>
                  )}
                </div>
              </div>
            </PixelPanel>
          );
        })}
      </section>

      <div className="grid gap-2 border-2 border-border bg-foreground p-2 text-white sm:grid-cols-3 lg:mt-5">
        <div className="border border-white/20 px-3 py-2 font-pixel text-[9px]">
          <span className="text-white/55">CONTACT</span>
          <span className="ml-2 text-accent">03 OPEN</span>
        </div>
        <div className="border border-white/20 px-3 py-2 font-pixel text-[9px]">
          <span className="text-white/55">RESUME</span>
          <span className="ml-2">LOCKED</span>
        </div>
        <div className="border border-white/20 px-3 py-2 font-pixel text-[9px]">
          <span className="text-white/55">STATUS</span>
          <span className="ml-2">PLAYER ONLINE ♥</span>
        </div>
      </div>
    </main>
  );
}
