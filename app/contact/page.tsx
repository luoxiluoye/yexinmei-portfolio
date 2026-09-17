"use client";

import { useState } from "react";
import { Link } from "next-view-transitions";

import { contact } from "@/data/contact";
import { profile } from "@/data/profile";
import { PixelIcon } from "@/components/ui/pixel-icon";
import { PixelPanel } from "@/components/ui/pixel-panel";

export default function ContactPage() {
  const [copied, setCopied] = useState(false);
  const email = contact.items.find((item) => item.type === "email")?.value ?? "";
  const phone = contact.items.find((item) => item.type === "phone")?.value ?? "";
  const wechat = contact.items.find((item) => item.type === "wechat")?.value ?? "";

  async function copyWechat() {
    if (!navigator.clipboard) {
      throw new Error("Clipboard API unavailable");
    }

    await navigator.clipboard.writeText(wechat);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <main className="site-container pb-12 pt-5 lg:pb-14 lg:pt-8">
      <header className="mb-5 flex flex-col justify-between gap-4 border-b-2 border-border pb-5 lg:flex-row lg:items-end">
        <div>
          <p className="font-pixel text-[10px] text-accent">07 / CONTACT</p>
          <h1 className="mt-2 font-pixel-zh text-[38px] leading-none lg:text-[48px]">联系我</h1>
          <p className="mt-3 max-w-2xl text-[13px] leading-6 text-muted">
            求职沟通、项目合作和内容交流都可以直接发消息。联系方式只保留在下面这个终端里。
          </p>
        </div>
        <div className="flex items-center gap-3 border border-divider bg-soft px-3 py-2">
          <PixelIcon assetId="items.mail" decorative width={30} height={30} />
          <div>
            <span className="block font-pixel text-[12px] text-accent">CHANNEL OPEN</span>
            <span className="text-[10px] text-muted">PLAYER ONLINE</span>
          </div>
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-[0.72fr_1.28fr] lg:items-stretch lg:gap-5">
        <PixelPanel eyebrow="PLAYER STATUS" title="CURRENT QUEST" accent className="h-full">
          <h2 className="text-[22px] font-semibold leading-8 tracking-[-0.02em]">
            寻找能继续做内容、产品和 AI 实践的机会。
          </h2>
          <p className="mt-3 text-[13px] leading-6 text-muted">
            方向以内容运营、产品运营、AI 产品运营和品牌传播为主，成都优先，也关注其他合适机会。
          </p>

          <div className="mt-5 grid grid-cols-2 gap-px border border-divider bg-divider">
            <ContactMeta label="BASE" value="成都" />
            <ContactMeta label="GRAD" value="2027" />
            <ContactMeta label="FOCUS" value="运营 / AI" />
            <ContactMeta label="STATUS" value="OPEN" accent />
          </div>

          <div className="mt-5 grid gap-2">
            <Link href="/quests" className="flex min-h-10 items-center justify-between border border-divider bg-soft px-3 font-pixel text-[9px] transition-[transform,border-color,color] hover:-translate-y-px hover:border-accent hover:text-accent">
              VIEW QUESTS <span>→</span>
            </Link>
            <Link href="/player" className="flex min-h-10 items-center justify-between border border-divider bg-paper px-3 font-pixel text-[9px] transition-[transform,border-color,color] hover:-translate-y-px hover:border-accent hover:text-accent">
              PLAYER FILE <span>→</span>
            </Link>
          </div>
        </PixelPanel>

        <section className="overflow-hidden border-2 border-border bg-[#1e201d] text-[#f7f2e7] shadow-[6px_6px_0_rgba(17,17,17,.08)]" aria-labelledby="contact-terminal-title">
          <div className="flex min-h-11 items-center justify-between border-b border-white/10 px-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse bg-accent" />
              <span className="font-pixel text-[9px] tracking-[0.08em]">CONTACT TERMINAL</span>
            </div>
            <span className="font-pixel text-[8px] text-white/40">READY</span>
          </div>

          <div className="relative p-5 sm:p-7 lg:p-8">
            <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:28px_28px]" />
            <div className="relative z-10">
              <p className="font-pixel text-[9px] text-[#d96854]">MESSAGE CHANNELS</p>
              <h2 id="contact-terminal-title" className="mt-3 font-pixel text-[17px] leading-7 sm:text-[20px]">CHOOSE ONE CHANNEL.</h2>

              <div className="mt-6 divide-y divide-white/10 border-y border-white/10">
                <TerminalRow command="EMAIL" value={email} href={`mailto:${email}`} />
                <TerminalRow command="WECHAT" value={wechat} onClick={copyWechat} copied={copied} />
                <TerminalRow command="PHONE" value={phone} href={`tel:${phone}`} />
                {profile.resumePath ? <TerminalRow command="RESUME" value="DOWNLOAD PDF" href={profile.resumePath} /> : null}
              </div>

              <div className="mt-7 flex items-end justify-between gap-5">
                <div>
                  <p className="font-pixel text-[9px] text-white/40">SYSTEM NOTE</p>
                  <p className="mt-2 max-w-[430px] text-[12px] leading-6 text-white/68">
                    邮件可以直接发送；微信点击后会复制微信号；电话可直接拨打。
                  </p>
                </div>
                <PixelIcon assetId="cat.peek" decorative width={84} height={84} className="h-auto w-[68px] shrink-0 opacity-90 sm:w-[84px]" />
              </div>

              <p className="mt-6 font-pixel text-[9px] text-[#d96854]">
                READY TO TALK<span className="ml-1 inline-block animate-pulse">_</span>
              </p>
            </div>
          </div>
        </section>
      </section>

      {copied ? (
        <div className="fixed bottom-[calc(var(--rpg-bottom-tab-height)+16px)] left-1/2 z-[70] -translate-x-1/2 border-2 border-border bg-foreground px-4 py-2 font-pixel text-[10px] text-white lg:bottom-6">
          WECHAT COPIED · 微信号已复制
        </div>
      ) : null}
    </main>
  );
}

function ContactMeta({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-background px-3 py-3">
      <p className="font-pixel text-[8px] text-muted">{label}</p>
      <p className={accent ? "mt-1 font-pixel text-[10px] text-accent" : "mt-1 font-pixel text-[10px]"}>{value}</p>
    </div>
  );
}

function TerminalRow({
  command,
  value,
  href,
  onClick,
  copied = false,
}: {
  command: string;
  value: string;
  href?: string;
  onClick?: () => void;
  copied?: boolean;
}) {
  const content = (
    <>
      <span className="font-pixel text-[9px] text-[#d96854]">&gt; {command}</span>
      <span className="min-w-0 break-all text-right text-[12px] text-white/78 sm:text-[13px]">
        {copied ? "COPIED! ✓" : value}
      </span>
    </>
  );

  if (href) {
    return (
      <a href={href} className="grid min-h-14 grid-cols-[86px_1fr] items-center gap-4 px-1 transition-colors hover:bg-white/5">
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className="grid min-h-14 w-full grid-cols-[86px_1fr] items-center gap-4 px-1 text-left transition-colors hover:bg-white/5">
      {content}
    </button>
  );
}
