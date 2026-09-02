import Image from "next/image";

import type { QuestGalleryItem } from "@/types/quest";

export function QuestGallery({ gallery }: { gallery: QuestGalleryItem[] }) {
  if (gallery.length === 0) return null;

  return (
    <section className="border-t border-divider py-6">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <p className="font-pixel text-[11px] text-accent">GALLERY</p>
          <h2 className="mt-1 font-pixel text-[17px]">PROJECT ARCHIVE</h2>
        </div>
        <span className="font-pixel text-[10px] text-muted">{gallery.length} FILES</span>
      </div>

      <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0">
        {gallery.map((image, index) => (
          <figure
            key={`${image.src}-${index}`}
            className="min-w-[86%] snap-start border-2 border-border bg-paper p-2 md:min-w-0"
          >
            <div className="relative aspect-[4/3] overflow-hidden border border-divider bg-soft">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 767px) 86vw, 36vw"
                className="object-cover"
              />
            </div>

            <figcaption className="flex justify-between gap-4 px-1 pt-3 text-[12px] leading-5 text-muted">
              <span>{image.caption ?? image.alt}</span>
              <span className="shrink-0 font-pixel text-[10px]">
                IMG_{String(index + 1).padStart(2, "0")}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
