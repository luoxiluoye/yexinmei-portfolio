import { PixelIcon } from "@/components/ui/pixel-icon";
import { SpeechBubble } from "@/components/ui/speech-bubble";
import { cn } from "@/lib/cn";

type CharacterSceneProps = {
  variant?: "home" | "player" | "contact" | "inventory" | "journal";
  className?: string;
  bubbleText?: string;
};

/**
 * Scene assets have generous transparent canvases. Positioning their box bottoms
 * independently made the character, cat and sign look pasted on top of each other.
 *
 * UI Final v1.1 treats the grass as the physical ground. Every foreground asset is
 * therefore anchored to the SAME visible grass-top line:
 * - grass visible top: ~46.2% down its source canvas
 * - full body visible feet: ~88.5%
 * - idle visible feet: ~90.5%
 * - wave visible feet: ~92.9%
 * - sitting cat visible feet: ~79.9%
 * - wooden sign visible base: ~77.7%
 *
 * Because transforms are percentages of each asset's own box, the feet remain on
 * the same ground line at different responsive sizes.
 */
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
    ? "min-h-[300px] lg:min-h-[400px]"
    : isPlayer
      ? "min-h-[250px] lg:min-h-[310px]"
      : isContact
        ? "min-h-[205px] lg:min-h-[245px]"
        : "min-h-[175px] lg:min-h-[205px]";

  const characterTransform = isContact
    ? "translate(-50%, -92.9%)"
    : isInventory
      ? "translate(-50%, -90.5%)"
      : "translate(-50%, -88.5%)";

  return (
    <div
      className={cn(
        "rpg-scene rpg-scene-open isolate bg-transparent",
        sceneHeight,
        className
      )}
    >
      {/* SKY / DISTANCE — decoration stays away from the information area. */}
      {(isHome || isPlayer || isJournal) && (
        <PixelIcon
          assetId="world.cloudLarge"
          decorative
          width={180}
          height={135}
          className={cn(
            "pointer-events-none absolute z-0 h-auto opacity-70",
            isHome
              ? "left-[1%] top-[30%] w-[128px] lg:left-[2%] lg:top-[30%] lg:w-[168px]"
              : "left-[3%] top-[18%] w-[112px] lg:w-[140px]"
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
              ? "right-[3%] top-[9%] w-[96px] lg:right-[4%] lg:w-[126px]"
              : "right-[6%] top-[12%] w-[88px] lg:w-[104px]"
          )}
        />
      )}

      {isHome && (
        <PixelIcon
          assetId="world.cloudSmall"
          decorative
          width={88}
          height={66}
          className="pointer-events-none absolute right-[27%] top-[31%] z-0 h-auto w-[62px] opacity-78 lg:w-[78px]"
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
          className="pointer-events-none absolute inset-x-[5%] bottom-[22%] z-[1] hidden h-[94px] bg-[#dedbd5] opacity-55 lg:block"
          style={{
            clipPath:
              "polygon(0 100%,0 76%,7% 76%,7% 64%,13% 64%,13% 48%,20% 48%,20% 70%,27% 70%,27% 57%,34% 57%,34% 36%,42% 36%,42% 62%,49% 62%,49% 45%,57% 45%,57% 28%,65% 28%,65% 58%,73% 58%,73% 43%,81% 43%,81% 66%,89% 66%,89% 52%,96% 52%,96% 74%,100% 74%,100% 100%)",
          }}
        />
      )}

      {isHome && bubbleText && (
        <div className="absolute left-[5%] top-2 z-40 max-w-[205px] lg:left-[8%] lg:top-5 lg:max-w-[245px]">
          <SpeechBubble speaker="HELLO!">
            <span className="whitespace-pre-line">{bubbleText}</span>
          </SpeechBubble>
        </div>
      )}

      {/* SHARED GROUND STAGE — all foreground objects use top: 68% as one ground line. */}
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        <PixelIcon
          assetId="world.grassLong"
          decorative
          priority={isHome}
          width={1040}
          height={520}
          className={cn(
            "absolute left-1/2 top-[68%] h-auto max-w-none",
            compact
              ? "w-[430px] lg:w-[500px]"
              : isPlayer
                ? "w-[540px] lg:w-[650px]"
                : "w-[560px] lg:w-[1040px]"
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
                ? "left-[34%] w-[84px] lg:left-[36%] lg:w-[100px]"
                : "left-[37%] w-[96px] lg:left-[38%] lg:w-[120px]"
          )}
          style={{ transform: "translate(-50%, -79.9%)" }}
        />

        <PixelIcon
          assetId={characterId}
          alt="Yexinmei Luo pixel character"
          width={230}
          height={307}
          priority={isHome}
          className={cn(
            "absolute top-[68%] z-30 h-auto max-w-none",
            compact
              ? "left-[58%] w-[118px] lg:left-[58%] lg:w-[138px]"
              : isPlayer
                ? "left-[54%] w-[160px] lg:left-[55%] lg:w-[190px]"
                : "left-[54%] w-[190px] lg:left-[55%] lg:w-[230px]"
          )}
          style={{ transform: characterTransform }}
        />

        {isHome && (
          <PixelIcon
            assetId="world.woodenSign"
            decorative
            width={210}
            height={280}
            className="absolute left-[80%] top-[68%] z-20 h-auto w-[160px] max-w-none lg:left-[81%] lg:w-[210px]"
            style={{ transform: "translate(-50%, -77.7%)" }}
          />
        )}
      </div>
    </div>
  );
}
