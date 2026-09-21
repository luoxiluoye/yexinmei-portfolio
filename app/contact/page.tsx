"use client";

import { useState } from "react";

import type { AssetId } from "@/lib/assets";
import { contact } from "@/data/contact";
import { profile } from "@/data/profile";

import { CharacterScene } from "@/components/scenes/character-scene";
import { PixelButton } from "@/components/ui/pixel-button";
import { PixelIcon } from "@/components/ui/pixel-icon";
import { PixelPanel } from "@/components/ui/pixel-panel";

type ContactCardType = "email" | "phone" | "wechat" | "resume";

type ContactCard = {
  type: ContactCardType;
  label: string;
  value: string;
};

const assetByType: Record<ContactCardType, AssetId> = {
  email: "items.mail",
  phone: "ui.contactPhone",
  wechat: "ui.heart",
  resume: "items.notebook",
};

const hintByType: Record<ContactCardType, string> = {
  email: "求职 / 合作 / 内容交流",
  phone: "求职沟通可直接电话联系",
  wechat: "点击按钮复制微信号",
  resume: "添加微信 luoxiluoye，备注「简历」即可",
};

export default function ContactPage() {
  const [copyError, setCopyError] = useState("");
  const [copiedTarget, setCopiedTarget] = useState<"wechat" | "resume" | null>(null);
  const email = contact.items.find((item) => item.type === "email")?.value ?? "";
  const phone = contact.items.find((item) => item.type === "phone")?.value ?? "";
  const wechat = contact.items.find((item) => item.type === "wechat")?.value ?? "";

  const contactCards: ContactCard[] = [
    { type: "email", label: "EMAIL", value: email },
    { type: "phone", label: "PHONE", value: phone },
    { type: "wechat", label: "WECHAT", value: wechat },
    {
      type: "resume",
      label: "RESUME",
      value: profile.resumePath ? "PDF RESUME" : "微信索取简历",
    },
  ];

  async function copyWechat(target: "wechat" | "resume" = "wechat") {
    try {
      await navigator.clipboard.writeText(wechat);
      setCopyError("");
      setCopiedTarget(target);
      window.setTimeout(() => setCopiedTarget(null), 1800);
    } catch {
      setCopyError(`无法自动复制，请手动复制微信号：${wechat}`);
    }
  }

  return (
    <main id="main-content" className="site-container portfolio-page py-5 lg:py-8">
      <section className="mx-auto grid max-w-[1080px] items-center gap-4 lg:grid-cols-[44fr_56fr] lg:gap-6">
        <div className="order-2 lg:order-1">
          <p className="font-pixel text-[12px] text-muted">07. CONTACT</p>
          <h1 className="rpg-page-title mt-2">{contact.heading}</h1>
          <p className="mt-4 max-w-[42ch] text-[15px] leading-[26px] text-muted">
            {contact.bubble}
          </p>
          <p className="mt-4 font-pixel text-[10px] text-accent">MAILBOX OPEN · PLAYER ONLINE</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {profile.resumePath ? (
              <PixelButton href={profile.resumePath} variant="primary">
                下载简历 ↓
              </PixelButton>
            ) : (
              <PixelButton variant="primary" onClick={() => copyWechat("resume")}>
                加微信索取简历
              </PixelButton>
            )}
            <PixelButton href={`mailto:${email}`} variant="secondary">
              发送邮件 →
            </PixelButton>
            <PixelButton variant="secondary" onClick={() => copyWechat("wechat")}>
              {copiedTarget === "wechat" ? "已复制微信 ✓" : "复制微信号"}
            </PixelButton>
          </div>

          <p role="status" aria-live="polite" className="mt-2 min-h-5 text-[12px] text-muted">{copyError || (copiedTarget ? "微信号已复制，可以粘贴到微信搜索。" : "")}</p>
          {profile.resumePath ? (
            <p className="mt-2 font-pixel text-[9px] text-muted">
              PDF · UPDATED {contact.resumeUpdated}
            </p>
          ) : (
            <p className="mt-2 text-[11px] leading-5 text-muted">
              暂未公开 PDF · 微信备注「简历」即可索取
            </p>
          )}
        </div>

        <div className="order-1 lg:order-2">
          <CharacterScene variant="contact" bubbleText="欢迎来找我聊聊 :)" />
        </div>
      </section>

      <section className="mx-auto mt-5 grid max-w-[1120px] gap-4 pb-8 sm:grid-cols-2 lg:mt-8 lg:grid-cols-4 lg:pb-0">
        {contactCards.map((item, index) => {
          const isWechat = item.type === "wechat";
          const isResume = item.type === "resume";
          const href =
            item.type === "email"
              ? `mailto:${item.value}`
              : item.type === "phone"
                ? `tel:${item.value}`
                : isResume && profile.resumePath
                  ? profile.resumePath
                  : undefined;

          return (
            <PixelPanel
              key={item.type}
              eyebrow={`0${index + 1}`}
              title={item.label}
              accent={index === 0}
              className="h-full"
              contentClassName="flex min-h-[190px] flex-col p-4 lg:p-5"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-[56px] w-[56px] shrink-0 items-center justify-center border border-divider bg-soft">
                  <PixelIcon
                    assetId={assetByType[item.type]}
                    decorative
                    width={48}
                    height={48}
                    className="h-12 w-12"
                  />
                </div>
                <div className="min-w-0">
                  <p className="break-all text-[14px] font-semibold leading-5">{item.value}</p>
                  <p className="mt-2 text-[12px] leading-5 text-muted">{hintByType[item.type]}</p>
                </div>
              </div>

              <div className="mt-auto pt-4">
                {isWechat ? (
                  <PixelButton variant="secondary" className="w-full" onClick={() => copyWechat("wechat")}>
                    {copiedTarget === "wechat" ? "已复制微信号 ✓" : "复制微信号"}
                  </PixelButton>
                ) : isResume && !profile.resumePath ? (
                  <PixelButton variant="secondary" className="w-full" onClick={() => copyWechat("resume")}>
                    {copiedTarget === "resume" ? "已复制微信号 ✓" : "加微信索取简历"}
                  </PixelButton>
                ) : (
                  <PixelButton
                    href={href}
                    variant={index === 0 ? "primary" : "secondary"}
                    className="w-full"
                  >
                    {item.type === "email"
                      ? "发送邮件"
                      : item.type === "phone"
                        ? "拨打电话"
                        : "下载简历 ↓"}
                  </PixelButton>
                )}
              </div>
            </PixelPanel>
          );
        })}
      </section>

      {copiedTarget && (
        <div className="fixed bottom-[calc(var(--rpg-bottom-tab-height)+16px)] left-1/2 z-[70] -translate-x-1/2 border-2 border-border bg-foreground px-4 py-2 font-pixel text-[11px] text-white lg:bottom-6">
          {copiedTarget === "resume" ? "WECHAT COPIED · 备注「简历」" : "WECHAT COPIED · 微信号已复制"}
        </div>
      )}
    </main>
  );
}
