import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata = buildPageMetadata({"title": "工作与创作手记", "description": "罗叶馨梅关于内容、摄影与工作方法的观察与记录。", "path": "/journal"});

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
