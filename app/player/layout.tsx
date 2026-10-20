import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata = buildPageMetadata({"title": "关于我", "description": "罗叶馨梅的教育经历、专业能力与荣誉。电子科技大学新闻与传播硕士在读，2027 届毕业生。", "path": "/player"});

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
