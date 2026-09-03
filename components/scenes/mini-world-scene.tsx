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
          height={47}
          className="absolute right-3 top-2 z-0 h-auto w-[62px] opacity-80"
        />
      )}

      {showGardenSky && (
        <PixelIcon
          assetId="world.cloudSmall"
          decorative
          width={46}
          height={35}
          className="absolute left-4 top-5 z-0 h-auto w-[46px] opacity-70"
        />
      )}

      {/* The visible green surface of grassShort sits at ~49% of its source canvas. */}
      <PixelIcon
        assetId="world.grassShort"
        decorative
        width={330}
        height={110}
        className="absolute left-1/2 top-[68%] z-10 h-auto w-[86%] max-w-[360px]"
        style={{ transform: "translate(-50%, -49%)" }}
      />

      {kind === "cat" && (
        <PixelIcon
          assetId="cat.sit"
          decorative
          width={72}
          height={72}
          className="absolute left-1/2 top-[68%] z-20 h-auto w-[72px]"
          style={{ transform: "translate(-50%, -79.9%)" }}
        />
      )}

      {kind === "garden" && (
        <>
          <PixelIcon
            assetId="world.flower"
            decorative
            width={30}
            height={30}
            className="absolute left-[36%] top-[68%] z-20 h-auto w-[30px]"
            style={{ transform: "translate(-50%, -73.6%)" }}
          />
          <PixelIcon
            assetId="cat.stand"
            decorative
            width={72}
            height={72}
            className="absolute left-[55%] top-[68%] z-20 h-auto w-[72px]"
            style={{ transform: "translate(-50%, -84.1%)" }}
          />
        </>
      )}

      {kind === "camera" && (
        <PixelIcon
          assetId="items.camera"
          decorative
          width={58}
          height={58}
          className="absolute left-1/2 top-[68%] z-20 h-auto w-[58px]"
          style={{ transform: "translate(-50%, -69.7%)" }}
        />
      )}
    </div>
  );
}
