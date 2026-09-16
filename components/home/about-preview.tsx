import Image from "next/image";
import { Link } from "next-view-transitions";
import { ScrollReveal } from "@/components/home/scroll-reveal";
import { PixelIcon } from "@/components/ui/pixel-icon";
export function AboutPreview() {
    return <section className="studio-about" aria-labelledby="about-preview-title"><ScrollReveal className="studio-about-layout"><div className="studio-about-portrait"><span className="studio-portrait-word" aria-hidden="true">OFF<br />DUTY.</span><Image src="/assets/player/snapshot/portrait.png" alt="罗叶馨梅的生活照" width={900} height={675} sizes="(max-width: 700px) 90vw, 42vw" className="studio-real-portrait"/><span className="studio-portrait-label">不止一个角色。<span className="font-pixel">JUST ME, BEING ME.</span></span><PixelIcon assetId="cat.peek" width={86} height={86} className="studio-portrait-cat" decorative/></div><div className="studio-about-copy"><p className="studio-kicker"><span>02 /</span> A LITTLE ABOUT ME</p><h2 id="about-preview-title">工作之外，<br />还有很多个我。</h2><p>新闻与传播专业出身，在内容、社区与科技之间探索。喜欢研究一件事为什么发生，也喜欢把它讲给更多人听。</p><p>拿起相机，记录一些日常；打开工作台，折腾一个新想法。很多好故事，就从这些小小的好奇开始。</p><div className="studio-about-tags"><span>内容观察者</span><span>相机爱好者</span><span>工具折腾家</span></div><Link href="/player" className="studio-text-link">翻开我的角色档案 <span aria-hidden="true">↗</span></Link></div></ScrollReveal></section>;
}
