import type { ReactNode } from "react";

import { PixelButton } from "./pixel-button";
import { PixelIcon } from "./pixel-icon";
import { PixelPanel } from "./pixel-panel";
import { PixelTag } from "./pixel-tag";
import { XPBar } from "./xp-bar";

type PlayerInfoItem = {
  label: string;
  value: ReactNode;
};

type PlayerCardProps = {
  name: string;
  subtitle?: string;
  info: PlayerInfoItem[];
  statusLabel?: string;
  xp?: {
    label?: string;
    current: number;
    max: number;
    level?: number;
  };
  description?: ReactNode;
  avatar?: ReactNode;
  href?: string;
  actionLabel?: string;
  className?: string;
};

export function PlayerCard({
  name,
  subtitle,
  info,
  statusLabel = "ACTIVE",
  xp,
  description,
  avatar,
  href,
  actionLabel = "VIEW PROFILE",
  className,
}: PlayerCardProps) {
  return (
    <PixelPanel eyebrow="PLAYER" title="PROFILE" accent className={className}>
      <div className="flex items-center gap-4">
        <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center border border-divider bg-soft">
          {avatar ?? (
            <PixelIcon
              assetId="character.avatar"
              alt={`${name} avatar`}
              width={66}
              height={66}
            />
          )}
        </div>

        <div className="min-w-0">
          <PixelTag variant="active" dot>
            {statusLabel}
          </PixelTag>
          <h3 className="mt-2 truncate text-xl font-bold">{name}</h3>
          {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
        </div>
      </div>

      <div className="my-5 border-t border-divider" />

      <dl className="space-y-3">
        {info.map((item) => (
          <div
            key={item.label}
            className="grid grid-cols-[78px_1fr] gap-3 text-sm"
          >
            <dt className="font-pixel text-[11px] text-muted">{item.label}</dt>
            <dd className="min-w-0 font-medium">{item.value}</dd>
          </div>
        ))}
      </dl>

      {xp && (
        <div className="mt-5">
          <XPBar
            label={xp.label}
            current={xp.current}
            max={xp.max}
            level={xp.level}
            showValue
          />
        </div>
      )}

      {description && (
        <div className="mt-5 text-sm leading-6 text-muted">{description}</div>
      )}

      {href && (
        <div className="mt-5">
          <PixelButton href={href} variant="primary" className="w-full">
            {actionLabel}
          </PixelButton>
        </div>
      )}
    </PixelPanel>
  );
}
