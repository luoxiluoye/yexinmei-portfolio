"use client";

import { useRef, useState } from "react";
import { RealGallery } from "@/components/media/real-gallery";
import { photoProjects } from "@/lib/real-assets";

const labels = ["人像", "商业", "宣发", "剧场", "演唱会"];

export function PhotographyArchive() {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const project = photoProjects[selected];
  return <section id="photography" className="photography-archive" aria-labelledby="photo-collections">
    <div className="photography-archive__heading">
      <div><p className="font-pixel text-[10px] text-accent">CONTACT SHEETS / 05 COLLECTIONS</p>
        <h2 id="photo-collections" className="mt-2 text-[25px] font-semibold">镜头里的五种现场</h2></div>
      <p className="text-[13px] text-muted">选择分类，点击照片查看原图。</p>
    </div>
    <div role="tablist" aria-label="摄影分类" className="photo-tabs">
      {photoProjects.map((item, index) => <button key={item.category} type="button" role="tab"
        id={`photo-tab-${index}`} aria-selected={selected === index} aria-controls="photo-panel"
        tabIndex={selected === index ? 0 : -1} ref={element => { tabs.current[index] = element; }}
        onClick={() => setSelected(index)} onKeyDown={event => {
          let next = index;
          if (event.key === "ArrowRight") next = (index + 1) % photoProjects.length;
          else if (event.key === "ArrowLeft") next = (index + photoProjects.length - 1) % photoProjects.length;
          else if (event.key === "Home") next = 0;
          else if (event.key === "End") next = photoProjects.length - 1;
          else return;
          event.preventDefault(); setSelected(next); tabs.current[next]?.focus();
        }}>{labels[index]}<span>{String(item.images.length).padStart(2, "0")}</span></button>)}
    </div>
    <div role="tabpanel" id="photo-panel" aria-labelledby={`photo-tab-${selected}`} tabIndex={0}
      className={`photo-project photo-project--${project.category.toLowerCase()}`}>
      <div className="photo-project__intro"><div>
        <p className="font-pixel text-[10px] text-accent">{project.category}</p>
        <h3 className="mt-1 text-[17px] font-semibold">{project.title}</h3>
      </div><p className="text-[13px] leading-6 text-muted">{project.note}</p></div>
      <RealGallery key={project.category} images={project.images} />
    </div>
  </section>;
}
