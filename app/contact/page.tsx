"use client";

import { useState } from "react";

import type { AssetId } from "@/lib/assets";
import { contact } from "@/data/contact";

import { CharacterScene } from "@/components/scenes/character-scene";
import { PixelButton } from "@/components/ui/pixel-button";
import { PixelIcon } from "@/components/ui/pixel-icon";
import { PixelPanel } from "@/components/ui/pixel-panel";

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
  email: "求职 / 合作 / 内容交流",
  phone: "需要时可以直接联系",
  wechat: "点击右侧即可复制",
  resume: "PDF 版本之后补充",
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
    <main className="site-container py-5 lg:py-8">
      <PixelPanel
        eyebrow="07. CONTACT"
        className="mx-auto max-w-[980px]"
        contentClassName="p-4 sm:p-5 lg:p-6"
      >
        <div className="grid items-center gap-4 lg:grid-cols-[44fr_56fr] lg:gap-7">
          <div className="order-2 lg:order-1">
            <h1 className="font-pixel text-[28px] leading-[1.05] sm:text-[34px] lg:text-[40px]">
              {contact.heading}
            </h1>
            <p className="mt-3 max-w-[38ch] text-[14px] leading-6 text-muted lg:text-[15px]">
              {contact.bubble}
            </p>
            <p className="mt-4 font-pixel text-[10px] text-accent">
              MAILBOX OPEN · PLAYER ONLINE
            </p>
          </div>

          <div className="order-1 lg:order-2">
            <CharacterScene variant="contact" />
          </div>
        </div>

        <div className="mt-4 space-y-2 lg:mt-5">
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

            const row = (
              <div className="flex min-h-[68px] items-center gap-3 border border-divider bg-paper px-3 py-2.5 transition-colors hover:border-border sm:gap-4 sm:px-4">
                <div className="flex h-[50px] w-[50px] shrink-0 items-center justify-center border border-divider bg-soft sm:h-[54px] sm:w-[54px]">
                  <PixelIcon
                    assetId={assetByType[item.type]}
                    decorative
                    width={44}
                    height={44}
                    className="h-[42px] w-[42px] sm:h-[46px] sm:w-[46px]"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-pixel text-[9px] text-accent">SLOT 0{index + 1}</span>
                    <span className="font-pixel text-[10px]">{item.label}</span>
                  </div>
                  <p className="mt-0.5 break-all text-[14px] font-semibold leading-5 sm:text-[15px]">
                    {displayValue}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-4 text-muted sm:text-[12px]">
                    {hintByType[item.type]} · {noteByType[item.type]}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  {isWechat && !pending ? (
                    <button
                      type="button"
                      onClick={() => copyWechat(item.value)}
                      className="min-h-11 border border-border bg-soft px-3 font-pixel text-[9px] hover:border-accent hover:text-accent"
                    >
                      {copied ? "COPIED ✓" : "COPY"}
                    </button>
                  ) : (
                    <span className="font-pixel text-[9px] text-muted">
                      {pending ? "LOCKED" : href ? "OPEN →" : "READY"}
                    </span>
                  )}
                </div>
              </div>
            );

            if (href && !pending) {
              return (
                <a key={item.type} href={href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                  {row}
                </a>
              );
            }

            return <div key={item.type}>{row}</div>;
          })}
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:mt-5">
          <PixelButton href={`mailto:${contact.items[0].value}`} variant="primary" className="w-full">
            发送邮件
          </PixelButton>
          <PixelButton variant="secondary" disabled className="w-full">
            简历稍后补充
          </PixelButton>
        </div>
      </PixelPanel>
    </main>
  );
}
