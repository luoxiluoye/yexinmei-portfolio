import { PixelIcon } from "@/components/ui/pixel-icon";
import { SpeechBubble } from "@/components/ui/speech-bubble";
import { cn } from "@/lib/cn";

type CharacterSceneProps = {
  variant?: "home" | "player" | "contact" | "inventory" | "journal";
  className?: string;
  bubbleText?: string;
};

export function CharacterScene({
  variant = "home",
  className,
  bubbleText,
}: CharacterSceneProps) {
  const characterId =
    variant === "contact"
      ? "character.wave"
      : variant === "inventory"
        ? "character.idle"
        : "character.fullBody";

  const isHome = variant === "home";
  const isPlayer = variant === "player";
  const isContact = variant === "contact";
  const isJournal = variant === "journal";
  const isInventory = variant === "inventory";
  const compact = isContact || isInventory || isJournal;
  const sceneHeight = isHome
    ? "min-h-[300px] lg:min-h-[390px]"
    : isPlayer
      ? "min-h-[270px] lg:min-h-[320px]"
      : isContact
        ? "min-h-[220px] lg:min-h-[270px]"
        : "min-h-[180px] lg:min-h-[210px]";

  return (
    <div
      className={cn(
        "rpg-scene rpg-scene-open isolate bg-transparent",
        sceneHeight,
        className
      )}
    >
      {/* SKY LAYER */}
      {(isHome || isPlayer || isJournal) && (
        <PixelIcon
          assetId="world.cloudLarge"
          decorative
          width={160}
          height={102}
          className={cn(
            "pointer-events-none absolute z-0 opacity-75",
            isHome
              ? "-left-5 top-[35%] w-[120px] h-auto lg:left-[2%] lg:top-[33%] lg:w-[150px]"
              : "left-[4%] top-[20%] w-[116px] h-auto lg:w-[142px]"
          )}
        />
      )}

      {(isHome || isPlayer || isJournal) && (
        <PixelIcon
          assetId="world.cloudMedium"
          decorative
          width={108}
          height={70}
          className={cn(
            "pointer-events-none absolute z-0 opacity-80",
            isHome
              ? "right-[5%] top-[11%] w-[84px] h-auto lg:right-[7%] lg:top-[12%] lg:w-[104px]"
              : "right-[7%] top-[14%] w-[86px] h-auto lg:w-[102px]"
          )}
        />
      )}

      {isHome && (
        <PixelIcon
          assetId="world.cloudSmall"
          decorative
          width={66}
          height={50}
          className="pointer-events-none absolute right-[31%] top-[34%] z-0 w-[50px] h-auto opacity-80 lg:w-[62px]"
        />
      )}

      {(isHome || isPlayer) && (
        <>
          <PixelIcon
            assetId="ui.sparkle"
            decorative
            width={18}
            height={18}
            className="pointer-events-none absolute left-[24%] top-[48%] z-0 h-[14px] w-[14px] lg:h-[18px] lg:w-[18px]"
          />
          <PixelIcon
            assetId="ui.star"
            decorative
            width={18}
            height={18}
            className="pointer-events-none absolute right-[17%] top-[42%] z-0 h-[14px] w-[14px] lg:h-[18px] lg:w-[18px]"
          />
          {isHome && (
            <PixelIcon
              assetId="ui.sparkle"
              decorative
              width={14}
              height={14}
              className="pointer-events-none absolute right-[43%] top-[22%] z-0 h-[12px] w-[12px] lg:h-[14px] lg:w-[14px]"
            />
          )}
        </>
      )}

      {/* COPY LAYER — intentionally kept away from clouds/character */}
      {isHome && bubbleText && (
        <div className="absolute left-1 top-2 z-40 max-w-[205px] lg:left-5 lg:top-5 lg:max-w-[245px]">
          <SpeechBubble speaker="HELLO!">
            <span className="whitespace-pre-line">{bubbleText}</span>
          </SpeechBubble>
        </div>
      )}

      {/* WORLD / CHARACTER LAYER */}
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0",
          compact ? "h-[176px] lg:h-[214px]" : "h-[224px] lg:h-[300px]"
        )}
      >
        <PixelIcon
          assetId="world.grassLong"
          decorative
          priority={isHome}
          width={560}
          height={280}
          className={cn(
            "absolute left-1/2 z-10 -translate-x-1/2",
            compact
              ? "bottom-[2px] w-[78%] h-auto lg:w-[66%]"
              : isPlayer
                ? "bottom-[2px] w-[82%] h-auto lg:w-[72%]"
                : "bottom-[2px] w-[90%] h-auto lg:w-[80%]"
          )}
        />

        {isJournal && (
          <>
            <PixelIcon
              assetId="world.flower"
              decorative
              width={30}
              height={30}
              className="absolute bottom-[34px] left-[24%] z-20 lg:left-[28%]"
            />
            <PixelIcon
              assetId="world.flower"
              decorative
              width={28}
              height={28}
              className="absolute bottom-[34px] right-[23%] z-20 lg:right-[27%]"
            />
          </>
        )}

        <PixelIcon
          assetId="cat.sit"
          decorative
          width={86}
          height={86}
          className={cn(
            "absolute z-30",
            compact
              ? "bottom-[30px] left-[22%] h-[60px] w-[60px] lg:left-[28%] lg:h-[68px] lg:w-[68px]"
              : isPlayer
                ? "bottom-[35px] left-[20%] h-[68px] w-[68px] lg:left-[27%] lg:h-[80px] lg:w-[80px]"
                : "bottom-[38px] left-[19%] h-[72px] w-[72px] lg:left-[28%] lg:h-[88px] lg:w-[88px]"
          )}
        />

        <PixelIcon
          assetId={characterId}
          alt="Yexinmei Luo pixel character"
          width={200}
          height={268}
          priority={isHome}
          className={cn(
            "absolute left-1/2 z-30 -translate-x-1/2",
            compact
              ? "bottom-[19px] h-[134px] w-[100px] lg:h-[160px] lg:w-[120px]"
              : isPlayer
                ? "bottom-[19px] h-[184px] w-[138px] lg:h-[226px] lg:w-[170px]"
                : "bottom-[18px] h-[198px] w-[148px] lg:h-[260px] lg:w-[195px]"
          )}
        />

        {isHome && (
          <PixelIcon
            assetId="world.woodenSign"
            decorative
            width={96}
            height={124}
            className="absolute bottom-[22px] right-[1%] z-20 h-[94px] w-[72px] lg:right-[7%] lg:h-[118px] lg:w-[92px]"
          />
        )}
      </div>
    </div>
  );
}
