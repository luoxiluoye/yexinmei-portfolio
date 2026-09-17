import { PixelIcon } from "@/components/ui/pixel-icon";
import { PixelPanel } from "@/components/ui/pixel-panel";

const accounts = [
  {
    platform: "XIAOHONGSHU",
    name: "叶子会变成树",
    href: "https://www.xiaohongshu.com/user/profile/5a788cf511be1052dbfc6085",
    icon: "ui.heart" as const,
    note: "近 1 个月冷启动",
    metrics: ["522 粉丝", "6,712 赞藏"],
  },
  {
    platform: "ZHIHU",
    name: "昔棗",
    href: "https://www.zhihu.com/people/luo-ye-xin-mei",
    icon: "ui.speechBubble" as const,
    note: "个人内容账号",
    metrics: ["1,348 关注者", "1,575 赞同", "775 收藏"],
  },
] as const;

export function OwnedChannels() {
  return (
    <PixelPanel
      eyebrow="SIDE CHANNELS"
      title="个人账号"
      rightSlot={<span className="font-pixel text-[10px] text-muted">02</span>}
      className="mb-5"
      contentClassName="p-3 lg:p-4"
    >
      <div className="grid gap-2 lg:grid-cols-2">
        {accounts.map((account) => (
          <a
            key={account.platform}
            href={account.href}
            target="_blank"
            rel="noreferrer"
            className="group grid grid-cols-[36px_1fr_auto] items-center gap-3 border border-divider bg-soft px-3 py-2.5 transition-[transform,border-color,background-color] hover:-translate-y-px hover:border-accent hover:bg-paper"
          >
            <PixelIcon assetId={account.icon} decorative width={28} height={28} />
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="font-pixel text-[9px] text-accent">{account.platform}</span>
                <strong className="truncate text-[13px]">{account.name}</strong>
              </div>
              <p className="mt-1 truncate text-[10px] text-muted">
                {account.note} · {account.metrics.join(" · ")}
              </p>
            </div>
            <span className="font-pixel text-[11px] transition-[transform,color] group-hover:translate-x-1 group-hover:text-accent" aria-hidden="true">↗</span>
          </a>
        ))}
      </div>
    </PixelPanel>
  );
}
