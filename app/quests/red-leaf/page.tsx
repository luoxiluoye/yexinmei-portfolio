import type { Metadata } from "next";
import { RealGallery } from "@/components/media/real-gallery";
import { redLeafGallery } from "@/lib/real-assets";
import { Link } from "next-view-transitions";

export const metadata: Metadata = {
  title: "赤页 RED LEAF",
  description: "从 0 到 1 完成的 AI 互动叙事产品：把知乎故事、盐选内容与回答转译成可游玩的文字冒险世界。",
};

const pipeline = [
  ["01", "STORY", "知乎故事 / 盐选内容 / 回答 / 内容片段"],
  ["02", "UNDERSTAND", "人物 / 关系 / 世界观 / 冲突 / 事件 / 线索"],
  ["03", "REWRITE", "章节 / 剧情节点 / 玩家选择 / 状态 / 多结局"],
  ["04", "MATCH", "角色 / 场景 / 道具 / 视觉资源"],
  ["05", "BUILD", "生成可运行的互动文字冒险"],
  ["06", "PLAY", "选择 / 存档 / 回溯 / 结局收集"],
] as const;

export default function RedLeafPage() {
  return (
    <main className="site-container pb-14 pt-6 lg:pb-20 lg:pt-10">
      <div className="mb-8 flex items-center justify-between gap-4">
        <Link href="/quests" className="font-pixel text-[10px] text-muted transition-colors hover:text-accent">← 返回项目</Link>
        <a href="https://zhihu.hegelsalon.com/" target="_blank" rel="noreferrer" className="font-pixel text-[10px] text-accent">
          在线体验 ↗
        </a>
      </div>

      <section className="grid items-start gap-8 border-b border-divider pb-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-12 lg:pb-14">
        <div className="red-leaf-detail-copy">
          <p className="font-pixel text-[10px] tracking-[0.08em] text-accent">FLAGSHIP PROJECT / 2026</p>
          <h1
            className="mt-4 text-[44px] font-semibold leading-[1.03] tracking-[-0.045em] sm:text-[56px] lg:text-[72px]"
            style={{ viewTransitionName: "red-leaf-title" }}
          >
            赤页 <span className="text-accent">RED LEAF</span>
          </h1>
          <p className="mt-6 text-[22px] font-semibold leading-8 tracking-[-0.02em] lg:text-[28px] lg:leading-10">
            把知乎里的故事，变成可以走进去玩的世界。
          </p>
          <p className="mt-5 max-w-[650px] text-[15px] leading-7 text-muted lg:text-[16px] lg:leading-8">
            这是我从 0 到 1 完成的一款 AI 互动叙事产品。用户可以把知乎故事、盐选内容、回答或任意内容片段交给刘看山，系统会解析人物、关系、情节与线索，并在约 5 分钟内生成一款包含人物、场景、剧情分支、玩家选择与多结局的文字冒险游戏。
          </p>
          <p className="mt-4 max-w-[650px] text-[14px] leading-7 text-muted">
            从原文阅读、内容分析，到互动创作、游玩、存档、剧情回溯和结局收集，我把「内容 → 互动故事 → 可游玩世界」做成了一条完整产品流程。
          </p>

          <div className="mt-7 grid grid-cols-2 gap-x-6 gap-y-5 border-y border-divider py-5">
            <Metric value="≈ 5 MIN" label="单次游戏生成" />
            <Metric value="3,608" label="公开资源文件" />
            <Metric value="8.75 GiB" label="游戏与美术资源" />
            <Metric value="50" label="《重生周》决策位置" />
          </div>
        </div>

        <RealGallery images={redLeafGallery} visibleIndices={[0]} layout="single" priority />
      </section>

      <section className="py-10 lg:py-14">
        <p className="font-pixel text-[10px] tracking-[0.08em] text-accent">HOW IT WORKS</p>
        <h2 className="mt-2 text-[30px] font-semibold tracking-[-0.03em] lg:text-[38px]">一段内容，怎样变成一个可玩的世界</h2>
        <div className="mt-8 grid gap-px border border-divider bg-divider sm:grid-cols-2 lg:grid-cols-3">
          {pipeline.map(([number, title, detail]) => (
            <article key={number} className="red-leaf-pipeline-card bg-background p-5 lg:p-6">
              <p className="font-pixel text-[9px] text-accent">{number}</p>
              <h3 className="mt-4 font-pixel text-[13px]">{title}</h3>
              <p className="mt-3 text-[13px] leading-6 text-muted">{detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-divider py-8" aria-labelledby="product-archive">
        <p className="font-pixel text-[10px] text-accent">PRODUCT ARCHIVE / 02—05</p>
        <h2 id="product-archive" className="mb-5 mt-2 text-[26px] font-semibold">从故事书库，到每一次选择</h2>
        <p className="mb-5 text-[13px] text-muted">点击查看完整界面，可切换图片或按原始尺寸阅读。</p>
        <RealGallery images={redLeafGallery} visibleIndices={[1, 2, 3, 4]} />
      </section>

      <section className="grid gap-8 border-y border-divider py-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:gap-12 lg:py-14">
        <div>
          <p className="font-pixel text-[10px] tracking-[0.08em] text-accent">COMPANION UX</p>
          <h2 className="mt-2 text-[30px] font-semibold tracking-[-0.03em] lg:text-[38px]">刘看山的陪伴与引导</h2>
          <p className="mt-5 text-[15px] leading-7 text-muted">
            刘看山会贯穿原文阅读、线索整理、人物关系梳理、剧情讨论和改编过程，并通过动作、动画与隐藏彩蛋回应用户。它承担陪伴与引导，也会持续帮助用户理解当前故事状态。
          </p>
        </div>

        <div>

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-[620px]">
              <p className="font-pixel text-[9px] tracking-[0.08em] text-accent">FEATURED STORY</p>
              <h3 className="mt-2 text-[24px] font-semibold tracking-[-0.025em]">《重生周》</h3>
              <p className="mt-3 text-[14px] leading-7 text-muted">
                屠亦娆在丧尸围校、物资耗尽后死去，再睁眼时却回到了末日发生前整整七天。玩家需要重新规划物资、寻找安全屋、建立信任并调查灾变线索；而前期留下的物资、人物关系和信息，会真正改变之后的剧情。
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2 text-[11px] sm:max-w-[230px] sm:justify-end">
              <span className="border border-divider bg-soft px-3 py-2">50 决策位置</span>
              <span className="border border-divider bg-soft px-3 py-2">20 常规结局</span>
              <span className="border border-divider bg-soft px-3 py-2">8 失败结局</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 lg:py-14">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="font-pixel text-[10px] tracking-[0.08em] text-accent">PLAYABLE EXPERIENCE</p>
            <h2 className="mt-2 text-[30px] font-semibold tracking-[-0.03em] lg:text-[38px]">选择会留下后果</h2>
          </div>
          <p className="max-w-[520px] text-[13px] leading-6 text-muted sm:text-right">
            玩家留下的物资、人物信任与剧情线索，会在后续章节继续生效，并持续影响剧情走向。
          </p>
        </div>


      </section>

      <section className="border-t border-divider py-10 lg:py-14">
        <p className="font-pixel text-[10px] tracking-[0.08em] text-accent">FROM 0 → 1</p>
        <h2 className="mt-2 text-[30px] font-semibold tracking-[-0.03em] lg:text-[38px]">我完成了什么</h2>
        <p className="mt-5 max-w-[900px] text-[15px] leading-7 text-muted lg:text-[16px] lg:leading-8">
          从最初的产品概念、内容解析与故事生成逻辑，到互动叙事结构、刘看山陪伴体验、资源体系、游戏流程、页面实现和最终上线，我完成了赤页从想法到可运行产品的完整过程。它具备从原文走到游玩、存档、回溯与多结局收集的完整体验。
        </p>
        <div className="mt-7 flex flex-wrap gap-2 font-pixel text-[9px]">
          {['PRODUCT', 'NARRATIVE', 'AI WORKFLOW', 'UX', 'ASSET SYSTEM', 'BUILD', 'LAUNCH'].map((item) => (
            <span key={item} className="border border-divider px-3 py-2">{item}</span>
          ))}
        </div>
      </section>

      <section className="border-t border-divider py-10 text-center lg:py-16">
        <p className="font-pixel text-[10px] text-accent">ENTER RED LEAF</p>
        <h2 className="mx-auto mt-4 max-w-[850px] text-[30px] font-semibold leading-tight tracking-[-0.03em] lg:text-[44px]">
          让知乎里的每一个好故事，都有机会成为一个可以亲自经历的世界。
        </h2>
        <a href="https://zhihu.hegelsalon.com/" target="_blank" rel="noreferrer" className="mt-7 inline-flex min-h-12 items-center justify-center border-2 border-border bg-foreground px-5 font-pixel text-[10px] text-white hover:border-accent hover:bg-accent">
          在线体验 RED LEAF ↗
        </a>
      </section>
    </main>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-pixel text-[15px] lg:text-[17px]">{value}</p>
      <p className="mt-1 text-[12px] text-muted">{label}</p>
    </div>
  );
}
