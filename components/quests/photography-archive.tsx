import { RealGallery } from "@/components/media/real-gallery";
import { photoProjects } from "@/lib/real-assets";

export function PhotographyArchive() {
  return <section className="mt-4 border-2 border-border bg-paper px-3 py-5 sm:px-5" aria-labelledby="photo-collections">
    <p className="font-pixel text-[10px] text-accent">CONTACT SHEETS / REAL WORK</p>
    <h2 id="photo-collections" className="mt-2 text-[24px] font-bold">镜头里的五种现场</h2>
    <p className="mt-2 text-[12px] leading-6 text-muted">人像、商家、街头广告、剧场与演唱会。精选作品保留原比例，点击查看完整照片。</p>
    <nav aria-label="摄影分类" className="my-4 flex flex-wrap gap-2">
      {photoProjects.map(project => <a key={project.category} href={`#photos-${project.category.toLowerCase()}`} className="inline-flex min-h-9 items-center border border-divider px-2 font-pixel text-[8px] hover:border-accent hover:text-accent">{project.category}</a>)}
    </nav>
    {photoProjects.map(project => <section key={project.category} id={`photos-${project.category.toLowerCase()}`} className="photo-project">
      <p className="font-pixel text-[9px] text-accent">{project.category}</p>
      <h3 className="mt-2 text-[17px] font-bold">{project.title}</h3>
      <p className="mb-4 mt-1 text-[12px] leading-6 text-muted">{project.note}</p>
      <RealGallery images={project.images} />
    </section>)}
  </section>;
}
