import { PixelIcon } from "@/components/ui/pixel-icon";
/** Editorial illustration of the subject, not a screenshot of the work. */
export function ProjectArt({ slug, className = "" }: {
    slug: string;
    className?: string;
}) {
    const theme = slug === "ccd-business" || slug === "visual-storytelling" ? "camera" : slug === "global-content" ? "global" : slug === "inspiration-studio" ? "workflow" : "community";
    return <div className={`studio-project-art studio-art-${theme} ${className}`} aria-hidden="true">
    <div className="studio-art-grid"/><span className="studio-art-topline">{theme === "camera" ? "SIDE QUEST / CAMERA STORIES" : theme === "global" ? "ACROSS LANGUAGES & CULTURES" : theme === "workflow" ? "IDEA → CREATE → PUBLISH" : "GOOD QUESTIONS. REAL CONNECTIONS."}</span>
    {theme === "community" ? <><span className="studio-art-watermark">?</span><div className="studio-question studio-question-back">让一个好问题，<br />遇见有趣的回答。</div><div className="studio-question studio-question-front"><span className="font-pixel">LET'S TALK</span><strong>内容的下一站，<br />是人与人的连接。</strong><span className="studio-art-dots">● ● ●</span></div><PixelIcon assetId="ui.speechBubble" width={84} height={84} className="studio-art-speech"/></> : theme === "camera" ? <><span className="studio-art-watermark">{slug === "ccd-business" ? "CCD" : "STORY"}</span><div className="studio-camera-orbit"/><PixelIcon assetId="items.camera" width={220} height={220} className="studio-art-camera-object"/><span className="studio-camera-label font-pixel">A LITTLE CAMERA.<br />A BIGGER STORY.</span><span className="studio-art-focus studio-art-focus-one"/><span className="studio-art-focus studio-art-focus-two"/></> : theme === "global" ? <><div className="studio-art-globe"><span /><span /><span /></div><span className="studio-global-word">Hello,<br /><em>world.</em></span><span className="studio-global-stamp">成都<br />→ 世界</span></> : <><span className="studio-art-watermark">IDEA</span><PixelIcon assetId="items.notebook" width={160} height={160} className="studio-art-camera-object"/><span className="studio-camera-label font-pixel">MAKE ROOM<br />FOR BETTER IDEAS.</span></>}
    <span className="studio-art-bottomline">YEXINMEI LUO <span>✳</span></span>
  </div>;
}
