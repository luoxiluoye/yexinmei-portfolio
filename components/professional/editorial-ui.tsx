import type { ReactNode } from "react";
import styles from "./resume.module.css";

const iconPaths = {
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
  message: <><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 10 10 0 0 1-4.2-.9L3 21l1.9-5.3a10 10 0 0 1-.9-4.2A8.5 8.5 0 0 1 12.5 3 8.5 8.5 0 0 1 21 11.5Z" /><path d="M8 11h.01M12 11h.01M16 11h.01" strokeWidth="2.5" /></>,
  phone: <path d="m7.5 3 3 5-2.3 2.2a15 15 0 0 0 5.6 5.6l2.2-2.3 5 3c-.4 3-2 4.7-4.5 4.2C9.4 19.3 4.7 14.6 3.3 7.5 2.8 5 4.5 3.4 7.5 3Z" />,
  copy: <><rect x="8" y="8" width="12" height="13" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  pin: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
  graduation: <><path d="m2 9 10-5 10 5-10 5L2 9ZM6 11v6c4 3 8 3 12 0v-6M22 9v7" /></>,
  pen: <><path d="m14 5 5 5M4 20l4.5-1 12-12a2.1 2.1 0 0 0-4-4l-12 12L4 20ZM3 22h18" /></>,
  camera: <><path d="m8 5 1.5-2h5L16 5h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4Z" /><circle cx="12" cy="13" r="4" /><path d="M18 9h.01" strokeWidth="2.5" /></>,
  people: <><circle cx="9" cy="8" r="3" /><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6M17 15a5 5 0 0 1 4 5v1" /></>,
  briefcase: <><rect x="3" y="7" width="18" height="14" rx="2" /><path d="M8 7V4h8v3M3 12c5 3 13 3 18 0M12 12v4" /></>,
  book: <><path d="M12 5v16M3 3c3-1 6 0 9 2 3-2 6-3 9-2v16c-3-1-6 0-9 2-3-2-6-3-9-2V3Z" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18M8 15h2M14 15h2M8 18h2" /></>,
  award: <><circle cx="12" cy="8" r="5" /><path d="m8 12-2 9 6-3 6 3-2-9" /></>,
  sparkle: <><path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3ZM20 2v4M18 4h4" /></>,
  folder: <path d="M3 20V5a2 2 0 0 1 2-2h5l3 4h6a2 2 0 0 1 2 2v11H3Z" />,
} satisfies Record<string, ReactNode>;

export type UiIconName = keyof typeof iconPaths;

/** Decorative icons always accompany visible text; no extra tab stops or names. */
export function UiIcon({ name, className = "" }: { name: UiIconName; className?: string }) {
  return <svg className={`${styles.uiIcon} ${className}`} viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{iconPaths[name]}</svg>;
}

export function IconBadge({ name, tone = "brick" }: { name: UiIconName; tone?: "brick" | "sage" | "bronze" }) {
  return <span className={styles.iconBadge} data-tone={tone} aria-hidden="true"><UiIcon name={name} /></span>;
}

export function SectionTitle({ id, number, children }: { id: string; number: string; children: ReactNode }) {
  return <div className={styles.headingGroup}><span className={styles.sectionIndex} aria-hidden="true">{number}</span><h2 id={id}>{children}</h2></div>;
}
