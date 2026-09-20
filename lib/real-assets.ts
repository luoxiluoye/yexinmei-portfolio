import registry from "./real-assets.json";

export type RealAsset = {
  src: string; alt: string; caption: string; category: string;
  width: number; height: number; kind: string;
};

// Original media only. Pixel illustrations remain in lib/assets.ts.
export const realAssets: RealAsset[] = registry;
function asset(suffix: string): RealAsset {
  const item = realAssets.find((entry) => entry.src.endsWith(suffix));
  if (!item) throw new Error(`Missing real asset: ${suffix}`);
  return item;
}
export const redLeafGallery = [
  ["landing-hero", "01 / PRODUCT ENTRANCE"],
  ["library", "02 / STORY LIBRARY"],
  ["story-modal", "03 / STORY SETUP"],
  ["gameplay-scene", "04 / INTERACTIVE STORY"],
  ["gameplay-choice", "05 / DECISION SYSTEM"],
].map(([file, category]) => ({ ...asset(`/red-leaf/${file}-hires.png`), category }));
export const socialProof = {
  xiaohongshu: asset("/xiaohongshu/profile-hires.png"),
  zhihu: asset("/zhihu/profile-hires.png"),
};
export const playerPortrait = asset("/portraits/profile-from-portfolio.jpeg");
export const photoProjects = [
  { category: "PORTRAIT", title: "人像摄影", note: "不同场景里的光线、人物与情绪。", images: ["01", "06", "10", "12"].map(n => asset(`/portrait/portrait-${n}.jpeg`)) },
  { category: "COMMERCIAL", title: "美团商家产品拍摄", note: "用服务过程、细节和环境呈现商家体验。", images: ["02", "03", "05"].map(n => asset(`/meituan-product/product-${n}.jpeg`)) },
  { category: "CAMPAIGN", title: "自如毕业宣发广告牌项目", note: "从手机与线下广告的呼应，到真实街头投放场景。", images: ["01", "02", "06"].map(n => asset(`/ziroom-campaign/campaign-${n}.jpeg`)) },
  { category: "STAGE", title: "开心麻花《捞金晚宴》官方剧照", note: "在舞台光线与表演节奏中记录人物关系。", images: ["01", "02", "04"].map(n => asset(`/happy-mahua/still-${n}.jpeg`)) },
  { category: "LIVE", title: "余超颖 2024 全国巡演摄影", note: "演唱会现场人物与合影记录。", images: ["03", "04", "06"].map(n => asset(`/yu-chaoying-concert/concert-${n}.jpeg`)) },
];
export const playerMemoryRoll = [playerPortrait, ...photoProjects[0].images];
export const photographyCover = photoProjects[3].images[0];
