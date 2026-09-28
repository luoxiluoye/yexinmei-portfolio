/** Source dimensions are independent of asynchronous texture loading. */
export const RED_LEAF_ITEMS = [
 {id:'landing-hero',title:'Landing Hero',caption:'产品首页 · 从一篇故事开始',height:1073},
 {id:'gameplay-scene',title:'Gameplay Scene',caption:'剧情游玩 · 走进故事，作出选择',height:1076},
 {id:'gameplay-choice',title:'Choice Interface',caption:'分支选择 · 每个决定改变故事走向',height:1075},
 {id:'story-library',title:'Story Library',caption:'故事书库 · 发现可以游玩的世界',height:1062},
 {id:'story-modal',title:'Story Modal',caption:'故事详情 · 了解设定，开始冒险',height:1068},
] as const;
export const RED_LEAF_URL='https://zhihu.hegelsalon.com/';

export const SOCIAL_ITEMS = [
 {id:'xiaohongshu',title:'小红书',caption:'叶子会变成树 · 小红书账号运营',width:2552,height:1424,href:'https://www.xiaohongshu.com/user/profile/5a788cf511be1052dbfc6085',cta:'打开小红书主页'},
 {id:'zhihu',title:'知乎',caption:'昔棗 · 知乎账号运营',width:2940,height:1606,href:'https://www.zhihu.com/people/luo-ye-xin-mei',cta:'打开知乎主页'},
] as const;
export type AigcCollectionId='red-leaf'|'social';
type CollectionItem={id:string;title:string;caption:string;width:number;height:number;href:string;cta:string};
type CollectionContent={id:AigcCollectionId;title:string;englishTitle:string;description:string;credit:string;initialIndex:number;items:readonly CollectionItem[]};
export const AIGC_COLLECTIONS:Record<AigcCollectionId,CollectionContent>={
 'red-leaf':{id:'red-leaf',title:'赤页',englishTitle:'RED LEAF',description:'把故事变成可以游玩的文字冒险。',credit:'AI 互动叙事产品 · 独立设计与开发',initialIndex:1,items:RED_LEAF_ITEMS.map(item=>({...item,width:2048,href:RED_LEAF_URL,cta:'在线体验赤页'}))},
 social:{id:'social',title:'个人自媒体运营',englishTitle:'SOCIAL MEDIA',description:'小红书与知乎的个人账号运营与内容创作。',credit:'内容创作 · 账号运营',initialIndex:0,items:SOCIAL_ITEMS},
};
export function collectionContent(id:string){return AIGC_COLLECTIONS[id==='social'?'social':'red-leaf'];}
