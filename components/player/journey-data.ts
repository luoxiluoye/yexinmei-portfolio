import type { AssetId } from "@/lib/assets";

export type Memory = {
  title: string;
  time: string;
  icon: AssetId;
  summary: string[];
  abilities: Array<{ title: string; detail: string; icon: AssetId }>;
  current?: boolean;
};

export const memories: Memory[] = [
  {
    title: "编导与影像",
    time: "本科阶段",
    icon: "player.journeyFilm",
    summary: [
      "从广播电视编导出发，开始系统接触影像、内容和叙事。",
      "在拍摄、剪辑和创作练习里，慢慢建立起对画面与表达的感知。",
    ],
    abilities: [
      { title: "影像表达", detail: "镜头语言与画面表达", icon: "player.journeyFilm" },
      { title: "叙事感知", detail: "故事结构与信息组织", icon: "player.memoryArchive" },
      { title: "内容基础", detail: "策划、制作与执行", icon: "items.notebook" },
    ],
  },
  {
    title: "传统媒体",
    time: "EARLY CAREER",
    icon: "player.journeyMedia",
    summary: [
      "进入媒体内容工作后，开始高频处理选题、信息和稿件。",
      "这段经历让我更在意事实、结构，也更习惯先把复杂的信息梳理清楚。",
    ],
    abilities: [
      { title: "选题判断", detail: "从信息中寻找值得讲的事", icon: "player.journeyMedia" },
      { title: "信息筛选", detail: "快速找到可信与关键内容", icon: "player.factNotes" },
      { title: "编辑表达", detail: "把信息组织成可读内容", icon: "items.notebook" },
    ],
  },
  {
    title: "国际传播",
    time: "2023 — 2024",
    icon: "player.journeyGlobal",
    summary: [
      "参与海外社媒内容运营，把内容放进不同平台和语境里重新理解。",
      "累计发布 1000+ 海外社媒内容，也第一次更明确地用数据观察传播结果。",
    ],
    abilities: [
      { title: "海外社媒", detail: "多平台内容运营", icon: "player.journeyGlobal" },
      { title: "跨文化传播", detail: "语境、受众与表达适配", icon: "player.journeyContent" },
      { title: "数据复盘", detail: "从传播结果反推内容", icon: "ui.star" },
    ],
  },
  {
    title: "新媒体运营",
    time: "2025 — 2026",
    icon: "player.journeyContent",
    summary: [
      "继续做内容、热点和账号，也开始接触更多行业与不同形态的内容项目。",
      "我越来越习惯把选题、生产、分发和复盘看成一条完整的内容链路。",
    ],
    abilities: [
      { title: "内容策划", detail: "选题与内容结构", icon: "player.journeyContent" },
      { title: "热点运营", detail: "快速判断与跟进节奏", icon: "ui.exclamation" },
      { title: "账号运营", detail: "持续生产与分发", icon: "items.laptop" },
    ],
  },
  {
    title: "社区与新品",
    time: "2026.06 — NOW",
    icon: "player.journeyCommunity",
    summary: [
      "在知乎负责汽车与消费电子领域的社区内容运营。",
      "工作覆盖问答、新品、热点、线上活动、用户与答主运营，以及数据分析和复盘。",
    ],
    abilities: [
      { title: "社区运营", detail: "供给、互动与活跃", icon: "player.journeyCommunity" },
      { title: "用户洞察", detail: "观察讨论与参与动机", icon: "player.inspectEye" },
      { title: "新品运营", detail: "新品议题与内容组织", icon: "items.laptop" },
    ],
  },
  {
    title: "个人项目",
    time: "SIDE QUESTS",
    icon: "player.journeySidequest",
    summary: [
      "工作之外，我也持续写科技内容、摄影、折腾相机和自己的小项目。",
      "从卖闲置 CCD 开始，慢慢做出了一个累计 GMV 20W+ 的小生意。",
    ],
    abilities: [
      { title: "独立运营", detail: "从想法到执行自己跑通", icon: "player.journeySidequest" },
      { title: "20W+ GMV", detail: "把兴趣做成真实交易", icon: "player.factCcd" },
      { title: "摄影创作", detail: "相机也是我的生产工具", icon: "player.factCameraKit" },
    ],
  },
  {
    title: "NOW",
    time: "2026 — ?",
    icon: "player.journeyNow",
    current: true,
    summary: [
      "正在继续探索内容、社区与新媒体之间更适合自己的位置。",
      "学习、实践、连接、创造，希望把喜欢的事情慢慢做成有意义的东西。",
    ],
    abilities: [
      { title: "持续学习", detail: "保持好奇，每天进步一点", icon: "items.notebook" },
      { title: "社区连接", detail: "倾听与分享，一起创造价值", icon: "ui.heart" },
      { title: "内容实践", detail: "从想法到落地，解决真实问题", icon: "items.sword" },
    ],
  },
];
