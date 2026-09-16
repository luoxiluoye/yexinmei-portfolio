import { PixelIcon } from "@/components/ui/pixel-icon";

const coverBySlug = {
  "zhihu-auto-consumer-tech": {
    theme: "zhihu",
    kicker: "CONTENT / COMMUNITY",
    title: "知乎数码",
    accent: "新品运营",
    descriptor: "问题运营 · 热点话题 · 专题页 · 用户参与",
    metrics: [
      { value: "NOW", label: "知乎数码 / 新品" },
      { value: "4", label: "核心运营场景" },
    ],
  },
  "global-content": {
    theme: "global",
    kicker: "GLOBAL CONTENT",
    title: "国际传播",
    accent: "GLOBAL",
    descriptor: "内容策划 · 分发 · 增长",
    metrics: [
      { value: "1000+", label: "海外社媒内容" },
      { value: "8000+", label: "账号涨粉" },
    ],
  },
  "tech-you-houhua": {
    theme: "tech",
    kicker: "TECH NOTES",
    title: "科技有后话",
    accent: "BEYOND NEWS",
    descriptor: "AI · ROBOT · CHIP · SMART CAR",
    metrics: [
      { value: "TECH", label: "热点之后继续追" },
      { value: "SEARCH", label: "搜索需求与解释" },
    ],
  },
  "ccd-business": {
    theme: "ccd",
    kicker: "CAMERA BUSINESS",
    title: "CCD",
    accent: "20W+ GMV",
    descriptor: "内容获客 · 交易 · 租赁 · 复购",
    metrics: [
      { value: "20W+", label: "累计 GMV" },
      { value: "50%+", label: "利润率" },
    ],
  },
  "visual-storytelling": {
    theme: "visual",
    kicker: "VISUAL STORY",
    title: "摄影 / 视觉",
    accent: "CONTACT SHEET",
    descriptor: "人物 · 活动 · 日常记录 · 视频",
    metrics: [
      { value: "PHOTO", label: "现场与人物" },
      { value: "VIDEO", label: "拍摄与剪辑" },
    ],
  },
  "inspiration-studio": {
    theme: "workflow",
    kicker: "AI WORKFLOW",
    title: "灵感编辑室",
    accent: "CONTENT OS",
    descriptor: "选题 → 创作 → 发布 → 数据 → 复盘",
    metrics: [
      { value: "32", label: "内容运营字段" },
      { value: "8", label: "看板视图" },
    ],
  },
} as const;

type ProjectCoverProps = {
  slug: string;
  code?: string;
  variant?: "card" | "detail";
  className?: string;
};

export function ProjectCover({ slug, code, variant = "card", className = "" }: ProjectCoverProps) {
  const cover = coverBySlug[slug as keyof typeof coverBySlug] ?? coverBySlug["zhihu-auto-consumer-tech"];

  return (
    <div className={`project-cover project-cover--${variant} project-cover--${cover.theme} ${className}`} aria-hidden="true">
      <div className="project-cover__topline">
        <span className="project-cover__mark" />
        <span>PERSONAL PROJECT</span>
        <span className="project-cover__code">{code ?? "PROJECT"}</span>
      </div>

      <div className="project-cover__body">
        <div className="project-cover__copy">
          <span className="project-cover__badge">{cover.kicker}</span>
          <div className="project-cover__title">
            <strong>{cover.title}</strong>
            <strong>{cover.accent}</strong>
          </div>
          <p>{cover.descriptor}</p>
          <div className="project-cover__metrics">
            {cover.metrics.map((metric) => (
              <div key={`${metric.value}-${metric.label}`}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="project-cover__visual">
          {cover.theme === "zhihu" ? <ZhihuVisual /> : null}
          {cover.theme === "global" ? <GlobalVisual /> : null}
          {cover.theme === "tech" ? <TechVisual /> : null}
          {cover.theme === "ccd" ? <CcdVisual /> : null}
          {cover.theme === "visual" ? <VisualSheet /> : null}
          {cover.theme === "workflow" ? <WorkflowVisual /> : null}
        </div>
      </div>

      <div className="project-cover__footer">
        <span>YEXINMEI LUO</span>
        <span>BUILD · LEARN · CREATE</span>
      </div>
    </div>
  );
}

function ZhihuVisual() {
  return (
    <div className="project-cover-feed">
      <div className="project-cover-feed__head"><span>DISCUSSION FEED</span><span>●</span></div>
      <div className="project-cover-feed__card"><b># 新品发布</b><span>这次升级最值得讨论什么？</span><i>328 · 142 · SAVE</i></div>
      <div className="project-cover-feed__card"><b># 长期体验</b><span>真实使用之后，还有哪些变化？</span><i>612 · 256 · SAVE</i></div>
      <div className="project-cover-feed__card"><b># 技术解析</b><span>AI 会怎样改变下一代设备？</span><i>489 · 217 · SAVE</i></div>
      <PixelIcon assetId="ui.speechBubble" decorative width={54} height={54} className="project-cover-feed__icon" />
    </div>
  );
}

function GlobalVisual() {
  return (
    <div className="project-cover-world">
      <span className="project-cover-world__globe"><i /><i /></span>
      <span className="project-cover-world__route project-cover-world__route--a" />
      <span className="project-cover-world__route project-cover-world__route--b" />
      <span className="project-cover-world__route project-cover-world__route--c" />
      <span className="project-cover-world__node project-cover-world__node--a" />
      <span className="project-cover-world__node project-cover-world__node--b" />
      <span className="project-cover-world__node project-cover-world__node--c" />
      <div className="project-cover-world__cards"><span>CREATE</span><span>DISTRIBUTE</span><span>CONNECT</span><span>GROW</span></div>
    </div>
  );
}

function TechVisual() {
  return (
    <div className="project-cover-terminal">
      <div className="project-cover-terminal__bar"><span /><span /><span /></div>
      <b>&gt; SEARCHING BEYOND THE HEADLINE</b>
      <span className="project-cover-terminal__line" />
      <span className="project-cover-terminal__line" />
      <span className="project-cover-terminal__line" />
      <div className="project-cover-terminal__chips"><span>AI</span><span>ROBOT</span><span>CHIP</span></div>
    </div>
  );
}

function CcdVisual() {
  return (
    <div className="project-cover-camera">
      <span className="project-cover-camera__orbit" />
      <PixelIcon assetId="items.camera" decorative width={190} height={190} className="project-cover-camera__icon" />
      <div className="project-cover-camera__tickets"><span>SOLD</span><span>RENT</span><span>REPEAT</span></div>
    </div>
  );
}

function VisualSheet() {
  return (
    <div className="project-cover-contact-sheet">
      {["01", "02", "03", "04", "05", "06"].map((frame) => <span key={frame} data-frame={frame} />)}
    </div>
  );
}

function WorkflowVisual() {
  return (
    <div className="project-cover-flow">
      <span className="project-cover-flow__line" />
      <span>IDEA</span><span>SORT</span><span>MAKE</span><span>REVIEW</span>
      <PixelIcon assetId="ui.sparkle" decorative width={36} height={36} className="project-cover-flow__spark" />
    </div>
  );
}
