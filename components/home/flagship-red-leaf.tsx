import Image from "next/image";
import { Link } from "next-view-transitions";

import { ScrollReveal } from "@/components/home/scroll-reveal";

const metrics = [
  { value: "≈ 5 MIN", label: "从内容到可玩故事" },
  { value: "3,608", label: "公开资源文件" },
  { value: "8.75 GiB", label: "游戏与美术资源" },
  { value: "50", label: "《重生周》决策位置" },
] as const;

export function FlagshipRedLeaf() {
  return (
    <section id="flagship-project" className="border-t border-divider py-12 lg:py-20" aria-labelledby="red-leaf-title">
      <ScrollReveal>
        <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="font-pixel text-[10px] tracking-[0.08em] text-accent">01 / FLAGSHIP PROJECT</p>
            <p className="mt-2 text-[13px] text-muted">AI INTERACTIVE NARRATIVE · FROM 0 → 1</p>
          </div>
          <span className="font-pixel text-[9px] tracking-[0.08em] text-muted">RED LEAF / 2026</span>
        </div>
      </ScrollReveal>

      <div className="grid items-start gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:gap-12 xl:gap-16">
        <ScrollReveal>
          <div className="max-w-[560px]">
            <h2
              id="red-leaf-title"
              className="text-[38px] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-[46px] lg:text-[58px]"
              style={{ viewTransitionName: "red-leaf-title" }}
            >
              赤页 <span className="text-accent">RED LEAF</span>
            </h2>
            <p className="mt-5 text-[22px] font-semibold leading-8 tracking-[-0.02em] lg:text-[26px] lg:leading-9">
              把知乎里的故事，变成可以走进去玩的世界。
            </p>
            <p className="mt-5 text-[15px] leading-7 text-muted lg:text-[16px] lg:leading-8">
              我从 0 到 1 完成的一款 AI 互动叙事产品。用户可以把知乎故事、盐选内容、回答或任意内容片段交给刘看山，系统会解析人物、关系、情节与线索，并在约 5 分钟内生成一款包含人物、场景、剧情分支、玩家选择与多结局的文字冒险游戏。
            </p>
            <p className="mt-4 text-[14px] leading-7 text-muted">
              从内容理解、叙事重构，到互动创作、游玩、存档、剧情回溯与结局收集，我搭建了完整的「内容 → 互动故事 → 可游玩世界」产品流程。
            </p>

            <div className="mt-7 grid grid-cols-2 gap-x-5 gap-y-5 border-y border-divider py-5">
              {metrics.map((metric) => (
                <div key={metric.label} className="red-leaf-metric">
                  <p className="font-pixel text-[15px] text-foreground lg:text-[17px]">{metric.value}</p>
                  <p className="mt-1 text-[12px] leading-5 text-muted">{metric.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/quests/red-leaf"
                className="inline-flex min-h-11 items-center justify-center border-2 border-border bg-foreground px-4 font-pixel text-[10px] text-white transition-[transform,border-color,background-color] hover:-translate-y-px hover:border-accent hover:bg-accent"
              >
                查看完整案例 →
              </Link>
              <a
                href="https://zhihu.hegelsalon.com/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center justify-center border-2 border-border bg-paper px-4 font-pixel text-[10px] transition-[transform,border-color,color] hover:-translate-y-px hover:border-accent hover:text-accent"
              >
                在线体验 ↗
              </a>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="relative">
            <div className="absolute -bottom-3 -right-3 h-full w-full bg-accent/80" aria-hidden="true" />
            <div
              className="red-leaf-stage relative overflow-hidden border-2 border-border bg-[#0b0c0e] shadow-[8px_8px_0_rgba(17,17,17,.08)]"
              style={{ viewTransitionName: "red-leaf-hero" }}
            >
              <div className="flex min-h-11 items-center justify-between border-b border-white/10 px-4 text-white">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-accent" />
                  <span className="font-pixel text-[9px] tracking-[0.08em]">RED LEAF / REAL PRODUCT</span>
                </div>
                <span className="font-pixel text-[8px] text-white/45">STORY → PLAYABLE WORLD</span>
              </div>
              <div className="relative overflow-hidden bg-[#111317]">
                <Image
                  src="/assets/projects/red-leaf/library.webp"
                  alt="赤页 RED LEAF 知乎故事书库真实产品界面"
                  width={900}
                  height={469}
                  sizes="(max-width: 1023px) 100vw, 58vw"
                  className="h-auto w-full object-cover object-top"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#090a0c] via-[#090a0c]/55 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 text-white">
                  <div>
                    <p className="font-pixel text-[9px] text-[#ff424b]">REAL PRODUCT SCREENSHOT</p>
                    <p className="mt-1 text-[18px] font-semibold sm:text-[22px]">《重生周》</p>
                    <p className="mt-1 text-[12px] text-white/60">50 个决策位置 · 20 个常规结局 · 8 个失败结局</p>
                  </div>
                  <a
                    href="https://zhihu.hegelsalon.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 border border-white/35 bg-black/40 px-3 py-2 font-pixel text-[9px] transition-colors hover:border-[#ff424b] hover:text-[#ff424b]"
                  >
                    ENTER ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
          <p className="mt-3 text-[11px] leading-5 text-muted">
            真实产品截图；点击「在线体验」可进入当前版本。
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
