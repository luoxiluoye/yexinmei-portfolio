export const journalSeed = [
  {
    slug: "after-the-hotspot",
    category: "TECH NOTES",
    title: "热点之后，我会继续找什么？",
    summary: "比起复述一条科技新闻，我更想继续找公司动作、产业背景，以及普通人真正会受到什么影响。",
    date: "SEP 05 · 2026",
    readTime: "4 MIN READ",
    tools: ["选题策划", "资料研究", "搜索需求"],
    relatedQuest: {
      title: "科技有后话",
      href: "/quests/tech-you-houhua",
    },
    body: [
      "做科技内容以后，我越来越不太满足于把一条新闻重新讲一遍。真正让我觉得值得继续写的，通常是新闻后面还没有被说清楚的那一层：公司为什么现在做这件事、它和前面的动作有没有关系、产业链里谁会被影响。",
      "我一般会先把当天最确定的事实和时间线理清楚，再继续找公司动作、产品变化、产业背景和用户真正关心的问题。这样做会慢一点，但也更容易判断一条热点到底值得跟多久。",
      "现在我还会把搜索需求放得更靠前。标题里尽量保留公司名、产品名和事件关键词，不为了所谓的表达感把最重要的信息藏起来。对我来说，内容被看见和内容本身写得好，是同一件事的两个部分。",
    ],
  },
  {
    slug: "what-a-camera-keeps",
    category: "PHOTO NOTES",
    title: "镜头里，什么值得被留下？",
    summary: "拍人物和活动时，我会先找现场真正有情绪、有关系、有信息的瞬间，而不只是把画面拍完整。",
    date: "AUG 28 · 2026",
    readTime: "3 MIN READ",
    tools: ["摄影", "视觉表达", "现场观察"],
    relatedQuest: {
      title: "摄影 / 视觉内容",
      href: "/quests/visual-storytelling",
    },
    body: [
      "我本科是广播电视编导，所以影像一直不是一个后来才补上的技能。比起单纯追求画面好看，我更在意一张照片或者一个镜头到底留下了什么。",
      "活动现场节奏很快，真正值得拍的往往不是最标准的那一刻，而是人物之间刚好发生关系的瞬间：一个回头、一次交流、观众的反应，或者某个能把现场氛围带出来的小细节。",
      "这件事后来也影响了我做内容。无论是图文还是视频，我都会先问自己：用户为什么要停在这里？画面里有没有一个真正值得被看到的信息点？",
    ],
  },
  {
    slug: "workflow-is-not-the-goal",
    category: "SIDE PROJECT LOG",
    title: "我折腾 Workflow，不是为了多一个工具",
    summary: "真正有价值的自动化，是把重复的信息工作压缩掉，让判断、表达和创意留在自己手里。",
    date: "AUG 20 · 2026",
    readTime: "4 MIN READ",
    tools: ["AI Workflow", "信息整理", "内容效率"],
    relatedQuest: {
      title: "AI Workflow / 灵感编辑室",
      href: "/quests/inspiration-studio",
    },
    body: [
      "我很喜欢折腾工具，但我并不觉得工具越多越好。真正让我愿意长期保留的一套 workflow，通常都只解决一个很具体的问题：哪些步骤每天都在重复，哪些信息可以先被整理，哪些判断一定要留给自己。",
      "比如选题时，我希望机器先帮我把候选信息归拢、去重、标记时间和来源，但最后要不要做、从哪个角度做，仍然需要我自己判断。发布和复盘也是一样，自动化应该让流程更顺，而不是让内容变得更像流水线。",
      "所以我现在更愿意把 AI 当作一个工作台组件，而不是替代创作的人。省下来的时间，应该重新花在那些更难被自动化的部分：用户感受、取舍、结构和表达。",
    ],
  },
] as const;

export type JournalEntry = (typeof journalSeed)[number];

export function getJournalEntry(slug: string) {
  return journalSeed.find((entry) => entry.slug === slug);
}

export function getJournalSlugs() {
  return journalSeed.map((entry) => ({ slug: entry.slug }));
}
