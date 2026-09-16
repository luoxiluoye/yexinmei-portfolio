"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { Link } from "next-view-transitions";

import { PixelIcon } from "@/components/ui/pixel-icon";

type Point = { x: number; y: number };

export function HomeWorld() {
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frame = useRef<number | null>(null);
  const target = useRef<Point>({ x: 0, y: 0 });
  const current = useRef<Point>({ x: 0, y: 0 });
  const [greeting, setGreeting] = useState(false);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
      if (frame.current !== null) window.cancelAnimationFrame(frame.current);
    };
  }, []);

  function writeWorldPosition(point: Point) {
    const scene = ref.current;
    if (!scene) return;
    scene.style.setProperty("--world-x", `${point.x.toFixed(2)}px`);
    scene.style.setProperty("--world-y", `${point.y.toFixed(2)}px`);
  }

  function animateToTarget() {
    if (frame.current !== null) return;

    const tick = () => {
      const dx = target.current.x - current.current.x;
      const dy = target.current.y - current.current.y;

      current.current = {
        x: current.current.x + dx * 0.12,
        y: current.current.y + dy * 0.12,
      };
      writeWorldPosition(current.current);

      if (Math.abs(dx) + Math.abs(dy) < 0.05) {
        current.current = { ...target.current };
        writeWorldPosition(current.current);
        frame.current = null;
        return;
      }

      frame.current = window.requestAnimationFrame(tick);
    };

    frame.current = window.requestAnimationFrame(tick);
  }

  function setTarget(point: Point) {
    target.current = point;
    animateToTarget();
  }

  function move(event: PointerEvent<HTMLDivElement>) {
    const scene = ref.current;
    if (
      !scene ||
      event.pointerType !== "mouse" ||
      scene.closest('[data-motion="off"]') ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const rect = scene.getBoundingClientRect();
    setTarget({
      x: ((event.clientX - rect.left) / rect.width - 0.5) * 14,
      y: ((event.clientY - rect.top) / rect.height - 0.5) * 9,
    });
  }

  function reset() {
    setTarget({ x: 0, y: 0 });
  }

  function greet() {
    setGreeting(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setGreeting(false), 2600);
  }

  return (
    <div ref={ref} className="studio-world" onPointerMove={move} onPointerLeave={reset}>
      <div className="studio-world-backdrop" aria-hidden="true">
        <span className="studio-world-grid" />
        <span className="studio-world-sun" />
      </div>

      <span className="studio-world-coordinate studio-coordinate-top" aria-hidden="true">
        WORLD 01 <span>＋</span>
      </span>
      <span className="studio-world-coordinate studio-coordinate-bottom" aria-hidden="true">
        30.67° N / 104.06° E
      </span>

      <div className="studio-world-layer studio-world-clouds" aria-hidden="true">
        <PixelIcon
          assetId="world.cloudLarge"
          width={180}
          height={135}
          priority
          className="studio-cloud studio-cloud-one"
        />
        <PixelIcon
          assetId="world.cloudMedium"
          width={130}
          height={98}
          priority
          className="studio-cloud studio-cloud-two"
        />
        <span className="studio-pixel-spark studio-spark-one">✦</span>
        <span className="studio-pixel-spark studio-spark-two">＋</span>
      </div>

      <div className="studio-world-ground" aria-hidden="true">
        <PixelIcon assetId="world.grassLong" width={1040} height={520} priority />
      </div>

      <div className="studio-world-person" aria-hidden="true">
        <PixelIcon assetId="character.fullBody" width={330} height={440} priority />
      </div>

      <div className="studio-world-bubble">
        <span className="font-pixel">HELLO, NEW FRIEND!</span>
        <span>欢迎来到我的小世界。</span>
      </div>

      <Link href="/quests/visual-storytelling" className="studio-world-object studio-world-camera">
        <PixelIcon assetId="items.camera" width={62} height={62} />
        <span>
          用镜头记录 <span aria-hidden="true">↗</span>
        </span>
      </Link>

      <Link href="/quests/inspiration-studio" className="studio-world-object studio-world-notebook">
        <PixelIcon assetId="items.notebook" width={52} height={52} />
        <span>
          让灵感落地 <span aria-hidden="true">↗</span>
        </span>
      </Link>

      <button
        className="studio-world-cat"
        type="button"
        onClick={greet}
        aria-label="和像素猫打个招呼"
      >
        <PixelIcon assetId={greeting ? "cat.love" : "cat.sit"} width={130} height={130} priority />
        <span>{greeting ? "♥ 很高兴认识你！" : "摸摸猫咪 +"}</span>
      </button>
      <span className="sr-only" role="status">
        {greeting ? "喵！很高兴认识你。" : ""}
      </span>

      <div className="studio-world-caption">
        <span className="studio-caption-dot" />
        好奇心在线 <span className="font-pixel">ALWAYS EXPLORING</span>
      </div>
    </div>
  );
}
