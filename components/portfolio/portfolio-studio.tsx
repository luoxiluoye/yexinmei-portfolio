"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { Link } from "next-view-transitions";

import { StudioScene, type PortfolioZoneId } from "@/components/portfolio/studio-scene";

const routeByZone: Record<PortfolioZoneId, string> = {
  writing: "/portfolio/writing",
  photography: "/portfolio/photography",
  aigc: "/portfolio/aigc",
  video: "/portfolio/video",
};

export function PortfolioStudio() {
  const router = useRouter();
  const [loadingZone, setLoadingZone] = useState<PortfolioZoneId | null>(null);

  function openZone(zone: PortfolioZoneId) {
    setLoadingZone(zone);
    window.setTimeout(() => router.push(routeByZone[zone]), 180);
  }

  return (
    <section className="studio-shell" aria-label="3D 作品集空间">
      <div className="studio-topbar">
        <Link href="/" className="studio-brand" aria-label="返回个人主页">
          <span>LUO YEXINMEI</span>
          <span>Creative Portfolio</span>
        </Link>

        <nav className="studio-topnav" aria-label="作品集导航">
          <Link href="/">Home</Link>
          <span aria-current="page">Portfolio</span>
        </nav>
      </div>

      <div className="studio-canvas-wrap" aria-hidden="true">
        <Canvas
          shadows
          dpr={[1, 1.6]}
          camera={{ position: [0, 0.32, 14.9], fov: 36, near: 0.1, far: 100 }}
          gl={{ antialias: true, alpha: false }}
        >
          <Suspense fallback={null}>
            <StudioScene onSelect={openZone} />
          </Suspense>
        </Canvas>
      </div>

      <div className="studio-a11y-nav" aria-label="作品分类">
        <button type="button" onClick={() => openZone("writing")}>文字作品</button>
        <button type="button" onClick={() => openZone("photography")}>摄影作品</button>
        <button type="button" onClick={() => openZone("aigc")}>AIGC 视觉</button>
        <button type="button" onClick={() => openZone("video")}>视频作品</button>
      </div>

      <div className={`studio-route-wash ${loadingZone ? "is-visible" : ""}`} aria-hidden="true" />
    </section>
  );
}
