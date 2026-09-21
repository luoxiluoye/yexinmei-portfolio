import { RealGallery } from "@/components/media/real-gallery";
import { socialProof } from "@/lib/real-assets";

const accounts = [
  {
    platform: "小红书",
    name: "叶子会变成树",
    href: "https://www.xiaohongshu.com/user/profile/5a788cf511be1052dbfc6085",
    image: socialProof.xiaohongshu,
    note: "近 1 个月冷启动",
    metrics: ["522 粉丝", "6,712 赞藏"],
  },
  {
    platform: "知乎",
    name: "昔棗",
    href: "https://www.zhihu.com/people/luo-ye-xin-mei",
    image: socialProof.zhihu,
    note: "个人内容账号",
    metrics: ["1,348 关注者", "1,575 赞同", "775 收藏"],
  },
] as const;

export function OwnedChannels() {
  return (
    <section className="qb-channels" aria-labelledby="owned-channels-title">
      <div className="qb-section-heading">
        <div><p className="qb-eyebrow font-pixel">SIDE CHANNELS</p><h2 id="owned-channels-title">也在这里创作</h2></div>
        <p>个人账号 · 点击截图可放大</p>
      </div>
      <div className="qb-channel-grid">
        {accounts.map(account => <article key={account.platform} className="qb-channel">
          <div className="qb-channel-preview"><RealGallery images={[account.image]} layout="thumb" /><span>查看主页截图 ＋</span></div>
          <div className="qb-channel-copy">
            <p className="qb-channel-platform">{account.platform}</p>
            <h3>{account.name}</h3>
            <p className="qb-channel-metrics">{account.metrics.join(" · ")}</p>
            <div className="qb-channel-bottom"><span>{account.note}</span><a href={account.href} target="_blank" rel="noreferrer" aria-label={`打开${account.platform}「${account.name}」主页（新窗口）`}>打开主页 ↗</a></div>
          </div>
        </article>)}
      </div>
    </section>
  );
}
