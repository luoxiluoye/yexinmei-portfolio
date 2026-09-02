import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type SpeechBubbleProps = {
  children: ReactNode;
  side?: "left" | "right";
  speaker?: string;
  className?: string;
};

export function SpeechBubble({
  children,
  side = "left",
  speaker,
  className,
}: SpeechBubbleProps) {
  return (
    <div
      className={cn(
        "relative max-w-[220px] border-2 border-border bg-paper px-4 py-3 text-sm leading-6 lg:max-w-[260px]",
        className
      )}
    >
      {speaker && (
        <p className="mb-1 font-pixel text-[11px] text-accent">{speaker}</p>
      )}

      <div>{children}</div>

      <span
        aria-hidden="true"
        className={cn(
          "absolute -bottom-[7px] h-3 w-3 rotate-45 border-b-2 border-r-2 border-border bg-paper",
          side === "left" ? "left-6" : "right-6"
        )}
      />
    </div>
  );
}
