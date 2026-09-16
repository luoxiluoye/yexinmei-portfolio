"use client";

import { useState } from "react";
import { Link } from "next-view-transitions";

import { contact } from "@/data/contact";
import { profile } from "@/data/profile";
import { PixelIcon } from "@/components/ui/pixel-icon";

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
    <main className="site-container pb-12 pt-6 lg:pb-16 lg:pt-10">
      <header className="border-b border-divider pb-8 lg:pb-10">
        <p className="font-pixel text-[11px] tracking-[0.08em] text-accent">07 / CONTACT</p>
        <div className="mt-3 grid gap-5 lg:grid-cols-[0.82fr_1.18fr] lg:items-end lg:gap-12">
          <div>
            <h1 className="text-[42px] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-[52px] lg:text-[64px]">
              {contact.heading}
            </h1>
            <p className="mt-3 font-pixel text-[10px] tracking-[0.08em] text-muted">MAILBOX OPEN · PLAYER ONLINE</p>
          </div>
          <p className="max-w-[700px] text-[15px] leading-7 text-muted lg:text-[16px] lg:leading-8">
            {contact.bubble} 求职沟通、项目合作和内容交流都欢迎直接联系。
          </p>
        </div>
      </header>

      <section className="grid gap-8 py-9 lg:grid-cols-[0.78fr_1.22fr] lg:items-stretch lg:gap-12 lg:py-14">
        <div className="flex flex-col justify-between gap-8">
          <div>
            <p className="font-pixel text-[9px] tracking-[0.08em] text-accent">OPEN CHANNEL</p>
            <h2 className="mt-3 max-w-[520px] text-[30px] font-semibold leading-tight tracking-[-0.03em] lg:text-[38px]">
              有合适的机会，直接把消息发给我。
            </h2>
            <p className="mt-5 max-w-[560px] text-[14px] leading-7 text-muted">
              我关注内容运营、产品运营、AI 产品运营和品牌传播，也愿意聊科技内容、社区、新品、摄影与个人项目。
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <a
              href={`mailto:${email}`}
              className="inline-flex min-h-12 items-center justify-between border-2 border-border bg-foreground px-4 font-pixel text-[10px] text-white transition-[transform,border-color,background-color] duration-200 hover:-translate-y-px hover:border-accent hover:bg-accent"
            >
              EMAIL ME <span aria-hidden="true">→</span>
            </a>
            <button
              type="button"
              onClick={copyWechat}
              className="inline-flex min-h-12 items-center justify-between border-2 border-border bg-paper px-4 font-pixel text-[10px] transition-[transform,border-color,color] duration-200 hover:-translate-y-px hover:border-accent hover:text-accent"
            >
              {copied ? "WECHAT COPIED ✓" : "COPY WECHAT"}
              <span aria-hidden="true">{copied ? "✓" : "→"}</span>
            </button>
            {profile.resumePath ? (
              <a
                href={profile.resumePath}
                className="inline-flex min-h-12 items-center justify-between border border-divider bg-soft px-4 font-pixel text-[9px] transition-colors hover:border-accent hover:text-accent sm:col-span-2"
              >
                DOWNLOAD RESUME <span aria-hidden="true">↓</span>
              </a>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-px border border-divider bg-divider text-[11px] sm:grid-cols-4">
            <ContactMeta label="BASE" value="成都" />
            <ContactMeta label="GRAD" value="2027" />
            <ContactMeta label="FOCUS" value="运营 / AI" />
            <ContactMeta label="STATUS" value="OPEN" accent />
          </div>
        </div>

        <div className="relative overflow-hidden border-2 border-border bg-[#1e201d] text-[#f7f2e7] shadow-[8px_8px_0_rgba(17,17,17,.08)]">
          <div className="flex min-h-11 items-center justify-between border-b border-white/10 px-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse bg-accent" />
              <span className="font-pixel text-[9px] tracking-[0.08em]">CONTACT TERMINAL</span>
            </div>
            <span className="font-pixel text-[8px] text-white/40">PLAYER ONLINE</span>
          </div>

          <div className="relative min-h-[430px] p-5 sm:p-7 lg:min-h-[500px] lg:p-9">
            <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:28px_28px]" />

            <div className="relative z-10 flex h-full min-h-[380px] flex-col">
              <div>
                <p className="font-pixel text-[9px] text-[#d96854]">MESSAGE CHANNELS</p>
                <h2 className="mt-4 font-pixel text-[18px] leading-8 sm:text-[22px]">HELLO, RECRUITER / COLLABORATOR.</h2>
              </div>

              <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
                <TerminalRow command="EMAIL" value={email} href={`mailto:${email}`} />
                <TerminalRow command="WECHAT" value={wechat} onClick={copyWechat} copied={copied} />
                <TerminalRow command="PHONE" value={phone} href={`tel:${phone}`} />
              </div>

              <div className="mt-auto flex items-end justify-between gap-5 pt-10">
                <div>
                  <p className="font-pixel text-[9px] text-white/40">CURRENT QUEST</p>
                  <p className="mt-2 max-w-[360px] text-[14px] leading-7 text-white/72">
                    寻找能继续把内容、产品、用户和 AI 连接起来的机会。
                  </p>
                  <Link
                    href="/quests"
                    className="mt-5 inline-flex items-center gap-3 border-b border-white/35 pb-1 font-pixel text-[9px] transition-colors hover:border-[#d96854] hover:text-[#d96854]"
                  >
                    VIEW PROJECTS →
                  </Link>
                </div>
                <PixelIcon assetId="cat.peek" decorative width={92} height={92} className="h-auto w-[72px] shrink-0 opacity-90 sm:w-[92px]" />
              </div>

              <p className="mt-6 font-pixel text-[9px] text-[#d96854]">
                READY TO TALK<span className="ml-1 inline-block animate-pulse">_</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 border-t border-divider py-8 lg:grid-cols-[1fr_auto] lg:items-center lg:py-10">
        <div>
          <p className="font-pixel text-[9px] tracking-[0.08em] text-accent">NEXT QUEST</p>
          <h2 className="mt-2 text-[25px] font-semibold tracking-[-0.025em]">好故事，也可以从一封邮件开始。</h2>
        </div>
        <Link href="/player" className="font-pixel text-[9px] text-muted transition-colors hover:text-accent">
          继续了解我 →
        </Link>
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
      <span className="min-w-0 break-all text-right text-[13px] text-white/78 sm:text-[14px]">
        {copied ? "COPIED! ✓" : value}
      </span>
    </>
  );

  if (href) {
    return (
      <a href={href} className="grid min-h-16 grid-cols-[90px_1fr] items-center gap-4 transition-colors hover:bg-white/5">
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="grid min-h-16 w-full grid-cols-[90px_1fr] items-center gap-4 text-left transition-colors hover:bg-white/5"
    >
      {content}
    </button>
  );
}
