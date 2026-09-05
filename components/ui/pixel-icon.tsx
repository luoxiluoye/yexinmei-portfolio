import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

import { getAsset, type AssetId } from "@/lib/assets";
import { cn } from "@/lib/cn";

type PixelIconProps = {
  assetId: AssetId;
  alt?: string;
  width?: number;
  height?: number;
  size?: number;
  className?: string;
  fallback?: ReactNode;
  priority?: boolean;
  decorative?: boolean;
  style?: CSSProperties;
};

export function PixelIcon({
  assetId,
  alt = "",
  width,
  height,
  size = 24,
  className,
  fallback = null,
  priority = false,
  decorative,
  style,
}: PixelIconProps) {
  const src = getAsset(assetId);
  const resolvedWidth = width ?? size;
  const resolvedHeight = height ?? size;
  const isDecorative = decorative ?? alt.length === 0;

  if (!src) {
    return fallback ? (
      <span
        aria-hidden={isDecorative || undefined}
        className={cn("inline-flex shrink-0 items-center justify-center", className)}
        style={{ width: resolvedWidth, height: resolvedHeight, ...style }}
      >
        {fallback}
      </span>
    ) : null;
  }

  if (src.startsWith("data:image/")) {
    return (
      // Embedded UI assets are tiny hand-cleaned pixel PNGs; keeping them native avoids optimizer rewriting.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={isDecorative ? "" : alt}
        aria-hidden={isDecorative || undefined}
        width={resolvedWidth}
        height={resolvedHeight}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={cn("pixelated shrink-0 object-contain", className)}
        style={style}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={isDecorative ? "" : alt}
      aria-hidden={isDecorative || undefined}
      width={resolvedWidth}
      height={resolvedHeight}
      priority={priority}
      className={cn("pixelated shrink-0 object-contain", className)}
      style={style}
    />
  );
}
