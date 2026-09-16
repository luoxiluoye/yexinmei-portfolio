"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";

import { PixelIcon } from "@/components/ui/pixel-icon";

export function HomeWorld() {
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frame = useRef<number | null>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const [greeting, setGreeting] = useState(false);

  useEffect(() => {
    const tick = () => {
      const scene = ref.current;
      if (!scene) return;

      const dx = target.current.x - current.current.x;
      const dy = target.current.y - current.current.y;
      current.current.x += dx * 0.11;
      current.current.y += dy * 0.11;

      scene.style.setProperty("--world-x", `${current.current.x.toFixed(2)}px`);
      scene.style.setProperty("--world-y", `${current.current.y.toFixed(2)}px`);

      const moving = Math.abs(dx) > 0.02 || Math.abs(dy) > 0.02;
      if (moving) frame.current = window.requestAnimationFrame(tick);
      else frame.current = null;
    };

    const start = () => {
      if (frame.current === null) frame.current = window.requestAnimationFrame(tick);
    };

    const node = ref.current;
    if (node) node.dataset.springReady = "true";

    const springEvent = () => start();
    window.addEventListener("portfolio-world-spring", springEvent);

    return () => {
      if (timer.current) clearTimeout(timer.current);
      if (frame.current !== null) window.cancelAnimationFrame(frame.current);
      window.removeEventListener("portfolio-world-spring", springEvent);
    };
  }, []);

  function nudge() {
    window.dispatchEvent(new Event("portfolio-world-spring"));
  }

  function move(event: PointerEvent<HTMLDivElement>) {
    const scene = ref.current;
    if (!scene || event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = scene.getBoundingClientRect();
    target.current.x = ((event.clientX - rect.left) / rect.width - 0.5) * 12;
    target.current.y = ((event.clientY - rect.top) / rect.height - 0.5) * 8;
    nudge();
  }

  function reset() {
    target.current = { x: 0, y: 0 };
    nudge();
  }

  function greet() {
    setGreeting(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setGreeting(false), 2200);
  }

  return (
    <div ref={ref} className="studio-world" onPointerMove={move} onPointerLeave={reset}>
      <div className="studio-world-backdrop" aria-hidden="true">
        <span className="studio-world-grid" />
        <span className="studio-world-sun" />
      </div>

      <div className="studio-world-layer studio-world-clouds" aria-hidden="true">
        <PixelIcon assetId="world.cloudLarge" width={180} height={135} priority className="studio-cloud studio-cloud-one" />
        <PixelIcon assetId="world.cloudMedium" width={130} height={98} priority className="studio-cloud studio-cloud-two" />
        <span className="studio-pixel-spark studio-spark-one">✦</span>
      </div>

      <div className="studio-world-ground" aria-hidden="true">
        <PixelIcon assetId="world.grassLong" width={1040} height={520} priority />
      </div>

      <div className="studio-world-person" aria-hidden="true">
        <PixelIcon assetId="character.fullBody" width={330} height={440} priority />
      </div>

      <div className="studio-world-bubble">
        <span className="font-pixel">HELLO!</span>
        <span>欢迎来到我的小世界。</span>
      </div>

      <button className="studio-world-cat" type="button" onClick={greet} aria-label="和像素猫打个招呼">
        <PixelIcon assetId={greeting ? "cat.love" : "cat.sit"} width={130} height={130} priority />
        <span>{greeting ? "♥ 很高兴认识你！" : "摸摸猫咪"}</span>
      </button>
      <span className="sr-only" role="status">{greeting ? "喵！很高兴认识你。" : ""}</span>
    </div>
  );
}
