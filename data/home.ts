import { quests } from "@/data/quests";
import { skills } from "@/data/skills";

export const homeContent = {
  eyebrow: "HELLO! WELCOME TO MY WORLD!",
  titleZh: "罗叶馨梅",
  titleEn: "Yexinmei Luo",
  keywords: ["新媒体", "内容运营", "社区", "传播"],
  capabilities: ["AI 内容工作流", "AIGC", "数据分析", "用户洞察"],
  intro: "做内容、追热点、研究用户，也喜欢拍照片、写东西和折腾一些能让内容工作更顺手的小工具。",
  bubble: "探索 · 创作 · 连接\n持续升级中……",
  sign: "正在探索新的任务…",
  ctaPrimary: "查看项目",
  ctaSecondary: "关于我",
  stats: [
    { value: "20W+", label: "个人项目 GMV" },
    { value: "1000+", label: "海外社媒内容" },
    { value: "∞", label: "好奇心" },
  ],
  footerQuote: "Stay curious. Keep building.",
} as const;

export const homeStats = homeContent.stats;

const homeQuestSlugs = [
  "zhihu-auto-consumer-tech",
  "ccd-business",
  "inspiration-studio",
] as const;

export const homeQuests = homeQuestSlugs
  .map((slug) => quests.find((quest) => quest.slug === slug))
  .filter((quest): quest is NonNullable<typeof quest> => Boolean(quest));

export const skillGroups = [
  { title: "CONTENT", items: skills.core.slice(0, 4) },
  { title: "COMMUNITY", items: skills.core.slice(3, 7) },
  { title: "TOOLS", items: skills.tools.slice(0, 4).map((item) => item.name) },
];
