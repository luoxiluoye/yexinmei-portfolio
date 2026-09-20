import Image from "next/image";
import type { RealAsset } from "@/lib/real-assets";

export function RealImage({ asset, className = "", sizes = "100vw", priority = false }: {
  asset: RealAsset; className?: string; sizes?: string; priority?: boolean;
}) {
  return <Image src={asset.src} alt={asset.alt} width={asset.width} height={asset.height}
    unoptimized sizes={sizes} priority={priority} className={`real-image ${className}`}
    style={{ maxWidth: `min(100%, ${asset.width}px)`, imageRendering: "auto" }} />;
}
