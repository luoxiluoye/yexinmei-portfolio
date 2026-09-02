# YEXINMEI CONTENT MASTER v1.3 — NO MEDIA

这是当前可直接接入网站的“无项目图片正式版”。

## 原则
- 不使用虚构项目图。
- 不使用像素装饰冒充真实案例截图。
- 所有 Quest 当前 `gallery: []`。
- 页面检测到 gallery 为空时，应自动隐藏 Gallery 区域，不显示“图片待补”占位框。
- 后续补图时只需：
  1. 把真实图片放进 `public/assets/projects/<slug>/`
  2. 在对应 Quest 的 `gallery` 数组登记
  3. 页面自动恢复 Gallery

## 当前网站应优先展示
- 项目简介
- 工作职责 / Objective
- Actions
- Outcomes / 数据
- Learnings
- RPG 元信息与正式像素资产

## 后续补图不是重构
补图片不应该改页面结构，也不应该重新设计 UI。
