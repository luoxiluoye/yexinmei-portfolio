"use client";

import { useEffect, useMemo, useState } from "react";

import { PixelIcon } from "@/components/ui/pixel-icon";
import type { AssetId } from "@/lib/assets";

type Memory = {
  title: string;
  time: string;
  icon: AssetId;
  summary: string[];
  abilities: Array<{ title: string; detail: string; icon: AssetId }>;
  current?: boolean;
};

type Fact = {
  title: string;
  itemTitle: string;
  icon: AssetId;
  type: string;
  rarity: number;
  status: string;
  story: string[];
};

const memories: Memory[] = [
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
    time: "2026 — NOW",
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

const facts: Fact[] = [
  {
    title: "卖过 20W+ 的 CCD",
    itemTitle: "CCD CAMERA",
    icon: "player.factCcd",
    type: "SIDE QUEST",
    rarity: 4,
    status: "ONGOING",
    story: [
      "最开始只是处理一台闲置 CCD，后来慢慢研究选品、定价、内容和交易。",
      "这件小事最后变成了累计 GMV 20W+ 的个人项目，也让我更喜欢把兴趣真正做起来。",
    ],
  },
  {
    title: "会为了一个选题翻很多资料",
    itemTitle: "RESEARCH NOTES",
    icon: "player.factNotes",
    type: "WORK HABIT",
    rarity: 4,
    status: "ALWAYS ON",
    story: [
      "遇到一个想讲清楚的选题，我通常会顺着线索继续翻报道、资料和数据。",
      "很多时候，真正有意思的角度就藏在那些看起来不起眼的细节里。",
    ],
  },
  {
    title: "相机既是爱好，也是生产工具",
    itemTitle: "CAMERA KIT",
    icon: "player.factCameraKit",
    type: "EQUIPMENT",
    rarity: 5,
    status: "EQUIPPED",
    story: [
      "我喜欢拍照，也习惯把相机带进自己的内容工作和个人项目里。",
      "它既负责记录生活，也会变成内容素材、作品和新的小生意。",
    ],
  },
  {
    title: "喜欢研究内容为什么会火",
    itemTitle: "CONTENT SPARK",
    icon: "player.factContentSpark",
    type: "PASSIVE SKILL",
    rarity: 4,
    status: "ACTIVE",
    story: [
      "我一直很喜欢观察：什么内容会让人停下来，为什么有人愿意看、愿意讨论。",
      "这种好奇心也是我做选题、社区和内容运营时最常用的一项能力。",
    ],
  },
  {
    title: "猫咪是本站常驻 NPC",
    itemTitle: "CAT COMPANION NPC",
    icon: "player.factCatNpc",
    type: "COMPANION",
    rarity: 5,
    status: "ALWAYS ONLINE",
    story: [
      "一只神出鬼没的黑猫，常年蹲守在本站各个页面。",
      "没有固定任务、不卖装备、不发经验，只负责陪你看世界，以及在需要的时候默默提供情绪价值。",
      "据说，它比你更早连接了这个网站。也可能，才是这里的真正主人。",
    ],
  },
];

function useDialog(open: boolean, close: () => void) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);
}

export function JourneyArchive() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [showFound, setShowFound] = useState(false);
  const active = activeIndex === null ? null : memories[activeIndex];
  const close = () => setActiveIndex(null);
  useDialog(activeIndex !== null, close);

  const openMemory = (index: number) => {
    setActiveIndex(index);
    setShowFound(true);
    window.setTimeout(() => setShowFound(false), 1400);
  };

  const move = (delta: number) => {
    if (activeIndex === null) return;
    setActiveIndex((activeIndex + delta + memories.length) % memories.length);
  };

  return (
    <>
      <div className="relative overflow-visible border border-divider bg-soft px-3 pb-4 pt-6 lg:px-4 lg:pt-7">
        <div className="no-scrollbar overflow-x-auto pb-1">
          <div className="relative min-w-[620px] lg:min-w-0">
            <div aria-hidden="true" className="absolute left-[6%] right-[6%] top-[22px] h-[2px] bg-divider" />
            <ol className="relative z-10 grid grid-cols-7 gap-2">
              {memories.map((memory, index) => {
                const isNow = memory.current;
                return (
                  <li key={memory.title} className="min-w-0 text-center">
                    <button
                      type="button"
                      onClick={() => openMemory(index)}
                      className="group relative mx-auto flex min-h-[86px] w-full cursor-pointer flex-col items-center border-0 bg-transparent p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-soft"
                      aria-label={`打开 ${memory.title} 的记忆档案`}
                    >
                      <span className="pointer-events-none absolute -top-9 left-1/2 hidden -translate-x-1/2 whitespace-nowrap border-2 border-border bg-paper px-2 py-1 font-pixel text-[9px] shadow-[2px_2px_0_rgba(17,17,17,.12)] group-hover:block lg:text-[10px]">
                        OPEN MEMORY
                      </span>
                      <span
                        className={[
                          "relative flex h-10 w-10 items-center justify-center border-2 font-pixel text-[9px] transition-[transform,box-shadow,background-color,color] duration-100 group-hover:-translate-y-1 group-hover:shadow-[3px_3px_0_rgba(17,17,17,.12)]",
                          isNow
                            ? "border-foreground bg-foreground text-white"
                            : "border-border bg-paper text-accent group-hover:border-accent",
                        ].join(" ")}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p className={["mt-3 max-w-[76px] text-[12px] font-medium leading-[18px]", isNow ? "font-pixel text-[11px]" : ""].join(" ")}>
                        {memory.title}
                      </p>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-[auto_1fr_auto] items-center gap-3 border-t border-divider pt-3 font-pixel text-[9px] text-muted">
          <span>START</span>
          <span className="text-center">MEDIA · CONTENT · COMMUNITY</span>
          <span className="text-foreground">CURRENT POSITION</span>
        </div>
      </div>

      {active && activeIndex !== null && (
        <MemoryDialog
          memory={active}
          index={activeIndex}
          onClose={close}
          onPrev={() => move(-1)}
          onNext={() => move(1)}
        />
      )}

      {showFound && (
        <div className="rpg-achievement-toast fixed right-4 top-24 z-[110] flex items-center gap-2 border-2 border-border bg-paper px-3 py-2 shadow-[3px_3px_0_rgba(17,17,17,.16)] lg:right-8">
          <PixelIcon assetId="player.achievementBadge" decorative width={30} height={30} />
          <div>
            <p className="font-pixel text-[9px] text-accent">MEMORY FOUND</p>
            <p className="text-[12px]">记忆档案已打开</p>
          </div>
        </div>
      )}
    </>
  );
}

function MemoryDialog({
  memory,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  memory: Memory;
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] bg-[#171717]/35"
      role="presentation"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label={`${memory.title} Memory Archive`}
        className="pixel-cut-frame fixed inset-x-2 bottom-[calc(var(--rpg-bottom-tab-height)+8px)] max-h-[82vh] overflow-hidden lg:left-1/2 lg:right-auto lg:top-1/2 lg:bottom-auto lg:w-[760px] lg:max-h-[88vh] lg:-translate-x-1/2 lg:-translate-y-1/2"
      >
        <div className="pixel-cut-surface max-h-[82vh] overflow-y-auto bg-paper lg:max-h-[88vh]">
          <header className="sticky top-0 z-10 flex min-h-12 items-center justify-between border-b-2 border-border bg-foreground px-4 text-white lg:px-5">
            <div className="flex items-center gap-2">
              <PixelIcon assetId="player.memoryArchive" decorative width={30} height={30} className="brightness-0 invert" />
              <span className="font-pixel text-[13px] lg:text-[15px]">MEMORY ARCHIVE</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="关闭 Memory Archive"
              className="flex h-9 w-9 items-center justify-center border-2 border-white bg-paper font-pixel text-[18px] text-foreground transition-transform hover:-translate-y-px active:translate-y-px"
            >
              ×
            </button>
          </header>

          <div className="p-4 lg:p-6">
            <div className="grid grid-cols-[62px_1fr] gap-4 border-b border-divider pb-4 lg:grid-cols-[66px_1fr_150px]">
              <div className="flex h-[58px] w-[58px] items-center justify-center border-2 border-border bg-soft font-pixel text-[20px] text-accent">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className="min-w-0">
                <p className="font-pixel text-[9px] text-accent">STAGE</p>
                <div className="mt-1 flex items-center gap-2">
                  <PixelIcon assetId={memory.icon} decorative width={34} height={34} />
                  <h3 className="text-[20px] font-bold leading-7">{memory.current ? "CURRENT CHAPTER" : memory.title}</h3>
                </div>
              </div>
              <div className="col-span-2 border-t border-divider pt-3 lg:col-span-1 lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0">
                <p className="font-pixel text-[9px] text-accent">TIME RANGE</p>
                <p className="mt-2 font-pixel text-[13px]">{memory.time}</p>
              </div>
            </div>

            {memory.current && (
              <div className="mt-4 flex items-center justify-center gap-4 font-pixel text-[12px]">
                <span className="text-yellow">✦</span>
                <span>LEVELING UP....</span>
                <span className="text-yellow">✦</span>
              </div>
            )}

            <div className="mt-4 grid gap-5 lg:grid-cols-[44fr_56fr]">
              <div className="flex min-h-[210px] flex-col items-center justify-center border-2 border-border bg-soft px-5 py-6 text-center lg:min-h-[240px]">
                <PixelIcon assetId="player.memoryLocked" decorative width={112} height={84} />
                <p className="mt-4 font-pixel text-[11px] leading-5">MEMORY IMAGE<br />NOT LOADED YET</p>
                <p className="mt-2 text-[11px] text-muted">以后补真实照片，这里会自动替换。</p>
              </div>
              <div className="space-y-4 text-[14px] leading-7 text-muted lg:text-[15px]">
                {memory.summary.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="mt-5 border-t border-divider pt-4">
              <p className="font-pixel text-[10px] text-accent">KEY ABILITIES</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {memory.abilities.map((ability) => (
                  <div key={ability.title} className="flex min-h-[84px] items-center gap-3 border border-divider bg-soft p-3">
                    <PixelIcon assetId={ability.icon} decorative width={34} height={34} />
                    <div className="min-w-0">
                      <p className="font-semibold">{ability.title}</p>
                      <p className="mt-1 text-[11px] leading-4 text-muted">{ability.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-[1fr_1fr]">
              <button
                type="button"
                onClick={onPrev}
                className="flex min-h-12 items-center justify-center gap-2 border-2 border-border bg-foreground px-4 font-pixel text-[11px] text-white transition-transform hover:-translate-y-px active:translate-y-px"
              >
                <PixelIcon assetId="player.memoryArrowLeft" decorative width={24} height={24} className="brightness-0 invert" />
                PREV
              </button>
              <button
                type="button"
                onClick={onNext}
                className="flex min-h-12 items-center justify-center gap-2 border-2 border-border bg-foreground px-4 font-pixel text-[11px] text-white transition-transform hover:-translate-y-px active:translate-y-px"
              >
                NEXT
                <PixelIcon assetId="player.memoryArrowRight" decorative width={24} height={24} className="brightness-0 invert" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export function FunFactsInspect() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const active = activeIndex === null ? null : facts[activeIndex];
  const close = () => setActiveIndex(null);
  useDialog(activeIndex !== null, close);

  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
        {facts.map((fact, index) => (
          <button
            key={fact.title}
            type="button"
            onClick={() => setActiveIndex(index)}
            className="group flex min-h-[78px] w-full cursor-pointer items-center gap-3 border border-divider bg-soft p-3 text-left transition-[transform,background-color,border-color,box-shadow] duration-100 hover:-translate-y-px hover:border-border hover:bg-paper hover:shadow-[3px_3px_0_rgba(17,17,17,.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center">
              <PixelIcon assetId={fact.icon} decorative width={48} height={48} className="rpg-item-icon transition-transform group-hover:-translate-y-1" />
            </div>
            <span className="min-w-0 flex-1 text-[14px] leading-6">{fact.title}</span>
            <span className="hidden shrink-0 items-center gap-1 font-pixel text-[9px] text-muted transition-colors group-hover:text-accent xl:flex">
              <PixelIcon assetId="player.inspectEye" decorative width={22} height={22} />
              INSPECT →
            </span>
          </button>
        ))}
      </div>

      {active && (
        <InspectDialog fact={active} onClose={close} />
      )}
    </>
  );
}

function InspectDialog({ fact, onClose }: { fact: Fact; onClose: () => void }) {
  const stars = useMemo(() => Array.from({ length: 5 }, (_, index) => index < fact.rarity), [fact.rarity]);

  return (
    <div
      className="fixed inset-0 z-[100] bg-[#171717]/40"
      role="presentation"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label={`${fact.itemTitle} Inspect Item`}
        className="pixel-cut-frame fixed inset-x-3 bottom-[calc(var(--rpg-bottom-tab-height)+8px)] max-h-[80vh] overflow-hidden lg:left-1/2 lg:right-auto lg:top-1/2 lg:bottom-auto lg:w-[650px] lg:max-h-[82vh] lg:-translate-x-1/2 lg:-translate-y-1/2"
      >
        <div className="pixel-cut-surface max-h-[80vh] overflow-y-auto bg-paper lg:max-h-[82vh]">
          <header className="flex min-h-[58px] items-center justify-between border-b border-divider px-4 lg:px-5">
            <div>
              <p className="font-pixel text-[9px] text-accent">ITEM FOUND</p>
              <h3 className="mt-1 font-pixel text-[15px]">INSPECT ITEM</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="关闭 Inspect Item"
              className="flex h-9 w-9 items-center justify-center border-2 border-border bg-accent font-pixel text-[17px] text-white transition-transform hover:-translate-y-px active:translate-y-px"
            >
              ×
            </button>
          </header>

          <div className="p-4 lg:p-5">
            <div className="grid gap-5 lg:grid-cols-[180px_1fr]">
              <div className="flex min-h-[200px] flex-col items-center justify-center border-2 border-border bg-soft p-4 text-center">
                <PixelIcon assetId={fact.icon} decorative width={96} height={96} />
                <p className="mt-4 font-pixel text-[9px] leading-5 text-muted">ITEM IMAGE<br />NOT LOADED YET</p>
              </div>
              <div>
                <h4 className="font-pixel text-[16px]">{fact.itemTitle}</h4>
                <p className="mt-1 text-[14px] font-medium">{fact.title}</p>
                <div className="mt-4 space-y-3 text-[14px] leading-7 text-muted">
                  {fact.story.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 border-t border-divider pt-4 text-[12px] sm:grid-cols-3">
              <div><span className="font-pixel text-[9px]">TYPE:</span> <span className="ml-1">{fact.type}</span></div>
              <div className="flex items-center gap-1">
                <span className="font-pixel text-[9px]">RARITY:</span>
                <span className="ml-1 flex gap-0.5">
                  {stars.map((filled, index) => (
                    <PixelIcon key={index} assetId={filled ? "ui.star" : "ui.emptyStar"} decorative width={16} height={16} />
                  ))}
                </span>
              </div>
              <div><span className="font-pixel text-[9px]">STATUS:</span> <span className="ml-1 text-[#2f7d3d]">{fact.status}</span></div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="mx-auto mt-5 flex min-h-11 w-full max-w-[220px] items-center justify-center border-2 border-border bg-paper px-5 font-pixel text-[11px] transition-[transform,background-color] hover:-translate-y-px hover:bg-soft active:translate-y-px"
            >
              CLOSE
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
