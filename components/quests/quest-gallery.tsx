import Image from "next/image";

import type { QuestGalleryItem } from "@/types/quest";

export function QuestGallery({ gallery }: { gallery: QuestGalleryItem[] }) {
  if (gallery.length === 0) return null;

  return (
    <section className="border-t border-divider py-6">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <p className="font-pixel text-[11px] text-accent">REAL PROJECT EVIDENCE</p>
          <h2 className="mt-1 font-pixel text-[17px]">PROJECT ARCHIVE</h2>
        </div>
        <span className="font-pixel text-[10px] text-muted">{gallery.length} FILES</span>
      </div>

      <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0">
        {gallery.map((image, index) => (
          <figure key={`${image.src}-${index}`} className="project-evidence-window min-w-[88%] snap-start md:min-w-0">
            <div className="project-evidence-window__bar" aria-hidden="true">
              <i /><i /><i />
              <span>PROJECT SCREENSHOT / {String(index + 1).padStart(2, "0")}</span>
            </div>
            <div className="project-evidence-window__screen">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 767px) 88vw, 36vw"
              />
            </div>
            <figcaption className="project-evidence-window__caption">
              <span>{image.caption ?? image.alt}</span>
              <span>REAL EVIDENCE</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
