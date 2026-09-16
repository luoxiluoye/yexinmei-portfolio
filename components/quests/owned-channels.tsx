const channels = [
  {
    platform: "XIAOHONGSHU",
    name: "叶子会变成树",
    href: "https://www.xiaohongshu.com/user/profile/5a788cf511be1052dbfc6085",
    headline: "把观察做成更有传播感的短内容。",
    description:
      "自己的小红书账号。围绕人物观点、成长观察与可讨论的话题持续做视频内容，从选题、素材组织、剪辑、封面到发布节奏都自己完成，也会根据互动反馈继续调整表达。",
    metrics: [
      { value: "522", label: "粉丝" },
      { value: "6,712", label: "获赞与收藏" },
    ],
    accent: "XHS / VIDEO & SOCIAL",
  },
  {
    platform: "ZHIHU",
    name: "昔暮",
    href: "https://www.zhihu.com/people/luo-ye-xin-mei",
    headline: "用更长的篇幅，把科技产品讲清楚。",
    description:
      "自己的知乎账号。长期输出数码、科技与产品相关回答，更重视信息梳理、产品判断和解释型写作；它也是我持续观察「什么问题值得回答、什么观点值得展开」的个人内容实验场。",
    metrics: [
      { value: "1,348", label: "关注者" },
      { value: "1,575", label: "获得赞同" },
      { value: "775", label: "获得收藏" },
    ],
    accent: "ZHIHU / LONGFORM & TECH",
  },
] as const;

export function OwnedChannels() {
  return (
    <section className="mb-12 border-y border-divider py-10 lg:mb-16 lg:py-14" aria-labelledby="owned-channels-title">
      <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="font-pixel text-[9px] tracking-[0.1em] text-accent">OWNED CHANNELS / PERSONAL CONTENT</p>
          <h2 id="owned-channels-title" className="mt-2 text-[30px] font-semibold tracking-[-0.035em] lg:text-[38px]">
            两个平台，两种内容语言。
          </h2>
        </div>
        <p className="max-w-[560px] text-[13px] leading-6 text-muted lg:text-right">
          知乎偏解释与观点，小红书偏人物感与短视频。我把自己的账号当作长期内容实验场：自己找题、自己做内容，也自己看数据和反馈。
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {channels.map((channel, index) => (
          <a
            key={channel.platform}
            href={channel.href}
            target="_blank"
            rel="noreferrer"
            className="group relative overflow-hidden border-2 border-border bg-paper p-5 transition-[transform,border-color,box-shadow] duration-150 hover:-translate-y-1 hover:border-accent hover:shadow-[7px_7px_0_rgba(17,17,17,.10)] lg:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-pixel text-[8px] tracking-[0.1em] text-accent">{channel.accent}</p>
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="font-pixel text-[10px] text-muted">0{index + 1}</span>
                  <h3 className="text-[27px] font-semibold tracking-[-0.035em] lg:text-[32px]">{channel.name}</h3>
                </div>
              </div>
              <span className="font-pixel text-[14px] text-muted transition-[transform,color] duration-150 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent" aria-hidden="true">
                ↗
              </span>
            </div>

            <p className="mt-5 text-[17px] font-semibold leading-7 tracking-[-0.015em]">{channel.headline}</p>
            <p className="mt-3 max-w-[620px] text-[13px] leading-6 text-muted">{channel.description}</p>

            <div className="mt-6 flex flex-wrap gap-x-7 gap-y-4 border-t border-divider pt-5">
              {channel.metrics.map((metric) => (
                <div key={metric.label}>
                  <p className="font-pixel text-[15px] lg:text-[17px]">{metric.value}</p>
                  <p className="mt-1 text-[11px] text-muted">{metric.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-divider pt-4">
              <span className="text-[12px] text-muted">数据为当前账号截图快照，后续会继续变化。</span>
              <span className="font-pixel text-[8px] text-foreground group-hover:text-accent">打开主页 ↗</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
