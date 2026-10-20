export type ResumeLink = {
  label: string;
  href: string;
};

export type ExperienceEntry = {
  organization: string;
  role: string;
  period?: string;
  summary: string;
  work: string[];
  practiceSlug?: string;
};

export type PracticeRecord = {
  slug: string;
  title: string;
  category: string;
  organization: string;
  role: string;
  period?: string;
  summary: string;
  responsibilities: string[];
  process: Array<{ title: string; description: string }>;
  outputs: string[];
  links: ResumeLink[];
};

export const education = [
  {
    school: "电子科技大学",
    degree: "新闻与传播 · 硕士研究生",
    period: "2024.09 — 2027.06（预计）",
    note: "推免入学；关注新闻写作、新媒体传播与传播研究。",
  },
  {
    school: "成都理工大学",
    degree: "广播电视编导 · 本科",
    period: "2020.09 — 2024.06",
    note: "学习视听表达与内容制作，完成纪录片《周家刀》等创作实践。",
  },
] as const;

export const honors = [
  { title: "校级优秀研究生干部", organization: "电子科技大学" },
  { title: "2025—2026 学年学业三等奖学金", organization: "电子科技大学" },
  { title: "四川省 2024 届优秀大学毕业生", organization: "本科阶段" },
  { title: "校级一等奖学金", organization: "成都理工大学" },
] as const;

export const internships: ExperienceEntry[] = [
  {
    organization: "知乎",
    role: "社区内容运营实习生",
    period: "2026.06 — 至今",
    summary: "围绕汽车、数码、消费电子与家电新品，参与选题策划、内容组织及活动运营。",
    work: [
      "跟进新品与热点，核对信息、梳理用户关注点，完成问题和活动文案。",
      "联系并邀请创作者参与，跟进内容供给、专题页及站内分发。",
      "记录内容表现和用户反馈，整理周报与项目复盘。",
    ],
    practiceSlug: "zhihu-auto-consumer-tech",
  },
  {
    organization: "蔚来",
    role: "新媒体运营实习生",
    period: "2025.12 — 2026.04",
    summary: "参与品牌新媒体内容及达人合作，跟进需求沟通、脚本与内容制作。",
    work: [
      "围绕传播需求整理内容要点，与达人及相关人员沟通脚本和素材要求。",
      "跟进拍摄、内容制作与发布安排，协调过程中的修改意见。",
      "回收合作素材与发布信息，整理传播台账，为后续复盘提供依据。",
    ],
    practiceSlug: "brand-communication",
  },
  {
    organization: "美团",
    role: "招聘运营实习生",
    summary: "参与招聘寻访、候选人沟通及流程跟进，积累信息整理与沟通协调经验。",
    work: [
      "根据岗位需求开展候选人寻访，整理并维护人才信息。",
      "联系候选人，跟进沟通进度和面试安排。",
      "记录招聘过程与结果，及时同步信息，支持团队日常招聘工作。",
    ],
  },
  {
    organization: "东原地产",
    role: "市场运营实习生",
    period: "2022.08 — 2022.10",
    summary: "参与原空间项目的内容运营和市场宣传，接触线下场景与线上内容的配合。",
    work: [
      "参与项目宣传内容整理与制作，配合日常内容运营。",
      "协助市场活动执行与素材整理，跟进相关沟通事项。",
    ],
  },
];

export const otherInternships = [
  { organization: "每日经济新闻", role: "编辑实习", description: "参与选题资料整理、稿件编辑与内容制作。" },
  { organization: "明基", role: "公关实习", description: "参与品牌传播工作，接触媒体沟通与宣传资料整理。" },
] as const;

export const campusExperience: ExperienceEntry[] = [
  {
    organization: "网络文化工作室",
    role: "负责人",
    period: "硕士阶段",
    summary: "统筹 15 人团队，参与校园宣传内容的选题、分工与制作。",
    work: ["跟进选题和稿件进度，协调文字、摄影及视觉内容的配合。"],
    practiceSlug: "campus-publicity",
  },
  {
    organization: "电子科技大学党委统战部",
    role: "公众号及网站内容工作",
    period: "硕士阶段",
    summary: "参与公众号与对应网站的内容编辑、图文制作及日常更新。",
    work: ["根据发布需求整理文字和图片，配合内容修改与发布。"],
    practiceSlug: "campus-publicity",
  },
  {
    organization: "研究生党小组 / 本科学院党建工作",
    role: "研一党小组组长；本科阶段参与学院党建工作",
    summary: "参与学习活动组织、人员沟通及宣传材料整理。",
    work: ["结合党史故事等活动，积累组织协调与文字工作经验。"],
    practiceSlug: "party-publicity",
  },
  {
    organization: "研究生会学术部 / 导师项目",
    role: "学术部副部长；项目参与人员",
    period: "硕士阶段",
    summary: "参与学术活动、研讨会及相关项目的策划、对接和执行。",
    work: ["从前期准备、人员沟通到现场执行和后期资料整理，持续跟进具体工作。"],
    practiceSlug: "conference-coordination",
  },
];

export const capabilities = [
  {
    title: "文字与编辑",
    description: "选题资料整理、新闻与活动稿件、公众号图文、项目材料。",
    evidence: "媒体编辑、校园宣传及知乎内容运营实践。",
  },
  {
    title: "沟通与执行",
    description: "需求确认、人员对接、活动准备、进度跟进与资料归档。",
    evidence: "学术活动、导师项目、达人合作与招聘运营实践。",
  },
  {
    title: "影像与视觉",
    description: "摄影摄像、视频剪辑、海报制作与图文排版。",
    evidence: "使用 Photoshop、Premiere、After Effects 与剪映完成内容制作。",
  },
  {
    title: "数据与工具",
    description: "用 Excel 整理记录与台账，用 AI 工具辅助资料整理和创意制作。",
    evidence: "结合实际任务学习 Python、SQL 与自动化工具。",
  },
] as const;

export const records: PracticeRecord[] = [
  {
    slug: "campus-publicity",
    title: "校园宣传与内容组织",
    category: "校园实践",
    organization: "网络文化工作室 / 电子科技大学党委统战部",
    role: "工作室负责人；公众号与网站内容工作",
    period: "硕士阶段",
    summary: "在校园宣传工作中，参与选题、稿件编辑、图文制作与内容更新，同时统筹工作室团队的分工与进度。",
    responsibilities: [
      "统筹 15 人工作室团队，沟通选题与分工，跟进内容制作进度。",
      "参与党委统战部公众号及网站内容工作，整理稿件与图片，配合修改和发布。",
      "根据活动和日常宣传需求，协调文字、摄影与视觉素材。",
    ],
    process: [
      { title: "明确内容", description: "了解活动或发布需求，整理背景资料，确认需要呈现的信息。" },
      { title: "协同制作", description: "安排内容分工，跟进文字和图片，按反馈完成修改。" },
      { title: "发布整理", description: "配合公众号及网站更新，保存稿件与素材供后续工作使用。" },
    ],
    outputs: ["校园图文、公众号内容与网站稿件。", "工作室选题、人员分工与制作进度记录。"],
    links: [{ label: "查看文字作品", href: "/portfolio#writing" }],
  },
  {
    slug: "party-publicity",
    title: "党建宣传与学习活动",
    category: "校园实践",
    organization: "研究生党小组 / 本科学院党建工作",
    role: "研一党小组组长；本科阶段参与学院党建工作",
    summary: "结合党小组工作和本科阶段的学院党建经历，参与学习活动、人员沟通与宣传材料整理。",
    responsibilities: [
      "担任研一党小组组长，参与党小组学习活动的安排与沟通。",
      "在本科阶段参与学院党建工作，配合活动组织与内容整理。",
      "参与党史故事等相关项目，结合文字与影像基础开展宣传实践。",
    ],
    process: [
      { title: "活动准备", description: "围绕学习或活动主题整理资料，沟通安排与参与事项。" },
      { title: "组织配合", description: "跟进人员沟通和具体分工，配合活动实施。" },
      { title: "材料整理", description: "整理相关文字与影像材料，配合后续总结和宣传。" },
    ],
    outputs: ["学习与宣传活动的组织参与经验。", "与活动配套的文字及影像材料整理。"],
    links: [{ label: "浏览个人作品集", href: "/portfolio" }],
  },
  {
    slug: "conference-coordination",
    title: "学术活动与项目协调",
    category: "校园实践",
    organization: "研究生会学术部 / 导师项目",
    role: "学术部副部长；项目参与人员",
    period: "硕士阶段",
    summary: "参与研讨会、电影节相关会务及导师项目，从前期策划、内外部人员对接到现场执行和后期资料整理，跟进具体工作。",
    responsibilities: [
      "参与前期策划和活动准备，整理任务、资料与人员沟通事项。",
      "对接校内外相关人员，跟进活动安排和实施过程中的具体需求。",
      "配合现场执行及新闻稿、项目材料整理，参与后续总结工作。",
    ],
    process: [
      { title: "前期筹备", description: "了解项目要求，梳理活动流程、需要对接的人员和待完成事项。" },
      { title: "沟通执行", description: "持续跟进相关人员反馈，配合现场安排，并及时同步变化。" },
      { title: "后续整理", description: "汇总活动素材与工作记录，参与通稿、总结及项目材料整理。" },
    ],
    outputs: ["研讨会与电影节相关会务的参与经验。", "活动通稿、工作记录与导师项目相关材料。"],
    links: [{ label: "查看相关文字作品", href: "/portfolio#writing" }],
  },
  {
    slug: "news-writing",
    title: "新闻写作与资料编辑",
    category: "内容实践",
    organization: "媒体实习 / 校园宣传 / 个人创作",
    role: "稿件编辑与内容制作",
    summary: "结合新闻与传播学习及媒体编辑实践，完成资料搜集、信息核对、稿件整理和图文表达。",
    responsibilities: [
      "根据选题查找背景资料，核对时间、人物及重要事实。",
      "梳理稿件结构与重点信息，按发布需求进行编辑和修改。",
      "结合采访、影像和文字材料，参与新闻、校园图文及纪录片内容制作。",
    ],
    process: [
      { title: "查找来源", description: "从原始资料和相关报道入手，记录出处与需要进一步核对的信息。" },
      { title: "组织表达", description: "明确稿件要回答的问题，安排事实、背景与细节。" },
      { title: "编辑检查", description: "检查文字、名称和信息一致性，按反馈完善稿件与配图。" },
    ],
    outputs: ["媒体编辑与校园图文实践。", "纪录片《周家刀》及相关采访、文字作品。"],
    links: [
      { label: "浏览文字作品", href: "/portfolio#writing" },
      { label: "阅读《周家刀》相关图文", href: "https://mp.weixin.qq.com/s/kVI3RlZmvkxI9FCXlhtOtw" },
    ],
  },
  {
    slug: "zhihu-auto-consumer-tech",
    title: "知乎社区内容运营",
    category: "实习实践",
    organization: "知乎",
    role: "社区内容运营实习生",
    period: "2026.06 — 至今",
    summary: "围绕汽车、数码、消费电子及家电新品，参与问题策划、创作者沟通、专题与活动内容组织，并持续整理内容表现。",
    responsibilities: [
      "跟进新品与热点信息，把用户关注点整理成适合讨论的问题。",
      "联系和邀请创作者，跟进优质内容供给、专题页及站内分发。",
      "参与活动文案和执行，记录内容表现、用户反馈与复盘结论。",
    ],
    process: [
      { title: "选题准备", description: "核对新品及热点信息，查看已有讨论，整理值得补充的问题角度。" },
      { title: "内容组织", description: "邀请相关创作者，跟进回答与活动内容，配合专题和分发安排。" },
      { title: "跟进复盘", description: "观察讨论和内容反馈，把有效做法与待改进事项整理到周报。" },
    ],
    outputs: ["汽车与消费电子新品问题、专题及活动文案。", "参与“爸妈的电子技能课后班”等活动的内容策划与运营。"],
    links: [{ label: "查看内容与视觉作品", href: "/portfolio" }],
  },
  {
    slug: "brand-communication",
    title: "品牌新媒体与达人合作",
    category: "实习实践",
    organization: "蔚来",
    role: "新媒体运营实习生",
    period: "2025.12 — 2026.04",
    summary: "围绕品牌传播需求，参与达人沟通、脚本与内容制作，跟进发布和素材回收。",
    responsibilities: [
      "整理内容需求和传播要点，与达人及相关人员沟通脚本与素材要求。",
      "跟进制作过程中的反馈和修改，配合拍摄及发布安排。",
      "回收成品素材与发布信息，整理传播台账和复盘资料。",
    ],
    process: [
      { title: "需求沟通", description: "明确内容主题、所需素材与交付安排，整理需要确认的问题。" },
      { title: "制作跟进", description: "沟通脚本和内容细节，收集反馈并跟进修改进度。" },
      { title: "素材回收", description: "整理发布信息、合作素材与相关记录，方便后续查询和复盘。" },
    ],
    outputs: ["达人合作相关脚本、内容及沟通记录。", "品牌传播素材与发布台账。"],
    links: [{ label: "浏览个人作品集", href: "/portfolio" }],
  },
  {
    slug: "visual-storytelling",
    title: "摄影、视频与视觉制作",
    category: "创作实践",
    organization: "毕业创作 / 活动拍摄 / 个人创作",
    role: "摄影摄像与内容制作",
    summary: "从广播电视编导学习出发，持续进行纪录片、人物、舞台及活动影像创作，将拍摄和后期能力用于具体内容项目。",
    responsibilities: [
      "围绕人物与场景整理拍摄思路，提前了解活动安排和重要节点。",
      "完成现场影像记录，兼顾人物、环境和后续传播所需画面。",
      "参与图片处理、视频剪辑及视觉制作，按使用场景整理成品。",
    ],
    process: [
      { title: "拍摄准备", description: "了解主题和场地，确认需要记录的内容与画面。" },
      { title: "现场记录", description: "观察人物与活动进程，在现场完成摄影摄像。" },
      { title: "后期制作", description: "筛选素材、处理图片或剪辑视频，完成适合展示和传播的作品。" },
    ],
    outputs: ["毕业纪录片《周家刀》及相关采访影像。", "人像、舞台、活动与商业场景摄影作品。"],
    links: [
      { label: "浏览摄影作品", href: "/portfolio#photography" },
      { label: "查看完整作品集", href: "/portfolio" },
    ],
  },
  {
    slug: "red-leaf",
    title: "赤页 · 互动叙事实践",
    category: "项目实践",
    organization: "互动叙事产品",
    role: "内容设计与产品制作",
    summary: "尝试把文字故事转化为可以选择和探索的互动叙事，结合 AI 工具完成内容结构、页面及体验流程。",
    responsibilities: [
      "梳理故事中的人物、关系与情节，把内容转化为章节、选择和不同走向。",
      "设计从阅读、进入故事到选择、存档与回溯的体验流程。",
      "结合 AI 工具与网页制作完成可访问的产品，并持续检查内容和交互。",
    ],
    process: [
      { title: "内容梳理", description: "阅读原始故事，提取人物、冲突与线索，组织互动叙事结构。" },
      { title: "体验制作", description: "把章节与选择组织到页面中，配合场景素材和状态提示。" },
      { title: "体验检查", description: "检查进入故事、选择、存档及回溯等流程，完善内容呈现。" },
    ],
    outputs: ["可在线访问的互动叙事项目。", "故事阅读、互动选择、存档与回溯等体验。"],
    links: [{ label: "打开赤页在线体验", href: "https://zhihu.hegelsalon.com/" }],
  },
];

export function getPracticeRecord(slug: string) {
  return records.find((record) => record.slug === slug);
}
