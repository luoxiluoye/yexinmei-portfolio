import { quests } from "@/data/quests";
import { skills } from "@/data/skills";

export const homeContent = {
  eyebrow: "HELLO! WELCOME TO MY WORLD!",
  titleZh: "罗叶馨梅",
  titleEn: "Yexinmei Luo",
  keywords: ["CONTENT", "AI PRODUCT", "TECH"],
  directionZh: "内容运营 × AI 产品 × 科技内容",
  intro: "电子科技大学新闻与传播硕士，现做知乎数码 / 新品运营。做内容、研究用户，也把一些突然冒出来的 AI 想法真的做成产品。",
  bubble: "主线任务：持续做点有意思的东西\n猫咪这里好像还藏了支线……",
  sign: "正在探索新的任务…",
  ctaPrimary: "查看项目",
  ctaSecondary: "关于我",
  stats: [
    { value: "0→1", label: "AI 产品 · 赤页" },
    { value: "20W+", label: "个人项目 GMV" },
    { value: "8000+", label: "海外账号涨粉" },
  ],
  footerQuote: "Stay curious. Keep building.",
} as const;

export const homeStats = homeContent.stats;

const homeQuestSlugs = [
  "zhihu-auto-consumer-tech",
  "ccd-business",
  "global-content",
] as const;

export const homeQuests = homeQuestSlugs
  .map((slug) => quests.find((quest) => quest.slug === slug))
  .filter((quest): quest is NonNullable<typeof quest> => Boolean(quest));

export const skillGroups = [
  { title: "CONTENT", items: ["内容策划", "社区运营", "新品运营", "用户洞察"] },
  { title: "AI / PRODUCT", items: [...skills.aiAssist.slice(0, 3), "互动叙事"] },
  { title: "TOOLS", items: skills.tools.slice(0, 4).map((item) => item.name) },
];
