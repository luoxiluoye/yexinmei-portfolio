import type { ReactNode } from "react";
import styles from "./resume.module.css";

// Original generated artwork, isolated into 24 equal 96px tiles.
// The single lossless WebP avoids a separate request for every small icon.
const tiles = {
  mail: 0, phone: 1, message: 2, pin: 3, calendar: 4, document: 5,
  briefcase: 6, graduation: 7, award: 8, camera: 9, pen: 10, book: 11,
  link: 12, copy: 13, check: 14, plus: 15, minus: 16, arrow: 17,
  sparkle: 18, leaf: 19, bookmark: 20, quote: 21, seal: 22, corner: 23,
  people: 12, folder: 6,
} as const;

export type UiIconName = keyof typeof tiles;

/** Decorative artwork accompanies live text and never replaces a control label. */
export function UiIcon({ name, className = "" }: { name: UiIconName; className?: string }) {
  const tile = tiles[name];
  return <span
    className={`${styles.uiIcon} ${className}`}
    data-ui-asset={name}
    aria-hidden="true"
    style={{ backgroundPosition: `${(tile % 6) * 20}% ${Math.floor(tile / 6) * 100 / 3}%` }}
  />;
}

export function IconBadge({ name, tone = "brick" }: { name: UiIconName; tone?: "brick" | "sage" | "bronze" }) {
  return <span className={styles.iconBadge} data-tone={tone} aria-hidden="true"><UiIcon name={name} /></span>;
}

export function SectionTitle({ id, number, children }: { id: string; number: string; children: ReactNode }) {
  return <div className={styles.headingGroup}>
    <span className={styles.sectionIndex} aria-hidden="true"><UiIcon name="bookmark" /><span className={styles.sectionNumeral}>{number}</span></span>
    <h2 id={id}>{children}</h2>
  </div>;
}
