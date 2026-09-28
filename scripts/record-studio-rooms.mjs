import {chromium} from 'playwright';
import fs from 'node:fs/promises';
const base=process.env.STUDIO_QA_URL||'http://localhost:3107',out=process.env.STUDIO_QA_OUT||'output/studio-rooms-preview';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chrome'});
for(const mobile of [false,true]){
 const label=mobile?'mobile':'desktop',viewport=mobile?{width:390,height:844}:{width:1440,height:900};const context=await browser.newContext({viewport,deviceScaleFactor:mobile?3:2,isMobile:mobile,hasTouch:mobile,recordVideo:{dir:out,size:viewport}}),page=await context.newPage();page.setDefaultTimeout(45000);
 if(process.env.SHARE)await page.goto(process.env.SHARE);await page.goto(`${base}/portfolio?qa=1`);await page.waitForFunction(()=>document.documentElement.dataset.studioReady==='true');await page.waitForTimeout(2000);
 const stable=async mode=>{await page.waitForTimeout(80);await page.waitForFunction(mode=>window.__STUDIO_QA__.studioState.mode===mode&&window.__STUDIO_QA__.studioState.phase==='stable',mode);await page.waitForTimeout(700);};
 const click=async key=>{const p=await page.evaluate(key=>window.__STUDIO_QA__.points[key],key);await page.mouse.click(p.x,p.y);};
 const shot=async name=>{await page.screenshot({path:`${out}/${label}-${name}.png`});await page.waitForTimeout(1600);};
 const back=async mode=>{await page.getByRole('button',{name:'返回上一步'}).click();await stable(mode);};
 await shot('idle');await click('photography');await page.waitForTimeout(220);await page.screenshot({path:`${out}/${label}-photo-transition.png`});await stable('room');await shot('photo-wall');await click('photography-0');await stable('room');await shot('photo');await page.getByRole('button',{name:'下一张照片'}).click();await stable('room');await shot('photo-landscape');await back('room');await back('idle');
 await click('writing');await stable('room');await shot('books');await click('writing-0');await stable('room');await shot('pei');for(let i=0;i<3;i++){await page.getByRole('button',{name:'下一篇作品'}).click();await stable('room');}await shot('research');await back('room');await back('idle');
 await click('video');await stable('room');await shot('television');await back('idle');await shot('restored');
 await fs.writeFile(`${out}/${label}-runtime.json`,JSON.stringify(await page.evaluate(()=>window.__STUDIO_QA__),null,2));await context.close();await page.video().saveAs(`${out}/${label}-normal-speed.webm`);
}
await browser.close();
