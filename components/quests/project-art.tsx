import { PixelIcon } from "@/components/ui/pixel-icon";

type ProjectTheme = "zhihu" | "global" | "tech" | "ccd" | "visual" | "workflow";

const themeBySlug: Record<string, ProjectTheme> = {
  "zhihu-auto-consumer-tech": "zhihu",
  "global-content": "global",
  "tech-you-houhua": "tech",
  "ccd-business": "ccd",
  "visual-storytelling": "visual",
  "inspiration-studio": "workflow",
};

const toplineByTheme: Record<ProjectTheme, string> = {
  zhihu: "GOOD QUESTIONS. REAL CONNECTIONS.",
  global: "ACROSS LANGUAGES & CULTURES",
  tech: "TECH SIGNAL / WHAT HAPPENS NEXT",
  ccd: "SIDE QUEST / CAMERA BUSINESS",
  visual: "VISUAL NOTES / CONTACT SHEET",
  workflow: "IDEA → RESEARCH → CREATE → REVIEW",
};

export function ProjectArt({
  slug,
  className = "",
}: {
  slug: string;
  className?: string;
}) {
  const theme = themeBySlug[slug] ?? "zhihu";

  return (
    <div className={`studio-project-art studio-art-${theme} ${className}`} aria-hidden="true">
      <div className="studio-art-grid" />
      <span className="studio-art-topline">{toplineByTheme[theme]}</span>

      {theme === "zhihu" ? (
        <>
          <span className="studio-art-watermark">?</span>
          <div className="studio-question studio-question-back">
            让一个好问题，
            <br />
            遇见有趣的回答。
          </div>
          <div className="studio-question studio-question-front">
            <span className="font-pixel">LET&apos;S TALK</span>
            <strong>
              内容的下一站，
              <br />
              是人与人的连接。
            </strong>
            <span className="studio-art-dots">● ● ●</span>
          </div>
          <PixelIcon assetId="ui.speechBubble" width={84} height={84} className="studio-art-speech" />
          <span className="studio-zhihu-pulse">DISCUSSION LIVE</span>
        </>
      ) : null}

      {theme === "global" ? (
        <>
          <div className="studio-art-globe">
            <span />
            <span />
            <span />
          </div>
          <div className="studio-global-routes">
            <span className="studio-global-route" />
            <span className="studio-global-route" />
            <span className="studio-global-route" />
          </div>
          <span className="studio-global-word">
            Hello,
            <br />
            <em>world.</em>
          </span>
          <span className="studio-global-stamp">
            成都
            <br />→ 世界
          </span>
        </>
      ) : null}

      {theme === "tech" ? (
        <>
          <span className="studio-art-watermark">AI</span>
          <div className="studio-tech-terminal">
            <span className="studio-tech-kicker">&gt; SEARCHING BEYOND THE HEADLINE</span>
            <span className="studio-tech-line" />
            <span className="studio-tech-line" />
            <span className="studio-tech-line" />
            <span className="studio-tech-cursor" />
          </div>
          <div className="studio-tech-stack">
            <span className="studio-tech-chip">AI</span>
            <span className="studio-tech-chip">ROBOT</span>
            <span className="studio-tech-chip">CHIP</span>
          </div>
        </>
      ) : null}

      {theme === "ccd" ? (
        <>
          <span className="studio-art-watermark">CCD</span>
          <div className="studio-camera-orbit" />
          <PixelIcon assetId="items.camera" width={220} height={220} className="studio-art-camera-object" />
          <div className="studio-ccd-metric">
            <strong>20W+</strong>
            <span>CUMULATIVE GMV</span>
          </div>
          <div className="studio-ccd-tags">
            <span>SOLD</span>
            <span>RENTED</span>
            <span>50%+</span>
          </div>
          <span className="studio-art-focus studio-art-focus-one" />
          <span className="studio-art-focus studio-art-focus-two" />
        </>
      ) : null}

      {theme === "visual" ? (
        <>
          <span className="studio-art-watermark">STORY</span>
          <div className="studio-visual-sheet">
            <span className="studio-visual-frame" data-frame="FRAME 01" />
            <span className="studio-visual-frame" data-frame="FRAME 02" />
            <span className="studio-visual-frame" data-frame="FRAME 03" />
            <span className="studio-visual-frame" data-frame="FRAME 04" />
          </div>
        </>
      ) : null}

      {theme === "workflow" ? (
        <>
          <span className="studio-art-watermark">FLOW</span>
          <div className="studio-workflow-map">
            <span className="studio-workflow-line" />
            <span className="studio-workflow-node">IDEA</span>
            <span className="studio-workflow-node">RESEARCH</span>
            <span className="studio-workflow-node">CREATE</span>
            <span className="studio-workflow-node">REVIEW</span>
          </div>
        </>
      ) : null}

      <span className="studio-art-bottomline">
        YEXINMEI LUO <span>✳</span>
      </span>
    </div>
  );
}
