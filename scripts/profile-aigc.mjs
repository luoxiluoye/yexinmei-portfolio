import {chromium} from 'playwright';
import fs from 'node:fs/promises';
const browser=await chromium.launch({headless:true,channel:'chrome'});
const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:2});page.setDefaultTimeout(60000);
const read=()=>page.evaluate(()=>window.__STUDIO_QA__);
const stable=mode=>page.waitForFunction(mode=>window.__STUDIO_QA__?.studioState?.mode===mode&&window.__STUDIO_QA__.studioState.phase==='stable',mode);
const click=async key=>{const p=(await read()).points[key];await page.mouse.click(p.x,p.y);};
const report={description:'Observed rendered-frame cadence in Chrome on this machine. No screenshots, video, or forced render loop during sampling. Stationary demand phases have no FPS. GPU memory unavailable.',viewport:{width:1440,height:900},phases:{}};
try{
 await page.goto(`${process.env.STUDIO_QA_URL||'http://localhost:3102'}/portfolio?qa=1`);await page.waitForFunction(()=>document.documentElement.dataset.studioReady==='true');await page.waitForTimeout(800);
 report.phases.idle=(await read()).metrics;
 await click('aigc');await stable('collection');report.phases.focus=(await read()).metricsByStage['focus-transition'];report.phases.collection=(await read()).metrics;
 await click('aigc-red-leaf');await stable('project');report.phases.opening=(await read()).metricsByStage['folder-opening'];
 for(let i=0;i<3;i++){await page.getByRole('button',{name:'下一张作品'}).click();await stable('project');}
 report.phases.browsing=(await read()).metricsByStage['project-browsing'];
 await click(`aigc-red-leaf-paper-${(await read()).studioState.activeItemIndex}`);await stable('inspect');report.phases.inspect=(await read()).metrics;
 for(const mode of ['project','collection','idle']){await page.getByRole('button',{name:'返回上一步'}).click();await stable(mode);}
 report.phases.returning=(await read()).metricsByStage.returning;
 await page.waitForTimeout(500);const frames=(await read()).frames;await page.waitForTimeout(1000);report.staticFramesInOneSecond=(await read()).frames-frames;
 await fs.writeFile('output/aigc-framing-fix/performance.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await browser.close();}
