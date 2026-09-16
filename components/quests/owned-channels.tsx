import Image from "next/image";

const accounts = [
  {
    platform: "小红书账号",
    name: "叶子会变成树",
    href: "https://www.xiaohongshu.com/user/profile/5a788cf511be1052dbfc6085",
    image: "/assets/projects/personal-social/xiaohongshu.webp",
    alt: "小红书账号「叶子会变成树」主页截图",
    metrics: [
      { value: "522", label: "粉丝" },
      { value: "6,712", label: "获赞与收藏" },
    ],
  },
  {
    platform: "知乎账号",
    name: "昔棗",
    href: "https://www.zhihu.com/people/luo-ye-xin-mei",
    image: "/assets/projects/personal-social/zhihu.webp",
    alt: "知乎账号「昔棗」主页截图",
    metrics: [
      { value: "1,348", label: "关注者" },
      { value: "1,575", label: "获得赞同" },
      { value: "775", label: "获得收藏" },
    ],
  },
] as const;

export function OwnedChannels() {
  return (
    <section className="mb-12 border-y border-divider py-10 lg:mb-16 lg:py-14" aria-labelledby="personal-social-title">
      <div className="mb-6">
        <p className="font-pixel text-[9px] tracking-[0.1em] text-accent">PERSONAL SOCIAL MEDIA</p>
        <h2 id="personal-social-title" className="mt-2 text-[30px] font-semibold tracking-[-0.035em] lg:text-[38px]">
          个人新媒体运营
        </h2>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {accounts.map((account) => (
          <a
            key={account.platform}
            href={account.href}
            target="_blank"
            rel="noreferrer"
            className="group overflow-hidden border-2 border-border bg-paper transition-[transform,border-color,box-shadow] duration-150 hover:-translate-y-1 hover:border-accent hover:shadow-[7px_7px_0_rgba(17,17,17,.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <div className="relative aspect-[2/1] overflow-hidden border-b border-divider bg-white">
              <Image
                src={account.image}
                alt={account.alt}
                fill
                sizes="(max-width: 1023px) 100vw, 50vw"
                className="object-contain"
              />
            </div>

            <div className="p-5 lg:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-pixel text-[9px] tracking-[0.08em] text-accent">{account.platform}</p>
                  <h3 className="mt-2 text-[26px] font-semibold tracking-[-0.03em] lg:text-[30px]">{account.name}</h3>
                </div>
                <span className="font-pixel text-[14px] text-muted transition-[transform,color] duration-150 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent" aria-hidden="true">
                  ↗
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-x-8 gap-y-4 border-t border-divider pt-5">
                {account.metrics.map((metric) => (
                  <div key={metric.label}>
                    <p className="font-pixel text-[15px] lg:text-[17px]">{metric.value}</p>
                    <p className="mt-1 text-[11px] text-muted">{metric.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 border-t border-divider pt-4 text-right">
                <span className="font-pixel text-[8px] text-foreground group-hover:text-accent">打开主页 ↗</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
