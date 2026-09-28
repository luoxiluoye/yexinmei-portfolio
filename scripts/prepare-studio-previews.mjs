import sharp from 'sharp';
import {mkdir} from 'node:fs/promises';
// Small textures for the distant workbench only. Inspect keeps the original assets.
const sources=['photos/portrait/portrait-01.jpeg','photos/happy-mahua/still-02.jpeg','photos/yu-chaoying-concert/concert-03.jpeg','photos/portrait/portrait-06.jpeg','photos/ziroom-campaign/campaign-02.jpeg','photos/meituan-product/product-02.jpeg','video/zhoujiadao/poster.png','photos/portrait/yexinmei-frame-v5.jpg'];
await mkdir('public/assets/studio/previews',{recursive:true});
for(const [index,source] of sources.entries())await sharp('public/assets/'+source).resize({width:index===6?1080:640,height:index===6?1080:640,fit:'inside',withoutEnlargement:true}).webp({quality:86}).toFile(`public/assets/studio/previews/workbench-${index}.webp`);
