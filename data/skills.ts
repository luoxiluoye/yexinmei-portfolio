export const skills = {
  tools: [
    { name: "Photoshop", level: "熟练" },
    { name: "Premiere Pro", level: "熟练" },
    { name: "Excel", level: "工作使用" },
    { name: "AI 工具", level: "高频使用" },
    { name: "摄影 / 相机", level: "熟练" },
    { name: "基础数据分析", level: "工作使用" },
  ],
  core: [
    "内容策划",
    "新媒体运营",
    "社区运营",
    "用户洞察",
    "热点选题",
    "内容分发",
    "数据复盘",
  ],
  aiAssist: [
    "AI 辅助选题",
    "AI 信息整理",
    "AI 内容工作流",
    "AIGC 辅助创作",
  ],
  specialItems: [
    { name: "CAMERA", buff: "+20 视觉表达" },
    { name: "NOTEBOOK", buff: "+10 灵感捕捉" },
    { name: "AI ASSISTANT", buff: "+30 内容效率" },
    { name: "CAT COMPANION", buff: "+999 心情值" },
  ],
} as const;
