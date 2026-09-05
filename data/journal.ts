export const journalCategories = ["WRITING", "PHOTOS", "NOTES", "EXPERIMENTS"] as const;

export const journalSeed = [
  {
    category: "WRITING",
    title: "科技有后话",
    summary: "科技新闻背后的公司选择、产业变化与职业影响。",
    status: "ACTIVE",
    href: "/quests/tech-you-houhua",
  },
  {
    category: "NOTES",
    title: "内容运营笔记",
    summary: "记录新品、社区、选题、用户与内容分发中的具体观察。",
    status: "PLANNED",
    href: null,
  },
  {
    category: "EXPERIMENTS",
    title: "AI Workflow",
    summary: "记录我如何把 AI 放进真实内容工作流，以及哪些方法真的有用。",
    status: "PLANNED",
    href: null,
  },
  {
    category: "PHOTOS",
    title: "Photo Notes",
    summary: "摄影、生活碎片和一些值得被留下来的画面。",
    status: "ONGOING",
    href: "/quests/visual-storytelling",
  },
] as const;
