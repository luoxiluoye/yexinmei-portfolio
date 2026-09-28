# 工作台的摄影、文字与电视交互

在已确认的 Visual / AIGC 实现之上扩展。一个 Canvas、一个 StudioExperience。原有 AIGC director 和文件夹/纸张保持不变。

## 状态与归位

`StudioState` 增加 `room`，包含 zone、itemIndex、page、phase。

- 摄影：idle → room（照片墙）→ room + itemIndex（查看照片）。手机照片墙每组 6 张，共 3 组。
- 文字：idle → room（三本书）→ room + itemIndex（开书阅读）。手机镜头靠近正文页，桌面显示双页。
- 视频：idle → room（电视聚焦）。屏幕内容保持依附原电视。
- UI 返回 / Esc / Browser Back 使用同一状态入口。切换作品只 replace history；进入区域和单件作品才 push。
- RoomDirector 保存 camera position/quaternion/fov 和工作台 orbit。先合书/收照片，再把实体沿展开路径送回；进度可中断反向，最终复制精确 home transform。
- 跨区域历史导航先收回旧区域，再展开新区域，避免两个导演同时写镜头。

## 模型和纹理

洞洞板原 6 张照片、书架上 3 本书和电视均为递归 noBatch 子树。新增照片存在于同一模型中，闲置时隐藏；不通过卸载重建归位。

照片墙使用 640px 内的 WebP（15 张），查看单张时使用仓库原图。原图部分只有 324×576；不会把插值放大称为高清。退出释放照片区拥有的纹理并恢复原地图。

书封 512×768；阅读页 1024×1536。只有正在开合的阅读页可见，合上时释放相应 GPU 纹理。返回和再次进入不累积材质或纹理实例。

保留 demand rendering。运动期间低 DPR，静止后按设备像素密度显示（最多 3，且总缓冲不超过 800 万像素），随后停止刷新。

## 内容来源与限制

- 《陪》：用户提供的知网截图；《电影文学》2023 (15)，168–175 页。书内明确标注“刊发节选”，不是完整剧本。对应第一条用户 CNKI URL。
- 传播论文：用户提供的知网截图；《中国报业》2023 (16)，78–79 页；DOI 10.13854/j.cnki.cni.2023.16.026。书内标注“论文摘要”。对应第二条 CNKI URL。
- 知网页面在自动访问工具中不可读，元数据依据用户截图录入；不声称全文已获取。
- 校园图文保留已有真实微信公众号入口；《周家刀》推文仅保留在电视区，明确标注“查看微信公众号推文”，不再重复充当文字作品。
- 《周家刀》：用户提供的两份 1080p H.264 / AAC 视频，分别约 1 分 14 秒（手艺人访谈）和 1 分 49 秒（直播与工坊）。保留完整内容，只做 faststart 无损重封装。封面使用用户提供的原图，保持比例。
- 点击电视聚焦后，手动播放；支持暂停、进度拖动、静音和两段切换。视频作为 VideoTexture 贴在原电视屏幕，Canvas 和屏幕对象不变。首次点击播放才请求 MP4；退出立即停止音频、移除解码元素、释放自有 VideoTexture 并恢复封面。
- 视频通过 requestVideoFrameCallback 请求必要画面，暂停后停止刷新；不把 demand 改为永久渲染。浏览器切到后台自动暂停。手机采用 playsInline；尚未进行实体 iPhone / Safari 验证。

## 旧组件

`portfolio-studio.tsx` 已取消旧 PortfolioExhibitOverlay 的 import、挂载、延时开关和 is-exhibiting class。原 overlay 文件和样式作为未引用的旧实现保留，不进入本工作台展示流程。

## 验证

- `npm run build`
- `STUDIO_QA_URL=http://localhost:3109 node scripts/qa-studio-video.mjs`（真实解码、播放/暂停、进度、切片、错误重试、清理与桌面/手机录屏）
- `STUDIO_QA_URL=http://localhost:3108 node scripts/qa-studio-rooms.mjs`
- `STUDIO_QA_URL=http://localhost:3108 node scripts/qa-studio-model.mjs`（AIGC 回归）
- `scripts/record-studio-rooms.mjs` 记录桌面和手机正常速度演示。

QA 检查真实 Canvas 点击、原对象 UUID、最终位置与旋转、镜头、照片视口范围、30%/70% 中途返回、Esc、Browser Back、手机浏览、减少动态效果、resize、10 次进出后的纹理收敛和静止停止刷新。手机为 Chrome 设备模拟；GPU memory 不可用，不将估算值当作实测。

## 2026-09-28 模型与内容精修

- 摄影墙移除 concert-01 的照片直播二维码；保留 15 张摄影图片，余超颖相关作品注明 2024 年演唱会专职摄影与整场照片直播职责（用户提供）。最后一排按实际张数居中。
- 文字区保留《陪》、校园图文、传播论文三本。推荐后续补充用户独立采写的人物特写或有完整论证的知乎长文，尚未提供的内容不编造。书脊朝前并标注真实作品名。
- 恢复 PMREM 环境反射：仅初始化一次，为不同粗糙度材质提供不同反射；使用 Three.js RoomEnvironment，无外部 HDR 下载。
- 一盏窗光负责 VSM 阴影（2048px，6 个模糊采样），阴影缓存在静态工作台上。活动子树不进入缓存，避免抽出后留下幽灵阴影；动态纸张未新增实时阴影。
- 暖色实用灯补充柜内灯带，辅以冷色天光；移除会拖慢过渡动画的额外实时面光源；弱局部轮廓光，不启用全屏 Bloom。原 dead composer 仍未参与主渲染。
- 收薄柜体边框，改善象牙漆、蓝灰柜体、陶瓷与金属参数；叶片变薄并调整曲率、叶脉、枝条疏密，同时减少叶片网格数量。
- 保持 demand rendering、动画 DPR 上限 1.25 / 手机 1 和既有阅读清晰度，不用永久渲染制造效果。

技术依据：[Three.js PMREMGenerator](https://threejs.org/docs/pages/PMREMGenerator.html)。它为粗糙度提供预过滤的反射层级，不等于完整光线追踪；与参考静态渲染相比，复杂漫反射、植物透射和布料细节仍有差距。

本轮本机 Chrome / Apple M3 验证：生产构建通过；桌面及 390×844 手机模拟的三分区真实点击、同 Canvas/UUID、精确归位、中途返回、Esc/浏览器返回、resize、减少动态效果通过；摄影 10 次循环退出纹理固定 45。电视两段 1080p 解码、拖动、静音、错误重试及循环回收通过。AIGC 完整回归通过（移除额外面光源之前的同交互版本）。

无录屏照片展开三次实测平均帧间隔 17.02 / 17.46 / 21.61ms，p95 17.9 / 18.9 / 32.4ms，约 58.7 / 57.3 / 46.3 FPS；222 draw calls、354,998 triangles、60 textures。静止后 demand 停止刷新，不能把静止状态报告成 60 FPS。录屏 QA 的首次展开平均 26.69ms，p95 67.2ms，约 37.5 FPS；与无录屏结果分开保留，不宣称全设备稳定满帧。GPU memory: unavailable。相较旧版摄影场景 423,816 triangles，当前减少约 16%。
