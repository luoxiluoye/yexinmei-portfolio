import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import sharp from 'sharp';
const dir = '.studio-qa/results';
await fs.mkdir(dir, {recursive:true});
for(let i=0;i<60;i++){try{const r=await fetch('http://127.0.0.1:3000/portfolio');if(r.ok)break;}catch{}await new Promise(r=>setTimeout(r,1000));}
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader','--use-gl=angle']});
const page=await browser.newPage({viewport:{width:1536,height:960},deviceScaleFactor:1});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:3000/portfolio?qa=1',{waitUntil:'networkidle',timeout:120000});
await page.waitForTimeout(12000);
const info=await page.evaluate(()=>({canvas:!!document.querySelector('canvas'),title:document.title,model:window.__STUDIO_QA__?.stats??null,ready:document.documentElement.dataset.studioReady,bodyWidth:document.body.scrollWidth,width:innerWidth}));
const full=await page.screenshot({path:dir+'/desktop.jpg',type:'jpeg',quality:88});
const thumb=await sharp(full).resize(960).jpeg({quality:44}).toBuffer();
console.log('STUDIO_THUMBNAIL_BASE64:'+thumb.toString('base64'));
const zones=['writing','photography','aigc','video'];
const tested=[];
for(const zone of zones){
  const point=await page.evaluate(z=>window.__STUDIO_QA__?.points?.[z]??null,zone);
  if(!point)continue;
  await page.mouse.move(point.x,point.y);await page.waitForTimeout(350);
  const hovered=await page.evaluate(()=>document.documentElement.dataset.studioHover??null);
  if(zone==='photography')await page.screenshot({path:dir+'/hover.jpg',type:'jpeg',quality:85});
  await page.mouse.click(point.x,point.y);
  await page.waitForURL('**/portfolio/'+zone,{timeout:15000});
  tested.push({zone,hovered,route:page.url()});
  await page.goBack({waitUntil:'networkidle'});await page.waitForTimeout(1800);
}
await page.setViewportSize({width:390,height:844});
await page.goto('http://127.0.0.1:3000/portfolio?qa=1',{waitUntil:'networkidle'});
await page.waitForTimeout(6000);
await page.screenshot({path:dir+'/mobile.jpg',type:'jpeg',quality:85});
const mobile=await page.evaluate(()=>({width:innerWidth,bodyWidth:document.body.scrollWidth,canvas:document.querySelector('canvas')?.getBoundingClientRect().toJSON()}));
const report={info,tested,mobile,errors};
await fs.writeFile(dir+'/report.json',JSON.stringify(report,null,2));console.log('STUDIO_QA_REPORT:'+JSON.stringify(report));
await browser.close();
if(errors.length)process.exitCode=1;
