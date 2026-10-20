import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata = buildPageMetadata({"title": "实践经历", "description": "罗叶馨梅的实习、校园任职及项目实践：宣传采编、内容运营、党群工作与组织协调。", "path": "/quests"});

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
