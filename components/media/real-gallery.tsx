"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { RealAsset } from "@/lib/real-assets";
import { RealImage } from "./real-image";

export function RealGallery({ images, visibleIndices, layout = "grid", priority = false }: {
  images: RealAsset[]; visibleIndices?: number[]; layout?: "grid" | "single" | "roll" | "thumb";
  priority?: boolean;
}) {
  const opener = useRef<HTMLButtonElement | null>(null);
  const [active, setActive] = useState<number | null>(null);
  const indices = visibleIndices ?? images.map((_, i) => i);
  return <>
    <div className={`real-gallery real-gallery--${layout}`}>
      {indices.map(index => {
        const item = images[index];
        return <figure key={item.src} className="real-gallery__item">
          <button type="button" className={`real-gallery__open real-gallery__open--${item.kind}`}
            aria-label={`查看大图：${item.alt}`} onClick={event => { opener.current = event.currentTarget; setActive(index); }}>
            <RealImage asset={item} sizes={layout === "thumb" ? "112px" : "(max-width: 639px) 90vw, (max-width: 1023px) 45vw, 560px"} priority={priority} />
            <span className="real-gallery__inspect" aria-hidden="true">＋</span>
          </button>
          {layout !== "thumb" && <figcaption><span>{item.category}</span>{item.caption}</figcaption>}
        </figure>;
      })}
    </div>
    {active !== null && createPortal(<Lightbox returnFocus={opener.current} images={images} active={active} onChange={setActive} onClose={() => setActive(null)} />, document.body)}
  </>;
}

function Lightbox({ images, active, onChange, onClose, returnFocus }: {
  returnFocus: HTMLButtonElement | null;
  images: RealAsset[]; active: number; onChange: (index: number) => void; onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const item = images[active];
  const move = (direction: number) => { setZoomed(false); onChange((active + direction + images.length) % images.length); };
  useEffect(() => {
    const previous = returnFocus;
    const modal = dialog.current;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    modal?.showModal();
    return () => { modal?.close(); document.body.style.overflow = overflow; previous?.focus(); };
  }, []);
  return <dialog ref={dialog} className="image-lightbox" aria-label="高清图片查看器"
    onCancel={event => { event.preventDefault(); onClose(); }}
    onClick={event => { if (event.target === event.currentTarget) onClose(); }}
    onKeyDown={event => {
      if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
      if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
    }}>
    <div className="image-lightbox__panel">
      <header>
        <span className="font-pixel text-[9px]">IMAGE ARCHIVE / {String(active + 1).padStart(2, "0")} · {images.length}</span>
        <button type="button" onClick={onClose} autoFocus aria-label="关闭图片">关闭 ×</button>
      </header>
      <div className={`image-lightbox__viewport ${zoomed ? "is-zoomed" : ""}`}
        onTouchStart={event => { if (event.touches.length === 1) touch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; else touch.current = null; }}
        onTouchEnd={event => {
          if (touch.current && !zoomed && event.changedTouches.length === 1) {
            const dx = event.changedTouches[0].clientX - touch.current.x;
            const dy = event.changedTouches[0].clientY - touch.current.y;
            if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) move(dx < 0 ? 1 : -1);
          }
          touch.current = null;
        }}>
        <RealImage asset={item} sizes="100vw" />
      </div>
      <footer>
        <p aria-live="polite">{item.category}<br />{item.caption}</p>
        <div className="image-lightbox__controls">
          {images.length > 1 && <button type="button" onClick={() => move(-1)} aria-label="上一张">←</button>}
          <button type="button" onClick={() => setZoomed(!zoomed)} aria-pressed={zoomed}>{zoomed ? "适应屏幕" : "原始尺寸"}</button>
          <a href={item.src} target="_blank" rel="noreferrer">打开原图 ↗</a>
          {images.length > 1 && <button type="button" onClick={() => move(1)} aria-label="下一张">→</button>}
        </div>
      </footer>
    </div>
  </dialog>;
}
