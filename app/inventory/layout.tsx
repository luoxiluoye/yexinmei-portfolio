import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata = buildPageMetadata({
  title: "技能与工具",
  description: "罗叶馨梅的内容运营、新媒体、社区运营、摄影、数据分析与 AI 辅助工作流能力。",
  path: "/inventory",
});

export default function InventoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
