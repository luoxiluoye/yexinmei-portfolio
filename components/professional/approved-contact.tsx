"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { contact } from "@/data/contact";
import styles from "./resume.module.css";

export function ApprovedContact() {
  const email = contact.items.find(item => item.type === "email")?.value ?? "";
  const phone = contact.items.find(item => item.type === "phone")?.value ?? "";
  const wechat = contact.items.find(item => item.type === "wechat")?.value ?? "";
  const [feedback, setFeedback] = useState("");
  const [copied, setCopied] = useState("");
  const mounted = useRef(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const attempt = useRef(0);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; attempt.current += 1; if (timer.current) clearTimeout(timer.current); };
  }, []);

  async function copy(value: string, label: string) {
    const current = ++attempt.current;
    if (timer.current) clearTimeout(timer.current);
    setCopied(""); setFeedback("");
    try {
      await navigator.clipboard.writeText(value);
      if (!mounted.current || attempt.current !== current) return;
      setCopied(label); setFeedback(`${label}已复制。`);
      timer.current = setTimeout(() => { if (mounted.current) setCopied(""); }, 2500);
    } catch {
      if (mounted.current && attempt.current === current) setFeedback(`暂时无法自动复制，请直接选中并复制${label}：${value}`);
    }
  }

  return (
    <main id="main-content" className={styles.page}>
      <header className={styles.contactOpening}>
        <img className={styles.contactArtwork} src="/assets/profile-20261020/editorial-light.webp" alt="" width={2172} height={724} />
        <div className={styles.contactOpeningCopy}>
          <p className={styles.eyebrow}>联系与交流</p>
          <h1 className={styles.title}>联系我</h1>
          <p className={styles.lead}>关于工作机会、经历与作品，<br />欢迎进一步交流。</p>
        </div>
      </header>

      <section className={styles.contactDetails} aria-label="联系方式">
        <div className={styles.contactPrimary}>
          <div>
            <h2 className={styles.sectionLabel}>电子邮箱</h2>
            <a href={`mailto:${email}`} className={styles.emailAddress}>{email}</a>
            <p className={styles.small}>可通过邮件联系并索取完整简历。</p>
          </div>
          <button type="button" className={styles.button} onClick={() => copy(email, "邮箱")} aria-label="复制邮箱">
            {copied === "邮箱" ? "已复制" : "复制邮箱"}<span aria-hidden="true">↗</span>
          </button>
        </div>
        <div className={styles.contactSecondary}>
          <div className={styles.contactRow}>
            <div><h2>微信</h2><p className={styles.contactValue}>{wechat}</p><p>添加时请注明姓名、单位及来意。</p></div>
            <button type="button" className={styles.copyButton} onClick={() => copy(wechat, "微信号")} aria-label="复制微信号">{copied === "微信号" ? "已复制" : "复制微信号"}</button>
          </div>
          <div className={styles.contactRow}>
            <div><h2>电话</h2><a href={`tel:${phone}`} className={styles.contactValue}>{phone}</a><p>也可以通过电话沟通。</p></div>
            <a className={styles.copyButton} href={`tel:${phone}`}>拨打电话 <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <p role="status" aria-live="polite" className={styles.copyFeedback}>{feedback}</p>
      </section>

      <div className={styles.footerPrompt}>
        <p>2027 届 · 新闻与传播硕士 · 意向城市：成都</p>
        <div className={styles.actions}><Link className={styles.link} href="/player">关于我 <span aria-hidden="true">→</span></Link><a className={styles.link} href="/portfolio">浏览作品集 <span aria-hidden="true">↗</span></a></div>
      </div>
    </main>
  );
}
