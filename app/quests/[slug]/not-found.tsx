import Link from "next/link";
import styles from "@/components/professional/resume.module.css";

export default function NotFound() {
  return <main id="main-content" className={styles.page}>
    <header className={styles.pageHeader}>
      <p className={styles.eyebrow}>实践经历</p>
      <h1 className={styles.title}>暂未找到这段经历</h1>
      <p className={styles.lead}>可以返回经历页面，查看实习、校园任职和项目记录。</p>
    </header>
    <div className={styles.footerPrompt}><Link className={styles.button} href="/quests">返回实践经历 →</Link></div>
  </main>;
}
