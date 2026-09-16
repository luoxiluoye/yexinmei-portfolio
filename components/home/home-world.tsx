"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";

import { PixelIcon } from "@/components/ui/pixel-icon";

export function HomeWorld() {
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [greeting, setGreeting] = useState(false);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function move(event: PointerEvent<HTMLDivElement>) {
    const scene = ref.current;
    if (!scene || event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = scene.getBoundingClientRect();
    scene.style.setProperty("--world-x", `${((event.clientX - rect.left) / rect.width - 0.5) * 8}px`);
    scene.style.setProperty("--world-y", `${((event.clientY - rect.top) / rect.height - 0.5) * 6}px`);
  }

  function reset() {
    ref.current?.style.setProperty("--world-x", "0px");
    ref.current?.style.setProperty("--world-y", "0px");
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
