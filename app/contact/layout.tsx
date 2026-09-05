import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata = buildPageMetadata({
  title: "联系我",
  description: "通过邮箱、电话或微信联系罗叶馨梅，交流内容、新媒体、社区与合作机会。",
  path: "/contact",
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
