# 工作台的摄影、文字与电视交互

在已确认的 Visual / AIGC 实现之上扩展。一个 Canvas、一个 StudioExperience。原有 AIGC director 和文件夹/纸张保持不变。

## 状态与归位

`StudioState` 增加 `room`，包含 zone、itemIndex、page、phase。

- 摄影：idle → room（照片墙）→ room + itemIndex（查看照片）。手机照片墙每组 6 张，共 3 组。
- 文字：idle → room（四本书）→ room + itemIndex（开书阅读）。手机镜头靠近正文页，桌面显示双页。
- 视频：idle → room（电视聚焦）。屏幕内容保持依附原电视。
- UI 返回 / Esc / Browser Back 使用同一状态入口。切换作品只 replace history；进入区域和单件作品才 push。
- RoomDirector 保存 camera position/quaternion/fov 和工作台 orbit。先合书/收照片，再把实体沿展开路径送回；进度可中断反向，最终复制精确 home transform。
- 跨区域历史导航先收回旧区域，再展开新区域，避免两个导演同时写镜头。

## 模型和纹理

洞洞板原 6 张照片、书架上 4 本书和电视均为递归 noBatch 子树。新增照片存在于同一模型中，闲置时隐藏；不通过卸载重建归位。

照片墙使用 640px 内的 WebP（16 张合计约 528KB），查看单张时使用仓库原图。原图部分只有 324×576；不会把插值放大称为高清。退出释放照片区拥有的纹理并恢复原地图。

书封 512×768；阅读页 1024×1536。只有正在开合的阅读页可见，合上时释放相应 GPU 纹理。返回和再次进入不累积材质或纹理实例。

保留 demand rendering。运动期间低 DPR，静止后按设备像素密度显示（最多 3，且总缓冲不超过 800 万像素），随后停止刷新。

## 内容来源与限制

- 《陪》：用户提供的知网截图；《电影文学》2023 (15)，168–175 页。书内明确标注“刊发节选”，不是完整剧本。对应第一条用户 CNKI URL。
- 传播论文：用户提供的知网截图；《中国报业》2023 (16)，78–79 页；DOI 10.13854/j.cnki.cni.2023.16.026。书内标注“论文摘要”。对应第二条 CNKI URL。
- 知网页面在自动访问工具中不可读，元数据依据用户截图录入；不声称全文已获取。
- 校园图文和非遗报道保留已有真实微信公众号入口，不编造正文。
- 《周家刀》成片尚未提供。电视已移除错误的赤页游戏截图与虚假播放按钮，显示真实项目名及相关报道入口。当前不能站内播放成片。

## 旧组件

`portfolio-studio.tsx` 已取消旧 PortfolioExhibitOverlay 的 import、挂载、延时开关和 is-exhibiting class。原 overlay 文件和样式作为未引用的旧实现保留，不进入本工作台展示流程。

## 验证

- `npm run build`
- `STUDIO_QA_URL=http://localhost:3108 node scripts/qa-studio-rooms.mjs`
- `STUDIO_QA_URL=http://localhost:3108 node scripts/qa-studio-model.mjs`（AIGC 回归）
- `scripts/record-studio-rooms.mjs` 记录桌面和手机正常速度演示。

QA 检查真实 Canvas 点击、原对象 UUID、最终位置与旋转、镜头、照片视口范围、30%/70% 中途返回、Esc、Browser Back、手机浏览、减少动态效果、resize、10 次进出后的纹理收敛和静止停止刷新。手机为 Chrome 设备模拟；GPU memory 不可用，不将估算值当作实测。
