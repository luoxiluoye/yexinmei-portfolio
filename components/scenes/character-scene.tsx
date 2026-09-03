import { HeroCatQuest } from "@/components/game/hero-cat-quest";
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
      ? "min-h-[250px] lg:min-h-[300px]"
      : isContact
        ? "min-h-[205px] lg:min-h-[235px]"
        : "min-h-[175px] lg:min-h-[200px]";

  const characterTransform = isContact
    ? "translate(-50%, -92.9%)"
    : isInventory
      ? "translate(-50%, -90.5%)"
      : "translate(-50%, -88.5%)";

  return (
    <div className={cn("rpg-scene rpg-scene-open isolate bg-transparent", sceneHeight, className)}>
      {(isHome || isPlayer || isJournal) && (
        <PixelIcon
          assetId="world.cloudLarge"
          decorative
          width={180}
          height={135}
          className={cn(
            "pointer-events-none absolute z-0 h-auto opacity-70",
            isHome
              ? "left-[1%] top-[30%] w-[128px] lg:left-[2%] lg:w-[160px]"
              : "left-[3%] top-[18%] w-[108px] lg:w-[132px]"
          )}
        />
      )}

      {(isHome || isPlayer || isJournal) && (
        <PixelIcon
          assetId="world.cloudMedium"
          decorative
          width={132}
          height={99}
          className={cn(
            "pointer-events-none absolute z-0 h-auto opacity-78",
            isHome
              ? "right-[3%] top-[9%] w-[94px] lg:right-[4%] lg:w-[118px]"
              : "right-[6%] top-[12%] w-[84px] lg:w-[100px]"
          )}
        />
      )}

      {isHome && (
        <PixelIcon
          assetId="world.cloudSmall"
          decorative
          width={88}
          height={66}
          className="pointer-events-none absolute right-[27%] top-[31%] z-0 h-auto w-[58px] opacity-78 lg:w-[72px]"
        />
      )}

      {(isHome || isPlayer) && (
        <>
          <PixelIcon
            assetId="ui.sparkle"
            decorative
            width={18}
            height={18}
            className="pointer-events-none absolute left-[20%] top-[43%] z-0 h-[14px] w-[14px] lg:h-[18px] lg:w-[18px]"
          />
          <PixelIcon
            assetId="ui.star"
            decorative
            width={18}
            height={18}
            className="pointer-events-none absolute right-[12%] top-[38%] z-0 h-[14px] w-[14px] lg:h-[18px] lg:w-[18px]"
          />
        </>
      )}

      {isHome && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[6%] bottom-[23%] z-[1] hidden h-[88px] bg-[#dedbd5] opacity-55 lg:block"
          style={{
            clipPath:
              "polygon(0 100%,0 76%,7% 76%,7% 64%,13% 64%,13% 48%,20% 48%,20% 70%,27% 70%,27% 57%,34% 57%,34% 36%,42% 36%,42% 62%,49% 62%,49% 45%,57% 45%,57% 28%,65% 28%,65% 58%,73% 58%,73% 43%,81% 43%,81% 66%,89% 66%,89% 52%,96% 52%,96% 74%,100% 74%,100% 100%)",
          }}
        />
      )}

      {bubbleText && (isHome || isContact) && (
        <div
          className={cn(
            "absolute z-40 max-w-[210px] lg:max-w-[250px]",
            isHome ? "left-[5%] top-2 lg:left-[8%] lg:top-5" : "left-[7%] top-1 lg:left-[9%] lg:top-3"
          )}
        >
          <SpeechBubble speaker={isHome ? "HELLO!" : "HI!"}>
            <span className="whitespace-pre-line">{bubbleText}</span>
          </SpeechBubble>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        <PixelIcon
          assetId="world.grassLong"
          decorative
          priority={isHome}
          width={1040}
          height={520}
          className={cn(
            "absolute left-1/2 top-[68%] z-20 h-auto max-w-none",
            compact
              ? "w-[420px] lg:w-[500px]"
              : isPlayer
                ? "w-[520px] lg:w-[620px]"
                : "w-[500px] lg:w-[760px]"
          )}
          style={{ transform: "translate(-50%, -46.2%)" }}
        />

        {isJournal && (
          <>
            <PixelIcon
              assetId="world.flower"
              decorative
              width={30}
              height={30}
              className="absolute left-[35%] top-[68%] z-20 w-[26px] lg:w-[30px]"
              style={{ transform: "translate(-50%, -73.6%)" }}
            />
            <PixelIcon
              assetId="world.flower"
              decorative
              width={28}
              height={28}
              className="absolute left-[69%] top-[68%] z-20 w-[24px] lg:w-[28px]"
              style={{ transform: "translate(-50%, -73.6%)" }}
            />
          </>
        )}

        {!isHome && (
          <PixelIcon
            assetId="cat.sit"
            decorative
            width={120}
            height={120}
            className={cn(
              "absolute top-[68%] z-30 h-auto max-w-none",
              compact
                ? "left-[38%] w-[72px] lg:left-[39%] lg:w-[82px]"
                : isPlayer
                  ? "left-[34%] w-[84px] lg:left-[36%] lg:w-[96px]"
                  : "left-[37%] w-[92px] lg:left-[38%] lg:w-[112px]"
            )}
            style={{ transform: "translate(-50%, -79.9%)" }}
          />
        )}

        <PixelIcon
          assetId={characterId}
          alt="Yexinmei Luo pixel character"
          width={230}
          height={307}
          priority={isHome}
          className={cn(
            "absolute top-[68%] z-30 h-auto max-w-none",
            compact
              ? "left-[58%] w-[116px] lg:left-[58%] lg:w-[136px]"
              : isPlayer
                ? "left-[54%] w-[156px] lg:left-[55%] lg:w-[184px]"
                : "left-[54%] w-[184px] lg:left-[55%] lg:w-[220px]"
          )}
          style={{ transform: characterTransform }}
        />

        {isHome && (
          <PixelIcon
            assetId="world.woodenSign"
            decorative
            width={210}
            height={280}
            className="absolute left-[80%] top-[68%] z-10 h-auto w-[145px] max-w-none lg:left-[81%] lg:w-[180px]"
            style={{ transform: "translate(-50%, -70%)" }}
          />
        )}
      </div>

      {isHome && <HeroCatQuest />}
    </div>
  );
}
