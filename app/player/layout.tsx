import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata = buildPageMetadata({
  title: "关于我",
  description: "罗叶馨梅的个人经历、成长路径与内容运营方向。",
  path: "/player",
});

export default function PlayerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
