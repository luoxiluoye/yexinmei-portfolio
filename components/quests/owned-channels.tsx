import { RealGallery } from "@/components/media/real-gallery";
import { socialProof } from "@/lib/real-assets";
import { PixelPanel } from "@/components/ui/pixel-panel";

const accounts = [
  {
    platform: "XIAOHONGSHU",
    name: "叶子会变成树",
    href: "https://www.xiaohongshu.com/user/profile/5a788cf511be1052dbfc6085",
    image: socialProof.xiaohongshu,
    note: "近 1 个月冷启动",
    metrics: ["522 粉丝", "6,712 赞藏"],
  },
  {
    platform: "ZHIHU",
    name: "昔棗",
    href: "https://www.zhihu.com/people/luo-ye-xin-mei",
    image: socialProof.zhihu,
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
          <article key={account.platform} className="grid grid-cols-[100px_minmax(0,1fr)] items-center gap-3 border border-divider bg-soft p-2.5">
            <RealGallery images={[account.image]} layout="thumb" />
            <div className="min-w-0">
              <p className="font-pixel text-[8px] text-accent">{account.platform}</p>
              <strong className="mt-1 block text-[13px]">{account.name}</strong>
              <p className="mt-1 text-[11px] leading-5 text-muted">{account.metrics.join(" · ")}</p>
              <a href={account.href} target="_blank" rel="noreferrer" className="mt-1 inline-flex min-h-9 items-center text-[11px] font-semibold hover:text-accent">打开主页 ↗</a>
            </div>
          </article>
        ))}
      </div>
    </PixelPanel>
  );
}
