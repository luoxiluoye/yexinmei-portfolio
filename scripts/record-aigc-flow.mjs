import {chromium} from 'playwright';
import fs from 'node:fs/promises';
const base=process.env.STUDIO_QA_URL||'http://localhost:3102';
const out=process.env.STUDIO_QA_OUT||'output/aigc-framing-fix';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chrome'});
async function record(name,viewport,options={}){
 const context=await browser.newContext({viewport,...options,recordVideo:{dir:out,size:viewport}});const page=await context.newPage();page.setDefaultTimeout(60000);
 const stable=mode=>page.waitForFunction(mode=>window.__STUDIO_QA__?.studioState?.mode===mode&&window.__STUDIO_QA__.studioState.phase==='stable',mode);
 const click=async key=>{const p=await page.evaluate(k=>window.__STUDIO_QA__.points[k],key);await page.mouse.click(p.x,p.y);};
 await page.goto(`${base}/portfolio?qa=1`);await page.waitForFunction(()=>document.documentElement.dataset.studioReady==='true');await page.waitForTimeout(700);
 await click('aigc');await stable('collection');await page.waitForTimeout(1000);
 await click('aigc-red-leaf');await stable('project');await page.waitForTimeout(1000);
 await click('aigc-red-leaf-paper-1');await stable('inspect');await page.waitForTimeout(1200);
 for(let i=0;i<2;i++){await page.getByRole('button',{name:'下一张作品'}).click();await stable('inspect');await page.waitForTimeout(800);}
 await page.getByRole('button',{name:'上一张作品'}).click();await stable('inspect');await page.waitForTimeout(800);
 for(const mode of ['project','collection','idle']){await page.getByRole('button',{name:'返回上一步'}).click();await stable(mode);await page.waitForTimeout(600);}
 const video=page.video();await context.close();await fs.copyFile(await video.path(),`${out}/${name}.webm`);console.log(`${name} recorded`);
}
try{await record('desktop-flow',{width:1440,height:900},{deviceScaleFactor:2});await record('mobile-flow',{width:390,height:844},{isMobile:true,hasTouch:true,deviceScaleFactor:3});}finally{await browser.close();}
