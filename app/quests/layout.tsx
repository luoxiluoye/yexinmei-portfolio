import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata = buildPageMetadata({
  title: "项目经历与作品",
  description: "罗叶馨梅的项目与实践：内容运营、社区运营、新媒体、国际传播、科技内容、AI 工作流与个人项目。",
  path: "/quests",
});

export default function QuestsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
