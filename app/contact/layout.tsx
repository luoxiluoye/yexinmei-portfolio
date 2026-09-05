import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "联系我",
  description: "通过邮箱、电话或微信联系罗叶馨梅，交流内容、新媒体、社区与合作机会。",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
