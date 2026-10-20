"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { contact } from "@/data/contact";
import { IconBadge, UiIcon } from "./editorial-ui";
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
    <main id="main-content" className={`${styles.page} ${styles.contactPage}`}>
      <header className={`${styles.pageHeader} ${styles.contactHeader}`}>
        <div>
          <p className={styles.eyebrow}><UiIcon name="mail" /> 联系与交流</p>
          <h1 className={styles.title}>联系我</h1>
          <p className={styles.lead}>关于工作机会、经历与作品，欢迎进一步交流。</p>
        </div>
        <img className={styles.contactVignette} src="/assets/profile-20261020/editorial-light.webp" alt="" width={2172} height={724} />
      </header>

      <div className={styles.contactLayout}>
        <aside className={styles.contactAside} aria-label="个人信息与交流方向">
          <span className={styles.contactBadge}><UiIcon name="graduation" /> 2027 届毕业生</span>
          <h2>罗叶馨梅</h2>
          <p>电子科技大学<br />新闻与传播硕士在读</p>
          <p className={styles.locationLine}><UiIcon name="pin" /> 意向城市：成都</p>
          <div className={styles.contactDirections}>
            <p>关注方向</p>
            <div className={styles.toolTags}><span className={styles.toolTag}>宣传传播</span><span className={styles.toolTag}>党群工作</span><span className={styles.toolTag}>综合管理</span></div>
          </div>
          <Link className={styles.link} href="/player">了解我的经历 <span aria-hidden="true">→</span></Link>
        </aside>

        <section className={styles.contactDetails} aria-label="联系方式">
          <div className={styles.contactList}>
            <div className={styles.contactItem}>
              <IconBadge name="mail" />
              <div className={styles.contactItemCopy}>
                <h2>电子邮箱</h2>
                <a href={`mailto:${email}`} className={styles.contactAddress}>{email}</a>
                <p>可通过邮件联系并索取完整简历。</p>
              </div>
              <button type="button" className={styles.copyButton} data-copied={copied === "邮箱"} onClick={() => copy(email, "邮箱")} aria-label="复制邮箱">
                <UiIcon name={copied === "邮箱" ? "check" : "copy"} />{copied === "邮箱" ? "已复制" : "复制邮箱"}
              </button>
            </div>
            <div className={styles.contactItem}>
              <IconBadge name="message" tone="sage" />
              <div className={styles.contactItemCopy}><h2>微信</h2><p className={styles.contactAddress}>{wechat}</p><p>添加时请注明姓名、单位及来意。</p></div>
              <button type="button" className={styles.copyButton} data-copied={copied === "微信号"} onClick={() => copy(wechat, "微信号")} aria-label="复制微信号">
                <UiIcon name={copied === "微信号" ? "check" : "copy"} />{copied === "微信号" ? "已复制" : "复制微信号"}
              </button>
            </div>
            <div className={styles.contactItem}>
              <IconBadge name="phone" tone="bronze" />
              <div className={styles.contactItemCopy}><h2>电话</h2><a href={`tel:${phone}`} className={styles.contactAddress}>{phone}</a><p>也可以通过电话沟通。</p></div>
              <a className={styles.copyButton} href={`tel:${phone}`}><UiIcon name="phone" /> 拨打电话</a>
            </div>
          </div>
          <div className={styles.contactFootnote}>
            <p><span aria-hidden="true">🌿</span> 感谢您的关注，期待与您交流。</p>
            <a className={styles.link} href="/portfolio">浏览作品集 <span aria-hidden="true">↗</span></a>
          </div>
          <p role="status" aria-live="polite" className={styles.copyFeedback}>{feedback}</p>
        </section>
      </div>
    </main>
  );
}
