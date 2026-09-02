# UI Implementation v1.4 — Visual QA Fix

本轮只处理实际预览中暴露出的视觉实现问题，不改变 UI Final 方向。

## 1. Pixel font

### 原因
项目使用 `next/font/google` 的 `Pixelify_Sans`，真实 Next.js runtime 会注入 `--font-pixel-source`。
之前的静态视觉镜像没有执行 Next Font 注入；原 token 写法：

```css
--rpg-font-pixel: var(--font-pixel-source), monospace;
```

当 `--font-pixel-source` 不存在时，这条 `font-family` 会整体失效，从而继承正文无衬线字体，因此预览里的英文标题和导航看起来不是像素字体。

### 修复
改为带 CSS variable fallback：

```css
--rpg-font-pixel: var(--font-pixel-source, "Courier New"), "Courier New", "Lucida Console", ui-monospace, monospace;
```

同时保留 `Pixelify Sans` 为正式 runtime 第一优先级，并为 `.font-pixel / .rpg-page-title / .rpg-hero-title` 禁用字体合成与 ligature。

## 2. Link 颜色层叠
把基础元素规则移动到 `@layer base`，避免 `a { color: inherit }` 覆盖 Tailwind 的 `text-white`，修复黑底按钮 / Active Nav 的文字消失问题。

## 3. Hero 信息层级
- 中文「罗叶馨梅」作为主标题。
- `Yexinmei Luo` 改为较小像素英文副标题。
- 中文关键词与正文继续使用清晰中文字体。
- Home 气泡改为正式中文内容。

## 4. Scene layering
重新整理 CharacterScene：
- sky / clouds / stars：z0
- grass：z10
- sign / flowers：z20
- character / cat：z30
- speech bubble：z40

不再使用 flex + negative margin 把 Cat / Character / Sign 挤在同一排。
Home 的木牌使用自身小草底座，放在主 grass platform 外侧，避免双草坪叠压。
Character 与 Cat 放大并重新定位，减少大面积空白。

## 5. Other layering cleanup
- Footer grass 不再使用负 z-index。
- MiniWorldScene 改为明确绝对定位层级。
- 404 的 Cat / Flower 放主 grass，Wooden Sign 单独放右侧，避免四个素材挤在一条 flex row。

## 6. Content sync
- Home Quest Preview：知乎 → 国际传播 → 科技有后话。
- Player Character Story：接入用户确认的四段最终自我介绍。
- Fun Facts / Journey 更新。
- Contact 删除 Product 定位。
- Journal 顶部介绍中文化。
- Metadata 改为新媒体 / 内容运营 / 社区 / 传播。

## QA
- Asset registry verification: 42/42 PASS
- TS/TSX syntax transpile: 49 files / 0 errors
- 未执行 npm install / next build（当前容器网络依赖安装条件不稳定）
