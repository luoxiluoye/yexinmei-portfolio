import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata = buildPageMetadata({
  title: "写作与观察",
  description: "罗叶馨梅的写作、摄影、内容观察与 AI 工作流记录。",
  path: "/journal",
});

export default function JournalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
