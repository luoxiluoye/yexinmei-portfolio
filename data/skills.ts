export const skills = {
  abilities: [
    {
      key: "CONTENT",
      title: "内容判断与表达",
      subtitle: "选题 · 结构 · 平台表达",
      description: "判断什么值得做，再把复杂信息整理成适合平台阅读和传播的内容。",
      items: [
        { name: "选题与热点判断", note: "从时效、信息量和用户关联里判断优先级" },
        { name: "内容结构与表达", note: "把资料整理成清楚、可读、有重点的内容" },
        { name: "新品与科技内容", note: "围绕消费电子、新品和科技议题组织讨论" },
      ],
      projects: [
        { title: "知乎数码 / 新品运营", href: "/quests/zhihu-auto-consumer-tech" },
        { title: "科技有后话", href: "/quests/tech-you-houhua" },
        { title: "国际传播 / 海外社媒", href: "/quests/global-content" },
      ],
    },
    {
      key: "COMMUNITY",
      title: "社区与用户运营",
      subtitle: "用户 · 讨论 · 数据",
      description: "从用户反馈和社区讨论里发现需求，再用运营动作和数据复盘持续调整。",
      items: [
        { name: "问题设计与讨论组织", note: "把大议题拆成用户愿意回答和讨论的问题" },
        { name: "用户洞察", note: "从咨询、反馈和行为里提取真实需求" },
        { name: "数据复盘与分发", note: "结合表现数据调整内容、节奏和后续动作" },
      ],
      projects: [
        { title: "知乎数码 / 新品运营", href: "/quests/zhihu-auto-consumer-tech" },
        { title: "CCD 20W+ GMV", href: "/quests/ccd-business" },
        { title: "国际传播 / 海外社媒", href: "/quests/global-content" },
      ],
    },
    {
      key: "AI_PRODUCT",
      title: "AI 与产品实践",
      subtitle: "Workflow · 交互 · 实现",
      description: "用 AI 处理信息和构建工作流，也把内容理解延伸到真正可以使用的交互产品。",
      items: [
        { name: "AI Workflow", note: "把资料整理、内容辅助和重复流程接进实际工作" },
        { name: "互动叙事与交互设计", note: "把故事结构重构成玩家选择、分支与结局" },
        { name: "产品原型与前端实现", note: "从概念、体验到可在线使用的产品版本" },
      ],
      projects: [
        { title: "赤页 RED LEAF", href: "/quests/red-leaf" },
        { title: "灵感编辑室", href: "/quests/inspiration-studio" },
      ],
    },
    {
      key: "VISUAL",
      title: "视觉内容制作",
      subtitle: "摄影 · 视频 · 设计",
      description: "用照片、视频和视觉包装完成内容表达，并把画面判断带回运营和项目展示。",
      items: [
        { name: "摄影", note: "人物、活动与日常影像记录" },
        { name: "视频剪辑", note: "完成素材筛选、节奏、字幕与成片" },
        { name: "视觉设计", note: "完成封面、基础图形和内容视觉包装" },
      ],
      projects: [
        { title: "摄影 / 视觉内容", href: "/quests/visual-storytelling" },
        { title: "CCD 20W+ GMV", href: "/quests/ccd-business" },
      ],
    },
  ],
  tools: [
    { name: "Photoshop", level: "熟练" },
    { name: "Premiere Pro", level: "熟练" },
    { name: "After Effects", level: "基础动效 / 包装" },
    { name: "Excel", level: "工作使用" },
    { name: "ChatGPT / Claude", level: "高频使用" },
    { name: "剪映 / Coze", level: "工作使用" },
  ],
  core: [
    "选题判断",
    "内容结构",
    "社区运营",
    "用户洞察",
    "新品运营",
    "数据复盘",
    "内容分发",
  ],
  aiAssist: [
    "AI 信息整理",
    "AI Workflow",
    "AIGC 内容辅助",
    "互动产品实践",
  ],
  specialItems: [
    { name: "CAMERA", buff: "+20 视觉表达" },
    { name: "NOTEBOOK", buff: "+10 灵感捕捉" },
    { name: "AI ASSISTANT", buff: "+30 内容效率" },
    { name: "CAT COMPANION", buff: "+999 心情值" },
  ],
} as const;
