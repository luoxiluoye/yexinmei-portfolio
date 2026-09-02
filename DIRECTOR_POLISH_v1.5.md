# DIRECTOR POLISH v1.5

本版本由指挥侧直接对 v1.4 进行视觉与内容层级修正，不新增业务功能。

## 1. Pixel 字体
- 保留 `next/font/google` 的 Pixelify Sans，显式加载 400 / 500 / 600 / 700。
- `adjustFontFallback: false`，减少 fallback 指标对像素字形视觉的干扰。
- 英文导航、RPG 标签、Panel 标题、Level/XP、英文副标题统一走 `.font-pixel`。
- 中文正文继续使用 Noto Sans SC / PingFang SC，不让中文正文像素化。

说明：静态截图器若不执行 Next Font 注入，会回退 monospace；真实 Next.js Runtime / Vercel 构建后以 Pixelify Sans 为准。

## 2. Hero / Scene 层级重做
- HOME / PLAYER / CONTACT / INVENTORY / JOURNAL 的大场景取消巨型边框盒子，改为开放式 Scene。
- 场景层级固定：Sky z0 → Grass z10 → Props z20 → Character/Cat z30 → Bubble z40。
- 云朵避开气泡与人物头部；星星减少；角色、猫咪、木牌独立定位。
- HOME 人物、猫和主草坪放大并向中心收拢，减少“大框里主体太小”的空感。
- Footer 改为绝对定位的单一地面基线，城堡/树不再 flex 挤成一团。

## 3. 内容方向进一步收紧
- HOME Skills Preview 从 `AI ASSIST` 改成 `COMMUNITY`；AI 保留在完整 Inventory 作为辅助能力。
- Player Card 中文姓名优先，英文名作为副信息。
- 首页/项目按钮改为中文主文案。
- Quest Detail 主内容标题中文化，保留小号英文 label 作为 RPG 装饰。
- Quest Detail Sidebar 从纯装饰 AREA 改成 QUEST MAP + 克制 mascot scene。
- Inventory Sidebar 改为 Skills Summary，AI 降级为辅助分区。
- Journal 不再显示英文 disabled CTA，改成“更多内容持续更新中…”。
- Contact 在联系方式未补齐时显示“稍后补充 / 待开放”，不直接露出 TODO。

## 4. 不变项
- 42 个正式 Pixel Assets 不改画风、不重绘。
- 6 个 Quest 内容与 NO MEDIA 规则不变。
- gallery 为空时继续完全隐藏。
- 不新增复杂动效、Class Switch、CMS、项目图片。

## QA
- Asset Registry: 42/42 PASS
- Forbidden media placeholders: 0
- Hardcoded `/assets/...` in page/components: 0
- Old Product positioning strings: 0
- TypeScript parse-level syntax: no parse diagnostics detected（完整 build 仍需联网安装 Next/React 依赖）
