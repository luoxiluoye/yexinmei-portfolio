import {chromium} from 'playwright';
import fs from 'node:fs/promises';
const base=process.env.STUDIO_QA_URL||'http://127.0.0.1:3100';
const out='output/aigc-recordings';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader','--use-gl=angle']});
async function record(name,viewport,options={}){
 const context=await browser.newContext({viewport,...options,recordVideo:{dir:out,size:{width:viewport.width,height:viewport.height}}});const page=await context.newPage();page.setDefaultTimeout(120000);
 await page.goto(`${base}/portfolio?qa=1`,{waitUntil:'domcontentloaded',timeout:120000});await page.waitForFunction(()=>window.__STUDIO_QA__?.points?.aigc,{timeout:120000});
 const click=async key=>{const p=await page.evaluate(k=>window.__STUDIO_QA__.points[k],key);await page.mouse.click(p.x,p.y);};
 await click('aigc');await page.waitForFunction(()=>window.__STUDIO_QA__.studioState?.mode==='collection'&&window.__STUDIO_QA__.studioState.phase==='stable',{timeout:120000});await page.waitForTimeout(450);
 await click('aigc-red-leaf');await page.waitForFunction(()=>window.__STUDIO_QA__.studioState?.mode==='project'&&window.__STUDIO_QA__.studioState.phase==='stable',{timeout:120000});await page.waitForTimeout(700);
 const paper=await page.evaluate(()=>window.__STUDIO_QA__.points['aigc-paper-2']);await page.mouse.click(paper.x,paper.y);await page.waitForFunction(()=>window.__STUDIO_QA__.studioState?.mode==='inspect'&&window.__STUDIO_QA__.studioState.phase==='stable',{timeout:120000});await page.waitForTimeout(650);
 await page.getByRole('button',{name:'返回上一步'}).click();await page.waitForFunction(()=>window.__STUDIO_QA__.studioState?.mode==='project'&&window.__STUDIO_QA__.studioState.phase==='stable',{timeout:120000});await page.waitForTimeout(450);
 await page.getByRole('button',{name:'返回上一步'}).click();await page.waitForFunction(()=>window.__STUDIO_QA__.studioState?.mode==='collection'&&window.__STUDIO_QA__.studioState.phase==='stable',{timeout:120000});await page.waitForTimeout(400);
 await page.getByRole('button',{name:'返回上一步'}).click();await page.waitForFunction(()=>window.__STUDIO_QA__.studioState?.mode==='idle'&&window.__STUDIO_QA__.studioState.phase==='stable',{timeout:120000});await page.waitForTimeout(250);
 const video=page.video();await context.close();if(video)await fs.copyFile(await video.path(),`${out}/${name}.webm`);
}
try{await record('desktop-aigc-flow',{width:1200,height:720});await record('mobile-aigc-flow',{width:390,height:844},{isMobile:true,hasTouch:true});}finally{await browser.close();}
console.log(`AIGC recordings written to ${out}`);
