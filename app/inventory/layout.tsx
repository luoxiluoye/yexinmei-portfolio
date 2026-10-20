import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata = buildPageMetadata({"title": "专业能力与工具", "description": "罗叶馨梅在文字采编、影像制作、组织协调与资料整理方面的实践能力。", "path": "/inventory"});

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
