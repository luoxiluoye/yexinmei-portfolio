import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata = buildPageMetadata({"title": "联系我", "description": "联系罗叶馨梅，了解实践经历、作品及宣传传播、党群和综合管理相关岗位意向。", "path": "/contact"});

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
