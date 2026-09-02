import { PixelIcon } from "@/components/ui/pixel-icon";
import { cn } from "@/lib/cn";

type MiniWorldSceneProps = {
  kind?: "cat" | "garden" | "camera" | "empty";
  className?: string;
};

export function MiniWorldScene({ kind = "cat", className }: MiniWorldSceneProps) {
  const showGardenSky = kind === "garden";
  const showCameraSky = kind === "camera";

  return (
    <div
      className={cn(
        "rpg-scene relative min-h-[118px] overflow-hidden border-2 border-border bg-background",
        className
      )}
    >
      {(showGardenSky || showCameraSky) && (
        <PixelIcon
          assetId="world.cloudSmall"
          decorative
          width={62}
          height={42}
          className="absolute right-3 top-2 z-0 opacity-85"
        />
      )}

      {showGardenSky && (
        <PixelIcon
          assetId="world.cloudSmall"
          decorative
          width={46}
          height={32}
          className="absolute left-4 top-5 z-0 opacity-75"
        />
      )}

      <PixelIcon
        assetId="world.grassShort"
        decorative
        width={230}
        height={70}
        className="absolute bottom-0 left-1/2 z-10 w-[70%] -translate-x-1/2"
      />

      {kind === "cat" && (
        <PixelIcon
          assetId="cat.sit"
          decorative
          width={62}
          height={62}
          className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2"
        />
      )}

      {kind === "garden" && (
        <>
          <PixelIcon
            assetId="world.flower"
            decorative
            width={28}
            height={28}
            className="absolute bottom-4 left-[38%] z-20"
          />
          <PixelIcon
            assetId="cat.stand"
            decorative
            width={58}
            height={58}
            className="absolute bottom-4 left-[52%] z-20 -translate-x-1/2"
          />
        </>
      )}

      {kind === "camera" && (
        <PixelIcon
          assetId="items.camera"
          decorative
          width={54}
          height={54}
          className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2"
        />
      )}
    </div>
  );
}
